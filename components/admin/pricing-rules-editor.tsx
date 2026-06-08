"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { PricingRule } from "@/lib/supabase/types"

export function PricingRulesEditor({ rules }: { rules: PricingRule[] }) {
  const router = useRouter()
  const [saving, setSaving] = useState<string | null>(null)

  const togglePublished = async (rule: PricingRule) => {
    setSaving(rule.id)
    await fetch(`/api/admin/pricing-rules/${rule.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !rule.is_published }),
    })
    setSaving(null)
    router.refresh()
  }

  if (rules.length === 0) {
    return <p className="text-sm text-muted-foreground">No pricing rules in database (code fallback active).</p>
  }

  return (
    <div className="glass-ios overflow-hidden rounded-2xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-primary/10 text-left text-muted-foreground">
            <th className="px-4 py-3 font-medium">Package</th>
            <th className="px-4 py-3 font-medium">Field</th>
            <th className="px-4 py-3 font-medium">Option</th>
            <th className="px-4 py-3 font-medium">EUR</th>
            <th className="px-4 py-3 font-medium">Published</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id} className="border-b border-primary/5">
              <td className="px-4 py-3 font-mono text-xs">{rule.package_id ?? "all"}</td>
              <td className="px-4 py-3">{rule.field_id ?? "—"}</td>
              <td className="px-4 py-3">{rule.option_value ?? "—"}</td>
              <td className="px-4 py-3">{rule.amount_eur >= 0 ? `+${rule.amount_eur}` : rule.amount_eur}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  disabled={saving === rule.id}
                  onClick={() => togglePublished(rule)}
                  className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/20 disabled:opacity-60"
                >
                  {rule.is_published ? "Yes" : "No"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
