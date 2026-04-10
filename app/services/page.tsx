"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"
import { SketchyCard } from "@/components/sketchy-card"
import { SketchyButton } from "@/components/sketchy-button"
import { Check, Sparkles, ShoppingCart, Zap } from "lucide-react"

export default function ServicesPage() {
  const { t } = useLanguage()

  const services = [
    {
      key: "starter",
      variant: "default" as const,
      icon: Zap,
      features: [
        t("services.starter.feature1"),
        t("services.starter.feature2"),
        t("services.starter.feature3"),
        t("services.starter.feature4"),
      ],
    },
    {
      key: "pro",
      variant: "highlighted" as const,
      icon: Sparkles,
      badge: t("services.pro.badge"),
      features: [
        t("services.pro.feature1"),
        t("services.pro.feature2"),
        t("services.pro.feature3"),
        t("services.pro.feature4"),
        t("services.pro.feature5"),
      ],
    },
    {
      key: "ecom",
      variant: "coral" as const,
      icon: ShoppingCart,
      badge: t("services.ecom.badge"),
      features: [
        t("services.ecom.feature1"),
        t("services.ecom.feature2"),
        t("services.ecom.feature3"),
        t("services.ecom.feature4"),
        t("services.ecom.feature5"),
      ],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-16 right-20 w-20 h-20 border-2 border-secondary/15 rounded-full opacity-50" />
          <div className="absolute bottom-24 left-16 w-12 h-12 border-2 border-primary/10 rounded-full opacity-40" />

          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block text-sm font-mono text-secondary mb-4 tracking-wider uppercase animate-fade-in-up">
                {"// "}{t("services.title")}
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 animate-fade-in-up stagger-1 text-balance">
                {t("services.title")}
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-in-up stagger-2 text-pretty">
                {t("services.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 lg:py-20 notebook-lines">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <div 
                    key={service.key} 
                    className={`relative animate-fade-in-up stagger-${index + 1}`}
                  >
                    {service.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <span
                          className="inline-block px-5 py-1.5 text-xs font-bold tracking-wide uppercase bg-secondary text-secondary-foreground shadow-md"
                          style={{ borderRadius: "16px 4px 16px 4px" }}
                        >
                          {service.badge}
                        </span>
                      </div>
                    )}

                    <SketchyCard variant={service.variant} className="h-full flex flex-col pt-10">
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary mb-2">
                          {t(`services.${service.key}.name`)}
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {t(`services.${service.key}.desc`)}
                        </p>
                      </div>

                      <ul className="space-y-4 flex-1 mb-8">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center mt-0.5">
                              <Check className="w-3 h-3 text-secondary" />
                            </div>
                            <span className="text-foreground/80 leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <SketchyButton
                        href="/contact"
                        variant={service.variant === "highlighted" ? "primary" : "outline"}
                        className="w-full"
                      >
                        {t("services.cta")}
                      </SketchyButton>
                    </SketchyCard>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
