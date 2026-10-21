#!/usr/bin/env python3
"""Library for moving a legacy .docx onto the current PJ Professionals stationery.

Works directly on an UNPACKED docx directory (unzip first, zip afterwards):
  - strip old headers/footers/logos, add a full-page backdrop header + footer line
  - optional cover section (own backdrop, bound title/version fields)
  - page size / margins for every section
  - restyle fonts (DM Sans body, Playfair navy headings)
  - convert plain-text tick boxes, [placeholders], underscore lines, dot leaders
    and label-colon lines into real content controls (w14:checkbox, text, dropdown)

Import it from a per-document script; see build_pilot.py style usage in the plan.
"""
import re
import shutil
import uuid
from pathlib import Path

KIT = Path(__file__).resolve().parent.parent
ASSETS = KIT / "assets"

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
REL = "http://schemas.openxmlformats.org/package/2006/relationships"
BODY_FONT, HEAD_FONT = "DM Sans", "Playfair Display"
NAVY, NAVY2, INK, PLACEHOLDER, GREY = "0A2540", "0B3C5D", "1A1A1A", "6D8A99", "999999"
SYMBOL_FONTS = ("MS Gothic", "Segoe UI Symbol", "Wingdings", "Symbol")

A4 = (11906, 16838)
EMU_W, EMU_H = 7562850, 10696575  # A4 in EMU

NS_DECL = (
    f'xmlns:w="{W}" xmlns:r="{R}" '
    'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" '
    'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
    'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" '
    'xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" '
    'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="w14"'
)

_id = [7_000_000]


def next_id():
    _id[0] += 1
    return _id[0]


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


# ───────────────────────── package access ─────────────────────────
class Pkg:
    def __init__(self, directory):
        self.d = Path(directory)

    def read(self, rel):
        return (self.d / rel).read_text(encoding="utf-8")

    def write(self, rel, text):
        p = self.d / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8")

    @property
    def doc(self):
        return self.read("word/document.xml")

    @doc.setter
    def doc(self, v):
        self.write("word/document.xml", v)

    def add_rel(self, rels_path, rtype, target):
        rels = self.read(rels_path)
        ids = [int(i) for i in re.findall(r'Id="rId(\d+)"', rels)]
        rid = f"rId{max(ids + [0]) + 1}"
        rels = rels.replace("</Relationships>", f'<Relationship Id="{rid}" Type="{rtype}" Target="{target}"/></Relationships>')
        self.write(rels_path, rels)
        return rid

    def add_override(self, part, ctype):
        ct = self.read("[Content_Types].xml")
        if f'PartName="{part}"' not in ct:
            ct = ct.replace("</Types>", f'<Override PartName="{part}" ContentType="{ctype}"/></Types>')
        self.write("[Content_Types].xml", ct)

    def ensure_default(self, ext, ctype):
        ct = self.read("[Content_Types].xml")
        if f'Extension="{ext}"' not in ct:
            ct = ct.replace("<Override", f'<Default Extension="{ext}" ContentType="{ctype}"/><Override', 1)
        self.write("[Content_Types].xml", ct)


# ───────────────────────── stationery ─────────────────────────
def strip_old_stationery(pkg):
    """Remove every header/footer part (+rels, content types) and their references."""
    for f in list((pkg.d / "word").glob("header*.xml")) + list((pkg.d / "word").glob("footer*.xml")):
        f.unlink()
    for f in list((pkg.d / "word/_rels").glob("header*.xml.rels")) + list((pkg.d / "word/_rels").glob("footer*.xml.rels")):
        f.unlink()
    rels = pkg.read("word/_rels/document.xml.rels")
    rels = re.sub(r'<Relationship [^>]*relationships/(?:header|footer)"[^>]*/>', "", rels)
    pkg.write("word/_rels/document.xml.rels", rels)
    ct = pkg.read("[Content_Types].xml")
    ct = re.sub(r'<Override PartName="/word/(?:header|footer)\d*\.xml"[^>]*/>', "", ct)
    pkg.write("[Content_Types].xml", ct)
    pkg.doc = re.sub(r"<w:(?:header|footer)Reference [^>]*/>", "", pkg.doc)
    settings = pkg.read("word/settings.xml")
    settings = re.sub(r"<w:evenAndOddHeaders[^>]*/>", "", settings)
    pkg.write("word/settings.xml", settings)


def remove_orphan_media(pkg):
    """Delete word/media files no rels file references any more."""
    used = set()
    for rf in pkg.d.rglob("*.rels"):
        used.update(Path(m).name for m in re.findall(r'Target="[^"]*media/([^"]+)"', rf.read_text(encoding="utf-8")))
    media = pkg.d / "word/media"
    if media.exists():
        for f in media.iterdir():
            if f.name not in used:
                f.unlink()


def _anchor(rid, landscape=False, name="Backdrop"):
    cx, cy = (EMU_H, EMU_W) if landscape else (EMU_W, EMU_H)
    return (
        '<w:r><w:drawing><wp:anchor distT="0" distB="0" distL="0" distR="0" simplePos="0" relativeHeight="0" '
        'behindDoc="1" locked="0" layoutInCell="1" allowOverlap="1"><wp:simplePos x="0" y="0"/>'
        '<wp:positionH relativeFrom="page"><wp:posOffset>0</wp:posOffset></wp:positionH>'
        '<wp:positionV relativeFrom="page"><wp:posOffset>0</wp:posOffset></wp:positionV>'
        f'<wp:extent cx="{cx}" cy="{cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:wrapNone/>'
        f'<wp:docPr id="{next_id()}" name="{name}"/><wp:cNvGraphicFramePr/>'
        '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic>'
        f'<pic:nvPicPr><pic:cNvPr id="0" name="{name}.png"/><pic:cNvPicPr/></pic:nvPicPr>'
        f'<pic:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
        f'<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm>'
        '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic>'
        "</wp:anchor></w:drawing></w:r>"
    )


def add_backdrop_header(pkg, png_path, name, landscape=False):
    """Create a header part holding the full-page backdrop; returns its rId in document rels."""
    media_name = f"{name}.png"
    (pkg.d / "word/media").mkdir(parents=True, exist_ok=True)
    shutil.copy(png_path, pkg.d / "word/media" / media_name)
    pkg.ensure_default("png", "image/png")
    part = f"header_{name}.xml"
    pkg.write(f"word/_rels/{part}.rels", f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="{REL}"></Relationships>')
    rid_img = pkg.add_rel(f"word/_rels/{part}.rels", R + "/image", f"media/{media_name}")
    pkg.write(
        f"word/{part}",
        f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr {NS_DECL}>'
        f'<w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>{_anchor(rid_img, landscape, name)}</w:p></w:hdr>',
    )
    pkg.add_override(f"/word/{part}", "application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml")
    return pkg.add_rel("word/_rels/document.xml.rels", R + "/header", part)


def add_footer(pkg, name, paragraph_xml):
    part = f"footer_{name}.xml"
    pkg.write(
        f"word/{part}",
        f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr {NS_DECL}>{paragraph_xml}</w:ftr>',
    )
    pkg.add_override(f"/word/{part}", "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml")
    return pkg.add_rel("word/_rels/document.xml.rels", R + "/footer", part)


def _frun(text, size=16, color=GREY, bold=False, italic=False):
    b = "<w:b/><w:bCs/>" if bold else ""
    i = "<w:i/><w:iCs/>" if italic else ""
    return (f'<w:r><w:rPr><w:rFonts w:ascii="{BODY_FONT}" w:hAnsi="{BODY_FONT}" w:cs="{BODY_FONT}" w:eastAsia="{BODY_FONT}"/>'
            f'{b}{i}<w:color w:val="{color}"/><w:sz w:val="{size}"/><w:szCs w:val="{size}"/></w:rPr>'
            f'<w:t xml:space="preserve">{esc(text)}</w:t></w:r>')


def _field(instr, size=16, color=GREY):
    rpr = (f'<w:rPr><w:rFonts w:ascii="{BODY_FONT}" w:hAnsi="{BODY_FONT}" w:cs="{BODY_FONT}"/>'
           f'<w:color w:val="{color}"/><w:sz w:val="{size}"/><w:szCs w:val="{size}"/></w:rPr>')
    return (f'<w:r>{rpr}<w:fldChar w:fldCharType="begin"/></w:r><w:r>{rpr}<w:instrText xml:space="preserve"> {instr} </w:instrText></w:r>'
            f'<w:r>{rpr}<w:fldChar w:fldCharType="separate"/></w:r><w:r>{rpr}<w:t>1</w:t></w:r><w:r>{rpr}<w:fldChar w:fldCharType="end"/></w:r>')


def footer_paragraph(title=None, version=None, title_sdt=None, version_sdt=None, size=16, color=GREY, short_sep=None):
    """Centered footer line: PJ Professionals | titel | versie X | pagina N van M.
    Pass title_sdt/version_sdt (ready-made sdt xml, data-bound) to override the plain strings."""
    long_t = short_sep if short_sep is not None else len(title or "") > 40
    sep = _frun(" | " if long_t else "  |  ", size, color)
    parts = [_frun("PJ Professionals", size, color), sep,
             title_sdt if title_sdt else _frun(title or "", size, color), sep,
             *([_frun("versie ", size, color), version_sdt if version_sdt else _frun(version, size, color), sep] if (version or version_sdt) else []),
             _frun("pagina ", size, color), _field("PAGE", size, color), _frun(" van ", size, color), _field("NUMPAGES", size, color)]
    return '<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr>' + "".join(parts) + "</w:p>"


def set_sections(pkg, header_rid=None, footer_rid=None, size=A4, margins=None, landscape=False, titlepg=False):
    """Rewrite every sectPr: header/footer refs, page size, margins, columns reset."""
    m = margins or dict(top=2500, bottom=900, left=1300, right=1300, header=708, footer=708)
    w, h = size
    if landscape:
        w, h = h, w

    def fix(match):
        s = match.group(0)
        s = re.sub(r"<w:(?:header|footer)Reference [^>]*/>", "", s)
        s = re.sub(r"<w:titlePg[^>]*/>", "", s)
        s = re.sub(r"<w:cols[^>]*/>|<w:cols[^>]*>.*?</w:cols>", "", s, flags=re.S)
        refs = ""
        if header_rid:
            refs += f'<w:headerReference w:type="default" r:id="{header_rid}"/>'
        if footer_rid:
            refs += f'<w:footerReference w:type="default" r:id="{footer_rid}"/>'
        s = re.sub(r"(<w:sectPr[^>]*>)", lambda mm: mm.group(1) + refs, s, count=1)
        orient = ' w:orient="landscape"' if landscape else ""
        s = re.sub(r"<w:pgSz[^>]*/>", f'<w:pgSz w:w="{w}" w:h="{h}"{orient}/>', s)
        s = re.sub(r"<w:pgMar[^>]*/>",
                   f'<w:pgMar w:top="{m["top"]}" w:right="{m["right"]}" w:bottom="{m["bottom"]}" w:left="{m["left"]}" '
                   f'w:header="{m["header"]}" w:footer="{m["footer"]}" w:gutter="0"/>', s)
        if titlepg:
            s = s.replace("</w:sectPr>", "<w:titlePg/></w:sectPr>") if "<w:docGrid" not in s else s.replace("<w:docGrid", "<w:titlePg/><w:docGrid", 1)
        return s

    pkg.doc = re.sub(r"<w:sectPr[ >].*?</w:sectPr>", fix, pkg.doc, flags=re.S)


# ───────────────────────── typography ─────────────────────────
def restyle(pkg, body_size=20):
    """DM Sans body, Playfair navy headings; drop theme/explicit fonts from runs (symbol fonts stay)."""
    st = pkg.read("word/styles.xml")
    fonts = f'<w:rFonts w:ascii="{BODY_FONT}" w:hAnsi="{BODY_FONT}" w:cs="{BODY_FONT}" w:eastAsia="{BODY_FONT}"/>'
    st = re.sub(r"<w:rPrDefault>.*?</w:rPrDefault>",
                f'<w:rPrDefault><w:rPr>{fonts}<w:sz w:val="{body_size}"/><w:szCs w:val="{body_size}"/><w:lang w:val="nl-NL"/></w:rPr></w:rPrDefault>',
                st, flags=re.S)

    def style_fix(m):
        block = m.group(0)
        name = re.search(r'<w:name w:val="([^"]*)"', block)
        name = name.group(1).lower() if name else ""
        head = re.match(r"(heading \d|title|subtitle)$", name) is not None
        # drop explicit/theme fonts in every style, headings get Playfair
        block = re.sub(r"<w:rFonts[^>]*/>", "", block)
        if head:
            sizes = {"title": 44, "subtitle": 28, "heading 1": 32, "heading 2": 26, "heading 3": 22, "heading 4": 20}
            sz = sizes.get(name, 22)
            hfonts = f'<w:rFonts w:ascii="{HEAD_FONT}" w:hAnsi="{HEAD_FONT}" w:cs="{HEAD_FONT}" w:eastAsia="{HEAD_FONT}"/>'
            block = re.sub(r"<w:color[^>]*/>|<w:sz [^>]*/>|<w:szCs [^>]*/>|<w:b/>|<w:bCs/>", "", block)
            color = NAVY if name in ("title", "heading 1") else NAVY2
            ins = f'{hfonts}<w:b/><w:bCs/><w:color w:val="{color}"/><w:sz w:val="{sz}"/><w:szCs w:val="{sz}"/>'
            if "<w:rPr>" in block:
                block = block.replace("<w:rPr>", "<w:rPr>" + ins, 1)
            else:
                block = block.replace("</w:style>", f"<w:rPr>{ins}</w:rPr></w:style>")
        return block

    st = re.sub(r'<w:style [^>]*w:type="(?:paragraph|character|table)"[^>]*>.*?</w:style>', style_fix, st, flags=re.S)
    pkg.write("word/styles.xml", st)

    def run_fonts(m):
        tag = m.group(0)
        return tag if any(f in tag for f in SYMBOL_FONTS + (BODY_FONT, HEAD_FONT)) else ""

    for part in ["word/document.xml"] + [str(p.relative_to(pkg.d)) for p in (pkg.d / "word").glob("footnotes.xml")]:
        x = pkg.read(part)
        x = re.sub(r"<w:rFonts [^>]*/>", run_fonts, x)
        pkg.write(part, x)


def set_update_fields(pkg):
    s = pkg.read("word/settings.xml")
    if "w:updateFields" not in s:
        m = re.search(r"<w:(?:hdrShapeDefaults|footnotePr|endnotePr|compat|docVars|rsids|mathPr|themeFontLang|clrSchemeMapping)\b", s)
        at = m.start() if m else s.rindex("</w:settings>")
        s = s[:at] + '<w:updateFields w:val="true"/>' + s[at:]
    pkg.write("word/settings.xml", s)


# ───────────────────────── content controls ─────────────────────────
def _rpr(base_rpr=None, placeholder=False):
    if base_rpr:
        return base_rpr
    color = PLACEHOLDER if placeholder else INK
    i = "<w:i/><w:iCs/>" if placeholder else ""
    return (f'<w:rPr><w:rFonts w:ascii="{BODY_FONT}" w:hAnsi="{BODY_FONT}" w:cs="{BODY_FONT}" w:eastAsia="{BODY_FONT}"/>{i}'
            f'<w:color w:val="{color}"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>')


def _strip_rpr(rpr):
    """Take an existing rPr and make it placeholder-styled (italic grey)."""
    if not rpr:
        return _rpr(placeholder=True)
    r = re.sub(r"<w:(?:i|iCs|color|u)\b[^>]*/>", "", rpr)
    r = r.replace("</w:rPr>", f'<w:i/><w:iCs/><w:color w:val="{PLACEHOLDER}"/></w:rPr>')
    return r


def text_sdt(tag, placeholder="Klik hier om te typen.", multiline=False, base_rpr=None, bind=None, value=None):
    """Plain-text content control. value=None -> shows placeholder; value given -> pre-filled."""
    ph = value is None
    shown = placeholder if ph else value
    run_rpr = _strip_rpr(base_rpr) if ph else (base_rpr or _rpr())
    plc = '<w:placeholder><w:docPart w:val="DefaultPlaceholder1234567"/></w:placeholder><w:showingPlcHdr/>' if ph else ""
    rpr_sdt = base_rpr if base_rpr else _rpr()
    return (f'<w:sdt><w:sdtPr>{rpr_sdt}<w:alias w:val="{tag}"/><w:tag w:val="{tag}"/><w:id w:val="{next_id()}"/>'
            f'{plc}{bind or ""}<w:text w:multiLine="{1 if multiline else 0}"/></w:sdtPr><w:sdtEndPr/>'
            f'<w:sdtContent><w:r>{run_rpr}<w:t xml:space="preserve">{esc(shown)}</w:t></w:r></w:sdtContent></w:sdt>')


def checkbox_sdt(tag, base_rpr=None, checked=False):
    rpr = '<w:rPr><w:rFonts w:ascii="MS Gothic" w:eastAsia="MS Gothic" w:hAnsi="MS Gothic"/></w:rPr>'
    glyph = "\u2612" if checked else "\u2610"
    return (f'<w:sdt><w:sdtPr><w:alias w:val="{tag}"/><w:tag w:val="{tag}"/><w:id w:val="{next_id()}"/>'
            f'<w14:checkbox><w14:checked w14:val="{1 if checked else 0}"/><w14:checkedState w14:val="2612" w14:font="MS Gothic"/>'
            '<w14:uncheckedState w14:val="2610" w14:font="MS Gothic"/></w14:checkbox></w:sdtPr>'
            f'<w:sdtContent><w:r>{rpr}<w:t>{glyph}</w:t></w:r></w:sdtContent></w:sdt>')


def dropdown_sdt(tag, options, placeholder="Kies een optie.", base_rpr=None):
    items = "".join(f'<w:listItem w:displayText="{esc(o)}" w:value="{esc(o)}"/>' for o in options)
    return (f'<w:sdt><w:sdtPr>{base_rpr or _rpr()}<w:alias w:val="{tag}"/><w:tag w:val="{tag}"/><w:id w:val="{next_id()}"/>'
            '<w:placeholder><w:docPart w:val="DefaultPlaceholder1234567"/></w:placeholder><w:showingPlcHdr/>'
            f'<w:dropDownList>{items}</w:dropDownList></w:sdtPr><w:sdtEndPr/>'
            f'<w:sdtContent><w:r>{_strip_rpr(base_rpr)}<w:t xml:space="preserve">{esc(placeholder)}</w:t></w:r></w:sdtContent></w:sdt>')


def ensure_w14(pkg):
    x = pkg.doc
    root = re.search(r"<w:document [^>]*>", x).group(0)
    new = root
    if "xmlns:w14=" not in new:
        new = new.replace("<w:document ", '<w:document xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" ', 1)
    if "xmlns:mc=" not in new:
        new = new.replace("<w:document ", '<w:document xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" ', 1)
    m = re.search(r'mc:Ignorable="([^"]*)"', new)
    if m and "w14" not in m.group(1).split():
        new = new.replace(m.group(0), f'mc:Ignorable="{m.group(1)} w14"')
    elif not m:
        new = new.replace("<w:document ", '<w:document mc:Ignorable="w14" ', 1)
    pkg.doc = x.replace(root, new, 1)


# ───────────────────────── paragraph-level surgery ─────────────────────────
PARA_RE = re.compile(r"<w:p[ >](?:(?!<w:p[ >]).)*?</w:p>", re.S)
RUN_RE = re.compile(r"<w:r(?: [^>]*)?>(.*?)</w:r>", re.S)


def parse_paragraph(p):
    """Return (open_tag+pPr, [(char, rpr_xml)], ok). ok=False when the paragraph holds anything but plain runs."""
    m = re.match(r"(<w:p(?: [^>]*)?>)(<w:pPr>.*?</w:pPr>)?(.*)</w:p>$", p, re.S)
    head = m.group(1) + (m.group(2) or "")
    rest = m.group(3)
    rest = re.sub(r"<w:proofErr[^>]*/>|<w:bookmark(?:Start|End)[^>]*/>|<w:lastRenderedPageBreak/>", "", rest)
    chars = []
    pos = 0
    for rm in RUN_RE.finditer(rest):
        if rest[pos:rm.start()].strip():
            return head, [], False
        pos = rm.end()
        inner = rm.group(1)
        rpr = ""
        rp = re.match(r"(<w:rPr>.*?</w:rPr>)", inner, re.S)
        if rp:
            rpr = rp.group(1)
            inner = inner[len(rpr):]
        # allowed run content: w:t, w:tab, w:br (line)
        toks = re.findall(r"<w:t(?: [^>]*)?>([^<]*)</w:t>|(<w:tab/>)|(<w:br/>)|(<w:\w+[^>]*/?>)", inner)
        for t, tab, br, other in toks:
            if other:
                return head, [], False
            if tab:
                chars.append(("\t", rpr))
            elif br:
                chars.append(("\n", rpr))
            else:
                chars.extend((c, rpr) for c in (t.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")))
    if rest[pos:].strip():
        return head, [], False
    return head, chars, True


def _runs_xml(chars):
    out = []
    i = 0
    while i < len(chars):
        j = i
        while j < len(chars) and chars[j][1] == chars[i][1]:
            j += 1
        seg, rpr = "".join(c for c, _ in chars[i:j]), chars[i][1]
        parts = re.split(r"(\t|\n)", seg)
        inner = ""
        for part in parts:
            if part == "\t":
                inner += "<w:tab/>"
            elif part == "\n":
                inner += "<w:br/>"
            elif part:
                inner += f'<w:t xml:space="preserve">{esc(part)}</w:t>'
        out.append(f"<w:r>{rpr}{inner}</w:r>")
        i = j
    return "".join(out)


def rebuild_paragraph(head, chars, spans):
    """spans: sorted list of (start, end, xml_builder(rpr_of_first_char)->sdt xml). Everything else stays plain runs."""
    out = [head]
    cur = 0
    for s, e, builder in spans:
        if s > cur:
            out.append(_runs_xml(chars[cur:s]))
        out.append(builder(chars[s][1] if s < len(chars) else (chars[-1][1] if chars else "")))
        cur = e
    if cur < len(chars):
        out.append(_runs_xml(chars[cur:]))
    out.append("</w:p>")
    return "".join(out)


def convert_paragraphs(xml, finder, log=None):
    """finder(text) -> list of (start, end, builder). Applies to every plain-run paragraph; others are logged when matched."""
    count = [0]

    def sub(m):
        p = m.group(0)
        if "\u2610" not in p and "[" not in p and "_" not in p and "." not in p and ":" not in p and "Ja" not in p:
            return p
        head, chars, ok = parse_paragraph(p)
        if not ok:
            if log is not None and finder("".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", p))):
                log.append("skipped complex paragraph: " + "".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", p))[:70])
            return p
        text = "".join(c for c, _ in chars)
        spans = finder(text)
        if not spans:
            return p
        count[0] += len(spans)
        return rebuild_paragraph(head, chars, sorted(spans, key=lambda s: s[0]))

    return PARA_RE.sub(sub, xml), count[0]


def slug(s, maxlen=32):
    s = re.sub(r"[^a-z0-9]+", "_", s.lower().replace("ë", "e").replace("é", "e").replace("ï", "i")).strip("_")
    return s[:maxlen] or "veld"


# ───────────────────────── data-bound custom XML (cover ↔ footer) ─────────────────────────
class Binder:
    """One custom XML store; every bind key becomes a node. Call write(pkg) once at the end."""

    def __init__(self):
        self.store = "{" + str(uuid.uuid4()).upper() + "}"
        self.ns = "urn:pj-professionals:doc"
        self.keys = []
        self.values = {}

    def xml(self, key, value=""):
        if key not in self.keys:
            self.keys.append(key)
            self.values[key] = value
        return (f'<w:dataBinding w:prefixMappings="xmlns:ns0=\'{self.ns}\'" '
                f'w:xpath="/ns0:root[1]/ns0:{key}[1]" w:storeItemID="{self.store}"/>')

    def write(self, pkg):
        if not self.keys:
            return
        nodes = "".join(f"<ns0:{k}>{esc(self.values[k])}</ns0:{k}>" for k in self.keys)
        pkg.write("customXml/pjitem.xml", f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns0:root xmlns:ns0="{self.ns}">{nodes}</ns0:root>')
        pkg.write("customXml/pjitemProps.xml",
                  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                  f'<ds:datastoreItem ds:itemID="{self.store}" xmlns:ds="http://schemas.openxmlformats.org/officeDocument/2006/customXml">'
                  f'<ds:schemaRefs><ds:schemaRef ds:uri="{self.ns}"/></ds:schemaRefs></ds:datastoreItem>')
        pkg.write("customXml/_rels/pjitem.xml.rels",
                  f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="{REL}">'
                  f'<Relationship Id="rId1" Type="{R}/customXmlProps" Target="pjitemProps.xml"/></Relationships>')
        pkg.add_override("/customXml/pjitemProps.xml", "application/vnd.openxmlformats-officedocument.customXmlProperties+xml")
        pkg.add_rel("word/_rels/document.xml.rels", R + "/customXml", "../customXml/pjitem.xml")


# ───────────────────────── Beleid cover ─────────────────────────
def cover_rpr(size, bold=False, font=None, color=INK):
    font = font or BODY_FONT
    b = "<w:b/><w:bCs/>" if bold else ""
    return (f'<w:rPr><w:rFonts w:ascii="{font}" w:hAnsi="{font}" w:cs="{font}" w:eastAsia="{font}"/>{b}'
            f'<w:color w:val="{color}"/><w:sz w:val="{size}"/><w:szCs w:val="{size}"/></w:rPr>')


def cover_blocks(binder, title, subtitle, version, date, owner, title_size=None):
    """Cover paragraphs (bound fields) calibrated against 'Voorblad Template (blank)' backdrop."""
    import math
    def lines(text, size, factor):
        """Greedy word-wrap estimate: width = chars * factor * em, usable width 455 pt."""
        em = size / 2
        n, cur = 1, 0.0
        for w in text.split():
            wd = len(w) * factor * em
            if cur and cur + 0.3 * em + wd > 455:
                n, cur = n + 1, wd
            else:
                cur = cur + (0.3 * em if cur else 0) + wd
        return n
    ts = title_size
    sub_size = lambda t: 48 if t >= 80 else 40 if t >= 56 else 36 if t >= 44 else 32
    if not ts:
        # bold Playfair measures ~0.70 em/char, regular ~0.58 (calibrated on rendered covers).
        # Prefer the largest size that keeps the title on ONE line; else the largest that fits in 2 lines
        # with title+subtitle ending above the circle (< 3950 twips); else the smallest size.
        sizes = (80, 64, 56, 48, 44, 40, 36)
        def fits(c, max_tl):
            tl, sl = lines(title, c, 0.72), lines(subtitle, sub_size(c), 0.58)
            return tl <= max_tl and 700 + 100 + tl * int(c * 12.5) + sl * int(sub_size(c) * 12.5) <= 3950
        ts = next((c for c in sizes if fits(c, 1)), None) or next((c for c in sizes if fits(c, 2)), None) or 36
    t_rpr = cover_rpr(ts, True, HEAD_FONT)
    s_rpr = cover_rpr(sub_size(ts), False, HEAD_FONT)
    m_rpr = cover_rpr(20)
    # Every cover line gets an EXACT height so inherited line spacing (legacy docs default to 1.16x)
    # and font metrics (Word vs LibreOffice, installed vs fallback font) cannot move anything.
    ss = sub_size(ts)
    t_line, s_line = int(ts * 12.5), int(ss * 12.5)
    tl, sl = lines(title, ts, 0.72), lines(subtitle, ss, 0.58)
    before = 2006
    while before > 700 and before + 100 + tl * t_line + sl * s_line > 3950:
        before -= 100
    head = (f'<w:p><w:pPr><w:spacing w:before="{before}" w:after="0" w:line="{t_line}" w:lineRule="exact"/><w:jc w:val="center"/></w:pPr>'
            + text_sdt("titel", "Titel", base_rpr=t_rpr, bind=binder.xml("titel", title), value=title) + "</w:p>"
            + f'<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="{s_line}" w:lineRule="exact"/><w:jc w:val="center"/></w:pPr>'
            + text_sdt("subtitel", "Sub titel", base_rpr=s_rpr, bind=binder.xml("subtitel", subtitle), value=subtitle) + "</w:p>")
    # absolute target for the first version line: box top at 14760 twips from page top
    meta_before = 14760 - 100 - before - tl * t_line - sl * s_line

    def meta(label, sdt, before):
        return (f'<w:p><w:pPr><w:spacing w:before="{before}" w:after="0" w:line="210" w:lineRule="exact"/></w:pPr>'
                f'<w:r>{m_rpr}<w:t xml:space="preserve">{esc(label)}</w:t></w:r>{sdt}</w:p>')
    versie = meta("Versienummer: ", text_sdt("versienummer", "X", base_rpr=m_rpr, bind=binder.xml("versienummer", version), value=version or None), meta_before)
    datum = meta("Versiedatum: ", text_sdt("versiedatum", "Dag / Maand voluit / Jaar", base_rpr=m_rpr, bind=binder.xml("versiedatum", date), value=date or None), 20)
    eigenaar = (f'<w:p><w:pPr><w:spacing w:before="20" w:after="0" w:line="210" w:lineRule="exact"/></w:pPr>'
                f'<w:r>{m_rpr}<w:t xml:space="preserve">Documenteigenaar: {esc(owner)}</w:t></w:r></w:p>')
    return head + versie + datum + eigenaar


def cover_sectpr(header_rid):
    return (f'<w:p><w:pPr><w:spacing w:before="0" w:after="0"/><w:sectPr><w:headerReference w:type="default" r:id="{header_rid}"/>'
            f'<w:pgSz w:w="{A4[0]}" w:h="{A4[1]}"/><w:pgMar w:top="100" w:right="1300" w:bottom="100" w:left="1300" w:header="0" w:footer="0" w:gutter="0"/>'
            '<w:docGrid w:linePitch="360"/></w:sectPr></w:pPr></w:p>')


def footer_bound_sdts(binder, title, version):
    f_rpr = cover_rpr(16, False, BODY_FONT, GREY)
    return (text_sdt("footer_titel", "Titel", base_rpr=f_rpr, bind=binder.xml("titel", title), value=title),
            text_sdt("footer_versienummer", "X", base_rpr=f_rpr, bind=binder.xml("versienummer", version), value=version))


def find_cover_end(xml):
    """Index in xml where the original cover ends: the first TOC sdt, else the first Kop1/Heading1 paragraph."""
    body = xml.index("<w:body>") + len("<w:body>")
    for m in re.finditer(r"<w:sdt>", xml[body:]):
        at = body + m.start()
        if re.search(r'<w:docPartGallery w:val="Table of Contents"', xml[at:at + 1200]):
            # keep a heading paragraph ("Inhoud…") that sits directly in front of the TOC block
            prev = max(xml.rfind("<w:p>", body, at), xml.rfind("<w:p ", body, at))
            if prev != -1 and xml.find("</w:p>", prev, at) != -1 and xml.find("</w:p>", prev, at) + 6 >= at - 2:
                ptxt = "".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", xml[prev:at])).strip().lower()
                if ptxt.startswith("inhoud"):
                    return body, prev
            return body, at
    m = re.search(r'<w:p[ >](?:(?!</w:p>).)*?<w:pStyle w:val="(?:Kop1|Heading1)"', xml[body:], re.S)
    return body, body + m.start()


# ───────────────────────── table cells, drawings ─────────────────────────
def _cell_text(c):
    return "".join(re.findall(r"<w:t(?: [^>]*)?>([^<]*)</w:t>", c)).strip()


def fill_empty_cells(xml, tag_for, skip_tables=(), multiline=True):
    """Put a text content control in every empty answer cell. tag_for(label, table_idx, row, col) -> unique tag.
    Label = previous non-empty cell in the row, else the nearest non-empty cell above. Nested tables are skipped."""
    count = [0]
    tbl_idx = [-1]

    def do_table(tm):
        tbl_idx[0] += 1
        t = tm.group(0)
        if tbl_idx[0] in skip_tables or t.count("<w:tbl>") > 1:
            return t
        rows = re.findall(r"<w:tr[ >].*?</w:tr>", t, re.S)
        grid = [[_cell_text(c) for c in re.findall(r"<w:tc>.*?</w:tc>", r, re.S)] for r in rows]
        new_rows = []
        for ri, r in enumerate(rows):
            ci = [-1]

            def do_cell(cm, ri=ri, ci=ci):
                ci[0] += 1
                c = cm.group(0)
                if _cell_text(c) or re.search(r"w:drawing|w:pict|<w:sdt>|<w:tbl>", c):
                    return c
                label = ""
                for k in range(ci[0] - 1, -1, -1):
                    if grid[ri][k]:
                        label = grid[ri][k]; break
                if not label:
                    for k in range(ri - 1, -1, -1):
                        if ci[0] < len(grid[k]) and grid[k][ci[0]]:
                            label = grid[k][ci[0]]; break
                tag = tag_for(label, tbl_idx[0], ri, ci[0])
                sdt = text_sdt(tag, "Klik hier om te typen.", multiline=multiline)
                sm = re.search(r"<w:p(?: [^>]*)?/>", c)  # empty paragraphs are self-closing
                pm = re.search(r"<w:p[ >](?:(?!<w:p[ >]).)*?</w:p>", c, re.S)
                if sm and (not pm or sm.start() < pm.start()):
                    open_tag = sm.group(0)[:-2] + ">"
                    count[0] += 1
                    return c[: sm.start()] + open_tag + sdt + "</w:p>" + c[sm.end():]
                if not pm:
                    return c
                p = pm.group(0)
                newp = p[: -len("</w:p>")] + sdt + "</w:p>"
                count[0] += 1
                return c[: pm.start()] + newp + c[pm.end():]

            new_rows.append(re.sub(r"<w:tc>.*?</w:tc>", do_cell, r, flags=re.S))
        out = t
        for old_r, new_r in zip(rows, new_rows):
            out = out.replace(old_r, new_r, 1)
        return out

    return re.sub(r"<w:tbl>.*?</w:tbl>", do_table, xml, flags=re.S), count[0]


def remove_body_drawings(xml):
    """Drop inline/anchored pictures from body runs (old logos next to titles)."""
    return re.sub(r"<w:r(?: [^>]*)?>(?:<w:rPr>.*?</w:rPr>)?<w:drawing>.*?</w:drawing></w:r>", "", xml, flags=re.S)


# ───────────────────────── chapters start on a new page ─────────────────────────
def chapters_on_new_page(pkg):
    """Rule (docs/decisions.md): every Heading 1 (chapter) starts on a new page.
    - pageBreakBefore on the heading 1 style
    - empty Heading 1 paragraphs become normal paragraphs (else they would force blank pages)
    - a paragraph holding only a hard page break right before a Heading 1 is dropped (else double break)"""
    st = pkg.read("word/styles.xml")
    m = re.search(r'<w:style [^>]*w:styleId="([^"]+)"[^>]*>\s*<w:name w:val="heading 1"/>.*?</w:style>', st, re.S)
    if not m:
        return 0
    sid, block = m.group(1), m.group(0)
    new = block.replace("<w:pageBreakBefore/>", "")
    if "<w:pPr>" in new:
        at = re.search(r"<w:pPr>(?:<w:keepNext/>)?(?:<w:keepLines/>)?", new).end()
        new = new[:at] + "<w:pageBreakBefore/>" + new[at:]
    else:
        new = new.replace("<w:rPr>", "<w:pPr><w:pageBreakBefore/></w:pPr><w:rPr>", 1) if "<w:rPr>" in new else new.replace("</w:style>", "<w:pPr><w:pageBreakBefore/></w:pPr></w:style>")
    pkg.write("word/styles.xml", st.replace(block, new))

    x = pkg.doc
    n = [0]

    def fix(pm):
        p = pm.group(0)
        if f'<w:pStyle w:val="{sid}"/>' in p and not "".join(re.findall(r"<w:t(?: [^>]*)?>([^<]*)</w:t>", p)).strip():
            n[0] += 1
            return p.replace(f'<w:pStyle w:val="{sid}"/>', "")
        return p

    x = PARA_RE.sub(fix, x)
    # empty paragraphs and hard-page-break paragraphs directly before a chapter heading (else blank pages)
    ppr = r"(?:<w:pPr>(?:(?!</w:pPr>|<w:sectPr).)*</w:pPr>)?"
    run_ = r'(?:<w:r(?: [^>]*)?>(?:<w:rPr>(?:(?!</w:rPr>).)*</w:rPr>)?(?:<w:br w:type="page"/>|<w:lastRenderedPageBreak/>)?</w:r>)*'
    empty = rf'(?:<w:p(?: [^>]*)?/>|<w:p(?: [^>]*)?>{ppr}{run_}</w:p>)'
    head = rf'(?=<w:p[ >](?:(?!</w:p>).)*?<w:pStyle w:val="{sid}"/>)'
    x = re.sub(rf'(?:{empty})+{head}', "", x, flags=re.S)
    pkg.doc = x
    return n[0]
