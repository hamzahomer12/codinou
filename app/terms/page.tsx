"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SketchyCard } from "@/components/sketchy-card"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <SketchyCard variant="default">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">Terms of Service</h1>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>All project timelines, scope, and pricing are confirmed in writing before work starts.</p>
              <p>Both parties agree to communicate clearly and provide feedback to keep delivery on schedule.</p>
              <p>Final ownership and transfer details are defined in each signed project agreement.</p>
            </div>
          </SketchyCard>
        </div>
      </main>
      <Footer />
    </div>
  )
}
