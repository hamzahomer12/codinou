"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SketchyCard } from "@/components/sketchy-card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <SketchyCard variant="default">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">Privacy Policy</h1>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>We only collect the contact details you share through the form to answer your request.</p>
              <p>We do not sell your personal data. Information is processed only for communication and project follow-up.</p>
              <p>
                To request deletion or updates of your data, contact us directly from the contact page.
              </p>
            </div>
          </SketchyCard>
        </div>
      </main>
      <Footer />
    </div>
  )
}
