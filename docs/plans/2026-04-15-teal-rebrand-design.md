# Teal rebrand + site restructure — design

**Date:** 2026-04-15
**Status:** approved (pending implementation)

## Context

Client reviewed three homepage variants (`/`, `/homepage-2`, `/homepage-3`) and settled on the homepage-2 layout with homepage-3's teal palette. The site also needs a new Documenten page (public PDF downloads) and a new WLZ-zorg service page. This design captures the full restructure so implementation can be mechanical.

## Goals

1. Delete homepage variants that lost the client review.
2. Apply the teal palette everywhere — no vestigial navy/indigo/accent classes.
3. Drop the desktop nav in favor of a single hamburger menu on all breakpoints.
4. Replace stock photography with the teal-toned `-alt` variants.
5. Add two new pages (Documenten, WLZ-zorg) without disturbing existing pages.

## Decisions

### Routes

| Before | After |
|---|---|
| `/` (src/app/page.tsx, original homepage-1) | **content replaced** with former homepage-2 content |
| `/homepage-2` | **removed** |
| `/homepage-3` | **removed** |
| `/wlz-zorg` | **new**, placeholder page ("Binnenkort meer informatie") |
| `/documenten` | **new**, list of downloadable PDFs |
| `/wmo-zorg`, `/forensische-zorg`, `/voor-verwijzers`, `/over-ons`, `/vacatures`, `/veelgestelde-vragen`, `/contact` | unchanged routes, restyled |

### Header

- **Hamburger-only** at every breakpoint. No `lg:flex` desktop nav, no "Home" dropdown (no more variants to choose between).
- Background: `bg-teal-dark/95` (was `bg-navy/95`), blurred, with teal-dark border.
- Menu icon: white (since header is now dark teal).
- **Homepage only** (`pathname === "/"`): giant centered logo wrapped in a `bg-teal-dark rounded-2xl p-[15px]` backdrop, positioned absolute to overhang below the header. Unchanged from homepage-2 except backdrop color.
- **All other pages**: small white-inverted `logo.png` top-left, 24 units tall, linking to `/`.

### Navigation items (in hamburger menu)

1. WMO-zorg
2. Forensische zorg
3. **WLZ-zorg** (new)
4. Voor verwijzers
5. Over ons
6. Vacatures
7. FAQ
8. **Documenten** (new)
9. Contact (styled as CTA button)

### Homepage hero buttons

Three buttons under the hero heading:

| Before | After |
|---|---|
| WMO-zorg | WMO-zorg |
| Forensische zorg | Forensische zorg |
| Contact | **WLZ** (links to `/wlz-zorg`) |

Contact is still reachable via the hamburger menu and the footer.

### Color palette (`globals.css`)

Purge old `navy`, `navy-light`, `indigo`, `indigo-light`, `accent`, `accent-light`, `surface`, `surface-dark`, and the `.logo-tint-teal` helper. Keep only:

```css
--color-teal-dark: #39585d;
--color-teal-medium: #78a8a8;
--color-teal-light: #bdd7d8;
--color-teal-surface: #edeef0;
```

### Class replacements (sitewide find & replace)

| Old | New |
|---|---|
| `bg-navy` | `bg-teal-dark` |
| `bg-navy/NN` | `bg-teal-dark/NN` |
| `text-navy` | `text-teal-dark` |
| `border-navy/NN` | `border-teal-dark/NN` |
| `from-navy`, `via-navy`, `to-navy` | `from-teal-dark`, `via-teal-dark`, `to-teal-dark` |
| `bg-indigo`, `from-indigo`, `via-indigo`, `to-indigo` | `bg-teal-dark`, `via-teal-medium` (in gradients for contrast) |
| `text-accent`, `bg-accent` | `text-teal-medium`, `bg-teal-medium` |
| `text-accent-light`, `bg-accent-light`, `from-accent-light`, `to-accent-light` | `text-teal-light`, `bg-teal-light`, `from-teal-light`, `to-teal-light` |
| `bg-surface`, `bg-surface-dark` | `bg-teal-surface`, `bg-teal-surface` |
| `border-accent-light/NN` | `border-teal-light/NN` |

Gradients like `from-navy via-indigo to-navy` become `from-teal-dark via-teal-medium to-teal-dark` so contrast is preserved.

### Image swap

Every `/images/pjprofessionalsN.jpg` reference in `src/app/**` becomes `/images/pjprofessionalsN-alt.jpg`. Old non-alt images remain in `public/images/` untouched (safety net if the client swings back).

### Documenten page

- Route: `src/app/documenten/page.tsx`
- Layout: PageHero ("Documenten") + a single section with a card grid of downloadable PDFs.
- Each card: title, short description, file size, download button (`<a href="/documenten/..." download>`).
- Initial PDFs (copied into `public/documenten/`):
  - `WMO Privacyverklaring.pdf` — "Hoe wij omgaan met persoonsgegevens binnen de WMO-zorg."
  - `WMO Zorgovereenkomst.pdf` — "Standaard zorgovereenkomst voor WMO-clienten."

### WLZ-zorg page

- Route: `src/app/wlz-zorg/page.tsx`
- Content: PageHero ("WLZ-zorg") + a single centered section with a placeholder paragraph ("Binnenkort meer informatie") and a CTA back to `/contact`.
- Styling follows `/wmo-zorg` so later copy can drop in without restructuring.

## Scope excluded

- Footer link order changes (covered by the sitewide class swap, no structural change).
- Contact form SMTP wiring (paused awaiting credentials — orthogonal to this rebrand).
- Image optimization / `next/image` migration on background images (out of scope).
- Translating Documenten titles to user-friendly labels beyond the filename (initial descriptions above are sufficient).

## Commit strategy

Three commits, roll-backable independently:

1. **Restructure**: delete homepage-1/homepage-2/homepage-3, promote homepage-2 content to `/`, add new `/wlz-zorg` and `/documenten` stubs, update Header (hamburger-only, WLZ button).
2. **Palette swap**: rewrite `globals.css`, class replacements across all pages and shared components, gradient updates.
3. **Image swap**: `-alt` suffix added to every `pjprofessionalsN.jpg` URL across the site.

## Verification

After each commit, start `pj-dev`, navigate to every route, confirm no 404s on images/PDFs, and spot-check computed colors on a representative element per page. No console errors tolerated.
