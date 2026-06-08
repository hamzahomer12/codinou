import { NextResponse } from "next/server"
import { requireApiAdmin } from "@/lib/api-admin"
import { createBalanceInvoice } from "@/lib/invoicing"

export async function POST(request: Request) {
  const auth = await requireApiAdmin({ invoices: true })
  if ("error" in auth) return auth.error

  const body = await request.json()
  const orderId = body.orderId as string | undefined
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
  }

  try {
    const result = await createBalanceInvoice(orderId)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create invoice"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
