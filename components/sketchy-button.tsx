"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import Link from "next/link"

interface SketchyButtonProps {
  children: ReactNode
  className?: string
  variant?: "primary" | "secondary" | "outline"
  href?: string
  type?: "button" | "submit"
  onClick?: () => void
  disabled?: boolean
}

export function SketchyButton({
  children,
  className,
  variant = "primary",
  href,
  type = "button",
  onClick,
  disabled = false,
}: SketchyButtonProps) {
  const baseStyles = cn(
    "relative inline-flex min-h-[44px] items-center justify-center px-8 py-4 text-base font-semibold tracking-wide transition-all duration-300 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg motion-safe:active:translate-y-0 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    disabled && "pointer-events-none opacity-60",
    variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/50",
    variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:ring-secondary/50",
    variant === "outline" && "bg-transparent border-2 border-primary text-primary hover:bg-primary/5 focus-visible:ring-primary/50",
    className,
  )

  const borderRadius = "20px 6px 20px 6px"

  if (href) {
    if (disabled) {
      return (
        <span className={baseStyles} style={{ borderRadius }} aria-disabled="true">
          {children}
        </span>
      )
    }
    return (
      <Link href={href} className={baseStyles} style={{ borderRadius }} onClick={onClick}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
      style={{ borderRadius }}
    >
      {children}
    </button>
  )
}
