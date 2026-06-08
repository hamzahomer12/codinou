export type AdminRole = "owner" | "admin" | "sales" | "viewer"
export type LeadStatus = "new" | "contacted" | "qualified" | "lost"
export type OrderStatus = "draft" | "checkout_started" | "paid" | "cancelled"
export type ProjectStage = "discovery" | "build" | "review" | "launched"
export type InvoiceStatus = "draft" | "sent" | "paid" | "void"

export type Profile = {
  id: string
  email: string
  full_name: string | null
  role: AdminRole
  created_at: string
  updated_at: string
}

export type Lead = {
  id: string
  name: string
  email: string
  service_interest: string | null
  message: string
  status: LeadStatus
  created_at: string
  updated_at: string
}

export type Order = {
  id: string
  package_id: string
  status: OrderStatus
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  company: string | null
  brief: Record<string, string>
  quote: Record<string, unknown> | null
  total_eur: number | null
  deposit_eur: number | null
  stripe_session_id: string | null
  currency: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  order_id: string | null
  title: string
  client_name: string | null
  client_email: string | null
  package_id: string | null
  stage: ProjectStage
  total_eur: number | null
  created_at: string
  updated_at: string
}

export type PackageRow = {
  id: string
  service_id: string
  name_en: string
  name_fr: string
  base_price_eur: number
  deposit_eur: number | null
  timeline_en: string | null
  timeline_fr: string | null
  best_for_en: string | null
  best_for_fr: string | null
  features: string[]
  is_published: boolean
  sort_order: number
}

export type Note = {
  id: string
  target_type: "lead" | "order" | "project"
  target_id: string
  author_id: string | null
  body: string
  created_at: string
}

export type Invoice = {
  id: string
  order_id: string
  project_id: string | null
  amount_eur: number
  status: InvoiceStatus
  stripe_invoice_id: string | null
  stripe_payment_link: string | null
  sent_at: string | null
  paid_at: string | null
  created_at: string
}

export type TeamInvite = {
  id: string
  email: string
  role: AdminRole
  invited_by: string | null
  status: "pending" | "accepted" | "expired"
  token: string
  expires_at: string
  created_at: string
}

export type PricingRule = {
  id: string
  package_id: string | null
  rule_type: string
  field_id: string | null
  option_value: string | null
  amount_eur: number
  label_key: string | null
  is_published: boolean
}
