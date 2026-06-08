import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { StatusSelect } from "@/components/admin/status-select"
import { getAdminProfile, canWrite } from "@/lib/admin-auth"

const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "lost", label: "Lost" },
]

export default async function LeadsPage() {
  const supabase = await createClient()
  const profile = await getAdminProfile()
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Leads</h1>
        <p className="text-sm text-muted-foreground">Contact form submissions.</p>
      </div>

      <div className="glass-ios overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((lead) => (
              <tr key={lead.id} className="border-b border-primary/5 hover:bg-primary/5">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-medium text-primary hover:underline">
                    {lead.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{lead.email}</td>
                <td className="px-4 py-3">{lead.service_interest ?? "—"}</td>
                <td className="px-4 py-3">
                  {profile && canWrite(profile.role) ? (
                    <StatusSelect
                      value={lead.status}
                      options={LEAD_STATUSES}
                      apiPath={`/api/admin/leads/${lead.id}`}
                    />
                  ) : (
                    <span className="capitalize">{lead.status}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(leads ?? []).length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No leads yet.</p>
        )}
      </div>
    </div>
  )
}
