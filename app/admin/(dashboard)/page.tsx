import { StatCard } from "@/components/admin/stat-card"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { fetchDashboardStats } from "@/lib/admin-queries"

export default async function AdminDashboardPage() {
  const stats = await fetchDashboardStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of leads, orders, and revenue.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Leads" value={stats.leadCount} sub={`${stats.newLeadCount} new`} />
        <StatCard label="Orders" value={stats.orderCount} />
        <StatCard label="Projects" value={stats.projectCount} />
        <StatCard label="Revenue (deposits)" value={`€${stats.revenue.toLocaleString()}`} />
      </div>

      <DashboardCharts paidOrders={stats.paidOrders} />
    </div>
  )
}
