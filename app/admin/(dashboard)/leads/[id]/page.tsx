import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getAdminProfile, canWrite } from "@/lib/admin-auth"
import { fetchNotes } from "@/lib/admin-queries"
import { NotesPanel } from "@/components/admin/notes-panel"
import { StatusSelect } from "@/components/admin/status-select"

const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "lost", label: "Lost" },
]

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const profile = await getAdminProfile()

  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).single()
  if (!lead) notFound()

  const notes = await fetchNotes("lead", id)

  return (
    <div className="space-y-6">
      <Link href="/admin/leads" className="text-sm text-muted-foreground hover:text-primary">
        ← Back to leads
      </Link>

      <div className="glass-ios rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">{lead.name}</h1>
            <p className="text-muted-foreground">{lead.email}</p>
          </div>
          {profile && canWrite(profile.role) && (
            <StatusSelect
              value={lead.status}
              options={LEAD_STATUSES}
              apiPath={`/api/admin/leads/${id}`}
            />
          )}
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Service interest</dt>
            <dd className="font-medium">{lead.service_interest ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Received</dt>
            <dd className="font-medium">{new Date(lead.created_at).toLocaleString()}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <p className="text-xs text-muted-foreground">Message</p>
          <p className="mt-2 whitespace-pre-wrap rounded-xl bg-background/60 p-4 text-sm">{lead.message}</p>
        </div>
      </div>

      {profile && (
        <NotesPanel
          targetType="lead"
          targetId={id}
          notes={notes}
          canWrite={canWrite(profile.role)}
        />
      )}
    </div>
  )
}
