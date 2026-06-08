"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { PageSection } from "@/components/page-section"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { cn } from "@/lib/utils"

const FAQ_KEYS = ["faq.q1", "faq.q2", "faq.q3", "faq.q4", "faq.q5"] as const

interface FaqSectionProps {
  t: (key: string) => string
}

export function FaqSection({ t }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <PageSection ariaLabelledby="faq-heading">
      <Reveal>
        <SectionHeading label={t("faq.kicker")} title={t("faq.title")} />
      </Reveal>
      <Reveal delay={120}>
      <div className="mx-auto max-w-2xl divide-y divide-primary/10 overflow-hidden rounded-2xl border border-primary/12 bg-card shadow-sm">
        {FAQ_KEYS.map((qKey, index) => {
          const aKey = qKey.replace(".q", ".a") as "faq.a1"
          const isOpen = openIndex === index
          return (
            <div key={qKey}>
              <button
                type="button"
                id={`faq-trigger-${index}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-primary transition-colors duration-300 hover:bg-primary/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                <span>{t(qKey)}</span>
                <ChevronDown
                  className={cn("h-5 w-5 shrink-0 text-secondary transition-transform duration-300 ease-out", isOpen && "rotate-180")}
                  aria-hidden
                />
              </button>
              {isOpen && (
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                  className="faq-answer border-t border-primary/8 px-5 pb-4 pt-1 text-sm leading-relaxed text-muted-foreground"
                >
                  {t(aKey)}
                </div>
              )}
            </div>
          )
        })}
      </div>
      </Reveal>
    </PageSection>
  )
}
