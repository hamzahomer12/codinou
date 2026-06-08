import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getAdminProfile, canWrite } from "@/lib/admin-auth"
import { StatusSelect } from "@/components/admin/status-select"

const STAGES = [
  { value: "discovery", label: "Discovery" },
  { value: "build", label: "Build" },
  { value: "review", label: "Review" },
  { value: "launched", label: "Launched" },
]

export default async function ProjectsPage() {
  const supabase = await createClient()
  const profile = await getAdminProfile()
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Projects</h1>
        <p className="text-sm text-muted-foreground">Post-sale delivery pipeline.</p>
      </div>

      <div className="glass-ios overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Package</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {(projects ?? []).map((project) => (
              <tr key={project.id} className="border-b border-primary/5 hover:bg-primary/5">
                <td className="px-4 py-3 font-medium text-primary">{project.title}</td>
                <td className="px-4 py-3">{project.client_name ?? project.client_email ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs">{project.package_id ?? "—"}</td>
                <td className="px-4 py-3">
                  {profile && canWrite(profile.role) ? (
                    <StatusSelect
                      value={project.stage}
                      options={STAGES}
                      apiPath={`/api/admin/projects/${project.id}`}
                      field="stage"
                    />
                  ) : (
                    <span className="capitalize">{project.stage}</span>
                  )}
                </td>
                <td className="px-4 py-3">€{project.total_eur?.toLocaleString() ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(projects ?? []).length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No projects yet. They are created when orders are paid.</p>
        )}
      </div>
    </div>
  )
}
