export type ServiceId = "website" | "webapp" | "ai"

export type PackageId =
  | "launch"
  | "growth"
  | "scale"
  | "mvp"
  | "product"
  | "platform"
  | "automate"
  | "agents"
  | "ai-custom"

export const SERVICE_IDS: ServiceId[] = ["website", "webapp", "ai"]

export const SERVICE_PACKAGES: Record<ServiceId, PackageId[]> = {
  website: ["launch", "growth", "scale"],
  webapp: ["mvp", "product", "platform"],
  ai: ["automate", "agents", "ai-custom"],
}

export const TECH_STACK_KEYS = [
  "tech.next",
  "tech.react",
  "tech.node",
  "tech.ai",
  "tech.automation",
  "tech.cloud",
] as const
