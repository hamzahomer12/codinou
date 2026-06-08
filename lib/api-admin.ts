import { NextResponse } from "next/server"
import {
  getAdminProfile,
  canWrite,
  canManageTeam,
  canEditCatalog,
  canManageInvoices,
} from "@/lib/admin-auth"
import type { AdminRole, Profile } from "@/lib/supabase/types"

type GuardOpts = {
  write?: boolean
  team?: boolean
  catalog?: boolean
  invoices?: boolean
}

export async function requireApiAdmin(opts: GuardOpts = {}): Promise<
  { profile: Profile } | { error: NextResponse }
> {
  const profile = await getAdminProfile()
  if (!profile) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  if (opts.write && !canWrite(profile.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }
  if (opts.team && !canManageTeam(profile.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }
  if (opts.catalog && !canEditCatalog(profile.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }
  if (opts.invoices && !canManageInvoices(profile.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  return { profile }
}

export function roleAllows(role: AdminRole, action: "write" | "team" | "catalog" | "invoices"): boolean {
  switch (action) {
    case "write":
      return canWrite(role)
    case "team":
      return canManageTeam(role)
    case "catalog":
      return canEditCatalog(role)
    case "invoices":
      return canManageInvoices(role)
  }
}
