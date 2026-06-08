import { NextResponse } from "next/server"
import { z } from "zod"
import { getAppUrl } from "@/lib/app-url"
import { getStripe } from "@/lib/stripe"
import { getEnvPriceId, getPackagePayment } from "@/lib/stripe-payments"
import type { PackageId } from "@/lib/services-data"

const checkoutSchema = z.object({
  packageId: z.string().min(1),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(500),
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

    const packageId = parsed.data.packageId as PackageId
    const payment = getPackagePayment(packageId, {
      name: parsed.data.name,
      description: parsed.data.description,
    })

    if (!payment) {
      return NextResponse.json({ error: "Unknown package." }, { status: 400 })
    }

    const appUrl = getAppUrl()
    const priceId = getEnvPriceId(packageId)

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        priceId
          ? { price: priceId, quantity: 1 }
          : {
              price_data: {
                currency: payment.currency,
                unit_amount: payment.amountCents,
                product_data: {
                  name: `${payment.name} (kickoff deposit)`,
                  description: payment.description,
                },
              },
              quantity: 1,
            },
      ],
      metadata: {
        packageId: payment.packageId,
        type: "kickoff_deposit",
      },
      success_url: `${appUrl}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pay/cancel`,
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
