# Teal Rebrand + Site Restructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure the PJ Professionals site to adopt homepage-2's layout at `/`, delete losing homepage variants, apply the teal palette site-wide, swap stock photos to the `-alt` teal-toned versions, and add `/documenten` and `/wlz-zorg` pages.

**Architecture:** The site is Next.js 15 App Router with Tailwind CSS v4. All pages live under `src/app/<route>/page.tsx`. Shared UI lives in `src/components/`. Tailwind theme colors are declared via `@theme` in `src/app/globals.css` — changing a single `--color-*` variable changes every utility class that references it. Verification is done against a running dev server via the preview tools (`preview_start`, `preview_inspect`, `preview_network`), since the project has no unit-test harness.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, next/image, next/navigation. Dev server runs via `npm run dev` on port 3000 (see `.claude/launch.json`).

**Design doc:** `docs/plans/2026-04-15-teal-rebrand-design.md`

**Reference images are in:** `public/images/` (all `pjprofessionalsN-alt.jpg` already present).

---

## Part A — Route restructure (commit 1)

Goal: promote homepage-2 content to `/`, remove losing variants, add stubs for new pages, simplify Header. Still using legacy navy palette at this point — color swap is Part B.

### Task A1: Capture current homepage-2 content

**Files:**
- Read: `src/app/homepage-2/page.tsx`

**Step 1:** Read the full file contents. Save a mental note (or scratch file) of the JSX. You will paste it into `src/app/page.tsx` in Task A3 with three modifications:
1. The third hero button (`href="/contact"`, label "Contact") becomes `href="/wlz-zorg"`, label **"WLZ"**, same styling.
2. Do **not** yet swap navy→teal — that is Part B.
3. Do **not** yet swap images — that is Part C.

### Task A2: Delete losing homepage variants

**Files:**
- Delete: `src/app/homepage-3/` (entire folder, including `page.tsx`)
- Delete: `src/app/homepage-2/` (entire folder — AFTER Task A3 copies its content)

**Step 1:** `rm -rf src/app/homepage-3`
**Step 2:** Leave `src/app/homepage-2/` for now — delete it in Task A4 only after A3 confirms the content moved.
**Step 3:** Verify: `ls src/app/` should no longer contain `homepage-3`.

### Task A3: Overwrite `/` with former homepage-2 content

**Files:**
- Modify: `src/app/page.tsx` (full rewrite)

**Step 1:** Replace the entire contents of `src/app/page.tsx` with the content you captured in Task A1, with the WLZ button swap applied.

The third button (currently the Contact button in homepage-2) must read:
```tsx
<Link
  href="/wlz-zorg"
  className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all text-base backdrop-blur-sm"
>
  WLZ
</Link>
```

**Step 2:** Verify the new file has no reference to `/homepage-2`, no reference to `/homepage-3`, and contains exactly one `href="/wlz-zorg"`.

Run:
```bash
grep -c "href=\"/wlz-zorg\"" src/app/page.tsx   # expect: 1
grep -c "homepage-" src/app/page.tsx            # expect: 0
```

### Task A4: Delete homepage-2 folder

**Files:**
- Delete: `src/app/homepage-2/`

**Step 1:** `rm -rf src/app/homepage-2`
**Step 2:** Verify: `ls src/app/` should no longer contain `homepage-2` or `homepage-3`.

### Task A5: Create `/wlz-zorg` placeholder page

**Files:**
- Create: `src/app/wlz-zorg/page.tsx`

**Step 1:** Write the file:

```tsx
import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function WlzZorg() {
  return (
    <>
      <PageHero
        title="WLZ-zorg"
        subtitle="Wet langdurige zorg"
        description="Informatie over onze WLZ-zorg volgt binnenkort."
      />
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Wij werken aan een uitgebreide beschrijving van onze WLZ-zorg.
            Heeft u nu al vragen? Neem gerust contact met ons op.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition-all"
          >
            Contact opnemen
          </Link>
        </div>
      </section>
    </>
  );
}
```

Note: `bg-navy` and `text-white` are intentional — Part B replaces them with teal equivalents sitewide.

**Step 2:** Verify the file compiles. In the running preview server, navigate to `/wlz-zorg` and confirm the PageHero renders. Run `preview_network filter: failed` — expect no failed requests.

### Task A6: Copy PDFs into `public/documenten/`

**Files:**
- Create: `public/documenten/WMO Privacyverklaring.pdf`
- Create: `public/documenten/WMO Zorgovereenkomst.pdf`

**Step 1:**
```bash
mkdir -p public/documenten
cp "documenten/WMO Privacyverklaring.pdf" "public/documenten/"
cp "documenten/WMO Zorgovereenkomst.pdf" "public/documenten/"
```

**Step 2:** Verify:
```bash
ls public/documenten/
# expect: WMO Privacyverklaring.pdf    WMO Zorgovereenkomst.pdf
```

**Step 3:** Via preview server, `fetch('/documenten/WMO%20Privacyverklaring.pdf').then(r => r.status)` should return 200.

### Task A7: Create `/documenten` page

**Files:**
- Create: `src/app/documenten/page.tsx`

**Step 1:** Write the file:

```tsx
import PageHero from "@/components/PageHero";

const documents = [
  {
    title: "WMO Privacyverklaring",
    description: "Hoe wij omgaan met persoonsgegevens binnen de WMO-zorg.",
    href: "/documenten/WMO%20Privacyverklaring.pdf",
    filename: "WMO Privacyverklaring.pdf",
    size: "74 KB",
  },
  {
    title: "WMO Zorgovereenkomst",
    description: "Standaard zorgovereenkomst voor WMO-clienten.",
    href: "/documenten/WMO%20Zorgovereenkomst.pdf",
    filename: "WMO Zorgovereenkomst.pdf",
    size: "108 KB",
  },
];

export default function Documenten() {
  return (
    <>
      <PageHero
        title="Documenten"
        subtitle="Downloads"
        description="Publiek beschikbare formulieren en documenten."
      />
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <a
                key={doc.filename}
                href={doc.href}
                download={doc.filename}
                className="block p-8 rounded-2xl border border-gray-200 bg-surface hover:border-navy/20 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <svg
                    className="w-10 h-10 text-navy shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{doc.size}</span>
                </div>
                <h2 className="text-lg font-semibold text-navy mb-2 group-hover:text-accent transition-colors">
                  {doc.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {doc.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-navy group-hover:gap-3 transition-all">
                  Download
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

Legacy palette (`bg-navy`, `bg-surface`, `text-accent`) is intentional — Part B swaps it.

**Step 2:** Via preview server, navigate to `/documenten`. Confirm 2 cards render and clicking a download link returns a 200 PDF.

### Task A8: Rewrite Header.tsx (hamburger-only, simplified)

**Files:**
- Modify: `src/components/Header.tsx` (full rewrite)

**Step 1:** Replace the entire file:

```tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "WMO-zorg", href: "/wmo-zorg" },
  { label: "Forensische zorg", href: "/forensische-zorg" },
  { label: "WLZ-zorg", href: "/wlz-zorg" },
  { label: "Voor verwijzers", href: "/voor-verwijzers" },
  { label: "Over ons", href: "/over-ons" },
  { label: "Vacatures", href: "/vacatures" },
  { label: "FAQ", href: "/veelgestelde-vragen" },
  { label: "Documenten", href: "/documenten" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-white/10 bg-navy/95 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="flex items-center justify-between h-20 overflow-visible">
          {/* Small logo on inner pages */}
          {!isHomepage && (
            <Link href="/" className="flex items-center group shrink-0 relative z-10">
              <Image
                src="/logo.png"
                alt="PJ Professionals"
                width={280}
                height={84}
                className="h-24 w-auto brightness-0 invert drop-shadow-lg mt-[75px]"
                priority
              />
            </Link>
          )}

          {/* Big centered logo on homepage only */}
          {isHomepage && (
            <div className="absolute left-1/2 -translate-x-1/2 top-3">
              <div className="bg-navy rounded-2xl p-[15px]">
                <Image
                  src="/logo.png"
                  alt="PJ Professionals"
                  width={800}
                  height={240}
                  className="h-64 w-auto brightness-0 invert drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          )}

          {/* Hamburger — always visible at every breakpoint */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg transition-colors ml-auto text-white hover:bg-white/10"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="pb-6 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-base font-medium rounded-lg transition-all text-white/80 hover:text-white hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 mx-4 px-5 py-3 font-semibold text-base rounded-lg transition-colors text-center bg-white text-navy hover:bg-white/90"
              >
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
```

Legacy `bg-navy` is kept — Part B swaps it.

**Step 2:** Verify: reload the preview. Confirm hamburger button appears at desktop size (resize to `preset: desktop`). Confirm no "Home" dropdown button. Confirm clicking hamburger reveals all 9 links (8 nav + Contact CTA).

### Task A9: Verify Part A end-to-end

**Step 1:** With preview running, navigate to each route in sequence:
- `/` (expect: big centered logo, 3 hero buttons including "WLZ" → `/wlz-zorg`)
- `/wlz-zorg` (expect: PageHero + "Binnenkort" paragraph)
- `/documenten` (expect: 2 download cards)
- `/wmo-zorg`, `/forensische-zorg`, `/voor-verwijzers`, `/over-ons`, `/vacatures`, `/veelgestelde-vragen`, `/contact` (expect: unchanged)
- `/homepage-2` (expect: 404)
- `/homepage-3` (expect: 404)

**Step 2:** Run `preview_console_logs level: error` on each page. No errors allowed.
**Step 3:** Run `preview_network filter: failed`. No failed requests allowed.

### Task A10: Commit Part A

```bash
git add -A
git status   # sanity check — only the expected files
git commit -m "$(cat <<'EOF'
restructure: promote homepage-2 to /, add WLZ-zorg and Documenten pages

- Delete homepage-2 and homepage-3 variants (client settled on homepage-2 layout)
- Move former homepage-2 content to /, replace Contact hero button with WLZ
- Add /wlz-zorg placeholder page
- Add /documenten page with WMO Privacyverklaring and Zorgovereenkomst PDFs
- Simplify Header: hamburger-only at every breakpoint, add WLZ-zorg and
  Documenten to menu

Palette and image swaps follow in separate commits.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Part B — Palette swap (commit 2)

Goal: replace every legacy color class (`bg-navy`, `text-accent-light`, etc.) with its teal equivalent, and purge legacy theme variables from `globals.css`.

### Task B1: Rewrite `globals.css`

**Files:**
- Modify: `src/app/globals.css`

**Step 1:** Replace the full file:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-teal-dark: #39585d;
  --color-teal-medium: #78a8a8;
  --color-teal-light: #bdd7d8;
  --color-teal-surface: #edeef0;

  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

This removes the old navy/indigo/accent/surface vars and the `.logo-tint-teal` helper (no longer used).

**Step 2:** Save. The dev server will reload — expect *many* broken utility classes until B2 completes.

### Task B2: Sitewide class replacement

**Files touched (14):**
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/PageHero.tsx`
- `src/components/SectionBlock.tsx`
- `src/components/ParallaxDivider.tsx`
- `src/app/page.tsx`
- `src/app/wlz-zorg/page.tsx`
- `src/app/documenten/page.tsx`
- `src/app/wmo-zorg/page.tsx`
- `src/app/forensische-zorg/page.tsx`
- `src/app/voor-verwijzers/page.tsx`
- `src/app/over-ons/page.tsx`
- `src/app/vacatures/page.tsx`
- `src/app/veelgestelde-vragen/page.tsx`
- `src/app/contact/page.tsx`

**Step 1:** In each file, perform the following find-and-replace (these are literal substring replacements — opacity modifiers like `/60` stay attached):

| Find | Replace with |
|---|---|
| `bg-navy-light` | `bg-teal-dark` |
| `from-navy-light` | `from-teal-dark` |
| `via-navy-light` | `via-teal-dark` |
| `to-navy-light` | `to-teal-dark` |
| `bg-indigo-light` | `bg-teal-medium` |
| `from-indigo-light` | `from-teal-medium` |
| `via-indigo-light` | `via-teal-medium` |
| `to-indigo-light` | `to-teal-medium` |
| `bg-indigo` | `bg-teal-dark` |
| `from-indigo` | `from-teal-dark` |
| `via-indigo` | `via-teal-medium` |
| `to-indigo` | `to-teal-dark` |
| `text-accent-light` | `text-teal-light` |
| `bg-accent-light` | `bg-teal-light` |
| `from-accent-light` | `from-teal-light` |
| `to-accent-light` | `to-teal-light` |
| `border-accent-light` | `border-teal-light` |
| `text-accent` | `text-teal-medium` |
| `bg-accent` | `bg-teal-medium` |
| `border-accent` | `border-teal-medium` |
| `bg-surface-dark` | `bg-teal-surface` |
| `bg-surface` | `bg-teal-surface` |
| `bg-navy` | `bg-teal-dark` |
| `text-navy` | `text-teal-dark` |
| `border-navy` | `border-teal-dark` |
| `from-navy` | `from-teal-dark` |
| `via-navy` | `via-teal-dark` |
| `to-navy` | `to-teal-dark` |

**Important ordering:** replace the `-light` variants **before** the base names, otherwise `bg-navy` will eat `bg-navy-light`. The table above is in the correct order — apply top to bottom.

**Step 2:** After all replacements, verify no legacy classes remain anywhere:

```bash
grep -rEn "(bg|text|border|from|via|to)-(navy|indigo|accent|surface)(-light|-dark)?([/ ]|$|\")" src/ || echo "CLEAN"
```
Expected: `CLEAN`.

### Task B3: Verify palette renders correctly

**Step 1:** With preview running, navigate to `/`. Run:
```
preview_inspect selector: "header" styles: ["background-color"]
```
Expected: background-color computes to ~`rgb(57, 88, 93)` at 0.95 opacity (= `#39585d` teal-dark).

**Step 2:** Navigate to `/wmo-zorg`. Inspect a primary heading or the PageHero. Expected: text-teal-dark or similar teal tones.

**Step 3:** Run `preview_console_logs level: error` — expect none.

**Step 4:** Take a screenshot of `/` as a sanity check.

### Task B4: Commit Part B

```bash
git add -A
git commit -m "$(cat <<'EOF'
style: swap navy/indigo/accent palette to teal sitewide

- globals.css: remove navy/indigo/accent/surface vars, keep only
  teal-dark, teal-medium, teal-light, teal-surface
- All components and pages: class-level find/replace
  (bg-navy -> bg-teal-dark, text-accent -> text-teal-medium, etc.)
- Gradients retargeted to from-teal-dark via-teal-medium to-teal-dark
  so contrast is preserved

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Part C — Image swap (commit 3)

Goal: every stock photo referenced by the site becomes its teal-toned `-alt` counterpart.

### Task C1: Confirm all `-alt` images exist

**Step 1:**
```bash
ls public/images/ | grep -c alt.jpg
# expect: 15
```

### Task C2: Find all legacy image references

**Step 1:**
```bash
grep -rn "pjprofessionals[0-9]\+\.jpg" src/app | grep -v "\-alt\.jpg"
```

This lists every file + line that still points at a non-alt image. Expected count from the design audit: 9 files.

### Task C3: Replace each reference

**Files:**
- All 9 files listed by Task C2.

**Step 1:** In each file, replace `pjprofessionalsN.jpg` with `pjprofessionalsN-alt.jpg` (same number, `-alt` inserted before `.jpg`).

**Step 2:** Verify zero non-alt references remain in `src/app/`:
```bash
grep -rEn "pjprofessionals[0-9]+\.jpg" src/app | grep -v "\-alt\.jpg" || echo "CLEAN"
```
Expected: `CLEAN`.

### Task C4: Verify all alt images load 200 on every page

**Step 1:** With preview running, navigate to each route in turn (`/`, `/wmo-zorg`, `/forensische-zorg`, `/wlz-zorg`, `/voor-verwijzers`, `/over-ons`, `/vacatures`, `/veelgestelde-vragen`, `/documenten`, `/contact`). After each navigation run `preview_network filter: failed` — expect no failures.

**Step 2:** On `/`, run `preview_eval`:
```js
(() => {
  const urls = new Set();
  document.querySelectorAll('*').forEach(el => {
    const bg = getComputedStyle(el).backgroundImage;
    const m = bg && bg.match(/url\("?([^")]+)"?\)/);
    if (m && m[1].includes('pjprofessionals')) urls.add(m[1]);
  });
  return Array.from(urls);
})()
```
Expect: every URL ends in `-alt.jpg`.

### Task C5: Commit Part C

```bash
git add -A
git commit -m "$(cat <<'EOF'
style: swap stock photography to teal-toned -alt variants sitewide

Every /images/pjprofessionalsN.jpg reference becomes
/images/pjprofessionalsN-alt.jpg. Old non-alt files remain in
public/images/ as a fallback.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Final verification

1. Preview running, visit every route: `/`, `/wmo-zorg`, `/forensische-zorg`, `/wlz-zorg`, `/voor-verwijzers`, `/over-ons`, `/vacatures`, `/veelgestelde-vragen`, `/documenten`, `/contact`. `preview_console_logs level: error` and `preview_network filter: failed` both clean.
2. Download one PDF from `/documenten` — status 200, correct filename.
3. Spot-check one page per part:
   - Part A: `/wlz-zorg` loads.
   - Part B: `preview_inspect` on `/` header shows teal-dark background.
   - Part C: `preview_eval` finds no non-alt image URLs.
4. `git log --oneline -4` shows three new commits (restructure, palette, images).

## Commits summary

- `restructure: promote homepage-2 to /, add WLZ-zorg and Documenten pages`
- `style: swap navy/indigo/accent palette to teal sitewide`
- `style: swap stock photography to teal-toned -alt variants sitewide`

Rolling back any one commit leaves the other two intact.
