"use client"

import { Check, X } from "lucide-react"
import { Reveal } from "@/components/reveal"

interface EcommerceComparisonProps {
  t: (key: string) => string
}

export function EcommerceComparison({ t }: EcommerceComparisonProps) {
  const rows = [
    { key: "cost", codinou: true, shopify: false, woo: false },
    { key: "admin", codinou: true, shopify: false, woo: false },
    { key: "custom", codinou: true, shopify: false, woo: false },
    { key: "setup", codinou: true, shopify: false, woo: false },
    { key: "fees", codinou: true, shopify: false, woo: false },
  ] as const

  return (
    <div className="mb-10 space-y-8">
      <Reveal>
        <div className="glass-ios rounded-2xl p-6 sm:p-8">
          <h3 className="mb-2 text-xl font-bold text-primary">{t("ecommerce.compare.title")}</h3>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {t("ecommerce.compare.intro")}
          </p>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-ios rounded-2xl border-secondary/20 p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-secondary">
              {t("ecommerce.compare.onetime.kicker")}
            </p>
            <h4 className="mb-3 text-lg font-bold text-primary">{t("ecommerce.compare.onetime.title")}</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("ecommerce.compare.onetime.desc")}
            </p>
          </div>
          <div className="glass-ios-subtle rounded-2xl p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("ecommerce.compare.monthly.kicker")}
            </p>
            <h4 className="mb-3 text-lg font-bold text-primary">{t("ecommerce.compare.monthly.title")}</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("ecommerce.compare.monthly.desc")}
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="glass-ios overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-primary/10 bg-primary/[0.03] text-left">
                  <th className="px-4 py-3 font-semibold text-primary">{t("ecommerce.compare.table.feature")}</th>
                  <th className="px-4 py-3 font-semibold text-secondary">Codinou</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Shopify</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">WooCommerce</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-b border-primary/5">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {t(`ecommerce.compare.row.${row.key}`)}
                    </td>
                    {[row.codinou, row.shopify, row.woo].map((positive, i) => (
                      <td key={i} className="px-4 py-3">
                        {positive ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700">
                            <Check className="h-4 w-4 shrink-0" aria-hidden />
                            {t(`ecommerce.compare.yes.${row.key}`)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <X className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
                            {t(`ecommerce.compare.no.${row.key}`)}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      <Reveal delay={180}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {(["1", "2", "3", "4"] as const).map((n) => (
            <li key={n} className="glass-ios-subtle flex gap-3 rounded-xl p-4 text-sm leading-relaxed text-foreground/85">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {n}
              </span>
              {t(`ecommerce.compare.benefit.${n}`)}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  )
}
