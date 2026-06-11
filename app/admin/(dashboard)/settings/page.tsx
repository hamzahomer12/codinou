import { getAdminProfile } from "@/lib/admin-auth"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const profile = await getAdminProfile()
  if (!profile || (profile.role !== "owner" && profile.role !== "admin")) redirect("/admin")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <p className="text-sm text-muted-foreground">Platform configuration.</p>
      </div>

      <div className="glass-ios max-w-lg space-y-4 rounded-2xl p-6 text-sm">
        <div>
          <p className="text-muted-foreground">Signed in as</p>
          <p className="font-medium">{profile.email}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Role</p>
          <p className="font-medium capitalize">{profile.role}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Admin URL</p>
          <p className="font-medium">admin.codinou.ma</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Environment variables (Supabase, Stripe, Resend) are managed in Vercel. Contact form emails use RESEND_API_KEY, CONTACT_INBOX_EMAIL (hamza@codinou.ma), and CONTACT_FROM_EMAIL (noreply@codinou.ma). CONTACT_WEBHOOK_URL remains optional.
        </p>
      </div>
    </div>
  )
}
