"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin/admin-nav"
import { AdminLogo } from "@/components/admin/admin-logo"
import { LogOut } from "lucide-react"
import type { Profile } from "@/lib/supabase/types"

export function AdminShell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">
      <aside className="glass-ios hidden w-60 shrink-0 border-r border-white/50 md:block">
        <AdminNav role={profile.role} />
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="glass-ios-header flex h-16 items-center justify-between px-6">
          <div className="md:hidden">
            <AdminLogo size="sm" showAdminLabel />
          </div>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">{profile.email}</span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-primary">
              {profile.role}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Log out
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
