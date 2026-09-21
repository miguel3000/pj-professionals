// Reusable docx-js building blocks for PJ Professionals fillable-PDF forms
// (Zorgplan, Evaluatie, Intakeformulier and anything built the same way).
// Values here are the exact numbers/colors reverse-engineered from the
// shipped Zorgplan Word source — see pdf-form-kit/README.md for how a new
// form is assembled from these pieces.
const fs = require("fs");
const {
  Paragraph, TextRun, Table, TableRow, TableCell,
  Header, ImageRun, BorderStyle, WidthType, ShadingType, HeightRule,
  VerticalAlign, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom,
  TextWrappingType,
} = require("docx");

// ── Palette / type (exact hex + sizes pulled from Zorgplan's docx) ─────────
const COLORS = {
  headingText: "0A2540",
  labelText: "0B3C5D",
  bodyText: "1A1A1A",
  placeholder: "6D8A99",
  hint: "5A6B78",
  rule: "2E86AB",
  border: "D8E3E8",
  valueBg: "F3F9FC",
  labelBg: "F4F7F9",
};
const HEADING_FONT = "Playfair Display";
const BODY_FONT = "DM Sans";

// ── Page geometry (A4, matching Zorgplan's pgMar exactly) ──────────────────
const PAGE = { width: 11906, height: 16838 };
const MARGIN = { top: 2500, right: 1300, bottom: 900, left: 1300, header: 708, footer: 708 };

// Full-bleed A4 backdrop extent in EMU — exact match to the discovered
// floating-anchor extent (7562850 x 10696575).
const BACKDROP_EMU = { cx: 7562850, cy: 10696575 };

function backdropImage(filePath) {
  return new Paragraph({
    children: [
      new ImageRun({
        data: fs.readFileSync(filePath),
        type: "png",
        transformation: { width: BACKDROP_EMU.cx / 9525, height: BACKDROP_EMU.cy / 9525 },
        floating: {
          horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
          verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 0 },
          behindDocument: true,
          wrap: { type: TextWrappingType.NONE },
        },
      }),
    ],
  });
}

// A `Header` for use in `sections[0].headers.first` / `.default` — pass the
// cover-art PNG for `first`, the continuation-page backdrop for `default`.
// Both must be 2481x3508px (A4 @ 300dpi), RGB, no alpha.
function letterheadHeader(imagePath) {
  return new Header({ children: [backdropImage(imagePath)] });
}

// ── Chapter/section heading ─────────────────────────────────────────────
// Playfair Display, bold, 13.5pt, navy, thin rule underneath.
function h1(text, opts = {}) {
  return new Paragraph({
    pageBreakBefore: !!opts.pageBreakBefore,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.rule, space: 4 } },
    spacing: { before: 420, after: 180 },
    children: [
      new TextRun({ text, font: HEADING_FONT, bold: true, color: COLORS.headingText, size: 27 }),
    ],
  });
}

// ── Marker convention ────────────────────────────────────────────────────
// docx-js can't emit a real Word content control (<w:sdt>) directly, so
// every fillable spot is emitted as a plain-text marker string here, then
// swapped for a real <w:sdt> by scripts/inject_sdt.py after the docx is
// unzipped. Marker shapes:
//   ⟦FIELD:tag|0|placeholder text⟧    - single-line fillable field
//   ⟦FIELD:tag|1|placeholder text⟧    - multi-line fillable field
//   ⟦FIELD:tag|0|placeholder|STYLE:size=80,bold=1,font=Playfair Display⟧
//                                      - same, with a non-default type style
//                                        (size in half-points) for both the
//                                        typed-text and placeholder runs —
//                                        e.g. a cover-page title field.
//   ⟦DATEFIELD:tag|placeholder text⟧  - single-line field that also gets a
//                                        native Acrobat calendar picker
//                                        (finalize_pdf.py wires the
//                                        AFDate_FormatEx JS onto it)
//   ⟦CHECKBOX:tag⟧                    - a checkbox (label is a separate run)
//
// The style object accepts size/font/bold/color — only pass what a caller
// wants to override, the rest fall back to the normal field styling.
function styleSuffix(style) {
  if (!style) return "";
  const parts = [];
  if (style.size) parts.push(`size=${style.size}`);
  if (style.bold) parts.push("bold=1");
  if (style.font) parts.push(`font=${style.font}`);
  if (style.color) parts.push(`color=${style.color}`);
  return parts.length ? `|STYLE:${parts.join(",")}` : "";
}
// `bind` (optional): a key shared by every field that should mirror the same
// value — e.g. the cover title and a footer line on every later page. All
// fields with the same key are data-bound to one custom-XML node by
// inject_sdt.py, so typing in one updates the others live in Word.
function fieldMarker(tag, placeholder, multiline = false, style = null, bind = null) {
  return `⟦FIELD:${tag}|${multiline ? 1 : 0}|${placeholder}${styleSuffix(style)}${bind ? `|BIND:${bind}` : ""}⟧`;
}
function dateFieldMarker(tag, placeholder) {
  return `⟦DATEFIELD:${tag}|${placeholder}⟧`;
}
function checkboxMarker(tag) {
  return `⟦CHECKBOX:${tag}⟧`;
}
function fieldRun(tag, placeholder, multiline = false, style = null, bind = null) {
  return new TextRun({
    text: fieldMarker(tag, placeholder, multiline, style, bind),
    font: (style && style.font) || BODY_FONT,
    size: (style && style.size) || 20,
    bold: !!(style && style.bold),
    color: (style && style.color) || COLORS.bodyText,
  });
}
function dateFieldRun(tag, placeholder) {
  return new TextRun({ text: dateFieldMarker(tag, placeholder), font: BODY_FONT, size: 20, color: COLORS.bodyText });
}
function checkboxRun(tag) {
  return new TextRun({ text: checkboxMarker(tag), font: BODY_FONT, size: 20 });
}
function labelRun(text, opts = {}) {
  return new TextRun({ text, font: BODY_FONT, size: 20, color: opts.color || COLORS.bodyText, bold: !!opts.bold });
}
// A checkbox's own label run — real Zorgplan/Evaluatie checkboxes bake the
// gap into the label text itself ("  Label    ", 2 leading + 4 trailing
// spaces) rather than using a separate spacer run between pairs.
function checkboxLabelRun(text) {
  return new TextRun({ text: `  ${text}    `, font: BODY_FONT, size: 20, color: COLORS.bodyText });
}
// Small italic instructional hint under a bold label (e.g. "Kies één van de
// onderstaande opties.", "Indien van toepassing: naam invullen en functie
// aanvinken.") — distinct from the placeholder color used inside empty
// fields.
function hintRun(text) {
  return new TextRun({ text, font: BODY_FONT, size: 16, italic: true, color: COLORS.hint });
}

const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};
function fourSideBorder() {
  const b = { style: BorderStyle.SINGLE, size: 2, color: COLORS.border };
  return { top: b, bottom: b, left: b, right: b };
}

// ── 2-column label/value field row (45%/55%, shaded, bordered) ─────────────
function infoRow(label, tag) {
  return new TableRow({
    height: { value: 500, rule: HeightRule.ATLEAST },
    children: [
      new TableCell({
        width: { size: 45, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.labelBg, type: ShadingType.CLEAR, color: "auto" },
        borders: fourSideBorder(),
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [labelRun(label, { bold: true, color: COLORS.labelText })] })],
      }),
      new TableCell({
        width: { size: 55, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.valueBg, type: ShadingType.CLEAR, color: "auto" },
        borders: fourSideBorder(),
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [fieldRun(tag, label)] })],
      }),
    ],
  });
}

// Same shape as `infoRow`, but the value cell gets a native Acrobat
// calendar-picker (finalize_pdf.py registers this tag as a date field).
function dateRow(label, tag) {
  return new TableRow({
    height: { value: 500, rule: HeightRule.ATLEAST },
    children: [
      new TableCell({
        width: { size: 45, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.labelBg, type: ShadingType.CLEAR, color: "auto" },
        borders: fourSideBorder(),
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [labelRun(label, { bold: true, color: COLORS.labelText })] })],
      }),
      new TableCell({
        width: { size: 55, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.valueBg, type: ShadingType.CLEAR, color: "auto" },
        borders: fourSideBorder(),
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [dateFieldRun(tag, label)] })],
      }),
    ],
  });
}

// A "locked" info row — label cell as usual, but the value cell is plain
// static text (no fillable field at all), for values the employee should
// never edit (e.g. "Document eigenaar: PJ Professionals"). Same neutral
// grey shading on both sides since it's not something to fill in.
function lockedRow(label, staticValue) {
  return new TableRow({
    height: { value: 500, rule: HeightRule.ATLEAST },
    children: [
      new TableCell({
        width: { size: 45, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.labelBg, type: ShadingType.CLEAR, color: "auto" },
        borders: fourSideBorder(),
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [labelRun(label, { bold: true, color: COLORS.labelText })] })],
      }),
      new TableCell({
        width: { size: 55, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.labelBg, type: ShadingType.CLEAR, color: "auto" },
        borders: fourSideBorder(),
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [labelRun(staticValue, { color: COLORS.bodyText })] })],
      }),
    ],
  });
}

// Wraps a list of `infoRow(...)` rows in a borderless 100%-width table
// (the visible grid comes from each cell's own borders, not the table's).
function infoTable(rows) {
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: NO_BORDERS, rows });
}

// ── Open (unlabeled) text box — shaded, no border, grows with `lines` ──────
// `lines` is approximate — trHeight is a minimum, LibreOffice/Word will
// grow the row if the typed content needs more room.
function openTextBox(tag, opts = {}) {
  const lines = opts.lines || 2;
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        height: { value: lines * 340, rule: HeightRule.ATLEAST },
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: COLORS.valueBg, type: ShadingType.CLEAR, color: "auto" },
            margins: { top: 100, bottom: 100, left: 150, right: 150 },
            verticalAlign: VerticalAlign.TOP,
            children: [new Paragraph({ children: [fieldRun(tag, opts.placeholder || "Klik hier om te typen.", true)] })],
          }),
        ],
      }),
    ],
  });
}

// ── Inline checkbox(+label) row — one or more [tag, label] pairs, spaced
// side by side on one line (matches Zorgplan's "Voortgang:"/Mentor-row
// checkbox pattern). `opts.prefix` prepends a run before the first
// checkbox (e.g. "a.  "). `opts.indent` nudges the whole row right (for a
// "b." sub-item's own sub-checkboxes). `opts.spacingBefore` overrides the
// paragraph's own top spacing (Zorgplan uses 100 twips when this follows a
// field in the same cell, the default 60 otherwise).
function checkboxRow(pairs, opts = {}) {
  const children = [];
  if (opts.prefix) children.push(labelRun(opts.prefix, { color: COLORS.bodyText }));
  pairs.forEach(([tag, text]) => {
    children.push(checkboxRun(tag));
    children.push(checkboxLabelRun(text));
  });
  return new Paragraph({
    spacing: { before: opts.spacingBefore ?? 60, after: 60 },
    indent: opts.indent ? { left: 260 } : undefined,
    children,
  });
}

// A plain (non-bold) label line — e.g. "b. Blijkt uit:" above a checkboxRow.
function subLabel(text) {
  return new Paragraph({ spacing: { before: 60, after: 40 }, children: [labelRun(text, { color: COLORS.bodyText })] });
}

// A bold, navy question/field-group heading (not a full h1 — no page break,
// no rule, just a labeled line introducing the fields under it). Spacing
// matches Zorgplan's "Voortgang:" label exactly.
function fieldGroupLabel(text) {
  return new Paragraph({ spacing: { before: 160, after: 60 }, children: [labelRun(text, { bold: true, color: COLORS.labelText })] });
}

// ── Checkbox group as a proper field row (matches Evaluatie's "Soort
// evaluatie" pattern) — label cell (bold label + optional italic hint),
// value cell with each checkbox on its own stacked line. Prefer this over
// a bare `checkboxRow` paragraph when the group is a first-class field
// among other table-row fields, for visual consistency with the rest of
// the form.
function checkboxGroupRow(label, hint, pairs) {
  const labelChildren = [new Paragraph({ children: [labelRun(label, { bold: true, color: COLORS.labelText })] })];
  if (hint) labelChildren.push(new Paragraph({ children: [hintRun(hint)] }));
  const valueChildren = pairs.map(
    ([tag, text], i) =>
      new Paragraph({
        spacing: i > 0 ? { before: 60 } : undefined,
        children: [checkboxRun(tag), checkboxLabelRun(text)],
      })
  );
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 45, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.labelBg, type: ShadingType.CLEAR, color: "auto" },
        borders: fourSideBorder(),
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        verticalAlign: VerticalAlign.CENTER,
        children: labelChildren,
      }),
      new TableCell({
        width: { size: 55, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.valueBg, type: ShadingType.CLEAR, color: "auto" },
        borders: fourSideBorder(),
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        verticalAlign: VerticalAlign.CENTER,
        children: valueChildren,
      }),
    ],
  });
}

// ── Name field + checkbox row (matches Zorgplan's Mentor/Curator/
// Bewindvoerder pattern) — label cell (bold label + optional italic hint),
// value cell with a fillable field on its own line, then the checkbox
// group on the line below it.
function fieldWithCheckboxesRow(label, hint, tag, fieldPlaceholder, pairs) {
  const labelChildren = [new Paragraph({ children: [labelRun(label, { bold: true, color: COLORS.labelText })] })];
  if (hint) labelChildren.push(new Paragraph({ children: [hintRun(hint)] }));
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 45, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.labelBg, type: ShadingType.CLEAR, color: "auto" },
        borders: fourSideBorder(),
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        verticalAlign: VerticalAlign.CENTER,
        children: labelChildren,
      }),
      new TableCell({
        width: { size: 55, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.valueBg, type: ShadingType.CLEAR, color: "auto" },
        borders: fourSideBorder(),
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({ children: [fieldRun(tag, fieldPlaceholder)] }),
          checkboxRow(pairs, { spacingBefore: 100 }),
        ],
      }),
    ],
  });
}

module.exports = {
  COLORS, HEADING_FONT, BODY_FONT, PAGE, MARGIN,
  backdropImage, letterheadHeader,
  h1, infoRow, dateRow, lockedRow, infoTable, openTextBox,
  checkboxRow, checkboxGroupRow, fieldWithCheckboxesRow, subLabel, fieldGroupLabel,
  fieldMarker, dateFieldMarker, checkboxMarker, fieldRun, dateFieldRun, checkboxRun,
  labelRun, checkboxLabelRun, hintRun,
  NO_BORDERS, fourSideBorder,
};
