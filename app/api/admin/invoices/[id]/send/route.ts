import { NextResponse } from "next/server"
import { requireApiAdmin } from "@/lib/api-admin"
import { sendBalanceInvoice } from "@/lib/invoicing"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiAdmin({ invoices: true })
  if ("error" in auth) return auth.error

  const { id } = await params
  try {
    await sendBalanceInvoice(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send invoice"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
