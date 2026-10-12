# Document stationery & forms — decisions

Rule sheet for every Word/PDF document PJ Professionals produces (letters, forms, policy docs).
**Read this before touching a document. If a rule here conflicts with a guess, the rule wins. If a rule is missing, ask — then add it here.**

Numbers below were measured from the actual template files and backdrop images (Oct 2026), not remembered.

## 1. Reference documents (the examples to copy, in `documenten/`)

| Document | Use it as the example for |
|---|---|
| `Template PJ Professionals BV.docx` | **Cover page + body page + footer line** (bound title/version fields). The standard for policy/report documents. |
| `Briefpapier PJ Professionals BV.docx` | **Letters** (logo band + address footer art, address block at the top, one big body field). |
| `Briefpapier PJ Professionals BV zonder voettekst.docx` | Letter/continuation page **without** address footer art. |
| `Zorgplan WMO - bewerkbare Word-bron.docx`, `Evaluatie Zorgplan WMO - bewerkbare Word-bron.docx` | **Forms**: title page, shaded field cells, checkboxes, counters in the PDF. |
| `pdf-form-kit/` (`lib/docx-helpers.js`, `scripts/*.py`, `assets/*.png`) | The code + backdrop images behind all of the above. Reuse it; don't re-derive constants. |

When building or converting a document: **open the matching reference, copy its XML for sectPr / header / footer / cover, and diff your result against it** (see §9).

## 2. Which stationery goes where

| Document type | Backdrop image (`pdf-form-kit/assets/`) | Notes |
|---|---|---|
| Brieven | `Briefpapier PJ Professionals BV.png` | Logo band top, address/KvK/AGB art at the bottom. |
| Formulieren, policy/Beleid body pages | `Briefpapier Formulier PJ Professionals.png` | Logo band top only. Identical art to the Evaluatie / "zonder voettekst" backdrop. |
| Cover of policy/Beleid/report documents | `Voorblad Template PJ Professionals BV (blank).png` | Big PJ circle in the middle; title above it, version block below. |
| Landscape pages | *(not created yet — see §10)* | Portrait art must never be stretched or rotated. |

Page size is **always A4 portrait** (11906 × 16838 twips) unless a document is explicitly landscape. US Letter is converted to A4.

## 3. Page geometry and keep-out zones (twips; 20 twips = 1 pt)

Measured from the backdrop PNGs (2481×3508 px = A4 at 300 dpi):

| Zone | Letters (Briefpapier BV) | Forms / Beleid body (Formulier) | Cover |
|---|---|---|---|
| Logo band + tagline + hairline | ink 854 → 2299, hairline at **2285** | same | tagline only, top right (not measured) |
| Footer art | rule at **15086**, address text 15336 → 16118 | none (faint watermark bottom-right only) | version hairline at **15921** |
| Cover circle + wordmark | – | – | **4075 → 10329** |

Page margins (copy exactly; `w:pgMar`):

| Section | top | bottom | left/right | header | footer |
|---|---|---|---|---|---|
| Body, forms/Beleid (Template body, Zorgplan, Evaluatie) | **2500** | **900** | 1300 | 708 | 708 |
| Body, letters (Briefpapier BV) | **2500** | **2200** | 1300 | 708 | 708 |
| Cover section | **100** | **100** | 1300 | 0 | 0 |

Rules that follow:
- **Body text never starts above 2500** (215 twips under the hairline) and never ends below 900 (forms) / 2200 (letters, 448 twips above the footer rule). Nothing may sit inside the logo band or footer art.
- Exact-fit blocks (a big field filling a page) need **≥ 1 inch (1440 twips) spare** against the computed page space. LibreOffice and Word paginate differently: the Template once fit "exactly" in LibreOffice and spilled onto a blank 3rd page in Word.
- Never fake a page break with an empty paragraph carrying `pageBreakBefore`; put `pageBreakBefore` on the heading itself (an empty spacer paragraph forced a near-empty page in the Evaluatie).

## 4. How the backdrop is built (copy, don't invent)

- The art is **one full-page image anchored in the header**: `wp:anchor … behindDoc="1" layoutInCell="1" allowOverlap="1" relativeHeight="10696575"`, `positionH/positionV relativeFrom="page" posOffset=0`, `wp:wrapNone`, extent **7562850 × 10696575 EMU** (exactly A4).
- Body pages use header = backdrop. A cover is its **own section** (own header with the cover image, top/bottom margin 100, no footer), followed by a next-page body section. (Zorgplan/Evaluatie use `titlePg` + first-page header instead; both patterns exist, use the Template's section pattern for new documents.)
- Old logos, old footer tables (Bestandsnaam / Datum laatste wijziging / Documenteigenaar), cover shapes and body-level logos are **removed**, never kept underneath the new art.
- Fonts DM Sans + Playfair Display are embedded (`scripts/embed_fonts.py`; the templates carry 4 embedded font files).

## 5. Footers

| Type | Format |
|---|---|
| Policy / Beleid / report (Template) | Centered, **8 pt** (`sz 16`), colour **999999**: `PJ Professionals  \|  <titel>  \|  versie <X>  \|  pagina <PAGE> van <NUMPAGES>`. `<titel>` and `<X>` are content controls **data-bound** to the cover fields (edit once on the cover → footer follows). No date/owner in the footer. |
| Forms without cover | Same line, title and version as plain text (or bound fields if the document has a cover). |
| Letters (Briefpapier BV) | Right-aligned, 7.5 pt (`sz 15`), colour 5A6B78: `Pagina <PAGE> van <NUMPAGES>`, `spacing before 40`. |
| Cover page | No footer. |

## 6. Cover page recipe (from `Template PJ Professionals BV.docx`)

- Title paragraph: centered, `spacing before 2006`, **Titel** 40 pt (`sz 80`) Playfair Display bold `1A1A1A`, line break, **Sub titel** 24 pt (`sz 48`) Playfair Display. Both are content controls bound to `titel` / `subtitel`.
- Longer titles: reduce the size so title + subtitle end above the circle (**above 4000 twips**). Sizes used in the pilot (28 pt up to 26 chars, 22 pt beyond, `before` ≈ 1700) are a first guess, **not verified in Word** — check each cover.
- Version block (10 pt DM Sans, `1A1A1A`, exact line 210): `Versienummer: <field>` (this paragraph carries `spacing before 11014`), `Versiedatum: <field>`, `Documenteigenaar: PJ Professionals` (**fixed text, not a field**). The block must end **above the hairline at 15921**.
- The line-break run after the title must use the small (10 pt) run properties, otherwise the subtitle drops into the logo circle.
- Cover fields are pre-filled with the document's real values when converting existing documents (never leave "X").

## 7. Fields and checkboxes

- Fill spots are **content controls** (`w:sdt`): plain text (`w:text`, `multiLine` 0/1), date, drop-down (`w:dropDownList`), checkbox (`w14:checkbox`, ☐ `2610` / ☒ `2612`, MS Gothic). No legacy form fields, no underscores/dots left in the text.
- Placeholder text: italic, colour `6D8A99`; typed text `1A1A1A`; same font and size as surrounding text. `[bracket placeholders]` become fields with the bracket text as placeholder; choice lists (`a/b/c`) become drop-downs.
- Tick boxes are one checkbox control per option, label stays normal text; every tick box in the original must have a control (count before = count after).
- **Letters and templates: no field borders or shading** (borders printed on paper; removed Oct 2026). **Forms** keep the shaded field cells (`F3F9FC` value / `F4F7F9` label, border `BFD8E3`) like Zorgplan/Evaluatie.
- Address block in letters: Naam / Adres / Postcode-Plaats / blank / Plaats, Datum, each exact line height 210 (≈ 10.5 pt), blank line 300. Looser spacing was rejected.
- Multi-line fields in PDF forms: box height is a UX choice, not a chars-per-line calculation; character counters sit directly under the box (limits are per field, see the Evaluatie/Zorgplan PDFs).
- Free-text fields in forms must not carry the date-picker script.

## 8. Typography

- Body: **DM Sans 10 pt**, `1A1A1A`. Headings and cover titles: **Playfair Display** bold, navy `0A2540` (title, H1) / `0B3C5D` (H2+). No other fonts except symbol fonts for checkboxes/bullets.
- Theme fonts and explicit run fonts of legacy documents are stripped; styles carry the look.
- Brand colours: Nacht `0A2540`, Primair `0B3C5D`, Diepblauw `1D5C7A`, Accent `2E86AB`, Lichtblauw `3FA7D6`, Oppervlak `E6F2F8`.

## 9. Working process (every batch of documents)

1. **Never overwrite originals.** Convert into a new folder (`documenten/Nieuwe stationary/...`).
2. **Start from the reference** (§1): same sectPr, header anchor, footer, cover XML; then diff the result against it. If anything differs from the table in §3–§6, fix the document, not the rule.
3. **Pilot first** (one letter, one form, one policy doc). The user opens them **in Word** and approves before the rest is converted. LibreOffice renders are only a pre-check.
4. Automated checks per file: Word-schema validation (`validate.py --original`), no text in keep-out zones (§3), control counts equal original counts, fonts embedded, A4, page-count change reported, old footer/logo text absent.
5. **PDFs only after an explicit "go" on the docx set.** Writeable PDF = `finalize_pdf.py` (+ counters where the form had them). Standard: unencrypted AcroForm, Helvetica 10 pt field text, shaded field background (`/MK/BG`), `app.runtimeHighlight=false`.
6. **Commit and push only on an explicit "commit and push"**, and only the files of that task.
7. Rebuild after changing a source: PDFs are generated from the Word source, never edited by hand.

## 10. Open questions / not decided yet

- Landscape backdrop (Sociogram, Interne audit): generate from the portrait art vs. other approach — pending.
- **Pilot rejected (Oct 2026):** the first three converted documents (waarschuwingsbrief, Risico inventarisatie, Jaarplan) show text over the logo/footer in the user's Word. Cause not yet identified (LibreOffice renders show no overlap) — needs a Word screenshot; update §3–§5 once found.
- Legacy-document typography restyle (DM Sans / Playfair) — chosen, but unverified against page counts and TOC refresh in Word.
- Table-of-contents refresh: `updateFields` on open (Word prompts once) vs. pre-refreshed TOC for PDFs.
