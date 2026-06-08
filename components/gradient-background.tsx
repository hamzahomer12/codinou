"use client"

export function GradientBackground() {
  return (
    <div className="gradient-mesh pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="gradient-blob gradient-blob-navy" />
      <div className="gradient-blob gradient-blob-coral" />
      <div className="gradient-blob gradient-blob-lavender" />
      <div className="gradient-blob gradient-blob-peach" />
      <div className="gradient-mesh-vignette" />
    </div>
  )
}
