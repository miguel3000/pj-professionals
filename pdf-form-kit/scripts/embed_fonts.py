#!/usr/bin/env python3
"""Embed TrueType fonts into an unpacked docx package.

Uses ECMA-376 §17.9 font obfuscation: a random GUID's bytes, reversed, XOR
the first 32 bytes of the font file. The GUID is stored as w:fontKey on the
<w:embedRegular>/<w:embedBold> element so Word can de-obfuscate on load.

Usage:
  embed_fonts.py <unpacked_dir>
  embed_fonts.py <unpacked_dir> "Family Name=/path/to/font.ttf" ["Other Family=/path/to/other.ttf" ...]

With no font args, defaults to PJ Professionals' house fonts (Playfair
Display + DM Sans) from the site's own public/fonts/ directory — the same
files reused for both the "regular" and "bold" font-table slots, matching
how this project already handles these specific variable TTFs on the live
site (one file serving multiple weights).
"""
import os
import re
import sys
import uuid

REPO_FONTS = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "fonts")
)
DEFAULT_FONTS = [
    ("Playfair Display", os.path.join(REPO_FONTS, "playfair-display.ttf")),
    ("DM Sans", os.path.join(REPO_FONTS, "dmsans.ttf")),
]


def obfuscate(data: bytes, guid: uuid.UUID) -> bytes:
    key = bytes(reversed(guid.bytes))
    out = bytearray(data)
    for i in range(min(32, len(out))):
        out[i] ^= key[i % 16]
    return bytes(out)


def guid_str(guid: uuid.UUID) -> str:
    return "{" + str(guid).upper() + "}"


def main():
    unpacked_dir = sys.argv[1]
    font_args = sys.argv[2:]
    fonts = DEFAULT_FONTS
    if font_args:
        fonts = []
        for arg in font_args:
            family, _, path = arg.partition("=")
            if not path:
                raise SystemExit(f"expected 'Family Name=/path/to/font.ttf', got: {arg!r}")
            fonts.append((family, path))

    fonts_dir = os.path.join(unpacked_dir, "word", "fonts")
    os.makedirs(fonts_dir, exist_ok=True)

    rels_path = os.path.join(unpacked_dir, "word", "_rels", "fontTable.xml.rels")
    font_table_path = os.path.join(unpacked_dir, "word", "fontTable.xml")

    rel_entries = []
    font_entries = []
    next_rid = 1
    next_file = 1

    for family, ttf_path in fonts:
        with open(ttf_path, "rb") as f:
            data = f.read()

        embeds = []
        # Same source file embedded twice (regular + bold slot) unless the
        # caller passed a genuinely different bold-weight file — most of
        # this project's TTFs are variable fonts that already cover both.
        for slot in ("Regular", "Bold"):
            rid = f"rIdFont{next_rid}"
            next_rid += 1
            g = uuid.uuid4()
            obf = obfuscate(data, g)
            next_file += 1
            fname = f"font{next_file}.odttf"
            with open(os.path.join(fonts_dir, fname), "wb") as out:
                out.write(obf)
            rel_entries.append(
                f'<Relationship Id="{rid}" '
                'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" '
                f'Target="fonts/{fname}"/>'
            )
            embeds.append((slot, rid, guid_str(g)))

        reg_rid, reg_key = embeds[0][1], embeds[0][2]
        bold_rid, bold_key = embeds[1][1], embeds[1][2]
        font_entries.append(
            f'<w:font w:name="{family}">'
            f'<w:embedRegular r:id="{reg_rid}" w:fontKey="{reg_key}"/>'
            f'<w:embedBold r:id="{bold_rid}" w:fontKey="{bold_key}"/>'
            "</w:font>"
        )

    # fontTable.xml.rels — docx-js emits this as a self-closing
    # <Relationships .../> (no separate close tag) when there are no
    # existing relationships yet, so it needs its own self-close -> open+
    # entries+close rewrite rather than a naive </Relationships> replace.
    with open(rels_path, "r", encoding="utf-8") as f:
        rels_xml = f.read()
    if rels_xml.rstrip().endswith("/>"):
        rels_xml = re.sub(r"/>\s*$", ">" + "".join(rel_entries) + "</Relationships>", rels_xml.rstrip())
    else:
        rels_xml = rels_xml.replace("</Relationships>", "".join(rel_entries) + "</Relationships>")
    with open(rels_path, "w", encoding="utf-8") as f:
        f.write(rels_xml)

    # fontTable.xml — insert <w:font> entries before the self-closing/close tag
    with open(font_table_path, "r", encoding="utf-8") as f:
        ft_xml = f.read()
    if ft_xml.rstrip().endswith("/>"):
        ft_xml = re.sub(r"/>\s*$", ">" + "".join(font_entries) + "</w:fonts>", ft_xml.rstrip())
    else:
        ft_xml = ft_xml.replace("</w:fonts>", "".join(font_entries) + "</w:fonts>")
    with open(font_table_path, "w", encoding="utf-8") as f:
        f.write(ft_xml)

    # settings.xml — declare embedded TrueType fonts. CT_Settings has a
    # fixed element sequence: embedTrueTypeFonts/saveSubsetFonts must come
    # right after displayBackgroundShape (or, failing that, right after the
    # opening tag as a last resort).
    settings_path = os.path.join(unpacked_dir, "word", "settings.xml")
    with open(settings_path, "r", encoding="utf-8") as f:
        settings_xml = f.read()
    if "<w:embedTrueTypeFonts" not in settings_xml:
        anchor = re.search(r"<w:displayBackgroundShape[^/]*/>", settings_xml)
        insert_at = anchor.end() if anchor else re.search(r"<w:settings[^>]*>", settings_xml).end()
        settings_xml = (
            settings_xml[:insert_at]
            + "<w:embedTrueTypeFonts/><w:saveSubsetFonts/>"
            + settings_xml[insert_at:]
        )
        with open(settings_path, "w", encoding="utf-8") as f:
            f.write(settings_xml)

    print(f"embedded {len(fonts)} font families ({len(rel_entries)} font parts)")


if __name__ == "__main__":
    main()
