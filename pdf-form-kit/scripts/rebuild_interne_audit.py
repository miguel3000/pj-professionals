"""audit.py <out.docx> [toc.json] : rebuild 'Interne audit 2026' from extracted content (/tmp/audit*.json)
as a clean document: cover, TOC, portrait section 1, landscape findings table with real checkboxes."""
import sys, re, json, shutil, subprocess, zipfile, os
from pathlib import Path

sys.path.insert(0, "/Users/pumpkin/Claude/pj-professionals/pdf-form-kit/scripts")
import restyle_docx as rd

KIT = rd.KIT
SRC = "/Users/pumpkin/Claude/pj-professionals/documenten/Replace for new stationary/Beleid/Interne audit 2026.docx"
out = sys.argv[1]
toc_pages = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else {}

TITLE, SUBTITLE, VERSION, DATE, OWNER = "Interne audit 2026", "Rapport - status: definitief", "", "24 maart 2026", "PJ Professionals"
esc = rd.esc
INK, NAVY, NAVY2, BORDER, LABELBG = rd.INK, rd.NAVY, rd.NAVY2, "D8E3E8", "F4F7F9"

d = {x["i"]: x for x in json.load(open("/tmp/audit.json"))}
tables = json.load(open("/tmp/audit_tbl.json"))[1:]  # drop the old cover table

# ───────────── package ─────────────
work = Path("work_audit")
shutil.rmtree(work, ignore_errors=True)
with zipfile.ZipFile(SRC) as z:
    z.extractall(work)
shutil.rmtree(work / "word/media", ignore_errors=True)
pkg = rd.Pkg(work)
rels = pkg.read("word/_rels/document.xml.rels")
rels = re.sub(r'<Relationship [^>]*relationships/image"[^>]*/>', "", rels)
pkg.write("word/_rels/document.xml.rels", rels)
rd.strip_old_stationery(pkg)
binder = rd.Binder()
body_hdr = rd.add_backdrop_header(pkg, KIT / "assets/Briefpapier Formulier PJ Professionals.png", "backdrop")
land_hdr = rd.add_backdrop_header(pkg, KIT / "assets/Briefpapier Formulier landscape.png", "backdrop_land", landscape=True)
cover_hdr = rd.add_backdrop_header(pkg, KIT / "assets/Voorblad Template PJ Professionals BV (blank).png", "cover")
t_sdt = rd.text_sdt("footer_titel", "Titel", base_rpr=rd.cover_rpr(16, False, rd.BODY_FONT, rd.GREY), bind=binder.xml("titel", TITLE), value=TITLE)
v_sdt = rd.text_sdt("footer_versienummer", "X", base_rpr=rd.cover_rpr(16, False, rd.BODY_FONT, rd.GREY), bind=binder.xml("versienummer", VERSION))
ftr = rd.add_footer(pkg, "beleid", rd.footer_paragraph(title_sdt=t_sdt, version_sdt=v_sdt, short_sep=False))

# clean styles + one bullet list definition (the PDF export left 20 junk styles / 37 list definitions)
F = lambda f: f'<w:rFonts w:ascii="{f}" w:hAnsi="{f}" w:cs="{f}" w:eastAsia="{f}"/>'
def pstyle(sid, name, ppr="", rpr="", based="Standaard", nxt=None, ui=None, extra=""):
    return (f'<w:style w:type="paragraph" w:styleId="{sid}"><w:name w:val="{name}"/>' + (f'<w:basedOn w:val="{based}"/>' if based else "")
            + (f'<w:next w:val="{nxt}"/>' if nxt else "") + (f'<w:uiPriority w:val="{ui}"/>' if ui else "") + "<w:qFormat/>"
            + (f"<w:pPr>{ppr}</w:pPr>" if ppr else "") + (f"<w:rPr>{rpr}</w:rPr>" if rpr else "") + "</w:style>")
styles = (
    f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="{rd.W}">'
    f'<w:docDefaults><w:rPrDefault><w:rPr>{F(rd.BODY_FONT)}<w:sz w:val="20"/><w:szCs w:val="20"/><w:lang w:val="nl-NL" w:eastAsia="nl-NL" w:bidi="ar-SA"/></w:rPr></w:rPrDefault>'
    '<w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>'
    '<w:style w:type="paragraph" w:default="1" w:styleId="Standaard"><w:name w:val="Normal"/><w:qFormat/></w:style>'
    '<w:style w:type="character" w:default="1" w:styleId="Standaardalinea-lettertype"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style>'
    '<w:style w:type="table" w:default="1" w:styleId="Standaardtabel"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/>'
    '<w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>'
    '<w:style w:type="numbering" w:default="1" w:styleId="Geenlijst"><w:name w:val="No List"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/></w:style>'
    + pstyle("Kop1", "heading 1", '<w:keepNext/><w:keepLines/><w:spacing w:before="360" w:after="120"/><w:outlineLvl w:val="0"/>',
             f'{F(rd.HEAD_FONT)}<w:b/><w:bCs/><w:color w:val="{NAVY}"/><w:sz w:val="32"/><w:szCs w:val="32"/>', nxt="Standaard", ui=9)
    + pstyle("Kop2", "heading 2", '<w:keepNext/><w:keepLines/><w:spacing w:before="280" w:after="80"/><w:outlineLvl w:val="1"/>',
             f'{F(rd.HEAD_FONT)}<w:b/><w:bCs/><w:color w:val="{NAVY2}"/><w:sz w:val="26"/><w:szCs w:val="26"/>', nxt="Standaard", ui=9)
    + pstyle("Inleiding", "Intro", '<w:spacing w:after="160"/>', f'<w:i/><w:iCs/><w:color w:val="{NAVY2}"/><w:sz w:val="22"/><w:szCs w:val="22"/>', ui=10)
    + pstyle("Inhoudskop", "Inhoudskop", '<w:keepNext/><w:spacing w:before="0" w:after="240"/>', f'{F(rd.HEAD_FONT)}<w:b/><w:bCs/><w:color w:val="{NAVY}"/><w:sz w:val="32"/><w:szCs w:val="32"/>', ui=10)
    + pstyle("Lijstalinea", "List Paragraph", '<w:numPr><w:numId w:val="1"/></w:numPr><w:spacing w:after="30"/><w:contextualSpacing/>', ui=34)
    + pstyle("Inhopg1", "toc 1", '<w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9306"/></w:tabs><w:spacing w:before="120" w:after="60"/>', "<w:b/><w:bCs/>", nxt="Standaard", ui=39).replace('w:styleId="Inhopg1"', 'w:styleId="TOC1"')
    + pstyle("Inhopg2", "toc 2", '<w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9306"/></w:tabs><w:spacing w:after="40"/><w:ind w:left="284"/>', "", nxt="Standaard", ui=39).replace('w:styleId="Inhopg2"', 'w:styleId="TOC2"')
    + "</w:styles>"
)
pkg.write("word/styles.xml", styles)
BUL = lambda lvl, ch, left: (f'<w:lvl w:ilvl="{lvl}"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="{ch}"/><w:lvlJc w:val="left"/>'
                             f'<w:pPr><w:ind w:left="{left}" w:hanging="260"/></w:pPr><w:rPr><w:rFonts w:ascii="{rd.BODY_FONT}" w:hAnsi="{rd.BODY_FONT}" w:cs="{rd.BODY_FONT}"/><w:color w:val="{NAVY2}"/></w:rPr></w:lvl>')
pkg.write("word/numbering.xml", f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="{rd.W}">'
          '<w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/>' + BUL(0, "•", 360) + BUL(1, "–", 720) +
          '</w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>')

# ───────────── xml helpers ─────────────
def run(t, rpr=""):
    return f'<w:r>{rpr}<w:t xml:space="preserve">{esc(t)}</w:t></w:r>'

def para(t="", style=None, ppr="", rpr="", runs=None):
    st = f'<w:pStyle w:val="{style}"/>' if style else ""
    return f'<w:p><w:pPr>{st}{ppr}</w:pPr>{runs if runs is not None else (run(t, rpr) if t else "")}</w:p>'

def norm(t):
    return re.sub(r"\s+", " ", t.replace(" ", " ")).strip()

def merge_wraps(items):
    """items = [(kind, text)] ; join hard-wrapped lines of the PDF export into running paragraphs."""
    res = []
    for kind, t in items:
        if res and kind == "p" and res[-1][0] == "p" and not re.search(r"[.:;!?]$", res[-1][1]) and re.match(r"[a-z0-9]", t):
            res[-1] = ("p", res[-1][1] + " " + t)
        else:
            res.append((kind, t))
    return res

# ───────────── cover ─────────────
cover = rd.cover_blocks(binder, TITLE, SUBTITLE, VERSION, DATE, OWNER) + rd.cover_sectpr(cover_hdr)

# ───────────── section 1 (portrait) ─────────────
H1 = lambda t, brk=False: para(t, "Kop1", "<w:pageBreakBefore/>" if brk else "")
H2 = lambda t: para(t, "Kop2")
heads = []  # (level, text) for the TOC
def h1(t, brk=False): heads.append((1, t)); return H1(t, brk)
def h2(t): heads.append((2, t)); return H2(t)
P = lambda i: norm(d[i]["t"])
BUL_P = lambda t: para(t, "Lijstalinea")

s1 = [h1("1. Verantwoording", True), para(P(102), "Inleiding")]
s1 += [h2("1.1 Doelstelling"), para(P(107))]
s1 += [h2("1.2 Scope"), para(P(110)), para(P(111) + " " + P(112)), para(P(113)), para(P(115))]
s1 += [h2("1.3 Auditdata"), para(P(118))]
s1 += [h2("1.4 Auditoren"), para(P(121))]
s1 += [h2("1.5 Auditees"), para(P(124), ppr="<w:keepNext/>")] + [BUL_P(P(i)) for i in (125, 126, 127, 128)]
s1 += [h2("1.6 Auditcriteria"), para(P(132) + " " + P(133))]
s1 += [h2("1.7 Afwijkingen t.o.v. het auditprogramma"),
       para(P(136) + " " + P(137)),
       para(" ".join(P(i) for i in range(139, 145))),
       para(" ".join(P(i) for i in (147, 148, 149)))]
s1 += [h2("1.8 Documentatie"), para(P(155), ppr="<w:keepNext/>")]
s1 += [BUL_P(P(i)) for i in list(range(156, 215)) + [217, 218]]
PORTRAIT = (f'<w:sectPr><w:headerReference w:type="default" r:id="{body_hdr}"/><w:footerReference w:type="default" r:id="{ftr}"/>'
            '<w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="2500" w:right="1300" w:bottom="900" w:left="1300" w:header="708" w:footer="708" w:gutter="0"/><w:docGrid w:linePitch="360"/></w:sectPr>')
LANDSCAPE = (f'<w:sectPr><w:headerReference w:type="default" r:id="{land_hdr}"/><w:footerReference w:type="default" r:id="{ftr}"/>'
             '<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="2500" w:right="1300" w:bottom="900" w:left="1300" w:header="708" w:footer="708" w:gutter="0"/><w:docGrid w:linePitch="360"/></w:sectPr>')
s1.append(f'<w:p><w:pPr><w:spacing w:before="0" w:after="0"/>{PORTRAIT}</w:pPr></w:p>')

# ───────────── TOC page ─────────────
def toc_xml():
    out_ = [para("Inhoud", "Inhoudskop", "<w:pageBreakBefore/>")] if False else [para("Inhoud", "Inhoudskop")]
    rpr0 = ""
    for n, (lvl, t) in enumerate(heads):
        pre = ""
        if n == 0:
            pre = ('<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \\o "1-2" \\z \\u </w:instrText></w:r>'
                   '<w:r><w:fldChar w:fldCharType="separate"/></w:r>')
        pg = str(toc_pages.get(t, ""))
        out_.append(f'<w:p><w:pPr><w:pStyle w:val="TOC{lvl}"/></w:pPr>{pre}{run(t)}<w:r><w:tab/></w:r>{run(pg)}</w:p>')
    out_.append('<w:p><w:pPr><w:spacing w:after="0"/></w:pPr><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>')
    return "".join(out_)

# ───────────── section 2 (landscape): findings ─────────────
CELL_RPR = rd.cover_rpr(18, False, rd.BODY_FONT, INK)
CELL_B = rd.cover_rpr(18, True, rd.BODY_FONT, NAVY2)
CW = (8000, 4100, 2138)
cell_p = lambda t, rpr=CELL_RPR, ppr="": para(ppr=ppr + '<w:spacing w:after="60" w:line="259" w:lineRule="auto"/>', runs=run(t, rpr))
cell_bul = lambda t: para(ppr='<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:spacing w:after="20" w:line="259" w:lineRule="auto"/>', runs=run(t, CELL_RPR))

def tc(width, content, fill=None, header=False):
    shd = f'<w:shd w:val="clear" w:color="auto" w:fill="{fill}"/>' if fill else ""
    return f'<w:tc><w:tcPr><w:tcW w:w="{width}" w:type="dxa"/>{shd}<w:tcMar><w:top w:w="70" w:type="dxa"/><w:bottom w:w="40" w:type="dxa"/></w:tcMar></w:tcPr>{content}</w:tc>'

def clean_findings_cell(paras):
    """Auditverslag column -> list of xml blocks."""
    items, titles = [], []
    ps = [p for p in paras]
    # leading bold paragraphs = title(s)
    k = 0
    while k < len(ps) and ps[k]["b"]:
        titles.append(norm(ps[k]["t"])); k += 1
    rest = ps[k:]
    i = 0
    while i < len(rest):
        p = rest[i]; t = norm(p["t"])
        if t.startswith("Locatie "):  # address block -> one paragraph with line breaks
            lines = [t]; i += 1
            while i < len(rest):
                lines.append(norm(rest[i]["t"])); i += 1
                if re.fullmatch(r"\d{6,}", lines[-1]):
                    break
            items.append(("addr", lines)); continue
        if p["num"]:
            items.append(("b", t))
        elif t.startswith("-"):
            t2 = t.lstrip("-").strip()
            if t2: items.append(("b", t2))
        elif re.fullmatch(r"RS|\d+[A-Z]{1,3}( [A-Z]{1,3})?|Cliëntnr\. \d+", t):
            items.append(("sub", t))
        else:
            items.append(("p", t))
        i += 1
    # merge hard-wrapped plain lines
    merged = []
    for kind, t in items:
        if merged and kind == "p" and merged[-1][0] == "p" and not re.search(r"[.:;!?]$", merged[-1][1]) and re.match(r"[a-z0-9]", t):
            merged[-1] = ("p", merged[-1][1] + " " + t)
        else:
            merged.append((kind, t))
    xml = "".join(cell_p(t, CELL_B) for t in titles)
    for kind, t in merged:
        if kind == "p": xml += cell_p(t)
        elif kind == "b": xml += cell_bul(t)
        elif kind == "sub": xml += cell_p(t, CELL_B)
        elif kind == "addr":
            r = "".join((run(l, CELL_RPR) + ("<w:r><w:br/></w:r>" if n < len(t) - 1 else "")) for n, l in enumerate(t))
            xml += para(ppr='<w:spacing w:after="80" w:line="259" w:lineRule="auto"/>', runs=r)
    return xml, titles

def bevinding_sdt(tag, texts):
    run_ = "<w:r>" + CELL_RPR + "".join((("<w:br/>" if n else "") + f'<w:t xml:space="preserve">{esc(t)}</w:t>') for n, t in enumerate(texts)) + "</w:r>"
    return (f'<w:sdt><w:sdtPr>{CELL_RPR}<w:alias w:val="{tag}"/><w:tag w:val="{tag}"/><w:id w:val="{rd.next_id()}"/><w:text w:multiLine="1"/></w:sdtPr>'
            f'<w:sdtContent>{run_}</w:sdtContent></w:sdt>')

rows, seen, flags = [], set(), []
hdr_cells = "".join(tc(w, cell_p(t, rd.cover_rpr(18, True, rd.BODY_FONT, "FFFFFF")), fill=NAVY) for w, t in zip(CW, ("Auditverslag", "Bevinding", "Categorie")))
rows.append(f'<w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>{hdr_cells}</w:tr>')
for tb in tables:
    for r in tb:
        if not r[0] or r[0][0]["t"].strip() == "Auditverslag":  # empty trailing / header row of the export
            continue
        c0, c1, c2 = r
        left, titles = clean_findings_cell(c0)
        m = re.search(r"ISO 9001,?\s*(\d+(?:\.\d+)?)", " ".join(titles))
        ref = m.group(1).replace(".", "_") if m else f"rij{len(rows)}"
        assert ref not in seen, ref; seen.add(ref)
        # bevinding text(s): hard-wrapped lines merged
        bev = [norm(p["t"]) for p in c1]
        bev = [t for _, t in merge_wraps([("p", t) for t in bev])]
        # categorie: option WITHOUT a leading box glyph is the selected one (PDF-export quirk)
        opts = []
        for p in c2:
            t = p["t"]
            opts.append((norm(t.replace("☐", "")), "☐" not in t))
        labels = [o[0] for o in opts]
        assert labels == ["Voldoet", "Verbeterpunt", "Afwijking"], labels
        if sum(o[1] for o in opts) != 1:
            flags.append(ref)
        cat = ""
        for lab, sel in opts:
            cat += para(ppr='<w:spacing w:after="60"/>', runs=rd.checkbox_sdt(f"cat_{ref}_{rd.slug(lab)}", checked=sel and sum(o[1] for o in opts) == 1) + run(" " + lab, CELL_RPR))
        n_par = len(c0)
        trpr = "<w:trPr><w:cantSplit/></w:trPr>" if n_par < 16 else ""
        rows.append(f"<w:tr>{trpr}" + tc(CW[0], left) + tc(CW[1], para(runs=bevinding_sdt(f"bevinding_{ref}", bev), ppr='<w:spacing w:after="60" w:line="259" w:lineRule="auto"/>')) +
                    tc(CW[2], cat, fill=LABELBG) + "</w:tr>")
bd = "".join(f'<w:{s} w:val="single" w:sz="4" w:space="0" w:color="{BORDER}"/>' for s in ("top", "left", "bottom", "right", "insideH", "insideV"))
table = (f'<w:tbl><w:tblPr><w:tblW w:w="{sum(CW)}" w:type="dxa"/><w:tblBorders>{bd}</w:tblBorders><w:tblLayout w:type="fixed"/>'
         '<w:tblCellMar><w:left w:w="110" w:type="dxa"/><w:right w:w="110" w:type="dxa"/></w:tblCellMar><w:tblLook w:val="0420" w:firstRow="1" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr>'
         '<w:tblGrid>' + "".join(f'<w:gridCol w:w="{w}"/>' for w in CW) + "</w:tblGrid>" + "".join(rows) + "</w:tbl>")
s2 = [h1("2. Auditbevindingen"), para("Bevindingen / verbetermogelijkheden. Een overzicht van de auditbevindingen.", "Inleiding"),
      h2("2.1 Overzicht van auditbevindingen"), para(P(226)), table, '<w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr></w:p>']

body = cover + toc_xml() + "".join(s1) + "".join(s2) + LANDSCAPE
pkg.doc = f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document {rd.NS_DECL}><w:body>{body}</w:body></w:document>'
binder.write(pkg)
rd.set_update_fields(pkg)
subprocess.run([str(KIT / ".venv/bin/python3"), str(KIT / "scripts/embed_fonts.py"), str(work)], check=True)
Path(out).parent.mkdir(parents=True, exist_ok=True)
if os.path.exists(out): os.remove(out)
subprocess.run(f'cd "{work}" && zip -Xrq "{os.path.abspath(out)}" . -x ".*"', shell=True, check=True)
json.dump([t for _, t in heads], open("audit_heads.json", "w"), ensure_ascii=False)
print("wrote", out, "| rows", len(rows) - 1, "| unselected/ambiguous category rows:", flags)
