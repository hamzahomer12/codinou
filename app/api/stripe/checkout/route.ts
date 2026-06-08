import { NextResponse } from "next/server"
import { z } from "zod"
import { getAppUrl } from "@/lib/app-url"
import { briefToStripeMetadata } from "@/lib/package-brief"
import { getStripe } from "@/lib/stripe"
import { getEnvPriceId, getPackagePayment, PACKAGE_PRICES_EUR } from "@/lib/stripe-payments"
import { validatePackageBrief } from "@/lib/validate-brief"
import type { PackageId } from "@/lib/services-data"

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
    const payment = getPackagePayment(packageId, {
      name: `pkg.${packageId}`,
      description: brief.company ?? packageId,
    })

    if (!payment) {
      return NextResponse.json({ error: "Unknown package." }, { status: 400 })
    }

    const appUrl = getAppUrl()
    const priceId = getEnvPriceId(packageId)
    const customerEmail = brief.email
    const customerName = brief.fullName

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
          termsAccepted: true,
        }),
      }).catch(() => undefined)
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: [
        priceId
          ? { price: priceId, quantity: 1 }
          : {
              price_data: {
                currency: payment.currency,
                unit_amount: payment.amountCents,
                product_data: {
                  name: `${packageId} kickoff deposit`,
                  description: `30% deposit for ${packageId} (project from €${PACKAGE_PRICES_EUR[packageId]}). Client: ${customerName}`,
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
        ...briefToStripeMetadata(brief),
      },
      success_url: `${appUrl}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/order/${packageId}`,
    })

    if (!session.url) {
      return NextResponse.json({ error: "Could not start checkout." }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Payment could not be started. Please try again." }, { status: 500 })
  }
}
