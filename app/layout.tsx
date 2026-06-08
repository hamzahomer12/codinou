import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Caveat, Fira_Code } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/context/language-context"
import { SkipLink } from "@/components/skip-link"
import { MobileStickyCta } from "@/components/mobile-sticky-cta"
import { MetaPixel } from "@/components/meta-pixel"

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
  title: "Codinou | Websites, Web Apps & AI Solutions",
  description:
    "Creative web studio building custom websites, web applications, and AI automations. Published packages from €990. Based in France, working with founders and businesses.",
  keywords: [
    "web development",
    "web application",
    "AI automation",
    "AI agents",
    "landing page",
    "MVP development",
    "Codinou",
    "agence web",
    "studio développement web",
  ],
  openGraph: {
    title: "Codinou | Websites, Web Apps & AI Solutions",
    description: "Custom websites, web apps, and AI automations with clear pricing",
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
        <MetaPixel />
      </body>
    </html>
  )
}
