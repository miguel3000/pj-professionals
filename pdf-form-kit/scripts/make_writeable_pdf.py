#!/usr/bin/env python3
"""make_writeable_pdf.py <in.docx> <out.pdf>

docx (new stationery, content controls) -> writeable AcroForm PDF.
 1. text controls that are PRE-FILLED (cover title/subtitle/date, footer title, audit findings) become static text,
    so they keep their Playfair/DM Sans look; empty (placeholder) controls stay fillable fields
 2. LibreOffice export with form fields, 3. finalize_pdf.py (names, checkbox states, field boxes, no highlight)
Run refresh_toc.py on the docx first so the TOC page numbers are right."""
import json, os, re, shutil, subprocess, sys, tempfile, zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
PY = HERE.parent / ".venv/bin/python3"
SOFFICE = "/Applications/LibreOffice.app/Contents/MacOS/soffice"
LEAF = re.compile(r"<w:sdt>(?:(?!<w:sdt>|</w:sdt>).)*</w:sdt>", re.S)


def prepare(docx, workdir):
    with zipfile.ZipFile(docx) as z:
        z.extractall(workdir / "x")
    registry, flat = {}, [0]
    parts = [p for p in (workdir / "x/word").glob("*.xml") if re.match(r"(document|header.*|footer.*)\.xml", p.name)]
    for p in parts:
        xml = p.read_text(encoding="utf-8")

        def fix(m):
            sdt = m.group(0)
            tag = (re.search(r'<w:tag w:val="([^"]*)"', sdt) or [None, ""])[1]
            if "<w14:checkbox>" in sdt:
                registry[tag] = {"type": "checkbox", "checked": 'w14:checked w14:val="1"' in sdt}
                return sdt
            if "<w:text" in sdt and "<w:showingPlcHdr" not in sdt:
                flat[0] += 1
                return re.search(r"<w:sdtContent>(.*)</w:sdtContent>", sdt, re.S).group(1)
            return sdt

        xml = LEAF.sub(fix, xml)
        p.write_text(xml, encoding="utf-8")
    return registry, flat[0]


def main(docx, out):
    tmp = Path(tempfile.mkdtemp())
    registry, flat = prepare(docx, tmp)
    name = Path(docx).stem
    work_docx = tmp / (name + ".docx")
    subprocess.run(f'cd "{tmp}/x" && zip -Xrq "{work_docx}" . -x ".*"', shell=True, check=True)
    subprocess.run([SOFFICE, "--headless", "--convert-to", 'pdf:writer_pdf_Export:{"ExportFormFields":{"type":"boolean","value":"true"}}', str(work_docx), "--outdir", str(tmp)],
                   capture_output=True, check=True)
    reg = tmp / "registry.json"
    reg.write_text(json.dumps(registry), encoding="utf-8")
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    r = subprocess.run([str(PY), str(HERE / "finalize_pdf.py"), str(tmp / (name + ".pdf")), str(out), str(reg)], capture_output=True, text=True)
    print(os.path.basename(out), "| flattened prefilled controls:", flat, "|", r.stdout.strip().splitlines()[0] if r.stdout else r.stderr[-300:])
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
