import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireApiAdmin } from "@/lib/api-admin"
import type { AdminRole } from "@/lib/supabase/types"

export async function POST(request: Request) {
  const auth = await requireApiAdmin({ team: true })
  if ("error" in auth) return auth.error

  const body = await request.json()
  const email = (body.email as string | undefined)?.trim().toLowerCase()
  const role = (body.role as AdminRole | undefined) ?? "viewer"

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 })
  }

  if (role === "owner") {
    return NextResponse.json({ error: "Cannot invite as owner" }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from("team_invites").insert({
    email,
    role,
    invited_by: auth.profile.id,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
