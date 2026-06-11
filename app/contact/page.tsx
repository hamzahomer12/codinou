"use client"

import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"
import { SketchyCard } from "@/components/sketchy-card"
import { SketchyButton } from "@/components/sketchy-button"
import { Mail, Send, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { trackMetaLead } from "@/lib/track-meta-lead"

export default function ContactPage() {
  const { t, language } = useLanguage()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serviceInterest: "",
    message: "",
  })

  const serviceOptions = [
    { value: "", label: t("contact.service.placeholder") },
    { value: "website", label: t("contact.service.website") },
    { value: "webapp", label: t("contact.service.webapp") },
    { value: "ai", label: t("contact.service.ai") },
    { value: "ecommerce", label: t("contact.service.ecommerce") },
    { value: "other", label: t("contact.service.other") },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, language }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setErrorMessage(payload.error ?? t("contact.api.error"))
        return
      }

      trackMetaLead()
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 5000)
      setFormData({ name: "", email: "", serviceInterest: "", message: "" })
    } catch {
      setErrorMessage(t("contact.error"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <section className="border-b border-primary/10 py-14 lg:py-20">
          <div className="container mx-auto max-w-2xl px-5 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10">
              <Mail className="h-8 w-8 text-secondary" aria-hidden />
            </div>
            <h1 className="mb-3 text-3xl font-bold text-balance text-primary sm:text-4xl">{t("contact.title")}</h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{t("contact.subtitle")}</p>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="container mx-auto max-w-xl px-5 sm:px-6 lg:px-8">
              <SketchyCard variant="highlighted" className="animate-fade-in-up">
                {isSubmitted ? (
                  <div
                    className="py-16 text-center"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary/20" aria-hidden>
                      <CheckCircle2 className="h-10 w-10 text-secondary" />
                    </div>
                    <p className="mb-2 text-2xl font-bold text-primary">{t("contact.api.success")}</p>
                    <p className="text-muted-foreground">{t("contact.api.success.sub")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-primary mb-2">
                        {t("contact.name")}
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-3.5 bg-background/80 border-2 border-primary/20 rounded-xl focus:border-primary/50 outline-none transition-all duration-200 text-foreground placeholder:text-muted-foreground/50"
                        placeholder={t("contact.name.placeholder")}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                        {t("contact.email")}
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-4 py-3.5 bg-background/80 border-2 border-primary/20 rounded-xl focus:border-primary/50 outline-none transition-all duration-200 text-foreground placeholder:text-muted-foreground/50"
                        placeholder={t("contact.email.placeholder")}
                      />
                    </div>

                    <div>
                      <label htmlFor="serviceInterest" className="block text-sm font-semibold text-primary mb-2">
                        {t("contact.service")}
                      </label>
                      <select
                        id="serviceInterest"
                        value={formData.serviceInterest}
                        onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                        className="w-full px-4 py-3.5 bg-background/80 border-2 border-primary/20 rounded-xl focus:border-primary/50 outline-none transition-all duration-200 text-foreground"
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt.value || "empty"} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-primary mb-2">
                        {t("contact.message")}
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="w-full px-4 py-3.5 bg-background/80 border-2 border-primary/20 rounded-xl focus:border-primary/50 outline-none transition-all duration-200 resize-none text-foreground placeholder:text-muted-foreground/50"
                        placeholder={t("contact.message.placeholder")}
                      />
                    </div>

                    {errorMessage && (
                      <div
                        className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                        role="alert"
                        aria-live="assertive"
                      >
                        {errorMessage}
                      </div>
                    )}

                    <div className="pt-4">
                      <SketchyButton type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                        <Send className="w-5 h-5 mr-2" />
                        {isSubmitting ? t("contact.sending") : t("contact.send")}
                      </SketchyButton>
                    </div>
                  </form>
                )}
              </SketchyCard>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
