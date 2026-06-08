"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"
import { SketchyCard } from "@/components/sketchy-card"
import { SketchyButton } from "@/components/sketchy-button"
import { PageSection } from "@/components/page-section"
import { SectionHeading } from "@/components/section-heading"
import { ExpertiseCard } from "@/components/expertise-card"
import { FaqSection } from "@/components/faq-section"
import {
  Lightbulb,
  Code2,
  Heart,
  ArrowRight,
  Globe,
  Layers,
  Bot,
  Search,
  PenTool,
  Hammer,
  RocketIcon,
} from "lucide-react"
import type { ServiceId } from "@/lib/services-data"

const SERVICES: { id: ServiceId; icon: typeof Globe }[] = [
  { id: "website", icon: Globe },
  { id: "webapp", icon: Layers },
  { id: "ai", icon: Bot },
]

const PROCESS_ICONS = [Search, PenTool, Hammer, RocketIcon]

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main" tabIndex={-1} className="flex-1 pb-20 outline-none md:pb-0">
        {/* Hero */}
        <PageSection variant="plain" className="pt-16 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Image
              src="/codinou-logo.png"
              alt="Codinou"
              width={240}
              height={120}
              className="mx-auto mb-8 h-auto w-56 md:w-64"
              priority
            />
            <h1 className="mb-4 text-3xl font-bold leading-tight text-balance text-primary sm:text-4xl lg:text-5xl">
              {t("hero.title")}
              <span className="mt-1 block text-secondary">{t("hero.subtitle")}</span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("hero.description")}
            </p>
            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <SketchyButton href="/services" variant="primary" className="sm:min-w-[200px]">
                {t("hero.cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </SketchyButton>
              <SketchyButton href="/contact" variant="outline" className="sm:min-w-[200px]">
                {t("hero.cta.secondary")}
              </SketchyButton>
            </div>
          </div>
        </PageSection>

        {/* Services */}
        <PageSection id="services" variant="muted" ariaLabelledby="services-heading">
          <SectionHeading
            label={t("expertise.kicker")}
            title={t("expertise.title")}
            subtitle={t("expertise.subtitle")}
          />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3 lg:gap-5">
            {SERVICES.map((item) => (
              <ExpertiseCard key={item.id} serviceId={item.id} icon={item.icon} t={t} />
            ))}
          </div>
        </PageSection>

        {/* Why us */}
        <PageSection ariaLabelledby="about-heading">
          <SectionHeading title={t("about.title")} subtitle={t("about.description")} />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Lightbulb, title: t("about.feature1.title"), desc: t("about.feature1.desc") },
              { icon: Code2, title: t("about.feature2.title"), desc: t("about.feature2.desc") },
              { icon: Heart, title: t("about.feature3.title"), desc: t("about.feature3.desc") },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-primary/12 bg-card p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" aria-hidden />
                </div>
                <h3 className="mb-2 font-bold text-primary">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </PageSection>

        {/* Process */}
        <PageSection variant="muted" ariaLabelledby="process-heading">
          <SectionHeading label={t("process.kicker")} title={t("process.title")} />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((step) => {
              const Icon = PROCESS_ICONS[step - 1]
              return (
                <li
                  key={step}
                  className="rounded-2xl border border-primary/12 bg-card p-5 shadow-sm"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15">
                    <Icon className="h-5 w-5 text-secondary" aria-hidden />
                  </div>
                  <h3 className="mb-1.5 font-bold text-primary">{t(`process.step${step}.title`)}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{t(`process.step${step}.desc`)}</p>
                </li>
              )
            })}
          </ol>
        </PageSection>

        <FaqSection t={t} />

        {/* CTA */}
        <PageSection>
          <SketchyCard variant="highlighted" className="mx-auto max-w-xl py-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-primary">{t("cta.title")}</h2>
            <p className="mb-6 text-muted-foreground">{t("cta.subtitle")}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <SketchyButton href="/contact" variant="primary">
                {t("nav.contact")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </SketchyButton>
              <SketchyButton href="/services" variant="outline">
                {t("nav.services")}
              </SketchyButton>
            </div>
          </SketchyCard>
        </PageSection>
      </main>

      <Footer />
    </div>
  )
}
