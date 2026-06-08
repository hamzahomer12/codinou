import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getAdminProfile, canManageInvoices } from "@/lib/admin-auth"
import { SendInvoiceButton } from "@/components/admin/send-invoice-button"

export default async function InvoicesPage() {
  const profile = await getAdminProfile()
  const supabase = await createClient()
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, orders(package_id, customer_name)")
    .order("created_at", { ascending: false })

  const canManage = profile ? canManageInvoices(profile.role) : false

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Invoices</h1>
        <p className="text-sm text-muted-foreground">Balance invoices after deposit payment.</p>
      </div>

      <div className="glass-ios overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(invoices ?? []).map((inv) => {
              const order = Array.isArray(inv.orders) ? inv.orders[0] : inv.orders
              return (
                <tr key={inv.id} className="border-b border-primary/5">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${inv.order_id}`} className="text-primary hover:underline">
                      {order?.customer_name ?? order?.package_id ?? inv.order_id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">€{inv.amount_eur.toLocaleString()}</td>
                  <td className="px-4 py-3 capitalize">{inv.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {inv.stripe_payment_link && (
                        <a
                          href={inv.stripe_payment_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Stripe
                        </a>
                      )}
                      {canManage && inv.status === "draft" && (
                        <SendInvoiceButton invoiceId={inv.id} />
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(invoices ?? []).length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No invoices yet. Create one from a paid order.
          </p>
        )}
      </div>
    </div>
  )
}
