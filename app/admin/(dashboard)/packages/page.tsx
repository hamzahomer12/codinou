import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminProfile, canEditCatalog } from "@/lib/admin-auth"
import { PackageEditor } from "@/components/admin/package-editor"
import { PricingRulesEditor } from "@/components/admin/pricing-rules-editor"
import type { PackageRow, PricingRule } from "@/lib/supabase/types"

export default async function PackagesPage() {
  const profile = await getAdminProfile()
  if (!profile || !canEditCatalog(profile.role)) redirect("/admin")

  const supabase = await createClient()
  const [{ data: packages }, { data: rules }] = await Promise.all([
    supabase.from("packages").select("*").order("sort_order"),
    supabase.from("pricing_rules").select("*").order("package_id"),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Packages</h1>
        <p className="text-sm text-muted-foreground">
          Edit catalog pricing. Published packages override code defaults on checkout.
        </p>
      </div>
      <PackageEditor packages={(packages ?? []) as PackageRow[]} />
      <div>
        <h2 className="mb-4 text-lg font-bold text-primary">Pricing rules</h2>
        <PricingRulesEditor rules={(rules ?? []) as PricingRule[]} />
      </div>
    </div>
  )
}
