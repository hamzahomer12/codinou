import Image from "next/image"
import { cn } from "@/lib/utils"

const SIZE_MAP = {
  sm: { height: 32, width: 64 },
  md: { height: 40, width: 80 },
  lg: { height: 52, width: 104 },
} as const

export function AdminLogo({
  size = "md",
  showAdminLabel = false,
  centered = false,
  className,
}: {
  size?: "sm" | "md" | "lg"
  showAdminLabel?: boolean
  centered?: boolean
  className?: string
}) {
  const { height, width } = SIZE_MAP[size]

  return (
    <div className={cn("flex flex-col gap-2", centered && "items-center", className)}>
      <span
        className="inline-flex shrink-0 items-center"
        style={{ width, height }}
      >
        <Image
          src="/codinou-logo.png"
          alt="Codinou Logo"
          width={width * 2}
          height={height * 2}
          className={cn("size-full object-contain", centered ? "object-center" : "object-left")}
          style={{ maxWidth: width, maxHeight: height }}
          priority
          quality={100}
        />
      </span>
      {showAdminLabel && (
        <p
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground",
            centered && "text-center",
          )}
        >
          Admin
        </p>
      )}
    </div>
  )
}
