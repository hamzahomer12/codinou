"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { AdminRole } from "@/lib/supabase/types"

const ROLES: AdminRole[] = ["admin", "sales", "viewer"]

export function TeamInviteForm() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<AdminRole>("sales")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    const res = await fetch("/api/admin/team/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setMessage(data.error ?? "Failed to invite")
      return
    }
    setEmail("")
    setMessage("Invite created. User will get the assigned role on signup.")
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="glass-ios max-w-md space-y-4 rounded-2xl p-5">
      <h3 className="font-bold text-primary">Invite team member</h3>
      <label className="block text-sm">
        <span className="text-muted-foreground">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-primary/15 bg-background/80 px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        <span className="text-muted-foreground">Role</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as AdminRole)}
          className="mt-1 w-full rounded-lg border border-primary/15 bg-background/80 px-3 py-2"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? "Sending..." : "Create invite"}
      </button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </form>
  )
}
