#!/usr/bin/env python3
"""add_fields_zorg.py <in.docx> <out.docx> <zorgplan|dienst|meierij>

Zorgplan / zorgovereenkomsten (already on the new stationery via convert_beleid.py): blanks -> content controls.
Rules are regexes with a group `f` = the span that becomes the field (empty span = insert there):
  line    plain text control      check   one checkbox      yn   two checkboxes (ja / nee)
  drop    drop-down               box     (Zorgplan) shaded one-cell table with a multi-line control under a label
Paragraphs inside mc:Fallback copies are left alone. See docs/decisions.md section 7."""
import re, shutil, subprocess, sys, tempfile, zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import restyle_docx as rd

HS = r"[ \t ]"
SP = r"[ \u00a0]"  # no tab: tab-aligned columns keep their tabs
PH = "Invullen"

# (regex, kind, tag or [tags per occurrence], placeholder / options)
COMMON_UNDERSCORE = (rf"(?:Naam|Adres|Telefoon|E-mail)\s*:\s*(?P<f>_{{3,}})", "line", None, PH)

RULES = {
    "zorgplan": [
        (rf"^(?:Naam cliënt:)(?P<f>{HS}*)$", "line", "naam_client", PH),
        (rf"^Geboortedatum:(?P<f>{HS}*)$", "line", "geboortedatum", "Datum"),
        (rf"^Datum plan:(?P<f>{HS}*)$", "line", "datum_plan", "Datum"),
        (rf"Datum afname:(?P<f>{HS}*)(?=\n|$)", "line", "datum_afname_fare", "Datum"),
        (rf"Score Statisch/Dynamisch/Totaal:(?P<f>{HS}*)(?=\n|$)", "line", "score_fare", PH),
        (rf"^Datum herijking \(6 maanden\):(?P<f>{HS}*)$", "line", "datum_herijking", "Datum"),
        (rf"^Datum volgende evaluatie:(?P<f>{HS}*)$", "line", "datum_volgende_evaluatie", "Datum"),
        (rf"Doel \d:(?P<f>{HS}*)(?=\n|$)", "line", "doel", PH),
        (r"Doel \d: (?P<f>behaald / gedeeltelijk / niet behaald)", "drop", "doel_resultaat", ["behaald", "gedeeltelijk", "niet behaald"]),
        (rf"(?:^|\n){HS}*\d\.(?P<f>{HS}*)(?=\n|$)", "line", "punt", PH),
        (r"Risicofactoren herijken: (?P<f>ja / nee)", "yn", "risicofactoren_herijken", ("ja", "nee")),
        (r"(?P<f>☐)(?= ?Ja)", "check", "ja", None),
        (r"(?P<f>☐)(?= ?Nee)", "check", "nee", None),
    ],
    "dienst": [
        (rf"^en(?P<f>{HS}+)(?=geb)", "line", "naam_client", "Naam cliënt"),
        (rf"geb\. dat:(?P<f>{HS}*)(?=met)", "line", "geboortedatum", "Datum"),
        (rf"cl\.nr(?P<f>{HS}*)(?=en wonende)", "line", "clientnummer", PH),
        (rf"wonende te(?P<f>{HS}*)$", "line", "woonplaats", PH),
        (rf"Betreft :(?P<f>{HS}*)(?=Geldig)", "line", "id_betreft", PH),
        (rf"Geldig ID type:(?P<f>{HS}*)(?=met nr)", "line", "id_type", PH),
        (rf"met nr:(?P<f>{HS}*)$", "line", "id_nummer", PH),
        (rf"Ingezien door: Naam:(?P<f>{HS}+)(?=Functie)", "line", "id_ingezien_door", PH),
        (rf"^De overeenkomst gaat in op datum:(?P<f>{HS}*)$", "line", "ingangsdatum", "Datum"),
        (rf"^Datum\s*:(?P<f>{HS}*)$", "line", "datum_ondertekening", "Datum"),
        (rf"^Plaats\s*:(?P<f>{HS}*)$", "line", "plaats_ondertekening", PH),
        (rf"^Naam:(?P<f>{SP}*)(?=\t)", "line", "naam_pj_professionals", PH),
        (rf"\tNaam:(?P<f>{SP}*)$", "line", "naam_client_ondertekening", PH),
        (rf"^{HS}*(?P<f>o)(?={HS}+Ik kan)", "check", "algemene_module_per_post", None),
        COMMON_UNDERSCORE,
    ],
    "meierij": [
        (rf"dhr\./mw(?P<f>[…\.]{{2,}})", "line", "naam_client", "Naam cliënt"),
        (rf"geboortedatum {HS}*(?P<f>[…\.]{{2,}})", "line", "geboortedatum", "Datum"),
        (rf"clnr(?P<f>[…\.]{{2,}})", "line", "clientnummer", PH),
        (rf"wonende (?P<f>[…\.]{{2,}})", "line", "woonplaats", PH),
        (r"^(?P<f>_{3,})$", "line", "adres_regel_2", PH),
        COMMON_UNDERSCORE,
    ],
}

# Zorgplan: label paragraph -> a shaded multi-line box is inserted right under it
BOX_LABELS = {
    "Beschrijving huidige beeldvorming:": "beeldvorming_beschrijving",
    "Indexdelict:": "indexdelict",
    "Delicttheorie:": "delicttheorie",
    "Conclusie hoogte recidiverisico & mogelijk advies op basis score:": "conclusie_recidiverisico",
    "Toelichting:": "toelichting",
    "Eventuele nieuwe doelen:": "nieuwe_doelen",
    "Bijstellen zorgplan: acties / deadlines:": "bijstellen_zorgplan",
}
BOX_PLACEHOLDER_PARAS = {"[Bijzonderheden vanuit de seksuele anamnese toevoegen]": ("seksuele_anamnese", "Bijzonderheden vanuit de seksuele anamnese toevoegen")}
LINE_NEUTRAL = rd._rpr()


def box_table(tag, placeholder="Klik hier om te typen."):
    b = "".join(f'<w:{s} w:val="single" w:sz="4" w:space="0" w:color="BFD8E3"/>' for s in ("top", "left", "bottom", "right"))
    sdt = rd.text_sdt(tag, placeholder, multiline=True)
    return ('<w:tbl><w:tblPr><w:tblW w:w="9306" w:type="dxa"/>'
            f'<w:tblBorders>{b}</w:tblBorders><w:tblLayout w:type="fixed"/>'
            '<w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tblCellMar></w:tblPr>'
            '<w:tblGrid><w:gridCol w:w="9306"/></w:tblGrid><w:tr><w:trPr><w:cantSplit/><w:trHeight w:val="1100" w:hRule="atLeast"/></w:trPr>'
            '<w:tc><w:tcPr><w:tcW w:w="9306" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F3F9FC"/></w:tcPr>'
            f'<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="260" w:lineRule="auto"/></w:pPr>{sdt}</w:p></w:tc></w:tr></w:tbl>'
            '<w:p><w:pPr><w:spacing w:before="0" w:after="120" w:line="120" w:lineRule="exact"/></w:pPr></w:p>')


def make_finder(rules, counters):
    def uniq(tag):
        counters[tag] = counters.get(tag, 0) + 1
        return tag if counters[tag] == 1 else f"{tag}_{counters[tag]}"

    def finder(text):
        spans, taken = [], []
        for rx, kind, tag, arg in rules:
            for m in re.finditer(rx, text, re.M):
                s, e = m.start("f"), m.end("f")
                if any(not (e <= a or s >= b) and not (s == e == a) for a, b in taken) or (s == e and any(a < s < b for a, b in taken)):
                    continue
                t = tag or slug_tag(m.group(0))
                if kind == "line":
                    b = (lambda t=t, arg=arg: (lambda _r: rd.text_sdt(uniq(t), arg)))()
                elif kind == "check":
                    b = (lambda t=t: (lambda _r: rd.checkbox_sdt(uniq(t))))()
                elif kind == "drop":
                    b = (lambda t=t, arg=arg: (lambda _r: rd.dropdown_sdt(uniq(t), arg)))()
                else:  # yn
                    b = (lambda t=t, arg=arg: (lambda _r: rd.checkbox_sdt(uniq(t + "_ja")) + f'<w:r>{LINE_NEUTRAL}<w:t xml:space="preserve"> {arg[0]}  </w:t></w:r>'
                                                + rd.checkbox_sdt(uniq(t + "_nee")) + f'<w:r>{LINE_NEUTRAL}<w:t xml:space="preserve"> {arg[1]}</w:t></w:r>'))()
                if kind in ("line", "drop"):
                    b = pad(b, text, s, e)
                spans.append((s, e, b))
                taken.append((s, e))
        return spans
    return finder


def pad(build, text, s, e):
    """A space before/after an inline field when the text next to it would otherwise touch it."""
    sp = f'<w:r>{LINE_NEUTRAL}<w:t xml:space="preserve"> </w:t></w:r>'
    before = sp if s > 0 and text[s - 1] not in " \t\n\u00a0" else ""
    after = sp if e < len(text) and text[e] not in " \t\n\u00a0" else ""
    return lambda r: before + build(r) + after


def slug_tag(s):
    return rd.slug(s.split(":")[0]) + "_wettelijk_vertegenwoordiger"


def convert(src, out, mode):
    work = Path(tempfile.mkdtemp())
    with zipfile.ZipFile(src) as z:
        z.extractall(work)
    p = work / "word/document.xml"
    xml = p.read_text(encoding="utf-8")
    stash = []
    xml = re.sub(r"<mc:Fallback>.*?</mc:Fallback>", lambda m: stash.append(m.group(0)) or f"<mc:Fallback>§{len(stash)-1}§</mc:Fallback>", xml, flags=re.S)

    if mode == "zorgplan":
        def box(m):
            para = m.group(0)
            text = re.sub(r"\s+", " ", "".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", para)).replace("&amp;", "&")).strip()
            if text in BOX_PLACEHOLDER_PARAS:
                tag, ph = BOX_PLACEHOLDER_PARAS[text]
                return box_table(tag, ph)
            if text in BOX_LABELS:
                tag = BOX_LABELS[text]
                if tag == "toelichting":
                    box.n += 1
                    tag = f"toelichting_{box.n}"
                return para + box_table(tag or "bij_seksuele_delicten")
            return para
        box.n = 0
        xml = rd.PARA_RE.sub(box, xml)

    counters = {}
    log = []
    xml, n = rd.convert_paragraphs(xml, make_finder(RULES[mode], counters), log)
    for l in log:
        print("  ", l)
    xml = re.sub(r"<mc:Fallback>§(\d+)§</mc:Fallback>", lambda m: stash[int(m.group(1))], xml)
    p.write_text(xml, encoding="utf-8")
    pkg = rd.Pkg(work)
    rd.ensure_w14(pkg)
    out = Path(out).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)
    out.unlink(missing_ok=True)
    subprocess.run(f'cd "{work}" && zip -Xrq "{out}" . -x ".*"', shell=True, check=True)
    shutil.rmtree(work, ignore_errors=True)
    print(f"{mode}: {n} fields -> {out}")


if __name__ == "__main__":
    convert(*sys.argv[1:4])
