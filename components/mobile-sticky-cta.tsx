"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/context/language-context"

const PATHS_WITH_STICKY = new Set(["/", "/services"])

export function MobileStickyCta() {
  const pathname = usePathname()
  const { t } = useLanguage()

  if (!PATHS_WITH_STICKY.has(pathname)) {
    return null
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-primary/15 bg-background/95 p-3 shadow-[0_-8px_24px_rgba(45,58,92,0.08)] backdrop-blur-md md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      role="region"
      aria-label={t("a11y.stickyCta")}
    >
      <Link
        href="/contact"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ borderRadius: "16px 6px 16px 6px" }}
      >
        {t("nav.cta")}
        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
      </Link>
    </div>
  )
}
