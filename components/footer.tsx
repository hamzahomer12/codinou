"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/context/language-context"

export function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t-2 border-primary/10 mt-auto">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="group">
              <Image
                src="/codinou-logo.png"
                alt="Codinou Logo"
                width={100}
                height={50}
                className="h-10 w-auto opacity-80 transition-opacity group-hover:opacity-100"
              />
            </Link>
          </div>

          {/* Quick Links */}
          <nav className="flex items-center gap-8">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("nav.home")}
            </Link>
            <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("nav.services")}
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("nav.contact")}
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Codinou
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              {t("footer.rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
