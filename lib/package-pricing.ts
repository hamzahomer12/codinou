import type { PackageId } from "@/lib/services-data"
import { PACKAGE_PRICES_EUR } from "@/lib/stripe-payments"

export type PriceLineItem = {
  id: string
  labelKey: string
  amountEur: number
}

export type PackageQuote = {
  packageId: PackageId
  baseEur: number
  totalEur: number
  depositEur: number
  lineItems: PriceLineItem[]
}

type BriefValues = Record<string, string>

const CONTENT_STATUS_DELTA: Record<string, number> = {
  partial: 150,
  none: 400,
}

const SELECT_DELTAS: Partial<Record<PackageId, Record<string, Record<string, number>>>> = {
  launch: {
    pageCount: { "2-3": 250 },
    contentStatus: CONTENT_STATUS_DELTA,
  },
  growth: {
    needBlog: { yes: 500, later: 250 },
    contentStatus: CONTENT_STATUS_DELTA,
  },
  mvp: {
    authNeeded: { yes: 900, unsure: 450 },
    designStatus: { wireframes: 700, none: 1400 },
  },
  product: {
    productStage: { "mvp-live": -400, rebuild: 2200 },
    billingNeeded: { yes: 1600, later: 800 },
  },
  platform: {
    tenantModel: { multi: 5500, unsure: 2800 },
  },
  agents: {
    agentUseCase: { sales: 250, internal: 150, other: 400 },
  },
  "ai-custom": {
    aiType: { rag: 0, agents: 2200, vision: 2800, mixed: 3500 },
  },
}

function countListItems(text: string): number {
  if (!text.trim()) return 0
  return text
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2).length
}

function isMultilingual(text: string): boolean {
  const t = text.toLowerCase()
  return /[,+/&]/.test(t) || /\b(and|et|\+)\b/.test(t) || t.split(/\s+/).length >= 3
}

function applySelectDeltas(
  packageId: PackageId,
  brief: BriefValues,
  lineItems: PriceLineItem[],
): number {
  const rules = SELECT_DELTAS[packageId]
  if (!rules) return 0

  let sum = 0
  for (const [fieldId, valueMap] of Object.entries(rules)) {
    const value = brief[fieldId]?.trim()
    if (!value || !(value in valueMap)) continue
    const amount = valueMap[value]
    if (amount === 0) continue
    sum += amount
    lineItems.push({
      id: `${fieldId}_${value}`,
      labelKey: `order.price.${packageId}.${fieldId}.${value.replace(/-/g, "_")}`,
      amountEur: amount,
    })
  }
  return sum
}

function applyTextDeltas(packageId: PackageId, brief: BriefValues, lineItems: PriceLineItem[]): number {
  let sum = 0

  if (packageId === "growth" || packageId === "scale" || packageId === "product") {
    const integrations = brief.integrations?.trim() ?? ""
    if (integrations.length > 40) {
      const extra = integrations.length > 120 ? 500 : 250
      sum += extra
      lineItems.push({
        id: "integrations_extra",
        labelKey: "order.price.integrations",
        amountEur: extra,
      })
    }
  }

  if (packageId === "scale" || packageId === "agents") {
    const languages = brief.languages?.trim() ?? ""
    if (languages && isMultilingual(languages)) {
      sum += 750
      lineItems.push({
        id: "multilingual",
        labelKey: "order.price.multilingual",
        amountEur: 750,
      })
    }
  }

  if (packageId === "platform") {
    const compliance = brief.compliance?.trim() ?? ""
    if (compliance.length > 15) {
      sum += 1600
      lineItems.push({
        id: "compliance",
        labelKey: "order.price.compliance",
        amountEur: 1600,
      })
    }
  }

  if (packageId === "mvp" || packageId === "product") {
    const features = brief.coreFeatures?.trim() ?? brief.features?.trim() ?? ""
    const count = countListItems(features)
    if (count > 4) {
      const extra = Math.min((count - 4) * 280, 1400)
      sum += extra
      lineItems.push({
        id: "extra_features",
        labelKey: "order.price.extraFeatures",
        amountEur: extra,
      })
    }
  }

  if (packageId === "automate") {
    const tools = countListItems(brief.toolsUsed ?? "")
    if (tools > 2) {
      const extra = Math.min((tools - 2) * 180, 720)
      sum += extra
      lineItems.push({
        id: "extra_tools",
        labelKey: "order.price.extraTools",
        amountEur: extra,
      })
    }
    const volume = brief.volume?.trim() ?? ""
    if (/\d{3,}/.test(volume) || /high|élevé|semaine|week|jour|day/i.test(volume)) {
      sum += 350
      lineItems.push({
        id: "high_volume",
        labelKey: "order.price.highVolume",
        amountEur: 350,
      })
    }
  }

  if (packageId === "agents") {
    const sources = countListItems(brief.knowledgeSources ?? "")
    if (sources > 3) {
      const extra = Math.min((sources - 3) * 200, 800)
      sum += extra
      lineItems.push({
        id: "extra_sources",
        labelKey: "order.price.extraSources",
        amountEur: extra,
      })
    }
  }

  if (packageId === "ai-custom") {
    const sources = countListItems(brief.dataSources ?? "")
    if (sources > 2) {
      const extra = Math.min((sources - 2) * 350, 1400)
      sum += extra
      lineItems.push({
        id: "extra_data",
        labelKey: "order.price.extraData",
        amountEur: extra,
      })
    }
    const compliance = brief.compliance?.trim() ?? ""
    if (compliance.length > 15) {
      sum += 900
      lineItems.push({
        id: "ai_compliance",
        labelKey: "order.price.compliance",
        amountEur: 900,
      })
    }
  }

  return sum
}

export function roundDeposit(totalEur: number): number {
  return Math.max(100, Math.round((totalEur * 0.3) / 10) * 10)
}

export function calculatePackageQuote(packageId: PackageId, brief: BriefValues = {}): PackageQuote {
  const baseEur = PACKAGE_PRICES_EUR[packageId]
  const lineItems: PriceLineItem[] = []

  const selectExtra = applySelectDeltas(packageId, brief, lineItems)
  const textExtra = applyTextDeltas(packageId, brief, lineItems)
  const totalEur = Math.max(baseEur, baseEur + selectExtra + textExtra)
  const depositEur = roundDeposit(totalEur)

  return {
    packageId,
    baseEur,
    totalEur,
    depositEur,
    lineItems: lineItems.filter((item) => item.amountEur !== 0),
  }
}

/** Price delta for a select option label in the form UI. */
export function getSelectOptionDelta(
  packageId: PackageId,
  fieldId: string,
  optionValue: string,
): number | null {
  const delta = SELECT_DELTAS[packageId]?.[fieldId]?.[optionValue]
  return delta === undefined ? null : delta
}
