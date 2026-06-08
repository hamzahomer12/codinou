import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminProfile, canManageTeam } from "@/lib/admin-auth"
import { TeamInviteForm } from "@/components/admin/team-invite-form"

export default async function TeamPage() {
  const profile = await getAdminProfile()
  if (!profile || !canManageTeam(profile.role)) redirect("/admin")

  const supabase = await createClient()
  const [{ data: members }, { data: invites }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at"),
    supabase.from("team_invites").select("*").order("created_at", { ascending: false }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Team</h1>
        <p className="text-sm text-muted-foreground">Manage access and invites.</p>
      </div>

      <TeamInviteForm />

      <div className="glass-ios rounded-2xl p-5">
        <h3 className="mb-4 font-bold text-primary">Members</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 text-left text-muted-foreground">
              <th className="py-2 font-medium">Email</th>
              <th className="py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {(members ?? []).map((m) => (
              <tr key={m.id} className="border-b border-primary/5">
                <td className="py-2">{m.email}</td>
                <td className="py-2">{m.full_name ?? "—"}</td>
                <td className="py-2 capitalize">{m.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-ios rounded-2xl p-5">
        <h3 className="mb-4 font-bold text-primary">Pending invites</h3>
        {(invites ?? []).filter((i) => i.status === "pending").length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending invites.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {(invites ?? [])
              .filter((i) => i.status === "pending")
              .map((inv) => (
                <li key={inv.id} className="flex justify-between">
                  <span>{inv.email}</span>
                  <span className="capitalize text-muted-foreground">{inv.role}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  )
}
