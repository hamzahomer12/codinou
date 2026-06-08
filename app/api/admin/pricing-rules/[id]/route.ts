import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireApiAdmin } from "@/lib/api-admin"
import { invalidateCatalogCache } from "@/lib/catalog-db"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiAdmin({ catalog: true })
  if ("error" in auth) return auth.error

  const { id } = await params
  const body = await request.json()

  const updates: Record<string, unknown> = {}
  if (body.is_published !== undefined) updates.is_published = body.is_published
  if (body.amount_eur !== undefined) updates.amount_eur = body.amount_eur

  const supabase = await createClient()
  const { error } = await supabase.from("pricing_rules").update(updates).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  invalidateCatalogCache()
  return NextResponse.json({ ok: true })
}
