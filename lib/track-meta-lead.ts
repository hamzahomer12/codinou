export function trackMetaLead(): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead")
  }
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}
