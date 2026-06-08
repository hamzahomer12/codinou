import Image from "next/image"
import { cn } from "@/lib/utils"

export function AdminLogo({
  size = "md",
  showAdminLabel = false,
  className,
}: {
  size?: "sm" | "md" | "lg"
  showAdminLabel?: boolean
  className?: string
}) {
  const heights = { sm: "h-8", md: "h-10", lg: "h-14" } as const

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Image
        src="/codinou-logo.png"
        alt="Codinou"
        width={140}
        height={70}
        className={cn("w-auto", heights[size])}
        priority
      />
      {showAdminLabel && (
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin</p>
      )}
    </div>
  )
}
