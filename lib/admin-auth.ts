import { createClient } from "@/lib/supabase/server"
import type { AdminRole, Profile } from "@/lib/supabase/types"

export async function getAdminProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile as Profile | null
}

export function canWrite(role: AdminRole): boolean {
  return role === "owner" || role === "admin" || role === "sales"
}

export function canManageTeam(role: AdminRole): boolean {
  return role === "owner" || role === "admin"
}

export function canEditCatalog(role: AdminRole): boolean {
  return role === "owner" || role === "admin"
}

export function canManageInvoices(role: AdminRole): boolean {
  return role === "owner" || role === "admin"
}

export async function requireAdminProfile(): Promise<Profile> {
  const profile = await getAdminProfile()
  if (!profile) throw new Error("Unauthorized")
  return profile
}
