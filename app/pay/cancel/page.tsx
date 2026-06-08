"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageSection } from "@/components/page-section"
import { SketchyButton } from "@/components/sketchy-button"
import { useLanguage } from "@/context/language-context"

export default function PayCancelPage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <PageSection>
          <div className="mx-auto max-w-lg text-center">
            <h1 className="mb-3 text-3xl font-bold text-primary">{t("payment.cancel.title")}</h1>
            <p className="mb-8 leading-relaxed text-muted-foreground">{t("payment.cancel.subtitle")}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <SketchyButton href="/services" variant="primary">
                {t("payment.cancel.cta")}
              </SketchyButton>
              <SketchyButton href="/contact" variant="outline">
                {t("nav.contact")}
              </SketchyButton>
            </div>
          </div>
        </PageSection>
      </main>
      <Footer />
    </div>
  )
}
