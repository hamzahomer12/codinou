import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getAdminProfile, canWrite } from "@/lib/admin-auth"
import { fetchNotes, fetchOrderEvents } from "@/lib/admin-queries"
import { NotesPanel } from "@/components/admin/notes-panel"
import { ActivityTimeline } from "@/components/admin/activity-timeline"
import { CreateInvoiceButton } from "@/components/admin/create-invoice-button"

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const profile = await getAdminProfile()

  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single()
  if (!order) notFound()

  const [notes, events, invoice] = await Promise.all([
    fetchNotes("order", id),
    fetchOrderEvents(id),
    supabase.from("invoices").select("*").eq("order_id", id).neq("status", "void").maybeSingle(),
  ])

  const brief = order.brief as Record<string, string>
  const quote = order.quote as Record<string, unknown> | null

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-primary">
        ← Back to orders
      </Link>

      <div className="glass-ios rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">{order.package_id}</h1>
            <p className="text-muted-foreground">
              {order.customer_name} · {order.customer_email}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold capitalize text-primary">
            {order.status.replace(/_/g, " ")}
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Total</dt>
            <dd className="text-lg font-bold">€{order.total_eur?.toLocaleString() ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Deposit</dt>
            <dd className="text-lg font-bold">€{order.deposit_eur?.toLocaleString() ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Paid at</dt>
            <dd>{order.paid_at ? new Date(order.paid_at).toLocaleString() : "—"}</dd>
          </div>
        </dl>

        {order.stripe_session_id && (
          <p className="mt-4 text-xs text-muted-foreground">
            Stripe session: <code className="font-mono">{order.stripe_session_id}</code>
          </p>
        )}

        {profile && order.status === "paid" && !invoice.data && (
          <div className="mt-4">
            <CreateInvoiceButton orderId={id} canManage={profile.role === "owner" || profile.role === "admin"} />
          </div>
        )}
        {invoice.data && (
          <p className="mt-4 text-sm">
            Balance invoice: <span className="capitalize">{invoice.data.status}</span>
            {invoice.data.stripe_payment_link && (
              <>
                {" · "}
                <a href={invoice.data.stripe_payment_link} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  View in Stripe
                </a>
              </>
            )}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-ios rounded-2xl p-5">
          <h3 className="mb-4 font-bold text-primary">Brief</h3>
          <dl className="space-y-2 text-sm">
            {Object.entries(brief).map(([key, value]) => (
              <div key={key}>
                <dt className="text-xs capitalize text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}</dt>
                <dd className="whitespace-pre-wrap">{value || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="glass-ios rounded-2xl p-5">
          <h3 className="mb-4 font-bold text-primary">Quote</h3>
          {quote ? (
            <pre className="overflow-auto rounded-xl bg-background/60 p-4 text-xs">
              {JSON.stringify(quote, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No quote data.</p>
          )}
        </div>
      </div>

      <div className="glass-ios rounded-2xl p-5">
        <h3 className="mb-4 font-bold text-primary">Activity</h3>
        <ActivityTimeline events={events} />
      </div>

      {profile && (
        <NotesPanel
          targetType="order"
          targetId={id}
          notes={notes}
          canWrite={canWrite(profile.role)}
        />
      )}
    </div>
  )
}
