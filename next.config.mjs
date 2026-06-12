/** @type {import('next').NextConfig} */

// Conservative security headers. No Content-Security-Policy is set here because
// the app relies on an inline Meta Pixel bootstrap script and an inline splash
// animation; a CSP would need nonces/hashes wired through those first.
const securityHeaders = [
  // Clickjacking: deny framing entirely (admin + marketing are never embedded).
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full URLs (which may carry session_id query params) cross-origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS for two years incl. subdomains (admin.codinou.ma).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Drop powerful features the site does not use.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
  // Legacy reflected-XSS protection for older browsers.
  { key: "X-XSS-Protection", value: "0" },
]

const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
