"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/context/language-context"
import { Menu, X, Globe } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Header() {
  const { language, setLanguage, t } = useLanguage()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isMenuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false)
        queueMicrotask(() => menuButtonRef.current?.focus())
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isMenuOpen])

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/services", label: t("nav.services") },
    { href: "/contact", label: t("nav.contact") },
  ]

  return (
    <header className="sticky top-0 z-50 border-b-2 border-primary/15 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/codinou-logo.png"
              alt="Codinou Logo"
              width={140}
              height={70}
              className="h-14 w-auto transition-transform duration-300 motion-safe:group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-base font-medium tracking-wide transition-colors duration-200",
                  pathname === item.href 
                    ? "text-secondary" 
                    : "text-foreground/80 hover:text-primary"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary rounded-full" />
                )}
              </Link>
            ))}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              style={{ borderRadius: "14px 5px 14px 5px" }}
            >
              {t("nav.cta")}
            </Link>
          </nav>

          {/* Language Switcher & Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === "en" ? "fr" : "en")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-primary/20 rounded-full hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
              aria-label="Switch language"
            >
              <Globe className="w-4 h-4 text-primary/70" />
              <span className="uppercase font-semibold text-primary">{language}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-primary/5 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="site-mobile-nav"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            id="site-mobile-nav"
            className="md:hidden py-6 border-t border-primary/10 animate-fade-in-up"
            aria-label={t("a11y.mobileNav")}
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                    pathname === item.href 
                      ? "bg-secondary/10 text-secondary" 
                      : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
