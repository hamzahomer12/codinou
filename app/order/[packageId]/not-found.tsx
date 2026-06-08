"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SketchyButton } from "@/components/sketchy-button"
import { useLanguage } from "@/context/language-context"

export default function OrderNotFound() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-5 py-20">
        <div className="max-w-md text-center">
          <h1 className="mb-3 text-2xl font-bold text-primary">{t("order.notFound.title")}</h1>
          <p className="mb-6 text-muted-foreground">{t("order.notFound.subtitle")}</p>
          <SketchyButton href="/services" variant="primary">
            {t("payment.cancel.cta")}
          </SketchyButton>
        </div>
      </main>
      <Footer />
    </div>
  )
}
