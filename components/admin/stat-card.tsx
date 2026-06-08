import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  sub,
  className,
}: {
  label: string
  value: string | number
  sub?: string
  className?: string
}) {
  return (
    <div className={cn("glass-ios rounded-2xl p-5", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold text-primary">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}
