#!/usr/bin/env python3
"""convert_beleid.py <src.docx> <out.docx> '<profile json>'

Policy / report document (legacy export) -> new stationery: Template cover + Formulier backdrop + bound footer.
profile: {title, subtitle, version, date, owner, [title_size], [keep_cover_table], [recolor: {old: new}]}
Follow with: restyle_docx.chapters_on_new_page, refresh_toc.py (docs with a TOC), make_writeable_pdf.py. See docs/decisions.md."""
import json, os, re, shutil, subprocess, sys, tempfile, zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import restyle_docx as rd

KIT = rd.KIT


def convert(src, out, prof):
    work = Path(tempfile.mkdtemp())
    with zipfile.ZipFile(src) as z:
        z.extractall(work)
    shutil.rmtree(work / "[trash]", ignore_errors=True)
    pkg = rd.Pkg(work)
    binder = rd.Binder()

    rd.strip_old_stationery(pkg)
    body_hdr = rd.add_backdrop_header(pkg, KIT / "assets/Briefpapier Formulier PJ Professionals.png", "backdrop")
    cover_hdr = rd.add_backdrop_header(pkg, KIT / "assets/Voorblad Template PJ Professionals BV (blank).png", "cover")
    t_sdt, v_sdt = rd.footer_bound_sdts(binder, prof["title"], prof["version"])
    ftr = rd.add_footer(pkg, "beleid", rd.footer_paragraph(title_sdt=t_sdt, version_sdt=v_sdt, short_sep=len(prof["title"]) > 40))
    rd.set_sections(pkg, body_hdr, ftr)
    rd.ensure_w14(pkg)

    xml = pkg.doc
    bs, ce = rd.find_cover_end(xml)
    cover = rd.cover_blocks(binder, prof["title"], prof["subtitle"], prof["version"], prof["date"], prof["owner"], prof.get("title_size"))
    keep = ""
    if prof.get("keep_cover_table"):
        keep = "".join(re.findall(r"<w:tbl>.*?</w:tbl>", xml[bs:ce], re.S))
        keep += '<w:p><w:pPr><w:spacing w:after="240"/></w:pPr></w:p>' if keep else ""
    pkg.doc = xml[:bs] + cover + rd.cover_sectpr(cover_hdr) + keep + xml[ce:]
    rd.remove_orphan_media(pkg)
    binder.write(pkg)
    for old_c, new_c in prof.get("recolor", {}).items():
        pkg.doc = pkg.doc.replace(f'w:fill="{old_c}"', f'w:fill="{new_c}"').replace(f'w:color w:val="{old_c}"', f'w:color w:val="{new_c}"')
    rd.restyle(pkg)
    rd.chapters_on_new_page(pkg)
    rd.set_update_fields(pkg)
    subprocess.run([str(KIT / ".venv/bin/python3"), str(KIT / "scripts/embed_fonts.py"), str(work)], check=True)
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    if os.path.exists(out):
        os.remove(out)
    subprocess.run(f'cd "{work}" && zip -Xrq "{os.path.abspath(out)}" . -x ".*"', shell=True, check=True)
    shutil.rmtree(work, ignore_errors=True)
    print("wrote", out)


if __name__ == "__main__":
    convert(sys.argv[1], sys.argv[2], json.loads(sys.argv[3]))
