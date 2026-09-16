#!/usr/bin/env python3
"""Swap ⟦FIELD:...⟧ / ⟦DATEFIELD:...⟧ / ⟦CHECKBOX:...⟧ markers for real
content controls.

⟦FIELD:tag|multiline(0/1)|placeholder text⟧  -> plain-text <w:sdt>
⟦DATEFIELD:tag|placeholder text⟧              -> plain-text <w:sdt>, tagged
                                                  "date" in the registry so
                                                  finalize_pdf.py can wire a
                                                  native calendar picker
⟦CHECKBOX:tag⟧                                -> w14:checkbox <w:sdt>

Usage: inject_sdt.py <unpacked_dir> <registry_out.json>
"""
import re
import sys
import json

FIELD_RE = re.compile(
    r'<w:r>(?:(?!<w:r>).)*?<w:t[^>]*>⟦FIELD:([a-zA-Z0-9_]+)\|([01])\|([^⟧]*)⟧</w:t></w:r>',
    re.DOTALL,
)
DATEFIELD_RE = re.compile(
    r'<w:r>(?:(?!<w:r>).)*?<w:t[^>]*>⟦DATEFIELD:([a-zA-Z0-9_]+)\|([^⟧]*)⟧</w:t></w:r>',
    re.DOTALL,
)
CHECKBOX_RE = re.compile(
    r'<w:r>(?:(?!<w:r>).)*?<w:t[^>]*>⟦CHECKBOX:([a-zA-Z0-9_]+)⟧</w:t></w:r>',
    re.DOTALL,
)

NAVY_LABEL = "0B3C5D"
BODY_TEXT = "1A1A1A"
PLACEHOLDER = "6D8A99"
BODY_FONT = "DM Sans"

_id_counter = [3000]
def next_id():
    _id_counter[0] += 1
    return _id_counter[0]


def rpr(font=BODY_FONT, color=BODY_TEXT, size=20, italic=False):
    i = "<w:i/><w:iCs/>" if italic else ""
    return (
        f'<w:rPr><w:rFonts w:ascii="{font}" w:cs="{font}" w:eastAsia="{font}" w:hAnsi="{font}"/>'
        f'{i}<w:color w:val="{color}"/><w:sz w:val="{size}"/><w:szCs w:val="{size}"/></w:rPr>'
    )


def xml_escape(text):
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def make_field_sdt(tag, multiline, placeholder):
    sid = next_id()
    field_rpr = rpr()
    placeholder_rpr = rpr(color=PLACEHOLDER, italic=True)
    ml = "1" if multiline == "1" else "0"
    esc_placeholder = xml_escape(placeholder)
    return (
        "<w:sdt><w:sdtPr>"
        f"{field_rpr}"
        f'<w:alias w:val="{tag}"/><w:tag w:val="{tag}"/><w:id w:val="{sid}"/>'
        '<w:placeholder><w:docPart w:val="DefaultPlaceholder1234567"/></w:placeholder>'
        "<w:showingPlcHdr/>"
        f'<w:text w:multiLine="{ml}"/>'
        "</w:sdtPr><w:sdtEndPr/><w:sdtContent>"
        f'<w:r>{placeholder_rpr}<w:t xml:space="preserve">{esc_placeholder}</w:t></w:r>'
        "</w:sdtContent></w:sdt>"
    )


def make_checkbox_sdt(tag):
    sid = next_id()
    return (
        "<w:sdt><w:sdtPr>"
        f'<w:alias w:val="{tag}"/><w:tag w:val="{tag}"/><w:id w:val="{sid}"/>'
        "<w14:checkbox>"
        '<w14:checked w14:val="0"/>'
        '<w14:checkedState w14:val="2612" w14:font="MS Gothic"/>'
        '<w14:uncheckedState w14:val="2610" w14:font="MS Gothic"/>'
        "</w14:checkbox>"
        "</w:sdtPr><w:sdtContent>"
        '<w:r><w:sym w:char="2610" w:font="MS Gothic"/></w:r>'
        "</w:sdtContent></w:sdt>"
    )


def main():
    unpacked_dir = sys.argv[1]
    registry_out = sys.argv[2]
    doc_path = f"{unpacked_dir}/word/document.xml"

    with open(doc_path, "r", encoding="utf-8") as f:
        xml = f.read()

    registry = {}

    def field_sub(m):
        tag, multiline, placeholder = m.group(1), m.group(2), m.group(3)
        registry[tag] = {"type": "text", "multiline": multiline == "1"}
        return make_field_sdt(tag, multiline, placeholder)

    def datefield_sub(m):
        tag, placeholder = m.group(1), m.group(2)
        registry[tag] = {"type": "date", "multiline": False}
        return make_field_sdt(tag, "0", placeholder)

    def checkbox_sub(m):
        tag = m.group(1)
        registry[tag] = {"type": "checkbox"}
        return make_checkbox_sdt(tag)

    xml, n_fields = FIELD_RE.subn(field_sub, xml)
    xml, n_dates = DATEFIELD_RE.subn(datefield_sub, xml)
    xml, n_checkboxes = CHECKBOX_RE.subn(checkbox_sub, xml)

    # w14/w15 namespaces + mc:Ignorable must be declared on the document root
    # for the checkbox content controls to be valid/ignorable by non-aware
    # readers.
    if 'xmlns:w14=' not in xml:
        xml = xml.replace(
            "<w:document ",
            '<w:document xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" ',
            1,
        )
    m = re.search(r'mc:Ignorable="([^"]*)"', xml)
    if m and "w14" not in m.group(1).split():
        xml = xml.replace(m.group(0), f'mc:Ignorable="{m.group(1)} w14"', 1)
    elif not m:
        xml = xml.replace("<w:document ", '<w:document mc:Ignorable="w14" ', 1)

    with open(doc_path, "w", encoding="utf-8") as f:
        f.write(xml)

    with open(registry_out, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2, ensure_ascii=False)

    print(f"injected {n_fields} field sdt(s), {n_dates} date field sdt(s), {n_checkboxes} checkbox sdt(s)")
    print(f"registry: {len(registry)} entries -> {registry_out}")


if __name__ == "__main__":
    main()
