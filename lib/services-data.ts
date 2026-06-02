export type ServiceId =
  | "website"
  | "webapp"
  | "ai"
  | "ecommerce"
  | "digital"
  | "odoo"

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
  | "store"
  | "store-growth"
  | "omnichannel"
  | "sprint"
  | "build"
  | "partner"
  | "odoo-essentials"
  | "odoo-custom"
  | "odoo-enterprise"

export const SERVICE_IDS: ServiceId[] = [
  "website",
  "webapp",
  "ai",
  "ecommerce",
  "digital",
  "odoo",
]

export const SERVICE_PACKAGES: Record<ServiceId, PackageId[]> = {
  website: ["launch", "growth", "scale"],
  webapp: ["mvp", "product", "platform"],
  ai: ["automate", "agents", "ai-custom"],
  ecommerce: ["store", "store-growth", "omnichannel"],
  digital: ["sprint", "build", "partner"],
  odoo: ["odoo-essentials", "odoo-custom", "odoo-enterprise"],
}

export const TECH_STACK_KEYS = [
  "tech.next",
  "tech.react",
  "tech.node",
  "tech.odoo",
  "tech.ai",
  "tech.cloud",
] as const
