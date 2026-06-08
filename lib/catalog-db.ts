import { createAdminClient } from "@/lib/supabase/admin"
import { PACKAGE_PRICES_EUR } from "@/lib/stripe-payments"
import type { PackageId } from "@/lib/services-data"
import type { PackageRow, PricingRule } from "@/lib/supabase/types"
import type { PackageQuote } from "@/lib/package-pricing"
import { roundDeposit } from "@/lib/package-pricing"

let rulesCache: PricingRule[] | null = null
let packagesCache: PackageRow[] | null = null
let cacheTime = 0
const CACHE_MS = 60_000

export async function getPublishedPackages(): Promise<PackageRow[]> {
  if (packagesCache && Date.now() - cacheTime < CACHE_MS) return packagesCache

  const supabase = createAdminClient()
  if (!supabase) return []

  const { data } = await supabase
    .from("packages")
    .select("*")
    .eq("is_published", true)
    .order("sort_order")

  packagesCache = (data ?? []) as PackageRow[]
  cacheTime = Date.now()
  return packagesCache
}

export async function getPublishedPricingRules(): Promise<PricingRule[]> {
  if (rulesCache && Date.now() - cacheTime < CACHE_MS) return rulesCache

  const supabase = createAdminClient()
  if (!supabase) return []

  const { data } = await supabase
    .from("pricing_rules")
    .select("*")
    .eq("is_published", true)

  rulesCache = (data ?? []) as PricingRule[]
  cacheTime = Date.now()
  return rulesCache
}

export function invalidateCatalogCache() {
  rulesCache = null
  packagesCache = null
  cacheTime = 0
}

export async function getBasePriceFromDb(packageId: PackageId): Promise<number | null> {
  const packages = await getPublishedPackages()
  const pkg = packages.find((p) => p.id === packageId)
  return pkg?.base_price_eur ?? null
}

export async function calculateQuoteFromDb(
  packageId: PackageId,
  brief: Record<string, string> = {},
): Promise<PackageQuote | null> {
  const baseEur = (await getBasePriceFromDb(packageId)) ?? PACKAGE_PRICES_EUR[packageId]
  const rules = await getPublishedPricingRules().then((r) =>
    r.filter((rule) => rule.package_id === packageId || rule.package_id === null),
  )

  const lineItems: PackageQuote["lineItems"] = []
  let extra = 0

  for (const rule of rules) {
    if (rule.rule_type === "select" && rule.field_id && rule.option_value) {
      if (brief[rule.field_id] === rule.option_value) {
        extra += rule.amount_eur
        if (rule.amount_eur !== 0) {
          lineItems.push({
            id: `${rule.field_id}_${rule.option_value}`,
            labelKey: rule.label_key ?? rule.field_id,
            amountEur: rule.amount_eur,
          })
        }
      }
    }
  }

  const totalEur = Math.max(baseEur, baseEur + extra)
  return {
    packageId,
    baseEur,
    totalEur,
    depositEur: roundDeposit(totalEur),
    lineItems,
  }
}

/** DB catalog when available, merged with code-based text heuristics. */
export async function resolvePackageQuote(
  packageId: PackageId,
  brief: Record<string, string> = {},
): Promise<PackageQuote> {
  const { calculatePackageQuote } = await import("@/lib/package-pricing")
  const codeQuote = calculatePackageQuote(packageId, brief)

  const rules = await getPublishedPricingRules()
  if (rules.length === 0) return codeQuote

  const dbQuote = await calculateQuoteFromDb(packageId, brief)
  if (!dbQuote) return codeQuote

  const dbIds = new Set(dbQuote.lineItems.map((i) => i.id))
  const textExtras = codeQuote.lineItems.filter((i) => !dbIds.has(i.id))
  const textExtraSum = textExtras.reduce((s, i) => s + i.amountEur, 0)
  const totalEur = Math.max(dbQuote.baseEur, dbQuote.baseEur + dbQuote.lineItems.reduce((s, i) => s + i.amountEur, 0) + textExtraSum)

  return {
    packageId,
    baseEur: dbQuote.baseEur,
    totalEur,
    depositEur: roundDeposit(totalEur),
    lineItems: [...dbQuote.lineItems, ...textExtras],
  }
}
