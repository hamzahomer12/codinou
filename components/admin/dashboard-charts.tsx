"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type PaidOrder = {
  package_id: string
  total_eur: number | null
  deposit_eur: number | null
  created_at: string
}

export function DashboardCharts({ paidOrders }: { paidOrders: PaidOrder[] }) {
  const byPackage = paidOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.package_id] = (acc[o.package_id] ?? 0) + 1
    return acc
  }, {})

  const packageData = Object.entries(byPackage).map(([pkg, count]) => ({
    package: pkg,
    orders: count,
  }))

  const byMonth = paidOrders.reduce<Record<string, number>>((acc, o) => {
    const month = new Date(o.created_at).toLocaleString("en", { month: "short", year: "2-digit" })
    acc[month] = (acc[month] ?? 0) + (o.deposit_eur ?? o.total_eur ?? 0)
    return acc
  }, {})

  const revenueData = Object.entries(byMonth).map(([month, revenue]) => ({
    month,
    revenue,
  }))

  if (packageData.length === 0 && revenueData.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Charts will appear once orders are paid.</p>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {revenueData.length > 0 && (
        <div className="glass-ios rounded-2xl p-5">
          <h3 className="mb-4 font-bold text-primary">Revenue (deposits)</h3>
          <ChartContainer
            config={{ revenue: { label: "EUR", color: "hsl(var(--primary))" } }}
            className="h-56 w-full"
          >
            <BarChart data={revenueData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      )}
      {packageData.length > 0 && (
        <div className="glass-ios rounded-2xl p-5">
          <h3 className="mb-4 font-bold text-primary">Orders by package</h3>
          <ChartContainer
            config={{ orders: { label: "Orders", color: "hsl(var(--primary))" } }}
            className="h-56 w-full"
          >
            <BarChart data={packageData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="package" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="orders" fill="var(--color-orders)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      )}
    </div>
  )
}
