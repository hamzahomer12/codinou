import { NextResponse } from "next/server"
import { z } from "zod"
import { persistLead } from "@/lib/db/persist"
import { isContactEmailConfigured, sendContactEmails } from "@/lib/contact-email"

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  serviceInterest: z
    .enum(["", "website", "webapp", "ai", "ecommerce", "other"])
    .optional()
    .transform((v) => v || undefined),
  message: z.string().trim().min(10).max(3000),
  language: z.enum(["en", "fr"]).optional(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = contactSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please complete all fields with valid details." },
        { status: 400 },
      )
    }

    await persistLead({
      name: parsed.data.name,
      email: parsed.data.email,
      serviceInterest: parsed.data.serviceInterest,
      message: parsed.data.message,
    })

    if (isContactEmailConfigured()) {
      const emailResult = await sendContactEmails(parsed.data)
      if (!emailResult.ok) {
        console.error("sendContactEmails:", emailResult.error)
        return NextResponse.json(
          { error: "Unable to send right now. Please email us directly." },
          { status: 503 },
        )
      }
    } else {
      console.warn("RESEND_API_KEY missing — contact emails not sent")
    }

    const webhook = process.env.CONTACT_WEBHOOK_URL
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "codinou-website",
          sentAt: new Date().toISOString(),
          ...parsed.data,
        }),
      }).catch(() => undefined)
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
