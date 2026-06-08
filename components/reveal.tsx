"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useInView } from "@/hooks/use-in-view"

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "none"
}

export function Reveal({ children, className, delay = 0, direction = "up" }: RevealProps) {
  const { ref, isInView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn(
        "reveal",
        direction === "up" && "reveal-up",
        direction === "down" && "reveal-down",
        direction === "none" && "reveal-fade",
        isInView && "reveal-visible",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
