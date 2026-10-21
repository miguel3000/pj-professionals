#!/usr/bin/env python3
"""refresh_toc.py <docx> [<docx> ...] : write correct page numbers into the cached TOC entries (in place).

LibreOffice cannot update a Word TOC on export, and Word only refreshes it when the user accepts the
'update fields' prompt, so cached numbers go stale after any re-flow. We render once, find the page of each
heading and patch the last number in every TOC entry. Entries are the paragraphs inside the TOC sdt."""
import os, re, shutil, subprocess, sys, tempfile, zipfile
from pathlib import Path

SOFFICE = "/Applications/LibreOffice.app/Contents/MacOS/soffice"


def render(docx, outdir):
    subprocess.run([SOFFICE, "--headless", "--convert-to", "pdf", str(docx), "--outdir", str(outdir)], capture_output=True, check=True)
    return Path(outdir) / (Path(docx).stem + ".pdf")


def page_texts(pdf):
    n = int(re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout).group(1))
    return [subprocess.run(["pdftotext", "-f", str(p), "-l", str(p), "-layout", str(pdf), "-"], capture_output=True, text=True).stdout for p in range(1, n + 1)]


def norm(t):
    return re.sub(r"[^a-z0-9]+", "", t.lower())


def refresh(docx):
    tmp = Path(tempfile.mkdtemp())
    with zipfile.ZipFile(docx) as z:
        z.extractall(tmp / "x")
    doc = (tmp / "x/word/document.xml").read_text(encoding="utf-8")
    m = re.search(r'<w:sdt>(?:(?!</w:sdt>).)*?<w:docPartGallery w:val="Table of Contents"/>.*?</w:sdt>', doc, re.S)
    if not m:
        m = re.search(r'<w:sdt>.*?<w:docPartGallery w:val="Table of Contents".*?</w:sdt>', doc, re.S)
    if m:
        toc = m.group(0)
    else:  # custom TOC (field result paragraphs styled TOC1/TOC2)
        paras = re.findall(r"<w:p[ >](?:(?!</w:p>).)*?<w:pStyle w:val=\"(?:TOC|Inhopg)\d\"/>.*?</w:p>", doc, re.S)
        if not paras:
            return "no TOC"
        toc = None
    pdf = render(docx, tmp)
    texts = page_texts(pdf)
    dotted = [i for i, t in enumerate(texts) if len(re.findall(r"\.{4,}\s*\d+\s*$", t, re.M)) >= 3]
    first_body = (max(dotted) + 1) if dotted else 2
    # TOC pages sit directly after the cover; allow contiguous run only
    run = [i for i in dotted if i < 6]
    first_body = (max(run) + 1) if run else 2
    pagelines = [[norm(l) for l in t.splitlines() if l.strip()] for t in texts]

    def page_of(title):
        k = norm(title)
        if not k:
            return None
        for p in range(first_body, len(texts)):
            if any(l == k or (len(k) > 12 and l.startswith(k)) for l in pagelines[p]):
                return p + 1
        return None

    pat = re.compile(r"<w:p[ >](?:(?!</w:p>).)*?</w:p>", re.S)
    count = [0]

    def fix_entry(pm):
        p = pm.group(0)
        if not re.search(r'<w:pStyle w:val="(?:TOC|Inhopg)\d"/>', p):
            return p
        ts = re.findall(r"<w:t(?: [^>]*)?>([^<]*)</w:t>", p)
        if len(ts) < 2 or not re.fullmatch(r"\d*", ts[-1].strip()):
            return p
        title = "".join(ts[:-1]).strip()
        title = re.sub(r"^\s*\d+(\.\d+)*\.?\s*", "", title) if False else title
        pg = page_of(title) or page_of(re.sub(r"^\d+(\.\d+)*\.?\s*", "", title))
        if not pg:
            return p
        i = p.rindex("<w:t")
        j = p.index("</w:t>", i)
        gt = p.index(">", i)
        count[0] += 1
        return p[:gt + 1] + str(pg) + p[j:]

    def fix_block(block):
        return pat.sub(fix_entry, block)

    if toc:
        doc = doc.replace(toc, fix_block(toc))
    else:
        doc = fix_block(doc)
    (tmp / "x/word/document.xml").write_text(doc, encoding="utf-8")
    out = tmp / "out.docx"
    subprocess.run(f'cd "{tmp}/x" && zip -Xrq "{out}" . -x ".*"', shell=True, check=True)
    shutil.move(str(out), docx)
    shutil.rmtree(tmp, ignore_errors=True)
    return f"{count[0]} TOC entries updated"


if __name__ == "__main__":
    for f in sys.argv[1:]:
        print(os.path.basename(f), "->", refresh(f))
