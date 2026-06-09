import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const SPLASH_COOKIE = "codinou_splash_seen"

function isAdminHost(hostname: string): boolean {
  const host = hostname.split(":")[0]
  return host === "admin.codinou.ma" || host.startsWith("admin.localhost") || host === "admin.localhost"
}

function hasSeenSplash(request: NextRequest): boolean {
  return (
    request.cookies.get(SPLASH_COOKIE)?.value === "1" ||
    request.cookies.get(SPLASH_COOKIE)?.value === "true"
  )
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? ""
  const { pathname } = request.nextUrl
  const adminHost = isAdminHost(hostname)

  if (!adminHost && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (!adminHost && pathname === "/splash") {
    if (hasSeenSplash(request)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    const splashUrl = request.nextUrl.clone()
    splashUrl.pathname = "/splash-animation.html"
    return NextResponse.rewrite(splashUrl)
  }

  if (!adminHost && pathname === "/" && !hasSeenSplash(request)) {
    const splashUrl = request.nextUrl.clone()
    splashUrl.pathname = "/splash"
    return NextResponse.redirect(splashUrl)
  }

  let response = NextResponse.next({ request })

  if (adminHost && !pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    const url = request.nextUrl.clone()
    url.pathname = pathname === "/" ? "/admin" : `/admin${pathname}`
    response = NextResponse.rewrite(url)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    const isAdminPath =
      pathname.startsWith("/admin") || (adminHost && !pathname.startsWith("/api"))
    const isLoginPath = pathname === "/admin/login" || pathname === "/login"

    if (isAdminPath && !isLoginPath && !user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = "/admin/login"
      return NextResponse.redirect(loginUrl)
    }

    if (isLoginPath && user) {
      const dashUrl = request.nextUrl.clone()
      dashUrl.pathname = "/admin"
      return NextResponse.redirect(dashUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|splash-animation.html|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
