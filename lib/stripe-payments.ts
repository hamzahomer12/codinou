import type { PackageId } from "@/lib/services-data"

export type StripePaymentOption = {
  packageId: PackageId
  name: string
  description: string
  amountCents: number
  currency: "eur"
}

/** Kickoff deposit per package in EUR (adjust here or use STRIPE_PRICE_* env vars). */
export const PACKAGE_DEPOSITS_EUR: Record<PackageId, number> = {
  launch: 290,
  growth: 590,
  scale: 990,
  mvp: 790,
  product: 1490,
  platform: 2490,
  automate: 390,
  agents: 790,
  "ai-custom": 990,
  store: 590,
  "store-growth": 990,
  omnichannel: 1990,
  sprint: 490,
  build: 1490,
  partner: 990,
  "odoo-essentials": 690,
  "odoo-custom": 1290,
  "odoo-enterprise": 2490,
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
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-EU", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100)
}
