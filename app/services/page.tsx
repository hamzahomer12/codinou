"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"
import { Reveal } from "@/components/reveal"
import { PageSection } from "@/components/page-section"
import { SectionHeading } from "@/components/section-heading"
import { ServicesNav } from "@/components/services-nav"
import { PackageCard } from "@/components/package-card"
import { SketchyButton } from "@/components/sketchy-button"
import { SERVICE_IDS, SERVICE_PACKAGES, type ServiceId } from "@/lib/services-data"
import { Globe, Layers, Bot, ShoppingBag, ArrowRight } from "lucide-react"
import { EcommerceComparison } from "@/components/ecommerce-comparison"
import type { LucideIcon } from "lucide-react"

const SERVICE_ICONS: Record<ServiceId, LucideIcon> = {
  website: Globe,
  webapp: Layers,
  ai: Bot,
  ecommerce: ShoppingBag,
}

export default function ServicesPage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main" tabIndex={-1} className="flex-1 pb-20 outline-none md:pb-0">
        <PageSection variant="plain" className="pt-12 lg:pt-16">
          <Reveal>
            <SectionHeading title={t("services.title")} subtitle={t("services.subtitle")} />
          </Reveal>
          <p className="mx-auto mb-8 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
            {t("services.pricingNote")}
          </p>
          <ServicesNav t={t} className="mx-auto max-w-3xl" />
        </PageSection>

        {SERVICE_IDS.map((serviceId, index) => {
          const Icon = SERVICE_ICONS[serviceId]
          const packages = SERVICE_PACKAGES[serviceId]
          return (
            <PageSection
              key={serviceId}
              id={serviceId}
              variant={index % 2 === 1 ? "muted" : "default"}
            >
              <Reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" aria-hidden />
                </div>
                <div className="max-w-2xl">
                  <h2 className="mb-2 text-2xl font-bold text-primary sm:text-3xl">
                    {t(`service.${serviceId}.name`)}
                  </h2>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {t(`service.${serviceId}.desc`)}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={80}>
              <p className="mb-8 max-w-3xl text-sm leading-relaxed text-foreground/80">
                {t(`service.${serviceId}.detail`)}
              </p>
              </Reveal>

              {serviceId === "ecommerce" && <EcommerceComparison t={t} />}

              <div className="grid gap-5 lg:grid-cols-3">
                {packages.map((pkgId, i) => (
                  <Reveal key={pkgId} delay={i * 90}>
                    <PackageCard packageId={pkgId} t={t} highlighted={i === 1} />
                  </Reveal>
                ))}
              </div>
            </PageSection>
          )
        })}

        <PageSection variant="muted">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="mb-3 text-2xl font-bold text-primary">{t("cta.title")}</h2>
            <p className="mb-6 text-muted-foreground">{t("cta.subtitle")}</p>
            <SketchyButton href="/contact" variant="primary">
              {t("services.cta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </SketchyButton>
          </div>
        </PageSection>
      </main>

      <Footer />
    </div>
  )
}
