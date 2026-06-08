import { createClient } from "@supabase/supabase-js"
import { getSupabaseServiceRoleKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/env"

export function createAdminClient() {
  const serviceKey = getSupabaseServiceRoleKey()
  if (!isSupabaseConfigured() || !serviceKey) return null

  return createClient(getSupabaseUrl(), serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
