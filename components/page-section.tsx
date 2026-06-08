import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface PageSectionProps {
  children: ReactNode
  id?: string
  className?: string
  variant?: "default" | "muted" | "plain"
  ariaLabelledby?: string
}

export function PageSection({
  children,
  id,
  className,
  variant = "default",
  ariaLabelledby,
}: PageSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn(
        "scroll-mt-24 py-14 lg:py-20",
        variant === "muted" && "glass-ios-subtle border-y border-white/40",
        variant === "plain" && "py-12",
        className,
      )}
    >
      <div className="container mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}
