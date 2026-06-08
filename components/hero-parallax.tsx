"use client"

import { useEffect, useRef } from "react"

export function HeroParallax() {
  const layerSlow = useRef<HTMLDivElement>(null)
  const layerMid = useRef<HTMLDivElement>(null)
  const layerFast = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const y = window.scrollY
        if (layerSlow.current) {
          layerSlow.current.style.transform = `translate3d(0, ${y * 0.12}px, 0)`
        }
        if (layerMid.current) {
          layerMid.current.style.transform = `translate3d(0, ${y * 0.22}px, 0)`
        }
        if (layerFast.current) {
          layerFast.current.style.transform = `translate3d(0, ${y * 0.32}px, 0)`
        }
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        ref={layerSlow}
        className="parallax-orb parallax-orb-navy absolute -left-16 top-8 h-64 w-64 opacity-60 md:h-80 md:w-80"
      />
      <div
        ref={layerMid}
        className="parallax-orb parallax-orb-coral absolute -right-12 top-24 h-56 w-56 opacity-50 md:h-72 md:w-72"
      />
      <div
        ref={layerFast}
        className="parallax-orb parallax-orb-blend absolute left-1/3 bottom-0 h-48 w-48 opacity-40 md:h-64 md:w-64"
      />
    </div>
  )
}
