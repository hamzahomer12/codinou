"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Note } from "@/lib/supabase/types"

export function NotesPanel({
  targetType,
  targetId,
  notes,
  canWrite,
}: {
  targetType: "lead" | "order" | "project"
  targetId: string
  notes: (Note & { author?: { full_name: string | null; email: string } | null })[]
  canWrite: boolean
}) {
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async () => {
    if (!body.trim()) return
    setLoading(true)
    await fetch("/api/admin/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId, body }),
    })
    setBody("")
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="glass-ios rounded-2xl p-5">
      <h3 className="mb-4 font-bold text-primary">Notes</h3>
      <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
        {notes.length === 0 && (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        )}
        {notes.map((note) => (
          <div key={note.id} className="rounded-xl bg-background/60 p-3 text-sm">
            <p className="text-foreground/90">{note.body}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {note.author?.full_name || note.author?.email || "Team"} ·{" "}
              {new Date(note.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      {canWrite && (
        <div className="space-y-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Add an internal note..."
            className="w-full resize-none rounded-xl border border-primary/15 bg-background/80 px-4 py-3 text-sm outline-none focus:border-primary/40"
          />
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Add note"}
          </button>
        </div>
      )}
    </div>
  )
}
