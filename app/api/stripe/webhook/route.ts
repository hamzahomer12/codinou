import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { persistPaymentCompleted } from "@/lib/db/persist"
import { createAdminClient } from "@/lib/supabase/admin"
import { stripeMetadataToBrief } from "@/lib/package-brief"
import { getStripe } from "@/lib/stripe"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 })
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  const body = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice
    const orderId = invoice.metadata?.order_id
    if (orderId) {
      const supabase = createAdminClient()
      if (supabase) {
        await supabase
          .from("invoices")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("stripe_invoice_id", invoice.id)
      }
    }
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const brief = stripeMetadataToBrief(session.metadata ?? undefined)

    await persistPaymentCompleted({
      stripeSessionId: session.id,
      packageId: session.metadata?.packageId,
      customerEmail: session.customer_details?.email ?? brief?.email,
      customerName: session.metadata?.customerName ?? brief?.fullName,
      totalEur: session.metadata?.totalEur ? Number(session.metadata.totalEur) : undefined,
      depositEur: session.metadata?.depositEur ? Number(session.metadata.depositEur) : undefined,
      brief,
      amountTotal: session.amount_total,
    })

    const webhook = process.env.CONTACT_WEBHOOK_URL
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "codinou-stripe",
          event: "payment_completed",
          sentAt: new Date().toISOString(),
          packageId: session.metadata?.packageId,
          customerEmail: session.customer_details?.email ?? brief?.email,
          customerName: session.metadata?.customerName ?? brief?.fullName,
          totalEur: session.metadata?.totalEur,
          depositEur: session.metadata?.depositEur,
          brief,
          amountTotal: session.amount_total,
          currency: session.currency,
          sessionId: session.id,
        }),
      }).catch(() => undefined)
    }
  }

  return NextResponse.json({ received: true })
}
