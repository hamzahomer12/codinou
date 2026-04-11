"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"
import { SketchyCard } from "@/components/sketchy-card"
import { SketchyButton } from "@/components/sketchy-button"
import { Lightbulb, Code2, Heart, ArrowRight } from "lucide-react"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-36 overflow-hidden">
          {/* Subtle decorative elements */}
          <div className="absolute top-20 left-10 w-24 h-24 border-2 border-primary/10 rounded-full opacity-50" />
          <div className="absolute bottom-32 right-16 w-16 h-16 border-2 border-secondary/20 rounded-full opacity-40" />
          <div className="absolute top-40 right-1/4 w-3 h-3 bg-secondary/30 rounded-full" />
          <div className="absolute bottom-48 left-1/3 w-2 h-2 bg-primary/20 rounded-full" />

          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Logo showcase */}
              <div className="flex justify-center mb-12 animate-fade-in-up">
                <Image
                  src="/codinou-logo.png"
                  alt="Codinouu - Creative Web Development"
                  width={280}
                  height={140}
                  className="h-auto w-64 md:w-72 float-animation"
                  priority
                />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up stagger-1 text-balance">
                <span className="text-primary">{t("hero.title")}</span>
                <br />
                <span className="text-secondary wavy-underline">{t("hero.subtitle")}</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up stagger-2 text-pretty">
                {t("hero.description")}
              </p>

              <div className="animate-fade-in-up stagger-3">
                <SketchyButton href="/services" variant="primary" className="text-lg">
                  {t("hero.cta")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </SketchyButton>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 lg:py-28 notebook-lines">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-sm font-mono text-secondary mb-4 tracking-wider uppercase">
                {"// "}{t("about.title")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-balance">
                {t("about.title")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                {t("about.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <SketchyCard variant="default" className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{t("about.feature1.title")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("about.feature1.desc")}</p>
              </SketchyCard>

              <SketchyCard variant="highlighted" className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 mb-6">
                  <Code2 className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{t("about.feature2.title")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("about.feature2.desc")}</p>
              </SketchyCard>

              <SketchyCard variant="coral" className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{t("about.feature3.title")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("about.feature3.desc")}</p>
              </SketchyCard>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <SketchyCard variant="highlighted" className="text-center py-12">
                <span className="inline-block text-sm font-mono text-secondary mb-4 tracking-wider">
                  {"<"} {t("services.cta")} {"/>"}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-balance">
                  {t("cta.title")}
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <SketchyButton href="/services" variant="primary">
                    {t("nav.services")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </SketchyButton>
                  <SketchyButton href="/contact" variant="outline">
                    {t("nav.contact")}
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
