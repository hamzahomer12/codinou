"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateInvoiceButton({
  orderId,
  canManage,
}: {
  orderId: string
  canManage: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  if (!canManage) return null

  const create = async () => {
    setLoading(true)
    setError("")
    const res = await fetch("/api/admin/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? "Failed")
      return
    }
    router.refresh()
  }

  return (
    <div>
      <button
        type="button"
        onClick={create}
        disabled={loading}
        className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create balance invoice"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
