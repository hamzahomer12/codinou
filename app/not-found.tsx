"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SketchyButton } from "@/components/sketchy-button"
import { useLanguage } from "@/context/language-context"
import { ArrowRight } from "lucide-react"

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main" tabIndex={-1} className="flex flex-1 items-center justify-center px-6 py-20 outline-none">
        <div className="max-w-xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">
            {t("notFound.kicker")}
          </p>
          <h1 className="text-display-sm mb-4 font-bold text-primary">{t("notFound.title")}</h1>
          <p className="mb-8 text-base leading-relaxed text-muted-foreground">{t("notFound.subtitle")}</p>
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <SketchyButton href="/" variant="primary" className="sm:min-w-[200px]">
              {t("notFound.cta")}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </SketchyButton>
            <SketchyButton href="/services" variant="outline" className="sm:min-w-[200px]">
              {t("notFound.services")}
            </SketchyButton>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
