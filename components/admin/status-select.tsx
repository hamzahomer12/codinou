"use client"

import { useRouter } from "next/navigation"

export function StatusSelect({
  value,
  options,
  apiPath,
  field = "status",
}: {
  value: string
  options: { value: string; label: string }[]
  apiPath: string
  field?: string
}) {
  const router = useRouter()

  const onChange = async (next: string) => {
    await fetch(apiPath, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: next }),
    })
    router.refresh()
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-primary/20 bg-background px-3 py-1.5 text-sm font-medium capitalize"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
