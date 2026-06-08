import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireApiAdmin } from "@/lib/api-admin"
import type { LeadStatus } from "@/lib/supabase/types"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiAdmin({ write: true })
  if ("error" in auth) return auth.error

  const { id } = await params
  const body = await request.json()
  const status = body.status as LeadStatus | undefined
  if (!status) {
    return NextResponse.json({ error: "Missing status" }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from("leads").update({ status }).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
