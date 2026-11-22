# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # ESLint via next lint
npm run start    # Start production server
```

Run `npm run test:engineering` on Node.js 22 for regression tests of the formulas in `lib/`.

## Architecture

Next.js 14 App Router project. `app/layout.tsx` renders the shared site navigation and footer. The home and category pages read their tool listings from `lib/calculator-catalog.ts`.

**Routing:**
- `/` — Searchable directory of all calculators (`app/page.tsx`)
- `/calculators/hvac|electrical|fluid|structure` — Category listing pages (server components)
- `/calculators/[slug]` — Individual calculators, each a physically separate `page.tsx` (not a dynamic route)

**Calculator page pattern:**
- `'use client'` directive at top
- Calculation functions live in the relevant page or a tested module in `lib/`
- State via `useState`; results update either on button click or reactively via `useEffect` (both patterns exist)
- Uses global CSS class names: `.calculator-container`, `.calculator-form`, `.result-group`, `.result-item`, `.content-section`, `.formula-box`, `.disclaimer`

**Shared component:** `components/CalculatorContent.tsx` exports `FormulaSection`, `TermsSection`, `GuideSection`, `FAQSection`, `CaseSection` for SEO content below the calculator form. Some pages use it; others inline the same content as HTML — both patterns coexist.

**Styling:** Single `app/globals.css` with CSS custom properties (`--primary`, `--text`, etc.). No CSS Modules, no Tailwind.

## Adding a New Calculator

1. Create `app/calculators/[new-slug]/page.tsx` — copy an existing calculator as a template
2. Register it in the appropriate category in `lib/calculator-catalog.ts`
3. Add the URL to `public/sitemap.xml`
