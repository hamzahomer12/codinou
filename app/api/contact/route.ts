import { NextResponse } from "next/server"
import { z } from "zod"
import { persistLead } from "@/lib/db/persist"

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  serviceInterest: z
    .enum(["", "website", "webapp", "ai", "other"])
    .optional()
    .transform((v) => v || undefined),
  message: z.string().trim().min(10).max(3000),
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
