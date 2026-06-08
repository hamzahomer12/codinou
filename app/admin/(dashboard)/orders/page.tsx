import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Orders</h1>
        <p className="text-sm text-muted-foreground">Checkout sessions and paid orders.</p>
      </div>

      <div className="glass-ios overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Package</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => (
              <tr key={order.id} className="border-b border-primary/5 hover:bg-primary/5">
                <td className="px-4 py-3 font-mono text-xs">{order.package_id}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-primary hover:underline">
                    {order.customer_name ?? order.customer_email ?? "—"}
                  </Link>
                </td>
                <td className="px-4 py-3">€{order.total_eur?.toLocaleString() ?? "—"}</td>
                <td className="px-4 py-3 capitalize">{order.status.replace(/_/g, " ")}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(orders ?? []).length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </div>
  )
}
