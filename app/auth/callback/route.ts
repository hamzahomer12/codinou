import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

/**
 * Only allow same-origin, single-leading-slash relative paths as the post-login
 * destination. Rejects absolute URLs, protocol-relative (`//host`) and
 * backslash-normalized (`/\host`) values to prevent open redirects.
 */
function safeNext(raw: string | null): string {
  const fallback = "/admin"
  if (!raw) return fallback
  if (!raw.startsWith("/")) return fallback
  // Reject protocol-relative and backslash tricks that browsers normalize to a host.
  if (raw.startsWith("//") || raw.startsWith("/\\") || raw.startsWith("/%2f") || raw.startsWith("/%5c")) {
    return fallback
  }
  return raw
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = safeNext(searchParams.get("next"))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=auth`)
}
