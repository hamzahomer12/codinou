import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SketchyCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "highlighted" | "coral"
}

export function SketchyCard({ children, className, variant = "default" }: SketchyCardProps) {
  return (
    <div
      className={cn(
        "glass-ios relative p-8 transition-all duration-300 motion-safe:hover:-translate-y-1",
        variant === "highlighted" && "ring-1 ring-primary/15",
        variant === "coral" && "ring-1 ring-secondary/20",
        className,
      )}
      style={{
        borderRadius: "24px 8px 24px 8px",
      }}
    >
      {children}
    </div>
  )
}
