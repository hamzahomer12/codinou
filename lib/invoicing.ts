import { getStripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"

export async function createBalanceInvoice(orderId: string) {
  const supabase = createAdminClient()
  const stripe = getStripe()
  if (!supabase || !stripe) {
    throw new Error("Stripe or Supabase not configured")
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, customer_email, customer_name, total_eur, deposit_eur, package_id, status")
    .eq("id", orderId)
    .single()

  if (error || !order) throw new Error("Order not found")
  if (order.status !== "paid") throw new Error("Order must be paid before invoicing balance")
  if (!order.customer_email) throw new Error("Order missing customer email")

  const total = order.total_eur ?? 0
  const deposit = order.deposit_eur ?? 0
  const balance = total - deposit
  if (balance <= 0) throw new Error("No balance due on this order")

  const { data: existing } = await supabase
    .from("invoices")
    .select("id, status")
    .eq("order_id", orderId)
    .neq("status", "void")
    .maybeSingle()

  if (existing) throw new Error("An active invoice already exists for this order")

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("order_id", orderId)
    .maybeSingle()

  let customerId: string | undefined
  const customers = await stripe.customers.list({ email: order.customer_email, limit: 1 })
  if (customers.data[0]) {
    customerId = customers.data[0].id
  } else {
    const customer = await stripe.customers.create({
      email: order.customer_email,
      name: order.customer_name ?? undefined,
      metadata: { order_id: orderId, package_id: order.package_id },
    })
    customerId = customer.id
  }

  const invoice = await stripe.invoices.create({
    customer: customerId,
    collection_method: "send_invoice",
    days_until_due: 14,
    metadata: { order_id: orderId, type: "balance" },
  })

  await stripe.invoiceItems.create({
    customer: customerId,
    invoice: invoice.id,
    amount: balance * 100,
    currency: "eur",
    description: `Balance payment — ${order.package_id} package`,
  })

  const finalized = await stripe.invoices.finalizeInvoice(invoice.id)

  const { data: row, error: insertError } = await supabase
    .from("invoices")
    .insert({
      order_id: orderId,
      project_id: project?.id ?? null,
      amount_eur: balance,
      status: "draft",
      stripe_invoice_id: finalized.id,
      stripe_payment_link: finalized.hosted_invoice_url,
    })
    .select("id")
    .single()

  if (insertError) throw new Error(insertError.message)
  return { invoiceId: row.id as string, stripeInvoiceId: finalized.id, url: finalized.hosted_invoice_url }
}

export async function sendBalanceInvoice(invoiceId: string) {
  const supabase = createAdminClient()
  const stripe = getStripe()
  if (!supabase || !stripe) throw new Error("Not configured")

  const { data: inv } = await supabase
    .from("invoices")
    .select("stripe_invoice_id, status")
    .eq("id", invoiceId)
    .single()

  if (!inv?.stripe_invoice_id) throw new Error("Invoice not found")

  await stripe.invoices.sendInvoice(inv.stripe_invoice_id)

  await supabase
    .from("invoices")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", invoiceId)
}
