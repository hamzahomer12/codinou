"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function SendInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const send = async () => {
    setLoading(true)
    await fetch(`/api/admin/invoices/${invoiceId}/send`, { method: "POST" })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={send}
      disabled={loading}
      className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/20 disabled:opacity-60"
    >
      {loading ? "..." : "Send"}
    </button>
  )
}
