import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  label?: string
  title: string
  subtitle?: string
  className?: string
  centered?: boolean
  /** @deprecated use `label` */
  kicker?: string
}

export function SectionHeading({
  label,
  kicker,
  title,
  subtitle,
  className,
  centered = true,
}: SectionHeadingProps) {
  const eyebrow = label ?? kicker

  return (
    <div className={cn(centered && "mx-auto max-w-2xl text-center", "mb-10 lg:mb-12", className)}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-secondary">{eyebrow}</p>
      )}
      <h2 className="text-balance text-2xl font-bold text-primary sm:text-3xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>
      )}
    </div>
  )
}
