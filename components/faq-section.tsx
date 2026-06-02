"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { cn } from "@/lib/utils"

const FAQ_KEYS = ["faq.q1", "faq.q2", "faq.q3", "faq.q4", "faq.q5"] as const

interface FaqSectionProps {
  t: (key: string) => string
}

export function FaqSection({ t }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 lg:py-28" aria-labelledby="faq-heading">
      <div className="container mx-auto px-6 lg:px-8">
        <SectionHeading kicker={t("faq.kicker")} title={t("faq.title")} />
        <div className="mx-auto max-w-2xl divide-y-2 divide-primary/10 rounded-2xl border-2 border-primary/15 bg-card/60">
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
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-primary transition-colors hover:bg-primary/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <span>{t(qKey)}</span>
                  <ChevronDown
                    className={cn("h-5 w-5 shrink-0 text-secondary transition-transform", isOpen && "rotate-180")}
                    aria-hidden
                  />
                </button>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                  hidden={!isOpen}
                  className={cn("px-5 pb-4 text-sm leading-relaxed text-muted-foreground", !isOpen && "hidden")}
                >
                  {t(aKey)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
