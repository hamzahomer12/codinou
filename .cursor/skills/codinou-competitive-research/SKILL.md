---
name: codinou-competitive-research
description: >-
  Analyze competitors for Codinou (web, web apps, AI, e-commerce, digital experiences,
  Odoo ERP). Use when improving services pages, packages, positioning, or bilingual copy.
---

# Codinou competitive research

## When to use

- Refining `/services` or homepage sections
- Defining or renaming packages
- Writing EN/FR service explanations
- Before pricing or deliverable changes

## Codinou service lines (source of truth)

1. Website development
2. Web application development
3. AI solutions (automations & AI agents)
4. E-commerce solutions
5. Full digital experiences — concept to launch
6. ERP (Odoo) solutions

## Research workflow

1. Ask or infer: market (France-first vs global), target client size, priority service lines.
2. Web search + review 5–8 competitor sites with overlapping offers.
3. Fill the competitor matrix (see agent `competitive-research` in `.cursor/agents/`).
4. Produce recommendations mapped to site structure:

| Site section | Purpose |
|--------------|---------|
| Hero | One-line value + breadth (not only "websites") |
| Expertise grid | Six services with 2-line explanations |
| Packages | Deliverable-based tiers; timelines; CTA to contact |
| Process | Discovery → build → launch → support |
| Tech | Stack transparency (Next.js, Odoo, etc.) |
| FAQ | Objections (timeline, Odoo vs custom, AI scope) |
| CTA | Quote-based engagement |

## Package design principles (from market)

Competitors (e.g. Odoo integrators) often use **3 tiers**: essentials / growth / custom. Mirror that pattern:

- **Clear deliverables** per tier (modules, pages, automations, training hours)
- **Typical timeline** (weeks)
- **Best for** one-line ICP
- **No invented prices** unless the user supplies them — use "Request a quote"

## Bilingual copy

- Provide EN and FR for any recommended hero, service blurbs, and package names.
- Keep FR accents correct (é, è, à) — avoid the old "Demarrer" typo style.

## Implementation handoff

When the user wants changes applied:

- Edit `lib/services-data.ts` for structure
- Edit `lib/translations/en.ts` and `lib/translations/fr.ts` for strings
- Update `app/page.tsx` and `app/services/page.tsx`
- Extend contact API/schema if adding `serviceInterest` field

## Reference file

See `.cursor/agents/competitive-research.md` for full output template.
