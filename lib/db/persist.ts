import { createAdminClient } from "@/lib/supabase/admin"
import type { PackageQuote } from "@/lib/package-pricing"
import type { PackageId } from "@/lib/services-data"

export async function persistLead(data: {
  name: string
  email: string
  serviceInterest?: string
  message: string
}) {
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      name: data.name,
      email: data.email,
      service_interest: data.serviceInterest || null,
      message: data.message,
    })
    .select("id")
    .single()

  if (error) {
    console.error("persistLead:", error.message)
    return null
  }
  return lead.id as string
}

export async function persistCheckoutStarted(data: {
  packageId: PackageId
  brief: Record<string, string>
  quote: PackageQuote
  stripeSessionId?: string
}) {
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      package_id: data.packageId,
      status: "checkout_started",
      customer_name: data.brief.fullName ?? null,
      customer_email: data.brief.email ?? null,
      customer_phone: data.brief.phone ?? null,
      company: data.brief.company ?? null,
      brief: data.brief,
      quote: data.quote,
      total_eur: data.quote.totalEur,
      deposit_eur: data.quote.depositEur,
      stripe_session_id: data.stripeSessionId ?? null,
    })
    .select("id")
    .single()

  if (error) {
    console.error("persistCheckoutStarted:", error.message)
    return null
  }

  await supabase.from("order_events").insert({
    order_id: order.id,
    event_type: "checkout_started",
    payload: { quote: data.quote },
  })

  return order.id as string
}

export async function persistPaymentCompleted(data: {
  stripeSessionId: string
  packageId?: string
  customerEmail?: string
  customerName?: string
  totalEur?: number
  depositEur?: number
  brief?: Record<string, string> | null
  amountTotal?: number | null
}) {
  const supabase = createAdminClient()
  if (!supabase) return null

  let orderId: string | null = null

  const { data: existing } = await supabase
    .from("orders")
    .select("id, package_id, customer_name, customer_email, total_eur")
    .eq("stripe_session_id", data.stripeSessionId)
    .maybeSingle()

  if (existing) {
    orderId = existing.id
    await supabase
      .from("orders")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        total_eur: data.totalEur ?? existing.total_eur,
        deposit_eur: data.depositEur ?? undefined,
      })
      .eq("id", orderId)
  } else {
    const { data: created, error } = await supabase
      .from("orders")
      .insert({
        package_id: data.packageId ?? "launch",
        status: "paid",
        customer_name: data.customerName ?? data.brief?.fullName ?? null,
        customer_email: data.customerEmail ?? data.brief?.email ?? null,
        customer_phone: data.brief?.phone ?? null,
        company: data.brief?.company ?? null,
        brief: data.brief ?? {},
        total_eur: data.totalEur ?? (data.amountTotal ? Math.round(data.amountTotal / 100) : null),
        deposit_eur: data.depositEur ?? null,
        stripe_session_id: data.stripeSessionId,
        paid_at: new Date().toISOString(),
      })
      .select("id, package_id, customer_name, customer_email, total_eur")
      .single()

    if (error) {
      console.error("persistPaymentCompleted insert:", error.message)
      return null
    }
    orderId = created.id
  }

  await supabase.from("order_events").insert({
    order_id: orderId,
    event_type: "payment_completed",
    payload: data,
  })

  const { data: order } = await supabase
    .from("orders")
    .select("id, package_id, customer_name, customer_email, total_eur")
    .eq("id", orderId)
    .single()

  if (order) {
    const { data: existingProject } = await supabase
      .from("projects")
      .select("id")
      .eq("order_id", orderId)
      .maybeSingle()

    if (!existingProject) {
      await supabase.from("projects").insert({
        order_id: orderId,
        title: `${order.package_id} — ${order.customer_name ?? "Client"}`,
        client_name: order.customer_name,
        client_email: order.customer_email,
        package_id: order.package_id,
        stage: "discovery",
        total_eur: order.total_eur,
      })
    }
  }

  return orderId
}

export async function linkStripeSession(orderId: string, stripeSessionId: string) {
  const supabase = createAdminClient()
  if (!supabase) return
  await supabase.from("orders").update({ stripe_session_id: stripeSessionId }).eq("id", orderId)
}
