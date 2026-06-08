import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ServiceId } from "@/lib/services-data"

interface ExpertiseCardProps {
  serviceId: ServiceId
  icon: LucideIcon
  t: (key: string) => string
  className?: string
}

export function ExpertiseCard({ serviceId, icon: Icon, t, className }: ExpertiseCardProps) {
  return (
    <Link
      href={`/services#${serviceId}`}
      className={cn(
        "card-lift glass-ios group flex h-full flex-col rounded-2xl p-6 hover:border-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-6 w-6 text-primary" aria-hidden />
      </div>
      <h3 className="mb-2 text-lg font-bold text-primary">{t(`service.${serviceId}.name`)}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{t(`service.${serviceId}.desc`)}</p>
      <span className="inline-flex items-center text-sm font-semibold text-secondary transition-colors duration-300 group-hover:text-primary">
        {t("expertise.learn")}
        <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
      </span>
    </Link>
  )
}
