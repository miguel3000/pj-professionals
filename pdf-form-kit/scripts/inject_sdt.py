#!/usr/bin/env python3
"""Swap ⟦FIELD:...⟧ / ⟦DATEFIELD:...⟧ / ⟦CHECKBOX:...⟧ markers for real
content controls.

⟦FIELD:tag|multiline(0/1)|placeholder text⟧  -> plain-text <w:sdt>
⟦DATEFIELD:tag|placeholder text⟧              -> plain-text <w:sdt>, tagged
                                                  "date" in the registry so
                                                  finalize_pdf.py can wire a
                                                  native calendar picker
⟦CHECKBOX:tag⟧                                -> w14:checkbox <w:sdt>

Optional trailing segments on ⟦FIELD⟧: |STYLE:size=80,bold=1,font=X and
|BIND:key. Every field sharing the same BIND key is data-bound to one node
of a generated custom XML part, so editing one (e.g. a cover-page title)
updates every other one (e.g. a footer line on every later page) live.
Markers are processed in word/document.xml AND every header*/footer*.xml.

Usage: inject_sdt.py <unpacked_dir> <registry_out.json>
"""
import glob
import os
import re
import sys
import json
import uuid

FIELD_RE = re.compile(
    r'<w:r>(?:(?!<w:r>).)*?<w:t[^>]*>⟦FIELD:([a-zA-Z0-9_]+)\|([01])\|([^⟧|]*)(?:\|STYLE:([^⟧|]*))?(?:\|BIND:([a-zA-Z0-9_]+))?⟧</w:t></w:r>',
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


def rpr(font=BODY_FONT, color=BODY_TEXT, size=20, italic=False, bold=False):
    i = "<w:i/><w:iCs/>" if italic else ""
    b = "<w:b/><w:bCs/>" if bold else ""
    return (
        f'<w:rPr><w:rFonts w:ascii="{font}" w:cs="{font}" w:eastAsia="{font}" w:hAnsi="{font}"/>'
        f'{b}{i}<w:color w:val="{color}"/><w:sz w:val="{size}"/><w:szCs w:val="{size}"/></w:rPr>'
    )


def xml_escape(text):
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


NS_URI = "urn:pj-professionals:template"
STORE_ID = "{" + str(uuid.uuid4()).upper() + "}"
BINDINGS = []  # ordered unique bind keys


def binding_xml(bind):
    if not bind:
        return ""
    if bind not in BINDINGS:
        BINDINGS.append(bind)
    return (
        f'<w:dataBinding w:prefixMappings="xmlns:ns0=\'{NS_URI}\'" '
        f'w:xpath="/ns0:root[1]/ns0:{bind}[1]" w:storeItemID="{STORE_ID}"/>'
    )


def parse_style(style_str):
    """'size=80,bold=1,font=Playfair Display' -> {'size': 80, 'bold': True, 'font': 'Playfair Display'}"""
    if not style_str:
        return {}
    style = {}
    for part in style_str.split(","):
        if "=" not in part:
            continue
        key, val = part.split("=", 1)
        key = key.strip()
        val = val.strip()
        if key == "size":
            style["size"] = int(val)
        elif key == "bold":
            style["bold"] = val == "1"
        elif key in ("font", "color"):
            style[key] = val
    return style


def make_field_sdt(tag, multiline, placeholder, style=None, bind=None):
    style = style or {}
    sid = next_id()
    field_rpr = rpr(
        font=style.get("font", BODY_FONT),
        color=style.get("color", BODY_TEXT),
        size=style.get("size", 20),
        bold=style.get("bold", False),
    )
    placeholder_rpr = rpr(
        font=style.get("font", BODY_FONT),
        color=PLACEHOLDER,
        size=style.get("size", 20),
        bold=style.get("bold", False),
        italic=True,
    )
    ml = "1" if multiline == "1" else "0"
    esc_placeholder = xml_escape(placeholder)
    return (
        "<w:sdt><w:sdtPr>"
        f"{field_rpr}"
        f'<w:alias w:val="{tag}"/><w:tag w:val="{tag}"/><w:id w:val="{sid}"/>'
        '<w:placeholder><w:docPart w:val="DefaultPlaceholder1234567"/></w:placeholder>'
        "<w:showingPlcHdr/>"
        f"{binding_xml(bind)}"
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


def write_custom_xml(unpacked_dir):
    """Generate the custom XML part every BIND key points at, and wire it
    into the package (part, props part, rels, content type, doc relationship)."""
    if not BINDINGS:
        return
    os.makedirs(f"{unpacked_dir}/customXml/_rels", exist_ok=True)
    nodes = "".join(f"<ns0:{b}/>" for b in BINDINGS)
    with open(f"{unpacked_dir}/customXml/item1.xml", "w", encoding="utf-8") as f:
        f.write(f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns0:root xmlns:ns0="{NS_URI}">{nodes}</ns0:root>')
    with open(f"{unpacked_dir}/customXml/itemProps1.xml", "w", encoding="utf-8") as f:
        f.write(
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            f'<ds:datastoreItem ds:itemID="{STORE_ID}" xmlns:ds="http://schemas.openxmlformats.org/officeDocument/2006/customXml">'
            f'<ds:schemaRefs><ds:schemaRef ds:uri="{NS_URI}"/></ds:schemaRefs></ds:datastoreItem>'
        )
    with open(f"{unpacked_dir}/customXml/_rels/item1.xml.rels", "w", encoding="utf-8") as f:
        f.write(
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXmlProps" Target="itemProps1.xml"/>'
            "</Relationships>"
        )
    ct_path = f"{unpacked_dir}/[Content_Types].xml"
    ct = open(ct_path, encoding="utf-8").read()
    ct = ct.replace(
        "</Types>",
        '<Override PartName="/customXml/itemProps1.xml" ContentType="application/vnd.openxmlformats-officedocument.customXmlProperties+xml"/></Types>',
    )
    open(ct_path, "w", encoding="utf-8").write(ct)
    rels_path = f"{unpacked_dir}/word/_rels/document.xml.rels"
    rels = open(rels_path, encoding="utf-8").read()
    rels = rels.replace(
        "</Relationships>",
        '<Relationship Id="rIdCustomXml1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml" Target="../customXml/item1.xml"/></Relationships>',
    )
    open(rels_path, "w", encoding="utf-8").write(rels)


def main():
    unpacked_dir = sys.argv[1]
    registry_out = sys.argv[2]
    parts = [f"{unpacked_dir}/word/document.xml"]
    parts += sorted(glob.glob(f"{unpacked_dir}/word/header*.xml"))
    parts += sorted(glob.glob(f"{unpacked_dir}/word/footer*.xml"))

    registry = {}

    def field_sub(m):
        tag, multiline, placeholder, style_str, bind = (m.group(i) for i in range(1, 6))
        registry[tag] = {"type": "text", "multiline": multiline == "1"}
        if bind:
            registry[tag]["bind"] = bind
        return make_field_sdt(tag, multiline, placeholder, parse_style(style_str), bind)

    def datefield_sub(m):
        tag, placeholder = m.group(1), m.group(2)
        registry[tag] = {"type": "date", "multiline": False}
        return make_field_sdt(tag, "0", placeholder)

    def checkbox_sub(m):
        tag = m.group(1)
        registry[tag] = {"type": "checkbox"}
        return make_checkbox_sdt(tag)

    n_fields = n_dates = n_checkboxes = 0
    for path in parts:
        with open(path, "r", encoding="utf-8") as f:
            xml = f.read()
        xml, a = FIELD_RE.subn(field_sub, xml)
        xml, b = DATEFIELD_RE.subn(datefield_sub, xml)
        xml, c = CHECKBOX_RE.subn(checkbox_sub, xml)
        n_fields += a; n_dates += b; n_checkboxes += c
        if a + b + c:
            # w14 must be declared + ignorable on every part that now holds
            # checkbox controls (and harmlessly on the rest).
            root = "<w:document " if path.endswith("document.xml") else ("<w:hdr " if "header" in path else "<w:ftr ")
            if 'xmlns:w14=' not in xml:
                xml = xml.replace(root, root + 'xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" ', 1)
            m = re.search(r'mc:Ignorable="([^"]*)"', xml)
            if m and "w14" not in m.group(1).split():
                xml = xml.replace(m.group(0), f'mc:Ignorable="{m.group(1)} w14"', 1)
            elif not m and 'xmlns:mc=' in xml:
                xml = xml.replace(root, root + 'mc:Ignorable="w14" ', 1)
        with open(path, "w", encoding="utf-8") as f:
            f.write(xml)

    write_custom_xml(unpacked_dir)

    with open(registry_out, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2, ensure_ascii=False)

    print(f"injected {n_fields} field sdt(s), {n_dates} date field sdt(s), {n_checkboxes} checkbox sdt(s), {len(BINDINGS)} bound node(s)")
    print(f"registry: {len(registry)} entries -> {registry_out}")


if __name__ == "__main__":
    main()
