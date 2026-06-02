"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"
import { SectionHeading } from "@/components/section-heading"
import { PackageCard } from "@/components/package-card"
import { SketchyButton } from "@/components/sketchy-button"
import { SERVICE_IDS, SERVICE_PACKAGES, type ServiceId } from "@/lib/services-data"
import {
  Globe,
  Layers,
  Bot,
  ShoppingCart,
  Rocket,
  Boxes,
  ArrowRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const SERVICE_ICONS: Record<ServiceId, LucideIcon> = {
  website: Globe,
  webapp: Layers,
  ai: Bot,
  ecommerce: ShoppingCart,
  digital: Rocket,
  odoo: Boxes,
}

export default function ServicesPage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main" tabIndex={-1} className="flex-1 pb-24 outline-none md:pb-0">
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute top-16 right-20 h-20 w-20 rounded-full border-2 border-secondary/15 opacity-50" aria-hidden />
          <div className="container relative z-10 mx-auto px-6 lg:px-8">
            <SectionHeading
              kicker={t("nav.services")}
              title={t("services.title")}
              subtitle={t("services.subtitle")}
            />
          </div>
        </section>

        {SERVICE_IDS.map((serviceId, sectionIndex) => {
          const Icon = SERVICE_ICONS[serviceId]
          const packages = SERVICE_PACKAGES[serviceId]
          return (
            <section
              key={serviceId}
              id={serviceId}
              className={`scroll-mt-24 py-16 lg:py-24 ${sectionIndex % 2 === 1 ? "notebook-lines" : ""}`}
            >
              <div className="container mx-auto px-6 lg:px-8">
                <div className="mx-auto mb-12 max-w-3xl">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" aria-hidden />
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-primary md:text-4xl">
                    {t(`service.${serviceId}.name`)}
                  </h2>
                  <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                    {t(`service.${serviceId}.desc`)}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/85">
                    <span className="font-semibold text-primary">{t("services.detail")}: </span>
                    {t(`service.${serviceId}.detail`)}
                  </p>
                </div>

                <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
                  {packages.map((pkgId, i) => (
                    <PackageCard
                      key={pkgId}
                      packageId={pkgId}
                      t={t}
                      highlighted={i === 1}
                    />
                  ))}
                </div>
              </div>
            </section>
          )
        })}

        <section className="border-t-2 border-primary/10 py-20">
          <div className="container mx-auto px-6 text-center lg:px-8">
            <h2 className="mb-6 text-2xl font-bold text-primary md:text-3xl">{t("cta.title")}</h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">{t("cta.subtitle")}</p>
            <SketchyButton href="/contact" variant="primary" className="text-lg">
              {t("services.cta")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </SketchyButton>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
