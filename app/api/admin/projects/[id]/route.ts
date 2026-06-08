import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireApiAdmin } from "@/lib/api-admin"
import type { ProjectStage } from "@/lib/supabase/types"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiAdmin({ write: true })
  if ("error" in auth) return auth.error

  const { id } = await params
  const body = await request.json()
  const stage = body.stage as ProjectStage | undefined
  if (!stage) {
    return NextResponse.json({ error: "Missing stage" }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from("projects").update({ stage }).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
