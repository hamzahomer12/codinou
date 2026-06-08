import type { PackageId } from "@/lib/services-data"

export type StripePaymentOption = {
  packageId: PackageId
  name: string
  description: string
  amountCents: number
  currency: "eur"
}

/**
 * Market-aligned project prices (France/EU 2025–2026).
 * Studio positioning: above solo landing-page gigs, below large agencies.
 * Sources: na-web.fr, WebCraftDev, EID Lab MVP benchmarks, AI automation agency guides.
 */
export const PACKAGE_PRICES_EUR: Record<PackageId, number> = {
  launch: 990,
  growth: 2490,
  scale: 5900,
  mvp: 7900,
  product: 14900,
  platform: 29900,
  automate: 1890,
  agents: 4490,
  "ai-custom": 9900,
}

/** ~30% kickoff deposit, rounded for clean checkout. */
export const PACKAGE_DEPOSITS_EUR: Record<PackageId, number> = {
  launch: 300,
  growth: 750,
  scale: 1750,
  mvp: 2400,
  product: 4500,
  platform: 8990,
  automate: 590,
  agents: 1350,
  "ai-custom": 2990,
}

function envPriceId(packageId: PackageId): string | undefined {
  const key = `STRIPE_PRICE_${packageId.replace(/-/g, "_").toUpperCase()}`
  return process.env[key]
}

export function getEnvPriceId(packageId: PackageId): string | undefined {
  const id = envPriceId(packageId)
  return id?.trim() || undefined
}

export function getPackagePayment(
  packageId: PackageId,
  labels: { name: string; description: string },
): StripePaymentOption | null {
  if (!(packageId in PACKAGE_DEPOSITS_EUR)) return null

  return {
    packageId,
    name: labels.name,
    description: labels.description,
    amountCents: PACKAGE_DEPOSITS_EUR[packageId] * 100,
    currency: "eur",
  }
}

export function formatDeposit(amountCents: number, currency: string, locale: string): string {
  return formatMoney(amountCents, currency, locale)
}

export function formatMoney(amountCents: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-EU", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amountCents / 100)
}
