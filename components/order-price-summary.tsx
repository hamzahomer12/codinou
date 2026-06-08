"use client"

import { useMemo } from "react"
import { calculatePackageQuote } from "@/lib/package-pricing"
import { formatMoney } from "@/lib/stripe-payments"
import type { PackageId } from "@/lib/services-data"

interface OrderPriceSummaryProps {
  packageId: PackageId
  values: Record<string, string>
  language: string
  t: (key: string) => string
}

export function OrderPriceSummary({ packageId, values, language, t }: OrderPriceSummaryProps) {
  const quote = useMemo(() => calculatePackageQuote(packageId, values), [packageId, values])

  const totalFormatted = formatMoney(quote.totalEur * 100, "eur", language)
  const depositFormatted = formatMoney(quote.depositEur * 100, "eur", language)
  const baseFormatted = formatMoney(quote.baseEur * 100, "eur", language)
  const hasAdjustments = quote.lineItems.length > 0

  return (
    <aside
      className="glass-ios sticky top-24 rounded-2xl p-5 ring-1 ring-secondary/15"
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary">
        {t("order.price.title")}
      </p>

      <div className="mb-4 flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted-foreground">{t("order.price.estimatedTotal")}</span>
        <span className="text-2xl font-bold text-primary transition-all duration-300">{totalFormatted}</span>
      </div>

      <div className="mb-4 space-y-2 border-b border-primary/10 pb-4 text-sm">
        <div className="flex justify-between gap-2 text-muted-foreground">
          <span>{t("order.price.base")}</span>
          <span>{baseFormatted}</span>
        </div>
        {hasAdjustments &&
          quote.lineItems.map((item) => (
            <div key={item.id} className="flex justify-between gap-2 text-foreground/80">
              <span className="min-w-0 flex-1">{t(item.labelKey)}</span>
              <span className="shrink-0 font-medium text-secondary">
                {item.amountEur > 0 ? "+" : ""}
                {formatMoney(item.amountEur * 100, "eur", language)}
              </span>
            </div>
          ))}
        {!hasAdjustments && (
          <p className="text-xs text-muted-foreground">{t("order.price.noAdjustments")}</p>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-primary">{t("order.price.depositDue")}</span>
        <span className="text-lg font-bold text-secondary transition-all duration-300">{depositFormatted}</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t("order.price.depositNote")}</p>
    </aside>
  )
}
