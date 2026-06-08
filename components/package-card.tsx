"use client"

import { Check } from "lucide-react"
import { SketchyButton } from "@/components/sketchy-button"
import { PayButton } from "@/components/pay-button"
import { useLanguage } from "@/context/language-context"
import { PACKAGE_DEPOSITS_EUR, formatDeposit } from "@/lib/stripe-payments"
import { cn } from "@/lib/utils"
import type { PackageId } from "@/lib/services-data"

interface PackageCardProps {
  packageId: PackageId
  t: (key: string) => string
  highlighted?: boolean
  className?: string
}

export function PackageCard({ packageId, t, highlighted, className }: PackageCardProps) {
  const { language } = useLanguage()
  const key = `pkg.${packageId}`
  const features = [1, 2, 3, 4].map((i) => t(`${key}.f${i}`))
  const depositCents = (PACKAGE_DEPOSITS_EUR[packageId] ?? 0) * 100
  const depositFormatted = formatDeposit(depositCents, "eur", language)

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border p-5 sm:p-6",
        highlighted
          ? "border-secondary/40 bg-secondary/[0.04] shadow-md"
          : "border-primary/12 bg-card shadow-sm",
        className,
      )}
    >
      <header className="mb-4 border-b border-primary/10 pb-4">
        <h4 className="text-lg font-bold text-primary">{t(`${key}.name`)}</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("packages.timeline")}: <span className="font-medium text-foreground/90">{t(`${key}.timeline`)}</span>
        </p>
      </header>

      <ul className="mb-5 flex-1 space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed text-foreground/85">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>

      <p className="mb-4 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground/75">{t("packages.bestFor")}: </span>
        {t(`${key}.best`)}
      </p>

      <div className="space-y-3">
        <PayButton
          packageId={packageId}
          packageName={t(`${key}.name`)}
          packageDescription={t(`${key}.best`)}
          depositLabel={`${t("payment.deposit")} ${depositFormatted}`}
          payLabel={t("payment.pay")}
          loadingLabel={t("payment.loading")}
          errorLabel={t("payment.error")}
          variant={highlighted ? "primary" : "outline"}
        />
        <SketchyButton href="/contact" variant="outline" className="w-full text-sm">
          {t("packages.cta")}
        </SketchyButton>
      </div>
    </article>
  )
}
