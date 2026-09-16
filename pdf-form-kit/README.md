# PDF Form Kit

Reusable pieces for building PJ Professionals fillable-PDF forms (the
Zorgplan/Evaluatie/Intakeformulier style: a Word source built with docx-js,
exported to PDF with real AcroForm fields, on top of client-supplied
full-page backdrop art). The styling in `lib/docx-helpers.js` — field-row
layout, checkbox-group patterns, hint-text style — was reverse-engineered
directly from the shipped Zorgplan and Evaluatie Word sources (unzipped and
read, not guessed), so a new form built from these pieces matches their
real visual language, not an approximation of it. The original build
scripts for those two documents were themselves lost from an earlier
session's scratchpad, which is exactly the failure this kit exists to
prevent. **Keep this folder — it's the only copy.**

## Why this exists

Building one of these forms from scratch is a real multi-hour task with
several non-obvious bugs baked in (see "Known gotchas" below). This folder
turns it into: write one `build_myform.js` using the helpers in `lib/`,
then run the same four-step pipeline every time.

## Layout

```
pdf-form-kit/
  lib/docx-helpers.js   — docx-js building blocks (import this in a new build script)
  scripts/inject_sdt.py — swaps ⟦FIELD⟧/⟦DATEFIELD⟧/⟦CHECKBOX⟧ markers for real content controls
  scripts/embed_fonts.py — embeds Playfair Display + DM Sans into the docx
  scripts/finalize_pdf.py — turns the LO-exported PDF into the final fillable AcroForm PDF
  assets/
    Voorblad Template PJ Professionals BV (blank).png — generic cover backdrop,
      placeholder "Titel"/"Sub titel" and version-metadata guideline text
      erased (see "Cover template" below) — the Photoshop/Illustrator source
      still has that guideline text; re-export and re-blank it if the design
      itself changes
    Briefpapier Formulier PJ Professionals.png — generic continuation-page backdrop
  package.json / node_modules/ — the `docx` npm package, installed locally
  .venv/ — Python venv with pypdf + pikepdf
```

## Building a new form

1. **Write `build_myform.js`** (put it in scratchpad, or wherever — it just needs
   to `require()` this kit's `lib/docx-helpers.js` by path, and its own
   `node_modules` needs `docx`; either run it from inside a directory with
   `docx` installed, or set `NODE_PATH=/path/to/pdf-form-kit/node_modules`):

   ```js
   const kit = require("/Users/pumpkin/Claude/pj-professionals/pdf-form-kit/lib/docx-helpers.js");
   const { Document, Packer, Paragraph, PageBreak } = require("docx");

   const doc = new Document({
     sections: [{
       properties: { page: { size: kit.PAGE, margin: kit.MARGIN }, titlePage: true },
       headers: {
         // Use the bundled generic backdrops unless the client supplied
         // form-specific art — both already 2481x3508px, A4@300dpi, RGB, no alpha.
         first: kit.letterheadHeader(`${__dirname}/../pdf-form-kit/assets/Voorblad Template PJ Professionals BV (blank).png`),
         default: kit.letterheadHeader(`${__dirname}/../pdf-form-kit/assets/Briefpapier Formulier PJ Professionals.png`),
       },
       children: [
         new Paragraph({ children: [new PageBreak()] }),          // cover page: backdrop only, no live text
         kit.h1("Form Title"),
         kit.infoTable([
           kit.infoRow("Naam:", "naam"),
           kit.dateRow("Geboortedatum:", "geboortedatum"),
           kit.lockedRow("Document eigenaar:", "PJ Professionals"),
         ]),
         kit.checkboxRow([["chk_a", "Ja"], ["chk_b", "Nee"]], { prefix: "a.  " }),
         kit.openTextBox("toelichting", { lines: 2 }),
       ],
     }],
   });
   Packer.toBuffer(doc).then(buf => require("fs").writeFileSync("myform-base.docx", buf));
   ```

   See `lib/docx-helpers.js` for the full list of exported helpers
   (`h1`, `infoRow`, `dateRow`, `lockedRow`, `infoTable`, `openTextBox`,
   `checkboxRow`, `checkboxGroupRow`, `fieldWithCheckboxesRow`, `subLabel`,
   `fieldGroupLabel`, `hintRun`) and `COLORS`/`PAGE`/`MARGIN` constants.
   Two checkbox shapes, matching what Zorgplan/Evaluatie actually use —
   pick whichever fits:
   - `checkboxGroupRow(label, hint, pairs)` — a first-class field row (label
     cell + hint, value cell with each checkbox stacked on its own line).
     Use when the checkbox group is one of several fields in the same
     `infoTable` (Evaluatie's "Soort evaluatie").
   - `checkboxRow(pairs, opts)` — a free paragraph, checkboxes side by side
     on one line, outside any table. Use under a `fieldGroupLabel(...)`
     heading for a lighter-weight group (Zorgplan's "Voortgang:").
   - `fieldWithCheckboxesRow(label, hint, tag, placeholder, pairs)` — a field
     row combining both: a name field, then a `checkboxRow` beneath it in
     the same value cell (Zorgplan's Mentor/Curator/Bewindvoerder row).

   Compose your own question/section helpers on top of these the way
   `build_intake.js` did (see `documenten/Intakeformulier gespecialiseerde
   begeleiding - bewerkbare Word-bron.docx` for a worked example, or ask for
   the original scratchpad script if it's still in this session).

2. **Run the pipeline:**

   ```bash
   KIT=/Users/pumpkin/Claude/pj-professionals/pdf-form-kit
   node build_myform.js
   unzip -q myform-base.docx -d unpacked
   "$KIT/.venv/bin/python3" "$KIT/scripts/inject_sdt.py" unpacked registry.json
   "$KIT/.venv/bin/python3" "$KIT/scripts/embed_fonts.py" unpacked
   (cd unpacked && zip -Xrq ../myform-unprotected.docx . -x '.*')

   # Export to PDF WITH real AcroForm fields — the ExportFormFields filter
   # option is required, plain --convert-to pdf silently drops all fields.
   # UseLosslessCompression avoids LibreOffice's default lossy JPEG
   # re-encoding of the backdrop images (Flate/PNG-style instead — usually
   # comes out *smaller* too, since this kind of flat line-art/logo content
   # compresses better losslessly than as a JPEG).
   soffice --headless --convert-to \
     'pdf:writer_pdf_Export:{"ExportFormFields":{"type":"boolean","value":"true"},"UseLosslessCompression":{"type":"boolean","value":"true"}}' \
     myform-unprotected.docx

   "$KIT/.venv/bin/python3" "$KIT/scripts/finalize_pdf.py" \
     myform-unprotected.pdf "Myform - formulier.pdf" registry.json
   ```

   (`registry.json` is only needed by `finalize_pdf.py` if the form has date
   fields — omit the third arg otherwise.)

3. **Verify** (don't skip this — every "obviously fine" build so far has had
   at least one real bug only visible after rendering):
   - `pdftoppm -jpeg -r 100 "Myform - formulier.pdf" page` and look at every page.
   - Structural check with pypdf: field count, names, `/FT` types, no fields
     with a non-empty `/V` (see "Known gotchas" #2), `reader.is_encrypted is False`.
   - Open the actual PDF and click into a few fields to confirm typing works
     and nothing is pre-filled with placeholder text.

4. **Deliver**: copy the finished PDF and the `*-unprotected.docx` (rename to
   `... - bewerkbare Word-bron.docx`) into `documenten/`, matching the
   Zorgplan/Evaluatie naming convention.

## Known gotchas (all already fixed in these scripts — read before changing them)

1. **LibreOffice does not preserve `<w:tag>` as the exported PDF field's
   `/T`.** It assigns generic sequential names (`Widget`, `_2`, `_3`, ...).
   It *does* carry the tag through as `/TU` (tooltip) — `finalize_pdf.py`
   renames every field from `/TU`.
2. **LibreOffice bakes the placeholder text in as the field's literal `/V`
   (and `/DV`)**, not just its displayed hint — Word's `w:showingPlcHdr`
   semantics ("this is a hint, not real content") aren't understood on
   import. Every field opens pre-filled with its own label text that has to
   be manually deleted before typing. `finalize_pdf.py` clears both.
3. **A text field's exported `/AP` is a stale cached appearance** (showing
   the old placeholder) that Acrobat displays while a field has focus,
   regenerating only on save — makes live typing look invisible.
   `finalize_pdf.py` deletes `/AP` from every `/Tx` field entirely.
4. **`/AcroForm/DR/Font` never gets a `/Helv` entry** even though every
   field's `/DA` references it, causing "Unknown font tag" errors when a
   viewer tries to regenerate appearances under `NeedAppearances`.
   `finalize_pdf.py` adds a standard (non-embedded) Helvetica entry.
5. **Checkbox `/AP/N` keys come out named after the literal glyph
   characters** (e.g. `/☐`/`/☒`) instead of the conventional `/Off`/`/Yes`
   some strict viewers require to match `/AS`. `finalize_pdf.py` renames
   them (`/Off` = the U+2610 empty-box glyph, `/Yes` = the other one).
6. **`CT_Settings` has a fixed element sequence** — `embedTrueTypeFonts`/
   `saveSubsetFonts` must come right after `displayBackgroundShape`, not at
   the start of `<w:settings>`, or the docx fails schema validation.
   `embed_fonts.py` anchors the insertion correctly.
7. **`word/_rels/fontTable.xml.rels` and `fontTable.xml` are emitted
   self-closing** (`<Relationships .../>`) when docx-js hasn't populated
   them yet — a naive `.replace("</Relationships>", ...)` silently no-ops.
   `embed_fonts.py` detects and handles the self-closing case.
8. **The `ExportFormFields` LibreOffice filter option is required** on
   `--convert-to pdf` — without it, every content control just becomes flat
   text with zero AcroForm fields, silently.
9. **A text field's exported `/Rect` is sized to fit only its own
   placeholder text** (one line, as wide as the hint), not the full visible
   shaded table cell around it — the interactive box ends up a small
   fraction of what looks clickable on the page. `finalize_pdf.py` reads
   the real shaded-cell rectangles out of the PDF's vector content (via
   `pdfplumber`, not pixels) and snaps every field to the one it's inside,
   inset by the cell's own `tcMar` (7.5pt / 5pt).
10. **A field's own generated appearance paints an opaque white background**,
    covering the page's own static cell-shading art the moment the field is
    focused or filled in — so a filled field looks white while every
    untouched field around it stays shaded, a visibly inconsistent page.
    `finalize_pdf.py` sets `/MK/BG` on every text field so Acrobat paints
    the same shading into its own appearance every time.
11. **Acrobat/Reader's "Highlight Fields" blue tint is a per-viewer
    preference**, not something a PDF can normally disable — it persists
    across filling in and saving the form regardless of file content. The
    one embeddable fix is a document-level JavaScript action
    (`app.runtimeHighlight = false;`, via `writer.add_js(...)`), which
    `finalize_pdf.py` adds — works in Acrobat/Reader desktop only, inert
    (harmless) in Preview or a browser's built-in viewer.
12. **LibreOffice's default `--convert-to pdf` re-encodes embedded images
    as lossy JPEG**, even when the source was a clean PNG — pass
    `"UseLosslessCompression":{"type":"boolean","value":"true"}` in the
    export filter data to keep them lossless (Flate/PNG-style). For this
    kind of flat line-art/logo backdrop it usually comes out *smaller*
    than the JPEG version too, not just cleaner.

## Backdrop images

Full-page background art (cover + continuation) must be **2481×3508px
(A4 @ 300dpi), RGB, no alpha channel**. `kit.letterheadHeader(path)` floats
the image behind the page content at `(0,0)` relative to the page, sized to
exact A4 bleed (7562850×10696575 EMU) — this is the one part of the pipeline
that's been unchanged and working across every form built this way so far.

## Cover template

`assets/Voorblad Template PJ Professionals BV (blank).png` is the design
team's generic cover template with its guideline text (a "Titel"/"Sub titel"
placeholder and a "Versienummer: X / Versiedatum: Dag / Maand voluit / Jaar
/ Documenteigenaar: PJ Professionals" placeholder block) painted over with
white — the source `.ai` file in `documenten/stationary/` still has that
text baked in as a design guide for humans, it was never meant to ship as
page content. The logo, circle mark, tagline, hairline rule, and the
watermark PJ in the bottom-right are all untouched. Use this blank version
as the `first` header for any new form that doesn't have its own
client-supplied cover art (the Intakeformulier did; most forms probably
won't) — the real title and metadata belong in the docx as live text/fields
instead (see how `build_intake.js` put "Intakeformulier gespecialiseerde
begeleiding" as an `h1()` plus a real `infoTable` on the first content page,
right after the blank-backdrop cover page).

If the design team ships an updated `.ai`/`.png` for this template, re-crop
and white out the same two regions (title block, metadata block) before
dropping it in here — don't reuse the erase-script coordinates blindly if
the layout has changed; re-measure against the new PNG first.

## Palette / type reference

| Token | Hex | Role |
|---|---|---|
| `COLORS.headingText` | `0A2540` | Chapter/section heading text |
| `COLORS.labelText` | `0B3C5D` | Field-label text (bold) |
| `COLORS.bodyText` | `1A1A1A` | Filled-in body text |
| `COLORS.placeholder` | `6D8A99` | Italic placeholder inside empty fields |
| `COLORS.hint` | `5A6B78` | Small italic instructional hint under a bold label (8pt) |
| `COLORS.rule` | `2E86AB` | Heading bottom-border rule |
| `COLORS.border` | `D8E3E8` | Field-box border |
| `COLORS.valueBg` | `F3F9FC` | Field VALUE cell shading |
| `COLORS.labelBg` | `F4F7F9` | Field LABEL cell shading (also used for locked rows) |

Headings: Playfair Display, bold, 13.5pt. Body/fields: DM Sans, 10pt (labels)
/ 9-10pt (values). Fonts embedded from `public/fonts/playfair-display.ttf`
and `public/fonts/dmsans.ttf` (the same files the live site uses).

## Not yet ported

Zorgplan/Evaluatie also have a few more specialized patterns not pulled into
this kit yet, since the Intakeformulier didn't need them — ask for these to
be added if a future form does:
- Live character-counter fields paired with a big text field (keystroke JS
  writing "N tekens over" into a read-only sibling field).
- Rich-text/drawable signature fields (an empty Word drawing canvas instead
  of a plain-text content control, for Draw-tab ink signing).
- Word's native Repeating Section content control (`w15:repeatingSection`) —
  turned out to have real bugs (labels becoming editable on duplicate, no
  remove-UI in some Word builds) and was abandoned in favor of N static
  copies for anything that needed "add another one of these."
- PDF permission/encryption locking (`qpdf`/pikepdf) — investigated early on
  for a different document but abandoned; every shipped form so far is a
  plain unencrypted AcroForm PDF, which is what `finalize_pdf.py` produces.
