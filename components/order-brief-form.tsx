"use client"

import type React from "react"
import { useMemo, useState } from "react"
import Link from "next/link"
import { CreditCard } from "lucide-react"
import { SketchyButton } from "@/components/sketchy-button"
import { OrderPriceSummary } from "@/components/order-price-summary"
import { useLanguage } from "@/context/language-context"
import { calculatePackageQuote, getSelectOptionDelta } from "@/lib/package-pricing"
import { getBriefFields } from "@/lib/package-brief"
import { formatMoney } from "@/lib/stripe-payments"
import { cn } from "@/lib/utils"
import type { PackageId } from "@/lib/services-data"

const inputClass =
  "w-full px-4 py-3.5 bg-background/80 border-2 border-primary/20 rounded-xl focus:border-primary/50 outline-none transition-all duration-200 text-foreground placeholder:text-muted-foreground/50"

interface OrderBriefFormProps {
  packageId: PackageId
  packageName: string
  t: (key: string) => string
}

function formatOptionDelta(delta: number, language: string): string {
  const formatted = formatMoney(Math.abs(delta) * 100, "eur", language)
  if (delta > 0) return `(+${formatted})`
  if (delta < 0) return `(-${formatted})`
  return ""
}

export function OrderBriefForm({ packageId, packageName, t }: OrderBriefFormProps) {
  const { language } = useLanguage()
  const fields = getBriefFields(packageId)
  const [values, setValues] = useState<Record<string, string>>({})
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const quote = useMemo(() => calculatePackageQuote(packageId, values), [packageId, values])
  const stripeEnabled = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

  const setField = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!termsAccepted) {
      setError(t("order.error.terms"))
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          termsAccepted: true,
          brief: values,
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok || !payload.url) {
        setError(payload.error ?? t("payment.error"))
        return
      }

      window.location.href = payload.url
    } catch {
      setError(t("payment.error"))
    } finally {
      setIsLoading(false)
    }
  }

  const renderField = (field: (typeof fields)[number]) => (
    <div key={field.id}>
      <label htmlFor={field.id} className="mb-2 block text-sm font-semibold text-primary">
        {t(field.labelKey)}
        {field.required && <span className="text-destructive"> *</span>}
      </label>

      {field.type === "select" && field.options ? (
        <select
          id={field.id}
          value={values[field.id] ?? ""}
          onChange={(e) => setField(field.id, e.target.value)}
          required={field.required}
          className={inputClass}
        >
          <option value="">{t("order.select.placeholder")}</option>
          {field.options.map((opt) => {
            const delta = getSelectOptionDelta(packageId, field.id, opt.value)
            const deltaLabel = delta !== null ? ` ${formatOptionDelta(delta, language)}` : ""
            return (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
                {deltaLabel}
              </option>
            )
          })}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          id={field.id}
          rows={field.rows ?? 3}
          value={values[field.id] ?? ""}
          onChange={(e) => setField(field.id, e.target.value)}
          required={field.required}
          className={cn(inputClass, "resize-none")}
          placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
        />
      ) : (
        <input
          id={field.id}
          type={field.type}
          value={values[field.id] ?? ""}
          onChange={(e) => setField(field.id, e.target.value)}
          required={field.required}
          className={inputClass}
          placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
        />
      )}
    </div>
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-start">
      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h2 className="mb-4 text-lg font-bold text-primary">{t("order.section.contact")}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {fields
              .filter((f) => ["fullName", "email", "phone", "company"].includes(f.id))
              .map(renderField)}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold text-primary">{t(`order.section.${packageId}`)}</h2>
          <div className="space-y-5">
            {fields
              .filter((f) => !["fullName", "email", "phone", "company"].includes(f.id))
              .map(renderField)}
          </div>
        </section>

        <section className="rounded-xl border border-primary/15 bg-muted/30 p-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
              className="mt-1 h-4 w-4 shrink-0 rounded border-primary/30 text-primary focus:ring-primary/50"
            />
            <span className="text-sm leading-relaxed text-foreground/90">
              {t("order.terms.prefix")}{" "}
              <Link href="/terms" target="_blank" className="font-semibold text-primary underline underline-offset-2">
                {t("footer.terms")}
              </Link>{" "}
              {t("order.terms.suffix")}
            </span>
          </label>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t("order.terms.note")}</p>
        </section>

        {error && (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="lg:hidden">
          <OrderPriceSummary packageId={packageId} values={values} language={language} t={t} />
        </div>

        {stripeEnabled ? (
          <div>
            <p className="mb-2 text-center text-sm font-medium text-muted-foreground">
              {t("order.price.payNow")}: {formatMoney(quote.depositEur * 100, "eur", language)} · {packageName}
            </p>
            <button
              type="submit"
              disabled={isLoading || !termsAccepted}
              className={cn(
                "relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
              )}
              style={{ borderRadius: "16px 6px 16px 6px" }}
            >
              <CreditCard className="h-4 w-4" aria-hidden />
              {isLoading ? t("payment.loading") : t("order.submit")}
            </button>
          </div>
        ) : (
          <SketchyButton href="/contact" variant="primary" className="w-full">
            {t("packages.cta")}
          </SketchyButton>
        )}
      </form>

      <div className="hidden lg:block">
        <OrderPriceSummary packageId={packageId} values={values} language={language} t={t} />
      </div>
    </div>
  )
}
