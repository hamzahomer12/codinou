import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  kicker?: string
  title: string
  subtitle?: string
  className?: string
  centered?: boolean
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  className,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && "mx-auto max-w-3xl text-center", "mb-12 lg:mb-16", className)}>
      {kicker && (
        <span className="mb-3 inline-block font-mono text-sm uppercase tracking-wider text-secondary">
          {"// "}
          {kicker}
        </span>
      )}
      <h2 className="text-balance text-3xl font-bold text-primary md:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}
