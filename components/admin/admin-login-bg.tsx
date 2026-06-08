"use client"

import { useEffect, useRef, useState } from "react"

export function AdminLoginBg() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      setOffset({
        x: (e.clientX - cx) / cx,
        y: (e.clientY - cy) / cy,
      })
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  const px = offset.x * 28
  const py = offset.y * 28

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[#eef0f8]" />

      <div
        className="admin-login-blob admin-login-blob-1"
        style={{ transform: `translate3d(${px * 1.2}px, ${py * 1.2}px, 0)` }}
      />
      <div
        className="admin-login-blob admin-login-blob-2"
        style={{ transform: `translate3d(${px * -0.9}px, ${py * 0.8}px, 0)` }}
      />
      <div
        className="admin-login-blob admin-login-blob-3"
        style={{ transform: `translate3d(${px * 0.6}px, ${py * -1.1}px, 0)` }}
      />
      <div
        className="admin-login-blob admin-login-blob-4"
        style={{ transform: `translate3d(${px * -0.5}px, ${py * -0.7}px, 0)` }}
      />

      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-white/20" />
    </div>
  )
}
