"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bot, Globe, Layers, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { SERVICE_IDS, SERVICE_PACKAGES, type ServiceId } from "@/lib/services-data"
import type { LucideIcon } from "lucide-react"

const SERVICE_META: Record<
  ServiceId,
  { icon: LucideIcon; accent: string; iconBg: string }
> = {
  website: {
    icon: Globe,
    accent: "group-hover:border-sky-200/80 group-data-[active=true]:border-sky-300/90",
    iconBg: "bg-sky-500/10 text-sky-700 group-data-[active=true]:bg-sky-500/15",
  },
  webapp: {
    icon: Layers,
    accent: "group-hover:border-violet-200/80 group-data-[active=true]:border-violet-300/90",
    iconBg: "bg-violet-500/10 text-violet-700 group-data-[active=true]:bg-violet-500/15",
  },
  ai: {
    icon: Bot,
    accent: "group-hover:border-amber-200/80 group-data-[active=true]:border-amber-300/90",
    iconBg: "bg-amber-500/10 text-amber-800 group-data-[active=true]:bg-amber-500/15",
  },
  ecommerce: {
    icon: ShoppingBag,
    accent: "group-hover:border-rose-200/80 group-data-[active=true]:border-rose-300/90",
    iconBg: "bg-rose-500/10 text-rose-700 group-data-[active=true]:bg-rose-500/15",
  },
}

interface ServicesNavProps {
  t: (key: string) => string
  className?: string
}

export function ServicesNav({ t, className }: ServicesNavProps) {
  const [activeId, setActiveId] = useState<ServiceId | null>(null)

  useEffect(() => {
    const sections = SERVICE_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id as ServiceId)
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <nav aria-label={t("nav.services")} className={cn("w-full", className)}>
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {t("services.nav.kicker")}
      </p>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {SERVICE_IDS.map((id) => {
          const meta = SERVICE_META[id]
          const Icon = meta.icon
          const packageCount = SERVICE_PACKAGES[id].length
          const isActive = activeId === id

          return (
            <li key={id}>
              <Link
                href={`#${id}`}
                data-active={isActive}
                className={cn(
                  "card-lift group flex h-full flex-col rounded-2xl border border-white/70 p-4 transition-all duration-300",
                  "glass-ios hover:border-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "data-[active=true]:border-primary/25 data-[active=true]:bg-white/70 data-[active=true]:shadow-md",
                  meta.accent,
                )}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300",
                      meta.iconBg,
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary/80">
                    {packageCount} {t("services.nav.packages")}
                  </span>
                </div>
                <span className="text-sm font-bold leading-snug text-primary">
                  {t(`services.nav.${id}`)}
                </span>
                <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {t(`service.${id}.desc`)}
                </span>
                <span className="mt-3 text-xs font-semibold text-secondary opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-data-[active=true]:opacity-100">
                  {t("services.nav.jump")} →
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
