import { NextResponse } from "next/server"
import type Stripe from "stripe"
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const webhook = process.env.CONTACT_WEBHOOK_URL
    const brief = stripeMetadataToBrief(session.metadata ?? undefined)

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
