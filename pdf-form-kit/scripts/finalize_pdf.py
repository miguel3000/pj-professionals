#!/usr/bin/env python3
"""Turn the LibreOffice-exported PDF into the final fillable AcroForm PDF.

LibreOffice's DOCX->PDF form-field export does NOT preserve the content
control's <w:tag> as the field's /T (partial name) -- it assigns generic
sequential names ("Widget", "_2", "_3", ...). It DOES however carry the
tag through as /TU (the field's tooltip / alternate name), so real field
names are recovered from there.

Also fixes a known LibreOffice checkbox-export quirk: /AP/N's two keys
come out named after the literal glyph characters (e.g. "/☐"/"/☒")
instead of the conventional "/Off"/"/Yes", which some strict viewers
require to match /AS correctly.

Also fixes a LibreOffice text-field sizing bug: a text field's exported
/Rect is sized to fit only its own placeholder text's natural width/height
(one line, as wide as the hint text), not the full visible shaded table
cell around it -- so the interactive box is a small fraction of what looks
clickable/typeable on the page. Fixed generically (not with hardcoded
per-form constants) by reading the actual shaded-cell rectangles straight
out of the PDF's vector content via pdfplumber, then snapping each text
field's /Rect to whichever shaded cell contains it, inset by the cell's
own tcMar (150 twips horizontal / 100 twips vertical -> 7.5pt / 5pt) so
the field's box lines up with where the cell's own text actually starts.

If a registry JSON (from inject_sdt.py) is passed, any field tagged
type "date" gets a native Acrobat calendar-picker action wired onto it
(AFDate_FormatEx, "d mmmm yyyy", with a JS-side Dutch month-name swap since
Acrobat's own month names follow the *application's* UI language, not
something a PDF can force). This only functions in Acrobat/Reader desktop
-- inert (but harmless) in Preview or a browser PDF viewer.

Usage: finalize_pdf.py <input.pdf> <output.pdf> [registry.json]
"""
import json
import sys

import pdfplumber
from pypdf import PdfReader, PdfWriter
from pypdf.generic import (
    NameObject, TextStringObject, BooleanObject, DictionaryObject,
    ArrayObject, FloatObject,
)

DATE_FORMAT = "d mmmm yyyy"
DATE_FORMAT_JS = (
    f'AFDate_FormatEx("{DATE_FORMAT}");'
    'var _d=new Date(event.value);if(!isNaN(_d.getTime())){'
    'var _m=["januari","februari","maart","april","mei","juni","juli",'
    '"augustus","september","oktober","november","december"];'
    'event.value=_d.getDate()+" "+_m[_d.getMonth()]+" "+_d.getFullYear();}'
)

# The two field-cell shading fills used throughout lib/docx-helpers.js
# (F3F9FC value cells, F4F7F9 label cells -- open text boxes also use the
# F3F9FC value fill), as the 0-1 RGB fractions pdfplumber reports.
SHADE_FILLS = [
    (0xF3 / 255, 0xF9 / 255, 0xFC / 255),
    (0xF4 / 255, 0xF7 / 255, 0xF9 / 255),
]
SHADE_TOLERANCE = 0.01
CELL_INSET_X = 7.5  # 150 twips
CELL_INSET_Y = 5.0  # 100 twips


def _color_matches(color, target, tol=SHADE_TOLERANCE):
    if not color or len(color) < 3:
        return False
    return all(abs(color[i] - target[i]) < tol for i in range(3))


def extract_shaded_rects(pdf_path):
    """Per page, every filled rectangle whose fill matches a known cell
    shading color, as (x0, y0, x1, y1) in PDF point space (bottom-left
    origin, matching /Rect)."""
    shaded_by_page = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_h = float(page.height)
            rects = []
            for r in page.rects:
                if not r.get("fill"):
                    continue
                color = r.get("non_stroking_color")
                if any(_color_matches(color, target) for target in SHADE_FILLS):
                    x0, x1 = float(r["x0"]), float(r["x1"])
                    top, bottom = float(r["top"]), float(r["bottom"])
                    rects.append((x0, page_h - bottom, x1, page_h - top))
            shaded_by_page.append(rects)
    return shaded_by_page


def find_containing_rect(rects, field_rect):
    fx0, fy0, fx1, fy1 = (float(v) for v in field_rect)
    cx, cy = (fx0 + fx1) / 2, (fy0 + fy1) / 2
    for x0, y0, x1, y1 in rects:
        if x0 <= cx <= x1 and y0 <= cy <= y1:
            return (x0, y0, x1, y1)
    return None


def main():
    in_path, out_path = sys.argv[1], sys.argv[2]
    registry = {}
    if len(sys.argv) > 3:
        with open(sys.argv[3], "r", encoding="utf-8") as f:
            registry = json.load(f)
    date_tags = {tag for tag, meta in registry.items() if meta.get("type") == "date"}

    shaded_by_page = extract_shaded_rects(in_path)

    reader = PdfReader(in_path)
    writer = PdfWriter()
    writer.append(reader)

    acroform = writer._root_object["/AcroForm"]

    renamed = 0
    checkbox_fixed = 0
    date_fields = 0
    resized = 0
    for page_index, page in enumerate(writer.pages):
        annots = page.get("/Annots")
        if not annots:
            continue
        page_rects = shaded_by_page[page_index] if page_index < len(shaded_by_page) else []
        for a in annots:
            obj = a.get_object()
            if obj.get("/Subtype") != "/Widget":
                continue
            tu = obj.get("/TU")
            if tu:
                obj[NameObject("/T")] = TextStringObject(str(tu))
                renamed += 1

            ft = obj.get("/FT")
            if ft == "/Tx":
                obj[NameObject("/DA")] = TextStringObject("0 0 0 rg /Helv 10 Tf")
                # LibreOffice's DOCX import doesn't understand w:showingPlcHdr
                # as "this is a placeholder, not real content" -- it bakes the
                # sdtContent placeholder run in as the field's literal /V (and
                # /DV), so every field opens pre-filled with its own hint text
                # that has to be manually deleted before typing. Clear both.
                obj[NameObject("/V")] = TextStringObject("")
                if "/DV" in obj:
                    obj[NameObject("/DV")] = TextStringObject("")
                # LibreOffice's exported /AP for a text field is a cached
                # appearance stream (showing the placeholder text baked into
                # the page) that's out of sync with /DA + NeedAppearances --
                # Acrobat displays that stale stream while a field has focus
                # and only regenerates on save, making live typing look
                # invisible. Deleting /AP entirely leaves nothing to display
                # except a live, NeedAppearances-driven render.
                if "/AP" in obj:
                    del obj[NameObject("/AP")]
                # Snap the widget's /Rect to the shaded cell it visually
                # sits inside -- LibreOffice sized it to its own placeholder
                # text instead, leaving a tiny sliver of the real box
                # actually clickable/typeable.
                container = find_containing_rect(page_rects, obj["/Rect"])
                if container:
                    x0, y0, x1, y1 = container
                    obj[NameObject("/Rect")] = ArrayObject(
                        [
                            FloatObject(x0 + CELL_INSET_X),
                            FloatObject(y0 + CELL_INSET_Y),
                            FloatObject(x1 - CELL_INSET_X),
                            FloatObject(y1 - CELL_INSET_Y),
                        ]
                    )
                    resized += 1
                if tu and str(tu) in date_tags:
                    aa = DictionaryObject()
                    fmt = DictionaryObject()
                    fmt[NameObject("/S")] = NameObject("/JavaScript")
                    fmt[NameObject("/JS")] = TextStringObject(DATE_FORMAT_JS)
                    aa[NameObject("/F")] = fmt
                    obj[NameObject("/AA")] = aa
                    date_fields += 1
            elif ft == "/Btn":
                ap = obj.get("/AP")
                n = ap.get("/N") if ap else None
                if n is not None:
                    keys = list(n.keys())
                    # Two non-conventional keys -> one is "off" (unchecked), one
                    # is "on" (checked). Figure out which is which the same way
                    # the checkbox glyph itself encodes it: the unchecked glyph
                    # (U+2610 empty box) vs the checked glyph (U+2612/2611).
                    needs_fix = any(k not in ("/Off", "/Yes") for k in keys)
                    if needs_fix and len(keys) == 2:
                        # Unchecked glyph is U+2610 (☐, empty box); the other
                        # key (U+2611/2612, a checked box) is "on".
                        unchecked_key = next((k for k in keys if len(k) == 2 and ord(k[1]) == 0x2610), None)
                        checked_key = next((k for k in keys if k != unchecked_key), None)
                        if unchecked_key and checked_key:
                            stream_off = n.raw_get(unchecked_key)
                            stream_on = n.raw_get(checked_key)
                            new_n = n.__class__()
                            new_n[NameObject("/Off")] = stream_off
                            new_n[NameObject("/Yes")] = stream_on
                            ap[NameObject("/N")] = new_n
                            obj[NameObject("/AS")] = NameObject("/Off")
                            checkbox_fixed += 1

    # Every /Tx field's /DA references /Helv, but LibreOffice's own export
    # only ever needed its Type3 design fonts + checkbox symbol font in
    # /AcroForm/DR/Font -- /Helv itself was never declared there, which
    # made viewers/renderers unable to resolve it ("Unknown font tag Helv")
    # when regenerating field appearances under NeedAppearances. Standard
    # Helvetica needs no embedded font program, just the resource entry.
    dr = acroform.get("/DR")
    dr = dr.get_object() if dr is not None else None
    if dr is not None:
        dr_font = dr.get("/Font")
        dr_font = dr_font.get_object() if dr_font is not None else None
        if dr_font is not None and "/Helv" not in dr_font:
            helv = DictionaryObject()
            helv[NameObject("/Type")] = NameObject("/Font")
            helv[NameObject("/Subtype")] = NameObject("/Type1")
            helv[NameObject("/BaseFont")] = NameObject("/Helvetica")
            helv[NameObject("/Encoding")] = NameObject("/WinAnsiEncoding")
            dr_font[NameObject("/Helv")] = writer._add_object(helv)

    acroform[NameObject("/NeedAppearances")] = BooleanObject(True)

    # Acrobat/Reader paints its own persistent blue "Highlight Fields"
    # tint over every form field by default -- that's a per-viewer
    # preference (Preferences > Forms), not something baked into the PDF,
    # so it survives filling in and saving the form. The one embeddable
    # fix is a document-level JavaScript action that runs on open and
    # turns the highlight off for THIS document specifically, for anyone
    # opening it in Acrobat/Reader (inert in Preview or a browser viewer,
    # same class of limitation as every other Acrobat-JS feature here).
    writer.add_js("app.runtimeHighlight = false;")

    with open(out_path, "wb") as f:
        writer.write(f)

    print(f"renamed {renamed} field(s) from /TU, resized {resized} field(s) to their cell, fixed {checkbox_fixed} checkbox appearance dict(s), wired {date_fields} date picker(s)")
    print(f"wrote {out_path}")


if __name__ == "__main__":
    main()
