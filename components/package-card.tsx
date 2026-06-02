import { Check } from "lucide-react"
import { SketchyButton } from "@/components/sketchy-button"
import { cn } from "@/lib/utils"
import type { PackageId } from "@/lib/services-data"

interface PackageCardProps {
  packageId: PackageId
  t: (key: string) => string
  highlighted?: boolean
  className?: string
}

export function PackageCard({ packageId, t, highlighted, className }: PackageCardProps) {
  const key = `pkg.${packageId}`
  const features = [1, 2, 3, 4].map((i) => t(`${key}.f${i}`))

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border-2 p-6 transition-all duration-300 motion-safe:hover:-translate-y-1",
        highlighted
          ? "border-primary/40 bg-primary/[0.04] shadow-md"
          : "border-primary/15 bg-card/70 shadow-sm",
        className,
      )}
      style={{ borderRadius: "20px 8px 20px 8px" }}
    >
      <div className="mb-4">
        <h4 className="text-xl font-bold text-primary">{t(`${key}.name`)}</h4>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-secondary">
          {t("packages.timeline")}: {t(`${key}.timeline`)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground/80">{t("packages.bestFor")}: </span>
          {t(`${key}.best`)}
        </p>
      </div>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary/70">{t("packages.includes")}</p>
      <ul className="mb-6 flex-1 space-y-2.5">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/20">
              <Check className="h-3 w-3 text-secondary" aria-hidden />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <SketchyButton href="/contact" variant={highlighted ? "primary" : "outline"} className="w-full text-sm">
        {t("packages.cta")}
      </SketchyButton>
    </article>
  )
}
