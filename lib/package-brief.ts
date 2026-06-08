import type { PackageId } from "@/lib/services-data"

export type BriefFieldType = "text" | "email" | "tel" | "textarea" | "select" | "url"

export type BriefFieldOption = {
  value: string
  labelKey: string
}

export type BriefField = {
  id: string
  type: BriefFieldType
  labelKey: string
  placeholderKey?: string
  required?: boolean
  options?: BriefFieldOption[]
  rows?: number
}

export const COMMON_BRIEF_FIELDS: BriefField[] = [
  {
    id: "fullName",
    type: "text",
    labelKey: "order.field.fullName",
    placeholderKey: "order.field.fullName.ph",
    required: true,
  },
  {
    id: "email",
    type: "email",
    labelKey: "order.field.email",
    placeholderKey: "order.field.email.ph",
    required: true,
  },
  {
    id: "phone",
    type: "tel",
    labelKey: "order.field.phone",
    placeholderKey: "order.field.phone.ph",
    required: true,
  },
  {
    id: "company",
    type: "text",
    labelKey: "order.field.company",
    placeholderKey: "order.field.company.ph",
  },
]

export const PACKAGE_BRIEF_FIELDS: Record<PackageId, BriefField[]> = {
  launch: [
    {
      id: "brandName",
      type: "text",
      labelKey: "order.launch.brandName",
      placeholderKey: "order.launch.brandName.ph",
      required: true,
    },
    {
      id: "siteGoal",
      type: "textarea",
      labelKey: "order.launch.siteGoal",
      placeholderKey: "order.launch.siteGoal.ph",
      required: true,
      rows: 3,
    },
    {
      id: "pageCount",
      type: "select",
      labelKey: "order.launch.pageCount",
      required: true,
      options: [
        { value: "1", labelKey: "order.launch.pageCount.1" },
        { value: "2-3", labelKey: "order.launch.pageCount.23" },
      ],
    },
    {
      id: "contentStatus",
      type: "select",
      labelKey: "order.launch.contentStatus",
      required: true,
      options: [
        { value: "ready", labelKey: "order.content.ready" },
        { value: "partial", labelKey: "order.content.partial" },
        { value: "none", labelKey: "order.content.none" },
      ],
    },
    {
      id: "inspiration",
      type: "textarea",
      labelKey: "order.launch.inspiration",
      placeholderKey: "order.launch.inspiration.ph",
      rows: 2,
    },
    {
      id: "targetDate",
      type: "text",
      labelKey: "order.field.targetDate",
      placeholderKey: "order.field.targetDate.ph",
    },
  ],
  growth: [
    {
      id: "businessName",
      type: "text",
      labelKey: "order.growth.businessName",
      placeholderKey: "order.growth.businessName.ph",
      required: true,
    },
    {
      id: "industry",
      type: "text",
      labelKey: "order.growth.industry",
      placeholderKey: "order.growth.industry.ph",
      required: true,
    },
    {
      id: "pagesNeeded",
      type: "textarea",
      labelKey: "order.growth.pagesNeeded",
      placeholderKey: "order.growth.pagesNeeded.ph",
      required: true,
      rows: 3,
    },
    {
      id: "needBlog",
      type: "select",
      labelKey: "order.growth.needBlog",
      required: true,
      options: [
        { value: "yes", labelKey: "order.yes" },
        { value: "no", labelKey: "order.no" },
        { value: "later", labelKey: "order.later" },
      ],
    },
    {
      id: "integrations",
      type: "textarea",
      labelKey: "order.growth.integrations",
      placeholderKey: "order.growth.integrations.ph",
      rows: 2,
    },
    {
      id: "contentStatus",
      type: "select",
      labelKey: "order.launch.contentStatus",
      required: true,
      options: [
        { value: "ready", labelKey: "order.content.ready" },
        { value: "partial", labelKey: "order.content.partial" },
        { value: "none", labelKey: "order.content.none" },
      ],
    },
    {
      id: "targetDate",
      type: "text",
      labelKey: "order.field.targetDate",
      placeholderKey: "order.field.targetDate.ph",
    },
  ],
  scale: [
    {
      id: "projectName",
      type: "text",
      labelKey: "order.scale.projectName",
      placeholderKey: "order.scale.projectName.ph",
      required: true,
    },
    {
      id: "requirements",
      type: "textarea",
      labelKey: "order.scale.requirements",
      placeholderKey: "order.scale.requirements.ph",
      required: true,
      rows: 4,
    },
    {
      id: "languages",
      type: "text",
      labelKey: "order.scale.languages",
      placeholderKey: "order.scale.languages.ph",
    },
    {
      id: "cmsPreference",
      type: "text",
      labelKey: "order.scale.cmsPreference",
      placeholderKey: "order.scale.cmsPreference.ph",
    },
    {
      id: "integrations",
      type: "textarea",
      labelKey: "order.scale.integrations",
      placeholderKey: "order.scale.integrations.ph",
      rows: 3,
      required: true,
    },
    {
      id: "existingSite",
      type: "url",
      labelKey: "order.scale.existingSite",
      placeholderKey: "order.scale.existingSite.ph",
    },
    {
      id: "targetDate",
      type: "text",
      labelKey: "order.field.targetDate",
      placeholderKey: "order.field.targetDate.ph",
    },
  ],
  mvp: [
    {
      id: "productName",
      type: "text",
      labelKey: "order.mvp.productName",
      placeholderKey: "order.mvp.productName.ph",
      required: true,
    },
    {
      id: "productSummary",
      type: "textarea",
      labelKey: "order.mvp.productSummary",
      placeholderKey: "order.mvp.productSummary.ph",
      required: true,
      rows: 3,
    },
    {
      id: "targetUsers",
      type: "textarea",
      labelKey: "order.mvp.targetUsers",
      placeholderKey: "order.mvp.targetUsers.ph",
      required: true,
      rows: 2,
    },
    {
      id: "coreFeatures",
      type: "textarea",
      labelKey: "order.mvp.coreFeatures",
      placeholderKey: "order.mvp.coreFeatures.ph",
      required: true,
      rows: 4,
    },
    {
      id: "authNeeded",
      type: "select",
      labelKey: "order.mvp.authNeeded",
      required: true,
      options: [
        { value: "yes", labelKey: "order.yes" },
        { value: "no", labelKey: "order.no" },
        { value: "unsure", labelKey: "order.unsure" },
      ],
    },
    {
      id: "designStatus",
      type: "select",
      labelKey: "order.mvp.designStatus",
      required: true,
      options: [
        { value: "ready", labelKey: "order.design.ready" },
        { value: "wireframes", labelKey: "order.design.wireframes" },
        { value: "none", labelKey: "order.design.none" },
      ],
    },
    {
      id: "targetDate",
      type: "text",
      labelKey: "order.field.targetDate",
      placeholderKey: "order.field.targetDate.ph",
    },
  ],
  product: [
    {
      id: "productName",
      type: "text",
      labelKey: "order.mvp.productName",
      placeholderKey: "order.mvp.productName.ph",
      required: true,
    },
    {
      id: "productStage",
      type: "select",
      labelKey: "order.product.productStage",
      required: true,
      options: [
        { value: "mvp-live", labelKey: "order.product.stage.mvp" },
        { value: "greenfield", labelKey: "order.product.stage.new" },
        { value: "rebuild", labelKey: "order.product.stage.rebuild" },
      ],
    },
    {
      id: "userRoles",
      type: "textarea",
      labelKey: "order.product.userRoles",
      placeholderKey: "order.product.userRoles.ph",
      required: true,
      rows: 3,
    },
    {
      id: "features",
      type: "textarea",
      labelKey: "order.product.features",
      placeholderKey: "order.product.features.ph",
      required: true,
      rows: 4,
    },
    {
      id: "billingNeeded",
      type: "select",
      labelKey: "order.product.billingNeeded",
      required: true,
      options: [
        { value: "yes", labelKey: "order.yes" },
        { value: "no", labelKey: "order.no" },
        { value: "later", labelKey: "order.later" },
      ],
    },
    {
      id: "integrations",
      type: "textarea",
      labelKey: "order.product.integrations",
      placeholderKey: "order.product.integrations.ph",
      rows: 3,
    },
    {
      id: "targetDate",
      type: "text",
      labelKey: "order.field.targetDate",
      placeholderKey: "order.field.targetDate.ph",
    },
  ],
  platform: [
    {
      id: "productName",
      type: "text",
      labelKey: "order.mvp.productName",
      placeholderKey: "order.mvp.productName.ph",
      required: true,
    },
    {
      id: "platformScope",
      type: "textarea",
      labelKey: "order.platform.platformScope",
      placeholderKey: "order.platform.platformScope.ph",
      required: true,
      rows: 4,
    },
    {
      id: "tenantModel",
      type: "select",
      labelKey: "order.platform.tenantModel",
      required: true,
      options: [
        { value: "single", labelKey: "order.platform.tenant.single" },
        { value: "multi", labelKey: "order.platform.tenant.multi" },
        { value: "unsure", labelKey: "order.unsure" },
      ],
    },
    {
      id: "compliance",
      type: "textarea",
      labelKey: "order.platform.compliance",
      placeholderKey: "order.platform.compliance.ph",
      rows: 2,
    },
    {
      id: "expectedUsers",
      type: "text",
      labelKey: "order.platform.expectedUsers",
      placeholderKey: "order.platform.expectedUsers.ph",
      required: true,
    },
    {
      id: "roadmap",
      type: "textarea",
      labelKey: "order.platform.roadmap",
      placeholderKey: "order.platform.roadmap.ph",
      rows: 3,
    },
    {
      id: "targetDate",
      type: "text",
      labelKey: "order.field.targetDate",
      placeholderKey: "order.field.targetDate.ph",
    },
  ],
  automate: [
    {
      id: "processName",
      type: "text",
      labelKey: "order.automate.processName",
      placeholderKey: "order.automate.processName.ph",
      required: true,
    },
    {
      id: "currentProcess",
      type: "textarea",
      labelKey: "order.automate.currentProcess",
      placeholderKey: "order.automate.currentProcess.ph",
      required: true,
      rows: 4,
    },
    {
      id: "toolsUsed",
      type: "textarea",
      labelKey: "order.automate.toolsUsed",
      placeholderKey: "order.automate.toolsUsed.ph",
      required: true,
      rows: 2,
    },
    {
      id: "volume",
      type: "text",
      labelKey: "order.automate.volume",
      placeholderKey: "order.automate.volume.ph",
    },
    {
      id: "successCriteria",
      type: "textarea",
      labelKey: "order.automate.successCriteria",
      placeholderKey: "order.automate.successCriteria.ph",
      required: true,
      rows: 3,
    },
    {
      id: "targetDate",
      type: "text",
      labelKey: "order.field.targetDate",
      placeholderKey: "order.field.targetDate.ph",
    },
  ],
  agents: [
    {
      id: "agentUseCase",
      type: "select",
      labelKey: "order.agents.agentUseCase",
      required: true,
      options: [
        { value: "support", labelKey: "order.agents.use.support" },
        { value: "sales", labelKey: "order.agents.use.sales" },
        { value: "internal", labelKey: "order.agents.use.internal" },
        { value: "other", labelKey: "order.agents.use.other" },
      ],
    },
    {
      id: "agentGoal",
      type: "textarea",
      labelKey: "order.agents.agentGoal",
      placeholderKey: "order.agents.agentGoal.ph",
      required: true,
      rows: 3,
    },
    {
      id: "knowledgeSources",
      type: "textarea",
      labelKey: "order.agents.knowledgeSources",
      placeholderKey: "order.agents.knowledgeSources.ph",
      required: true,
      rows: 3,
    },
    {
      id: "integrations",
      type: "textarea",
      labelKey: "order.agents.integrations",
      placeholderKey: "order.agents.integrations.ph",
      required: true,
      rows: 2,
    },
    {
      id: "languages",
      type: "text",
      labelKey: "order.agents.languages",
      placeholderKey: "order.agents.languages.ph",
    },
    {
      id: "targetDate",
      type: "text",
      labelKey: "order.field.targetDate",
      placeholderKey: "order.field.targetDate.ph",
    },
  ],
  "ai-custom": [
    {
      id: "problemStatement",
      type: "textarea",
      labelKey: "order.aiCustom.problemStatement",
      placeholderKey: "order.aiCustom.problemStatement.ph",
      required: true,
      rows: 4,
    },
    {
      id: "dataSources",
      type: "textarea",
      labelKey: "order.aiCustom.dataSources",
      placeholderKey: "order.aiCustom.dataSources.ph",
      required: true,
      rows: 3,
    },
    {
      id: "aiType",
      type: "select",
      labelKey: "order.aiCustom.aiType",
      required: true,
      options: [
        { value: "rag", labelKey: "order.aiCustom.type.rag" },
        { value: "agents", labelKey: "order.aiCustom.type.agents" },
        { value: "vision", labelKey: "order.aiCustom.type.vision" },
        { value: "mixed", labelKey: "order.aiCustom.type.mixed" },
      ],
    },
    {
      id: "compliance",
      type: "textarea",
      labelKey: "order.aiCustom.compliance",
      placeholderKey: "order.aiCustom.compliance.ph",
      rows: 2,
    },
    {
      id: "successMetrics",
      type: "textarea",
      labelKey: "order.aiCustom.successMetrics",
      placeholderKey: "order.aiCustom.successMetrics.ph",
      required: true,
      rows: 3,
    },
    {
      id: "targetDate",
      type: "text",
      labelKey: "order.field.targetDate",
      placeholderKey: "order.field.targetDate.ph",
    },
  ],
}

export const ALL_PACKAGE_IDS = Object.keys(PACKAGE_BRIEF_FIELDS) as PackageId[]

export function isValidPackageId(id: string): id is PackageId {
  return id in PACKAGE_BRIEF_FIELDS
}

export function getBriefFields(packageId: PackageId): BriefField[] {
  return [...COMMON_BRIEF_FIELDS, ...PACKAGE_BRIEF_FIELDS[packageId]]
}

export function getServiceIdForPackage(packageId: PackageId): "website" | "webapp" | "ai" {
  if (["launch", "growth", "scale"].includes(packageId)) return "website"
  if (["mvp", "product", "platform"].includes(packageId)) return "webapp"
  return "ai"
}

/** Split JSON brief into Stripe-safe metadata chunks (max 500 chars per value). */
export function briefToStripeMetadata(brief: Record<string, string>): Record<string, string> {
  const meta: Record<string, string> = {}
  const priority = ["fullName", "email", "phone", "company"] as const

  for (const key of priority) {
    const value = brief[key]?.trim()
    if (value) meta[key] = value.slice(0, 500)
  }

  const json = JSON.stringify(brief)
  const chunkSize = 480
  const chunks = Math.ceil(json.length / chunkSize)

  for (let i = 0; i < chunks && i < 40; i++) {
    meta[`brief_${i}`] = json.slice(i * chunkSize, (i + 1) * chunkSize)
  }

  meta.brief_chunks = String(chunks)
  return meta
}

export function stripeMetadataToBrief(metadata: Record<string, string> | null | undefined): Record<string, string> | null {
  if (!metadata?.brief_0) return null

  const chunks = Number(metadata.brief_chunks ?? 0)
  let json = ""
  for (let i = 0; i < chunks; i++) {
    json += metadata[`brief_${i}`] ?? ""
  }

  try {
    return JSON.parse(json) as Record<string, string>
  } catch {
    return null
  }
}
