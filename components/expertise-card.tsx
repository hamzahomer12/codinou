import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { SketchyCard } from "@/components/sketchy-card"
import { cn } from "@/lib/utils"
import type { ServiceId } from "@/lib/services-data"

interface ExpertiseCardProps {
  serviceId: ServiceId
  icon: LucideIcon
  t: (key: string) => string
  variant?: "default" | "highlighted" | "coral"
  className?: string
}

export function ExpertiseCard({
  serviceId,
  icon: Icon,
  t,
  variant = "default",
  className,
}: ExpertiseCardProps) {
  return (
    <SketchyCard variant={variant} className={cn("flex h-full flex-col", className)}>
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Icon className="h-7 w-7 text-primary" aria-hidden />
      </div>
      <h3 className="mb-2 text-xl font-bold text-primary">{t(`service.${serviceId}.name`)}</h3>
      <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
        {t(`service.${serviceId}.desc`)}
      </p>
      <Link
        href={`/services#${serviceId}`}
        className="inline-flex items-center text-sm font-semibold text-secondary transition-colors hover:text-primary"
      >
        {t("expertise.learn")}
        <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
      </Link>
    </SketchyCard>
  )
}
