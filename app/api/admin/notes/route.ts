import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireApiAdmin } from "@/lib/api-admin"

export async function POST(request: Request) {
  const auth = await requireApiAdmin({ write: true })
  if ("error" in auth) return auth.error

  const body = await request.json()
  const { targetType, targetId, body: noteBody } = body as {
    targetType?: string
    targetId?: string
    body?: string
  }

  if (!targetType || !targetId || !noteBody?.trim()) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from("notes").insert({
    target_type: targetType,
    target_id: targetId,
    author_id: auth.profile.id,
    body: noteBody.trim(),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
