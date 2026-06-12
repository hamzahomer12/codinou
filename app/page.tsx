"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
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
  ShoppingBag,
  Search,
  PenTool,
  Hammer,
  RocketIcon,
  Tag,
  MessageCircle,
  LifeBuoy,
  ShieldCheck,
} from "lucide-react"
import type { ServiceId } from "@/lib/services-data"
import { trackMetaLead } from "@/lib/track-meta-lead"

const SERVICES: { id: ServiceId; icon: typeof Globe }[] = [
  { id: "website", icon: Globe },
  { id: "webapp", icon: Layers },
  { id: "ai", icon: Bot },
  { id: "ecommerce", icon: ShoppingBag },
]

const PROCESS_ICONS = [Search, PenTool, Hammer, RocketIcon]

const TRUST_SIGNALS: { id: string; icon: typeof Globe }[] = [
  { id: "onetime", icon: Tag },
  { id: "reply", icon: MessageCircle },
  { id: "launch", icon: LifeBuoy },
  { id: "secure", icon: ShieldCheck },
]

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main" tabIndex={-1} className="flex-1 pb-20 outline-none md:pb-0">
        <PageSection variant="plain" className="pt-16 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Image
              src="/codinou-logo.png"
              alt="Codinou"
              width={240}
              height={120}
              className="hero-enter mx-auto mb-8 h-auto w-56 md:w-64"
              priority
            />
            <h1 className="text-display hero-enter hero-enter-delay-1 mb-4 font-bold text-balance text-primary">
              {t("hero.title")}
              <span className="mt-1 block text-secondary">{t("hero.subtitle")}</span>
            </h1>
            <p className="hero-enter hero-enter-delay-2 mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("hero.description")}
            </p>
            <div className="hero-enter hero-enter-delay-3 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <SketchyButton href="/services" variant="primary" className="sm:min-w-[200px]">
                {t("hero.cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </SketchyButton>
              <SketchyButton
                href="/contact"
                variant="outline"
                className="sm:min-w-[200px]"
                onClick={trackMetaLead}
              >
                {t("hero.cta.secondary")}
              </SketchyButton>
            </div>
          </div>
        </PageSection>

        <PageSection variant="plain" className="pt-0 pb-8 lg:pb-10" ariaLabelledby="trust-heading">
          <h2 id="trust-heading" className="sr-only">
            {t("trust.title")}
          </h2>
          <Reveal>
            <ul className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {TRUST_SIGNALS.map((item) => (
                <li
                  key={item.id}
                  className="glass-ios-subtle flex items-start gap-3 rounded-2xl p-4"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/15">
                    <item.icon className="h-5 w-5 text-secondary" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-primary">{t(`trust.${item.id}.title`)}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {t(`trust.${item.id}.desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </PageSection>

        <PageSection id="services" variant="muted" ariaLabelledby="services-heading">
          <Reveal>
            <SectionHeading
              label={t("expertise.kicker")}
              title={t("expertise.title")}
              subtitle={t("expertise.subtitle")}
            />
          </Reveal>
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {SERVICES.map((item, index) => (
              <Reveal key={item.id} delay={index * 100}>
                <ExpertiseCard serviceId={item.id} icon={item.icon} t={t} />
              </Reveal>
            ))}
          </div>
        </PageSection>

        <PageSection ariaLabelledby="about-heading">
          <Reveal>
            <SectionHeading title={t("about.title")} subtitle={t("about.description")} />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Lightbulb, title: t("about.feature1.title"), desc: t("about.feature1.desc") },
              { icon: Code2, title: t("about.feature2.title"), desc: t("about.feature2.desc") },
              { icon: Heart, title: t("about.feature3.title"), desc: t("about.feature3.desc") },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 90}>
                <div className="card-lift glass-ios rounded-2xl p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" aria-hidden />
                  </div>
                  <h3 className="mb-2 font-bold text-primary">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </PageSection>

        <PageSection variant="muted" ariaLabelledby="process-heading">
          <Reveal>
            <SectionHeading label={t("process.kicker")} title={t("process.title")} />
          </Reveal>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((step) => {
              const Icon = PROCESS_ICONS[step - 1]
              return (
                <Reveal key={step} delay={(step - 1) * 80}>
                  <li className="card-lift glass-ios h-full rounded-2xl p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15">
                      <Icon className="h-5 w-5 text-secondary" aria-hidden />
                    </div>
                    <h3 className="mb-1.5 font-bold text-primary">{t(`process.step${step}.title`)}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{t(`process.step${step}.desc`)}</p>
                  </li>
                </Reveal>
              )
            })}
          </ol>
        </PageSection>

        <FaqSection t={t} />

        <PageSection>
          <Reveal>
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
          </Reveal>
        </PageSection>
      </main>

      <Footer />
    </div>
  )
}
