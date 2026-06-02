"use client"

import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"
import { SketchyCard } from "@/components/sketchy-card"
import { SketchyButton } from "@/components/sketchy-button"
import { SectionHeading } from "@/components/section-heading"
import { ExpertiseCard } from "@/components/expertise-card"
import { PackageCard } from "@/components/package-card"
import { FaqSection } from "@/components/faq-section"
import {
  Lightbulb,
  Code2,
  Heart,
  ArrowRight,
  Globe,
  Layers,
  Bot,
  ShoppingCart,
  Rocket,
  Boxes,
} from "lucide-react"
import type { ServiceId } from "@/lib/services-data"

const EXPERTISE: { id: ServiceId; icon: typeof Globe; variant: "default" | "highlighted" | "coral" }[] = [
  { id: "website", icon: Globe, variant: "default" },
  { id: "webapp", icon: Layers, variant: "highlighted" },
  { id: "ai", icon: Bot, variant: "coral" },
  { id: "ecommerce", icon: ShoppingCart, variant: "default" },
  { id: "digital", icon: Rocket, variant: "highlighted" },
  { id: "odoo", icon: Boxes, variant: "coral" },
]

const HIGHLIGHT_PACKAGES = ["growth", "product", "odoo-custom"] as const

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main" tabIndex={-1} className="flex-1 pb-24 outline-none md:pb-0">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 lg:py-36">
          <div className="absolute top-20 left-10 h-24 w-24 rounded-full border-2 border-primary/10 opacity-50" aria-hidden />
          <div className="absolute bottom-32 right-16 h-16 w-16 rounded-full border-2 border-secondary/20 opacity-40" aria-hidden />

          <div className="container relative z-10 mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-10 flex justify-center animate-fade-in-up" aria-hidden>
                <Image
                  src="/codinou-logo.png"
                  alt=""
                  width={280}
                  height={140}
                  className="float-animation h-auto w-64 md:w-72"
                  priority
                />
              </div>

              <h1 className="animate-fade-in-up stagger-1 mb-6 text-4xl leading-tight font-bold text-balance md:text-5xl lg:text-6xl">
                <span className="text-primary">{t("hero.title")}</span>
                <br />
                <span className="text-secondary wavy-underline">{t("hero.subtitle")}</span>
              </h1>

              <p className="animate-fade-in-up stagger-2 mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
                {t("hero.description")}
              </p>

              <div className="animate-fade-in-up stagger-3 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <SketchyButton href="/services" variant="primary" className="text-lg">
                  {t("hero.cta")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </SketchyButton>
                <SketchyButton href="/contact" variant="outline">
                  {t("hero.cta.secondary")}
                </SketchyButton>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y-2 border-primary/10 bg-primary/[0.03] py-10" aria-label="Highlights">
          <div className="container mx-auto grid max-w-4xl grid-cols-3 gap-6 px-6 text-center lg:px-8">
            <div>
              <p className="text-3xl font-bold text-primary">6</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("stats.services")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-secondary">18+</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("stats.projects")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">✓</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("stats.support")}</p>
            </div>
          </div>
        </section>

        {/* Expertise */}
        <section id="expertise" className="py-20 lg:py-28 notebook-lines">
          <div className="container mx-auto px-6 lg:px-8">
            <SectionHeading
              kicker={t("expertise.kicker")}
              title={t("expertise.title")}
              subtitle={t("expertise.subtitle")}
            />
            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {EXPERTISE.map((item) => (
                <ExpertiseCard
                  key={item.id}
                  serviceId={item.id}
                  icon={item.icon}
                  t={t}
                  variant={item.variant}
                />
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6 lg:px-8">
            <SectionHeading title={t("about.title")} subtitle={t("about.description")} />
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              <SketchyCard variant="default" className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-primary">{t("about.feature1.title")}</h3>
                <p className="leading-relaxed text-muted-foreground">{t("about.feature1.desc")}</p>
              </SketchyCard>
              <SketchyCard variant="highlighted" className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10">
                  <Code2 className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-primary">{t("about.feature2.title")}</h3>
                <p className="leading-relaxed text-muted-foreground">{t("about.feature2.desc")}</p>
              </SketchyCard>
              <SketchyCard variant="coral" className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-primary">{t("about.feature3.title")}</h3>
                <p className="leading-relaxed text-muted-foreground">{t("about.feature3.desc")}</p>
              </SketchyCard>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="border-y-2 border-primary/10 bg-primary/[0.02] py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <SectionHeading kicker={t("process.kicker")} title={t("process.title")} />
            <ol className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((step) => (
                <li
                  key={step}
                  className="rounded-2xl border-2 border-primary/15 bg-card/60 p-5 shadow-sm backdrop-blur-sm"
                >
                  <span className="mb-2 block font-mono text-sm font-semibold text-secondary">
                    {String(step).padStart(2, "0")}
                  </span>
                  <h3 className="mb-2 font-bold text-primary">{t(`process.step${step}.title`)}</h3>
                  <p className="text-sm leading-relaxed text-foreground/85">{t(`process.step${step}.desc`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Tech */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-6 lg:px-8">
            <SectionHeading
              kicker={t("tech.kicker")}
              title={t("tech.title")}
              subtitle={t("tech.subtitle")}
            />
            <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
              {(["tech.next", "tech.react", "tech.node", "tech.odoo", "tech.ai", "tech.cloud"] as const).map(
                (key) => (
                  <li
                    key={key}
                    className="rounded-full border-2 border-primary/20 bg-card/80 px-4 py-2 text-sm font-medium text-foreground/90"
                  >
                    {t(key)}
                  </li>
                ),
              )}
            </ul>
          </div>
        </section>

        {/* Package highlights */}
        <section className="notebook-lines py-20 lg:py-28">
          <div className="container mx-auto px-6 lg:px-8">
            <SectionHeading
              kicker={t("packages.kicker")}
              title={t("packages.title")}
              subtitle={t("packages.subtitle")}
            />
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              {HIGHLIGHT_PACKAGES.map((pkg, i) => (
                <PackageCard key={pkg} packageId={pkg} t={t} highlighted={i === 1} />
              ))}
            </div>
            <p className="mt-10 text-center">
              <Link href="/services" className="inline-flex items-center font-semibold text-secondary hover:text-primary">
                {t("hero.cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </p>
          </div>
        </section>

        {/* Trust */}
        <section className="py-16 lg:py-20" aria-labelledby="trust-heading">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-3 inline-block font-mono text-sm uppercase tracking-wider text-secondary">
                {"// "}
                {t("trust.kicker")}
              </span>
              <h2 id="trust-heading" className="mb-10 text-2xl font-bold text-balance text-primary md:text-3xl">
                {t("trust.title")}
              </h2>
              <ul className="grid gap-6 text-left sm:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <li
                    key={n}
                    className="rounded-2xl border-2 border-primary/15 bg-card/60 p-5 shadow-sm backdrop-blur-sm"
                  >
                    <span className="mb-2 block font-mono text-sm font-semibold text-secondary">
                      {String(n).padStart(2, "0")}
                    </span>
                    <p className="leading-relaxed text-foreground/90">{t(`trust.step${n}`)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <FaqSection t={t} />

        {/* CTA */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
              <SketchyCard variant="highlighted" className="py-12 text-center">
                <span className="mb-4 inline-block font-mono text-sm tracking-wider text-secondary">
                  {"<"} {t("nav.cta")} {"/>"}
                </span>
                <h2 className="mb-3 text-2xl font-bold text-balance text-primary md:text-3xl">{t("cta.title")}</h2>
                <p className="mb-8 text-muted-foreground">{t("cta.subtitle")}</p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <SketchyButton href="/contact" variant="primary">
                    {t("nav.contact")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </SketchyButton>
                  <SketchyButton href="/services" variant="outline">
                    {t("nav.services")}
                  </SketchyButton>
                </div>
              </SketchyCard>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
