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

from pypdf import PdfReader, PdfWriter
from pypdf.generic import (
    NameObject, TextStringObject, BooleanObject, DictionaryObject,
)

DATE_FORMAT = "d mmmm yyyy"
DATE_FORMAT_JS = (
    f'AFDate_FormatEx("{DATE_FORMAT}");'
    'var _d=new Date(event.value);if(!isNaN(_d.getTime())){'
    'var _m=["januari","februari","maart","april","mei","juni","juli",'
    '"augustus","september","oktober","november","december"];'
    'event.value=_d.getDate()+" "+_m[_d.getMonth()]+" "+_d.getFullYear();}'
)


def main():
    in_path, out_path = sys.argv[1], sys.argv[2]
    registry = {}
    if len(sys.argv) > 3:
        with open(sys.argv[3], "r", encoding="utf-8") as f:
            registry = json.load(f)
    date_tags = {tag for tag, meta in registry.items() if meta.get("type") == "date"}

    reader = PdfReader(in_path)
    writer = PdfWriter()
    writer.append(reader)

    acroform = writer._root_object["/AcroForm"]
    fields = acroform["/Fields"]

    renamed = 0
    checkbox_fixed = 0
    date_fields = 0
    for f in fields:
        obj = f.get_object()
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

    with open(out_path, "wb") as f:
        writer.write(f)

    print(f"renamed {renamed} field(s) from /TU, fixed {checkbox_fixed} checkbox appearance dict(s), wired {date_fields} date picker(s)")
    print(f"wrote {out_path}")


if __name__ == "__main__":
    main()
