"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { SERVICE_IDS, type ServiceId } from "@/lib/services-data"

interface ServicesNavProps {
  t: (key: string) => string
  className?: string
}

export function ServicesNav({ t, className }: ServicesNavProps) {
  return (
    <nav
      aria-label={t("nav.services")}
      className={cn(
        "flex flex-wrap justify-center gap-2 rounded-2xl border border-primary/15 bg-card/80 p-2 shadow-sm",
        className,
      )}
    >
      {SERVICE_IDS.map((id) => (
        <Link
          key={id}
          href={`#${id}`}
          className="rounded-xl px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t(`service.${id}.name`)}
        </Link>
      ))}
    </nav>
  )
}
