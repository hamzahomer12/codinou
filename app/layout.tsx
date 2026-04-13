import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Caveat, Fira_Code } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/context/language-context"
import { SkipLink } from "@/components/skip-link"
import { MobileStickyCta } from "@/components/mobile-sticky-cta"

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
})

const caveat = Caveat({ 
  subsets: ["latin"], 
  variable: "--font-caveat",
  display: "swap",
})

const firaCode = Fira_Code({ 
  subsets: ["latin"], 
  variable: "--font-fira",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Codinou | Creative Web Development Studio",
  description:
    "Codinou transforms your ideas into beautiful, functional websites. Professional web development with a creative touch - from simple sites to full e-commerce solutions.",
  generator: "v0.app",
  keywords: ["web development", "website creation", "e-commerce", "web design", "Codinou", "agence web", "creation site web"],
  openGraph: {
    title: "Codinou | Creative Web Development Studio",
    description: "Professional web development with a creative touch",
    type: "website",
    images: [
      {
        url: "/codinou-logo.png",
        width: 768,
        height: 468,
        alt: "Codinou official logo",
      },
    ],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/codinou-logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#2d3a5c",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${caveat.variable} ${firaCode.variable} font-sans antialiased`}>
        <LanguageProvider>
          <SkipLink />
          {children}
          <MobileStickyCta />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
