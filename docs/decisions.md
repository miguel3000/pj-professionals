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
| Landscape pages | `Briefpapier Formulier landscape.png` (generated from crops of the portrait art: logo block left, tagline right, hairline redrawn across, watermark bottom-right) | Portrait art must never be stretched or rotated. Used for the Sociogram. |

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

- **Every cover line has an EXACT line height** (`w:lineRule="exact"`). Legacy documents inherit a 1.16× default line spacing (`pPrDefault line=278`) the Template does not have; with automatic line height the 40 pt title block grew in Word and the subtitle drifted toward the logo circle (pilot, Oct 2026). Exact heights make the cover independent of inherited spacing, font metrics and installed fonts.
- Title paragraph: centered, `spacing before 2006`, line exact = 1.25 × font size, **Titel** 40 pt (`sz 80`) Playfair Display bold `1A1A1A`, bound to `titel`. **Sub titel** is its own paragraph right below (`before 0`, exact 1.25 × size), 24 pt (`sz 48`) Playfair Display, bound to `subtitel`. Rendered position to match the Template: title box 124.8 → 164.8 pt, subtitle 173 → 197 pt, both **above the circle at 204 pt**.
- Longer titles: the size is chosen automatically — the largest of 40/32/28/24/22/20/18 pt that keeps the title on **one line** (greedy word-wrap estimate, bold Playfair ≈ 0.72 em/char, regular ≈ 0.58, usable width 455 pt); if none fits, the largest that fits in two lines. `spacing before` shrinks (2006 → min 700) until title + subtitle end above the circle (**under 3950 twips**), and the version block's `before` is computed from the estimated line counts so it always starts at 14760 twips. Checked in LibreOffice on 6 covers; **not yet verified in Word**.
- Version block (10 pt DM Sans, `1A1A1A`, exact line 210): `Versienummer: <field>`, `Versiedatum: <field>`, `Documenteigenaar: PJ Professionals` (**fixed text, not a field**). The first line's box top is placed at **14760 twips** from the page top (Template: 748.9 pt) by computing its `spacing before`; the block must end **above the hairline at 15921**.
- Cover fields are pre-filled with the document's real values when converting existing documents (never leave "X").

## 7. Fields and checkboxes

- Fill spots are **content controls** (`w:sdt`): plain text (`w:text`, `multiLine` 0/1), date, drop-down (`w:dropDownList`), checkbox (`w14:checkbox`, ☐ `2610` / ☒ `2612`, MS Gothic). No legacy form fields, no underscores/dots left in the text.
- Placeholder text: italic, colour `6D8A99`; typed text `1A1A1A`; same font and size as surrounding text. `[bracket placeholders]` become fields with the bracket text as placeholder; choice lists (`a/b/c`) become drop-downs.
- Tick boxes are one checkbox control per option, label stays normal text; every tick box in the original must have a control (count before = count after).
- **Letters and templates: no field borders or shading** (borders printed on paper; removed Oct 2026). **Forms** keep the shaded field cells (`F3F9FC` value / `F4F7F9` label, border `BFD8E3`) like Zorgplan/Evaluatie.
- Address block in letters: Naam / Adres / Postcode-Plaats / blank / Plaats, Datum, each exact line height 210 (≈ 10.5 pt), blank line 300. Looser spacing was rejected.
- Multi-line fields in PDF forms: box height is a UX choice, not a chars-per-line calculation; character counters sit directly under the box (limits are per field, see the Evaluatie/Zorgplan PDFs).
- Free-text fields in forms must not carry the date-picker script.
- **Empty answer cells in tables** (incl. whitespace-only ones) get a multi-line text control; its tag comes from the label cell to the left, else the nearest label above. Empty paragraphs in legacy documents are self-closing (`<w:p …/>`) — handle that when inserting.
- Bullets that were really tick choices (Mentor / Curator / Informeel) become checkboxes; `Ja/Nee` text becomes two checkboxes (Ja, Nee); `[ ]` text becomes a checkbox.
- Dot-leader example lists (Intake "........ woont zelfstandig") are examples, not fields: left as text.
- Legacy colours that clash with the brand (teal table header `008080`, mixed blues in Beleid headings) are remapped to Primair `0B3C5D`; semantic colours (stoplight red/orange/green in the Signaleringsplan, grey section bars) stay.

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
7. **Generated paragraphs must set their own spacing** (`before/after/line`) — never rely on inherited defaults; legacy documents differ from the Template here and Word and LibreOffice then disagree.
8. Rebuild after changing a source: PDFs are generated from the Word source, never edited by hand.

## 10. Open questions / not decided yet

- Landscape pages: backdrop generated (§2). Floating diagram text boxes (Sociogram) stay anchored to their paragraph; start the diagram section on a new page so no box lands on the footer.
- **Interne audit 2026 not converted:** it is a PDF-to-Word export (headings and the table of contents live inside floating text boxes, 10 sections with 2/3-column breaks, zero margins, tables wider than the page, 49 boxes split across runs). Needs a proper rebuild, decision pending.
- **Pilot rejected (Oct 2026):** objection = cover title/subtitle position in Word (header/footer do **not** overlap in Word, checked by the user). Fixed with exact line heights (§6) — to be re-checked in Word. Other objections, if any, still to be collected.
- Legacy-document typography restyle (DM Sans / Playfair) — chosen, but unverified against page counts and TOC refresh in Word.
- Table-of-contents refresh: `updateFields` on open (Word prompts once) vs. pre-refreshed TOC for PDFs.

## Interne audit 2026 (rebuild)
- The PDF-to-Word export could not be converted in place; rebuilt from extracted content (`pdf-form-kit/scripts/rebuild_interne_audit.py`): Template cover, TOC page, portrait section 1, landscape section 2 (single findings table, repeating header row, Formulier landscape backdrop).
- Categorie column: 3 real checkboxes per finding; the option without a leading ☐ in the export was the selected one. Directiebeoordeling (ISO 9.3) had none selected -> left unchecked, to confirm with owner.
- Version number unknown (cover field left as placeholder). "Mandaatdocument ... d.d." has no date in the source.

## Chapters start on a new page (rule, decided 2026-10-21)
- Every chapter (Heading 1 / "Kop1") starts on a new page — in all documents, Beleid and forms alike. Sub-headings (Heading 2+) flow normally.
- Implemented as `pageBreakBefore` on the Heading 1 style (not per paragraph), via `restyle_docx.chapters_on_new_page(pkg)`; CLI wrapper pattern: unzip -> call -> rezip.
- The function also removes what would turn that rule into blank pages: empty Heading 1 paragraphs (style dropped), and empty / hard-page-break paragraphs sitting directly in front of a chapter heading.
- New or rebuilt documents: build headings with the real Heading 1 style (never bold text), then run the function; never add manual page breaks before chapters.
- A document title that is the first heading (e.g. "Privacyverklaring ...") is unaffected, it already sits at the top of a page.
- Check after applying: every chapter heading is the first line of its page (pdftotext per page) and there are no near-empty pages. TOC page numbers change -> TOC field must be refreshed before the PDF is made.
- Open data issue (not changed without OK): 07 kindcheck has two chapters numbered "2." ("Kinderen in het huishouden" and "Opvoedsituatie").

## Writeable PDFs (step 2, started 2026-10-21 after explicit "go")
- Order per document: docx final -> `refresh_toc.py` (cached TOC page numbers) -> `make_writeable_pdf.py <docx> <pdf>`; PDF is written next to the docx in `documenten/Nieuwe stationary/<map>/`.
- Pre-filled text controls (cover title/subtitle/date, footer title, audit findings) are flattened to static text so they keep their typography; empty controls stay fillable. Pre-ticked checkboxes keep their state.
- `finalize_pdf.py`: fields outside a shaded cell are widened to the next word / right margin; documents with no fields get a plain PDF.
- Known limits: footer controls (page footer "versie X") are static in the PDF; multi-line answer cells in legacy tables are single-line fields.

## Public website documents (2026-11-01)
- Converted with `pdf-form-kit/scripts/convert_beleid.py` (cover + bound footer + chapters on new pages), then `refresh_toc.py` and `make_writeable_pdf.py`: Cliënttevredenheidsonderzoek 2025 (v1.0, 31 maart 2026), Klachtenreglement (v1.3, 8 oktober 2026), Privacyverklaring (v2.1, 8 oktober 2026 per client).
- Site downloads live in `public/documenten/` with URL-safe names; paths, titles and sizes are defined once in `src/lib/documents.ts` (footer, Over ons, Forensische zorg and /documenten all read from it). Update sizes there when a PDF changes.
- Footer links (Privacyverklaring, Klachtenreglement) open the PDF directly; the Documenten page lists everything.

## Exception to the chapter rule: Klachtenreglement (2026-11-01)
- Short legal text: chapters flow (no page break before Heading 1) to keep the document short. Page 2 = chapters 1-3 (if they ever stop fitting, chapter 3 starts on a new page), page 3 = 4-6, page 4 = 7-9 (explicit page break before chapter 7). Cover + 3 pages instead of cover + 9.
- Done by removing `pageBreakBefore` from the Heading 1 style of this document only. The general rule above stays the default.
