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
        "relative p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        variant === "default" && "bg-card/80 border-2 border-primary/20 shadow-sm",
        variant === "highlighted" && "bg-primary/[0.03] border-2 border-primary/40 shadow-md",
        variant === "coral" && "bg-secondary/[0.03] border-2 border-secondary/40 shadow-md",
        className,
      )}
      style={{
        borderRadius: "24px 8px 24px 8px",
        backdropFilter: "blur(8px)",
      }}
    >
      {children}
    </div>
  )
}
