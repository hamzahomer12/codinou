"use client"

import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SketchyCard } from "@/components/sketchy-card"
import { OrderBriefForm } from "@/components/order-brief-form"
import { useLanguage } from "@/context/language-context"
import { isValidPackageId } from "@/lib/package-brief"
import { PACKAGE_PRICES_EUR, formatMoney } from "@/lib/stripe-payments"
import type { PackageId } from "@/lib/services-data"

export default function OrderPage() {
  const params = useParams()
  const packageId = typeof params.packageId === "string" ? params.packageId : ""
  const { t, language } = useLanguage()

  if (!isValidPackageId(packageId)) {
    notFound()
  }

  const pkg = packageId as PackageId
  const key = `pkg.${pkg}`
  const basePriceFormatted = formatMoney(PACKAGE_PRICES_EUR[pkg] * 100, "eur", language)
  const features = [1, 2, 3, 4].map((i) => t(`${key}.f${i}`))

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <section className="border-b border-primary/10 py-10 lg:py-14">
          <div className="container mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
            <Link
              href="/services"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {t("order.back")}
            </Link>

            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-secondary">
              {t("order.kicker")}
            </p>
            <h1 className="mb-2 text-3xl font-bold text-primary sm:text-4xl">{t(`${key}.name`)}</h1>
            <p className="mb-4 text-base leading-relaxed text-muted-foreground">{t(`${key}.best`)}</p>

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
              <span className="text-xl font-bold text-secondary">
                {t("packages.from")} {basePriceFormatted}
              </span>
              <span className="text-muted-foreground">{t("order.price.updatesLive")}</span>
              <span className="text-muted-foreground">
                {t("packages.timeline")}: {t(`${key}.timeline`)}
              </span>
            </div>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-10 lg:py-14">
          <div className="container mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
            <SketchyCard variant="highlighted">
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{t("order.intro")}</p>
              <OrderBriefForm packageId={pkg} packageName={t(`${key}.name`)} t={t} />
            </SketchyCard>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
