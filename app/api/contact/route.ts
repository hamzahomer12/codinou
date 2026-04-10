import { NextResponse } from "next/server"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
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

    const webhook = process.env.CONTACT_WEBHOOK_URL
    if (webhook) {
      const forward = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "codinou-website",
          sentAt: new Date().toISOString(),
          ...parsed.data,
        }),
      })

      if (!forward.ok) {
        return NextResponse.json({ error: "Unable to send right now. Please email us directly." }, { status: 502 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
