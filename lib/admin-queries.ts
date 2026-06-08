import { createClient } from "@/lib/supabase/server"

export async function fetchDashboardStats() {
  const supabase = await createClient()

  const [leads, orders, projects, paidOrders] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("total_eur, deposit_eur, created_at, package_id, status")
      .eq("status", "paid"),
  ])

  const paid = paidOrders.data ?? []
  const revenue = paid.reduce((s, o) => s + (o.deposit_eur ?? o.total_eur ?? 0), 0)
  const newLeads = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("status", "new")

  return {
    leadCount: leads.count ?? 0,
    newLeadCount: newLeads.count ?? 0,
    orderCount: orders.count ?? 0,
    projectCount: projects.count ?? 0,
    revenue,
    paidOrders: paid,
  }
}

export async function fetchNotes(targetType: string, targetId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("notes")
    .select("*, author:profiles(full_name, email)")
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .order("created_at", { ascending: false })

  return (data ?? []).map((n) => ({
    ...n,
    author: Array.isArray(n.author) ? n.author[0] : n.author,
  }))
}

export async function fetchOrderEvents(orderId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("order_events")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
  return data ?? []
}
