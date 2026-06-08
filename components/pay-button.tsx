"use client"

import { useState } from "react"
import { CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PackageId } from "@/lib/services-data"

interface PayButtonProps {
  packageId: PackageId
  packageName: string
  packageDescription: string
  depositLabel: string
  payLabel: string
  loadingLabel: string
  errorLabel: string
  variant?: "primary" | "outline"
  className?: string
}

export function PayButton({
  packageId,
  packageName,
  packageDescription,
  depositLabel,
  payLabel,
  loadingLabel,
  errorLabel,
  variant = "outline",
  className,
}: PayButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const stripeEnabled = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  if (!stripeEnabled) return null

  const handlePay = async () => {
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          name: packageName,
          description: packageDescription,
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok || !payload.url) {
        setError(payload.error ?? errorLabel)
        return
      }

      window.location.href = payload.url
    } catch {
      setError(errorLabel)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      <p className="mb-2 text-center text-xs font-medium text-muted-foreground">{depositLabel}</p>
      <button
        type="button"
        onClick={handlePay}
        disabled={isLoading}
        className={cn(
          "relative inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
          variant === "primary"
            ? "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50"
            : "border-2 border-primary bg-transparent text-primary hover:bg-primary/5 focus:ring-primary/50",
        )}
        style={{ borderRadius: "16px 6px 16px 6px" }}
      >
        <CreditCard className="h-4 w-4" aria-hidden />
        {isLoading ? loadingLabel : payLabel}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
