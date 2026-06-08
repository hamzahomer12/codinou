"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { PackageRow } from "@/lib/supabase/types"

export function PackageEditor({ packages: initial }: { packages: PackageRow[] }) {
  const router = useRouter()
  const [packages, setPackages] = useState(initial)
  const [saving, setSaving] = useState<string | null>(null)

  const save = async (pkg: PackageRow) => {
    setSaving(pkg.id)
    await fetch(`/api/admin/packages/${pkg.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        base_price_eur: pkg.base_price_eur,
        deposit_eur: pkg.deposit_eur,
        is_published: pkg.is_published,
        name_en: pkg.name_en,
        name_fr: pkg.name_fr,
      }),
    })
    setSaving(null)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <PackageRowEditor
          key={pkg.id}
          pkg={pkg}
          saving={saving === pkg.id}
          onChange={(next) => setPackages((prev) => prev.map((p) => (p.id === next.id ? next : p)))}
          onSave={() => save(pkg)}
        />
      ))}
    </div>
  )
}

function PackageRowEditor({
  pkg,
  saving,
  onChange,
  onSave,
}: {
  pkg: PackageRow
  saving: boolean
  onChange: (p: PackageRow) => void
  onSave: () => void
}) {
  return (
    <div className="glass-ios rounded-2xl p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{pkg.id}</p>
          <p className="font-bold text-primary">{pkg.name_en}</p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={pkg.is_published}
            onChange={(e) => onChange({ ...pkg, is_published: e.target.checked })}
          />
          Published
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm">
          <span className="text-muted-foreground">Base price (EUR)</span>
          <input
            type="number"
            value={pkg.base_price_eur}
            onChange={(e) => onChange({ ...pkg, base_price_eur: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-primary/15 bg-background/80 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="text-muted-foreground">Deposit (EUR)</span>
          <input
            type="number"
            value={pkg.deposit_eur ?? ""}
            onChange={(e) =>
              onChange({ ...pkg, deposit_eur: e.target.value ? Number(e.target.value) : null })
            }
            className="mt-1 w-full rounded-lg border border-primary/15 bg-background/80 px-3 py-2"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="text-muted-foreground">Name (EN)</span>
          <input
            value={pkg.name_en}
            onChange={(e) => onChange({ ...pkg, name_en: e.target.value })}
            className="mt-1 w-full rounded-lg border border-primary/15 bg-background/80 px-3 py-2"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save package"}
      </button>
    </div>
  )
}
