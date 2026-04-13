"use client"

import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"
import { SketchyCard } from "@/components/sketchy-card"
import { SketchyButton } from "@/components/sketchy-button"
import { Mail, Send, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const { t } = useLanguage()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

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
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setErrorMessage(payload.error ?? t("contact.api.error"))
        return
      }

      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 5000)
      setFormData({ name: "", email: "", message: "" })
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
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 right-16 h-16 w-16 rounded-full border-2 border-secondary/15 opacity-50" aria-hidden />
          <div className="absolute bottom-28 left-20 h-10 w-10 rounded-full border-2 border-primary/10 opacity-40" aria-hidden />

          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary/10 mb-8 animate-fade-in-up">
                <Mail className="w-10 h-10 text-secondary" />
              </div>

              <span className="inline-block text-sm font-mono text-secondary mb-4 tracking-wider uppercase animate-fade-in-up stagger-1">
                {"// "}{t("contact.title")}
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 animate-fade-in-up stagger-2 text-balance">
                {t("contact.title")}
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-in-up stagger-3 text-pretty">
                {t("contact.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-12 lg:py-20 notebook-lines">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
