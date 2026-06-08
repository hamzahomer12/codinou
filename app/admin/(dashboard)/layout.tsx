import { redirect } from "next/navigation"
import { getAdminProfile } from "@/lib/admin-auth"
import { AdminShell } from "@/components/admin/admin-shell"

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getAdminProfile()
  if (!profile) redirect("/admin/login")

  return <AdminShell profile={profile}>{children}</AdminShell>
}
