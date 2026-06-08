import { z } from "zod"
import { getBriefFields, isValidPackageId } from "@/lib/package-brief"
import type { PackageId } from "@/lib/services-data"

export function validatePackageBrief(packageId: string, brief: Record<string, unknown>) {
  if (!isValidPackageId(packageId)) {
    return { ok: false as const, error: "Unknown package." }
  }

  const fields = getBriefFields(packageId)
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of fields) {
    if (!field.required) {
      shape[field.id] = z.string().trim().max(2000).optional()
    } else if (field.type === "email") {
      shape[field.id] = z.string().trim().email().max(200)
    } else {
      shape[field.id] = z.string().trim().min(1).max(2000)
    }
  }

  const parsed = z.object(shape).safeParse(brief)
  if (!parsed.success) {
    return { ok: false as const, error: "Please complete all required fields." }
  }

  const cleaned: Record<string, string> = {}
  for (const [key, value] of Object.entries(parsed.data)) {
    if (typeof value === "string" && value.length > 0) {
      cleaned[key] = value
    }
  }

  return { ok: true as const, brief: cleaned, packageId: packageId as PackageId }
}
