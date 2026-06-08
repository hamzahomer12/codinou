import { NextResponse } from "next/server"
import { z } from "zod"
import { getAppUrl } from "@/lib/app-url"
import { resolvePackageQuote } from "@/lib/catalog-db"
import { persistCheckoutStarted, linkStripeSession } from "@/lib/db/persist"
import { briefToStripeMetadata } from "@/lib/package-brief"
import { getStripe } from "@/lib/stripe"
import { validatePackageBrief } from "@/lib/validate-brief"

const checkoutSchema = z.object({
  packageId: z.string().min(1),
  termsAccepted: z.literal(true),
  brief: z.record(z.string(), z.string()),
})

export async function POST(request: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Please contact us directly." },
      { status: 503 },
    )
  }

  try {
    const json = await request.json()
    const parsed = checkoutSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payment request." }, { status: 400 })
    }

    const validated = validatePackageBrief(parsed.data.packageId, parsed.data.brief)
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }

    const { packageId, brief } = validated
    const quote = await resolvePackageQuote(packageId, brief)
    const appUrl = getAppUrl()
    const customerEmail = brief.email
    const customerName = brief.fullName

    const orderId = await persistCheckoutStarted({ packageId, brief, quote })

    const webhook = process.env.CONTACT_WEBHOOK_URL
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "codinou-order-brief",
          event: "checkout_started",
          sentAt: new Date().toISOString(),
          packageId,
          brief,
          quote,
          orderId,
          termsAccepted: true,
        }),
      }).catch(() => undefined)
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: quote.depositEur * 100,
            product_data: {
              name: `${packageId} kickoff deposit`,
              description: `30% deposit (€${quote.depositEur}) for project total €${quote.totalEur}. Client: ${customerName}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        packageId,
        type: "kickoff_deposit",
        termsAccepted: "true",
        customerName: customerName.slice(0, 500),
        totalEur: String(quote.totalEur),
        depositEur: String(quote.depositEur),
        orderId: orderId ?? "",
        ...briefToStripeMetadata(brief),
      },
      success_url: `${appUrl}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/order/${packageId}`,
    })

    if (!session.url) {
      return NextResponse.json({ error: "Could not start checkout." }, { status: 500 })
    }

    if (orderId && session.id) {
      await linkStripeSession(orderId, session.id)
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Payment could not be started. Please try again." }, { status: 500 })
  }
}
