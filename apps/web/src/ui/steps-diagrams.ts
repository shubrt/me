import { t, type Lang } from "../helper/i18n.ts";
import {
  ACC,
  ACC_TEXT,
  card,
  check,
  chip,
  circle,
  INK,
  line,
  LINE,
  markers,
  MUTED,
  rect,
  SOFT,
  svg,
  text,
  TINT,
  WHITE,
} from "./svg.ts";

/**
 * The main diagram of each step. Every public function returns two SVGs: `.wide` (760 viewBox)
 * and `.narrow` (380 viewBox, same content stacked vertically). steps.css shows one of them.
 */

const HEADING = { size: 15, weight: 700 };
const NOTE = { size: 13, weight: 600, fill: MUTED };
const EXCEPTION = { fill: TINT, stroke: ACC, sw: 1.2, r: 8 };
const LATER_CHIP = { fill: TINT, stroke: ACC, color: ACC_TEXT };
const LATER_LINE = { color: ACC, dash: "6 5" };
// Small type on orange is ink: white fails contrast here, the headline above it is large enough.
const TEXT_ON_ACC = { weight: 500, fill: INK };

/** Step 1: scattered sources feed one database that everyone works with. */
export function renderHubDiagram(lang: Lang): string {
  const scattered = t(lang, "Heute verstreut", "Scattered today");
  const source = t(lang, "Eine Quelle", "One source");
  const everyone = t(lang, "Alle arbeiten damit", "Everyone works with it");
  const database = t(lang, "Datenbasis", "Database");
  const sources = [
    t(lang, "Excel-Listen", "Spreadsheets"),
    t(lang, "Postfächer", "Inboxes"),
    "CRM",
    t(lang, "Buchhaltung", "Accounting"),
    t(lang, "Wissen in Köpfen", "People's heads"),
  ];
  const tables = [
    [t(lang, "Kunden", "Customers"), [t(lang, "Nummer", "Number"), "Name", "Status"]],
    [
      t(lang, "Rechnungen", "Invoices"),
      [t(lang, "Nummer", "Number"), t(lang, "Betrag", "Amount"), t(lang, "Fällig", "Due")],
    ],
    [
      t(lang, "Verträge", "Contracts"),
      [t(lang, "Laufzeit", "Term"), t(lang, "Kündigung", "Notice")],
    ],
    [t(lang, "Kontakte", "Contacts"), [t(lang, "Person", "Person"), t(lang, "Rolle", "Role")]],
  ] as const;
  const users = [
    t(lang, "Vertrieb", "Sales"),
    t(lang, "Buchhaltung", "Accounting"),
    t(lang, "Geschäftsführung", "Management"),
  ];
  const later = t(lang, "Später: Agent", "Later: Agent");
  const label = t(
    lang,
    "Verstreute Quellen laufen in eine Datenbasis, mit der alle arbeiten",
    "Scattered sources flow into one database that everyone works with",
  );

  const wide = svg("diagram wide", 760, 332, label, [
    text(0, 18, scattered, HEADING),
    text(380, 18, source, { ...HEADING, anchor: "middle" }),
    text(760, 18, everyone, { ...HEADING, anchor: "end" }),
    ...sources.map((name, i) => {
      const y = 38 + i * 60;
      return (
        chip(0, y, 132, name, { h: 42, size: 14 }) +
        line([
          [132, y + 21],
          [214, 186 + (i - 2) * 26],
        ])
      );
    }),
    rect(216, 38, 328, 290, { sw: 1.8, r: 14 }),
    text(380, 68, database, { size: 20, weight: 700, anchor: "middle" }),
    ...tables.map(([title, rows], i) =>
      card(i % 2 ? 384 : 230, i < 2 ? 84 : 208, 146, title, rows),
    ),
    ...[...users, later].map((name, i) => {
      const y = 56 + i * 70;
      const isLater = name === later;
      return (
        line(
          [
            [544, 186 + (i - 1.5) * 34],
            [620, y + 21],
          ],
          isLater ? LATER_LINE : {},
        ) + chip(620, y, 140, name, { h: 42, size: 14, ...(isLater ? LATER_CHIP : {}) })
      );
    }),
    markers([
      [246, 61, "a"],
      [514, 61, "b"],
      [152, 104, "c"],
    ]),
  ]);

  // Chips sit in two columns around a vertical trunk that carries the flow.
  const trunk = 190;
  const columnWidth = 160;
  const right = 220;
  const narrow = svg("diagram narrow", 380, 612, label, [
    text(0, 16, scattered, HEADING),
    ...sources.map((name, i) => {
      const cy = 47 + Math.floor(i / 2) * 48;
      const x = i % 2 ? right : 0;
      const edge = i % 2 ? right : columnWidth;
      return (
        line(
          [
            [edge, cy],
            [trunk, cy],
          ],
          { hasHead: false },
        ) + chip(x, cy - 19, columnWidth, name, { size: 14 })
      );
    }),
    line([
      [trunk, 47],
      [trunk, 196],
    ]),
    text(0, 186, source, HEADING),
    rect(0, 196, 380, 280, { sw: 1.8, r: 14 }),
    text(trunk, 232, database, { size: 20, weight: 700, anchor: "middle" }),
    ...tables.map(([title, rows], i) =>
      card(i % 2 ? 196 : 12, i < 2 ? 250 : 373, 172, title, rows),
    ),
    line(
      [
        [trunk, 476],
        [trunk, 591],
      ],
      { hasHead: false },
    ),
    text(0, 510, everyone, HEADING),
    ...[...users, later].map((name, i) => {
      const cy = 543 + Math.floor(i / 2) * 48;
      const x = i % 2 ? right : 0;
      const edge = i % 2 ? right : columnWidth;
      const isLater = name === later;
      return (
        line(
          [
            [trunk, cy],
            [edge, cy],
          ],
          isLater ? LATER_LINE : {},
        ) + chip(x, cy - 19, columnWidth, name, { size: 14, ...(isLater ? LATER_CHIP : {}) })
      );
    }),
    markers([
      [28, 226, "a"],
      [352, 226, "b"],
      [244, 143, "c"],
    ]),
  ]);

  return wide + narrow;
}

/** Step 2: an invoice runs through the system, people only see the exception. */
export function renderLanesDiagram(lang: Lang): string {
  const human = t(lang, "Mensch", "Human");
  const invoice = [t(lang, "Rechnung", "Invoice"), t(lang, "per Mail", "by email")] as const;
  const extract = [t(lang, "Daten", "Extract"), t(lang, "auslesen", "data")] as const;
  const complete = t(lang, "Vollständig?", "Complete?");
  const yes = t(lang, "Ja", "Yes");
  const no = t(lang, "Nein", "No");
  const match = [t(lang, "Zahlung", "Match"), t(lang, "abgleichen", "payment")] as const;
  const status = [t(lang, "Status", "Set"), t(lang, "setzen", "status")] as const;
  const review = [t(lang, "Klärfall", "Review"), t(lang, "prüfen", "exception")] as const;
  const label = t(
    lang,
    "Ablauf einer Rechnung, Menschen prüfen nur Klärfälle",
    "How an invoice runs through the system. People only review exceptions.",
  );

  const y = 76;
  const mid = y + 24;
  const dx = 366;
  const wide = svg("diagram wide", 760, 322, label, [
    rect(0, 0, 760, 196, { fill: SOFT, stroke: SOFT, sw: 0, r: 12 }),
    rect(0, 208, 760, 112, { stroke: LINE, sw: 1.2, r: 12 }),
    text(14, 26, "System", { size: 14.5, weight: 700 }),
    text(14, 234, human, { size: 14.5, weight: 700 }),
    circle(28, mid, 11),
    line([
      [39, mid],
      [60, mid],
    ]),
    renderFlowStep(60, y, 100, invoice),
    renderFlowStep(182, y, 100, extract),
    line([
      [160, mid],
      [182, mid],
    ]),
    line([
      [282, mid],
      [dx - 58, mid],
    ]),
    renderDiamond(dx, mid, 58, 44),
    text(dx, mid + 5, complete, { ...NOTE, fill: INK, anchor: "middle" }),
    line([
      [dx + 58, mid],
      [452, mid],
    ]),
    text(t(lang, 438, 434), mid - 8, yes, { ...NOTE, anchor: "middle" }),
    renderFlowStep(452, y, 100, match),
    renderFlowStep(574, y, 100, status),
    line([
      [552, mid],
      [574, mid],
    ]),
    line([
      [674, mid],
      [704, mid],
    ]),
    renderEndpoint(720, mid, 15),
    line([
      [dx, mid + 44],
      [dx, 240],
    ]),
    text(dx + 9, 186, no, NOTE),
    rect(dx - 70, 240, 140, 48, EXCEPTION),
    renderTwoLines(dx, 261, review, 13.5),
    line([
      [dx + 70, 264],
      [502, 264],
      [502, y + 48],
    ]),
    text(744, 256, t(lang, "Menschen nur noch", "People step in"), {
      size: 14,
      weight: 500,
      fill: MUTED,
      anchor: "end",
    }),
    text(744, 276, t(lang, "bei Ausnahmen.", "for exceptions only."), {
      size: 14,
      weight: 500,
      fill: MUTED,
      anchor: "end",
    }),
    markers([
      [86, 21, "a"],
      [dx, 34, "b"],
      [110, 54, "c"],
      [502, 54, "c"],
    ]),
  ]);

  // The two lanes turn into columns: the flow runs down, the exception branches off sideways.
  const cx = 116;
  const left = 46;
  const w = 140;
  const dy = 274;
  const renderNarrowStep = (top: number, lines: readonly [string, string]) =>
    rect(left, top, w, 50, { r: 8 }) + renderTwoLines(cx, top + 21, lines, 14.5);
  const renderDownArrow = (from: number, to: number) =>
    line([
      [cx, from],
      [cx, to],
    ]);
  const noteLines = t(
    lang,
    ["Menschen", "nur noch bei", "Ausnahmen."],
    ["People step in", "only for", "exceptions."],
  );
  const narrow = svg("diagram narrow", 380, 544, label, [
    rect(0, 0, 232, 544, { fill: SOFT, stroke: SOFT, sw: 0, r: 12 }),
    rect(244, 0, 136, 544, { stroke: LINE, sw: 1.2, r: 12 }),
    text(14, 26, "System", { size: 14.5, weight: 700 }),
    text(258, 26, human, { size: 14.5, weight: 700 }),
    circle(cx, 52, 10),
    renderDownArrow(62, 84),
    renderNarrowStep(84, invoice),
    renderDownArrow(134, 156),
    renderNarrowStep(156, extract),
    renderDownArrow(206, 228),
    renderDiamond(cx, dy, 80, 46),
    text(cx, dy + 5, complete, { size: 14, weight: 600, anchor: "middle" }),
    renderDownArrow(320, 352),
    text(cx + 10, 341, yes, { size: 14, weight: 600, fill: MUTED }),
    renderNarrowStep(352, match),
    renderDownArrow(402, 424),
    renderNarrowStep(424, status),
    renderDownArrow(474, 496),
    renderEndpoint(cx, 513, 15),
    line([
      [cx + 80, dy],
      [256, dy],
    ]),
    text(214, dy - 8, no, { size: 14, weight: 600, fill: MUTED, anchor: "middle" }),
    rect(256, dy - 25, 112, 50, EXCEPTION),
    renderTwoLines(312, dy - 4, review, 14.5),
    line([
      [312, dy + 25],
      [312, 377],
      [left + w, 377],
    ]),
    ...noteLines.map((row, i) =>
      text(258, 440 + i * 20, row, { size: 14, weight: 500, fill: MUTED }),
    ),
    markers([
      [90, 21, "a"],
      [190, 228, "b"],
      [207, 109, "c"],
      [24, 377, "c"],
    ]),
  ]);

  return wide + narrow;
}

/** Step 3: the agent reads a mail, checks the database and suggests the next move. */
export function renderMailDiagram(lang: Lang): string {
  const incoming = t(lang, "Mail kommt rein", "Email comes in");
  const understands = t(lang, "Er versteht und sucht", "It reads and searches");
  const suggests = t(lang, "Er schlägt vor", "It suggests");
  const sender = "Eva Brandt, Müller GmbH";
  const body = [
    t(lang, "Hallo, die letzte Rechnung", "Hello, the last invoice"),
    t(lang, "stimmt so nicht. Bitte prüfen,", "is not right. Please check it,"),
    t(lang, "sonst müssen wir reden.", "or we will have to talk."),
    "",
    t(lang, "Viele Grüße", "Best regards"),
    "Eva Brandt",
  ];
  const facts = [
    [t(lang, "Kunde", "Customer"), "Müller GmbH"],
    [t(lang, "Anliegen", "Issue"), t(lang, "strittig", "disputed")],
    [t(lang, "Ton", "Tone"), t(lang, "verärgert", "annoyed")],
  ] as const;
  const fromData = t(lang, "Aus der Datenbasis", "From the database");
  const records = [
    t(lang, "Zahlt seit 2019 pünktlich", "Has paid on time since 2019"),
    t(lang, "Umsatz 2026: 84.200 €", "Revenue 2026: €84,200"),
    t(lang, "Rabatt fehlt auf Rechnung", "Discount missing on invoice"),
  ];
  const advice = t(lang, "Anrufen statt mahnen.", "Call, don't chase.");
  const reasons = [
    t(lang, "Rabatt fehlt auf der Rechnung.", "The discount is missing."),
    t(lang, "Korrektur ist vorbereitet.", "Correction prepared."),
    t(lang, "Antwort liegt als Entwurf vor.", "Reply drafted."),
  ];
  const decides = t(lang, "Tom entscheidet", "Tom decides");
  const label = t(
    lang,
    "Der Agent liest eine verärgerte Mail, sucht in der Datenbasis und schlägt einen Anruf vor",
    "The agent reads an annoyed email, searches the database and suggests a call",
  );

  const wide = svg("diagram wide", 760, 292, label, [
    text(0, 18, incoming, HEADING),
    text(266, 18, understands, HEADING),
    text(532, 18, suggests, HEADING),
    rect(0, 32, 228, 252, { r: 11 }),
    text(14, 58, sender, { size: 13.5, weight: 700 }),
    ...body.map((row, i) => text(14, 86 + i * 23, row, { size: 14 })),
    line([
      [228, 158],
      [266, 158],
    ]),
    ...facts.map(
      ([key, value], i) =>
        rect(266, 32 + i * 40, 228, 33, { fill: TINT, stroke: ACC, sw: 1, r: 7 }) +
        text(278, 53 + i * 40, key, { size: 13.5, fill: MUTED }) +
        text(482, 53 + i * 40, value, { size: 14, weight: 600, fill: ACC_TEXT, anchor: "end" }),
    ),
    rect(266, 156, 228, 128),
    text(278, 180, fromData, { size: 13.5, weight: 700 }),
    ...records.map(
      (row, i) =>
        check(278, 198 + i * 26) + text(298, 206 + i * 26, row, { size: 13.5, weight: 500 }),
    ),
    line(
      [
        [494, 158],
        [532, 158],
      ],
      { color: ACC, sw: 1.8 },
    ),
    rect(532, 32, 228, 252, { fill: ACC, stroke: ACC, sw: 1, r: 12 }),
    text(548, 72, advice, { size: 18.5, weight: 700, fill: WHITE }),
    ...reasons.map((row, i) => text(548, 106 + i * 25, row, { ...TEXT_ON_ACC, size: 13.5 })),
    rect(548, 222, 196, 44, { stroke: WHITE, sw: 1, r: 8 }),
    text(646, 250, decides, { size: 15, weight: 700, fill: ACC_TEXT, anchor: "middle" }),
    markers(
      [
        [444, 12, "a"],
        [472, 176, "b"],
        [726, 196, "c", true],
      ],
      ACC,
    ),
  ]);

  const narrow = svg("diagram narrow", 380, 766, label, [
    text(0, 16, incoming, HEADING),
    rect(0, 28, 380, 186, { r: 11 }),
    text(14, 54, sender, { size: 14.5, weight: 700 }),
    ...body.map((row, i) => text(14, 82 + i * 23, row, { size: 14.5 })),
    line([
      [190, 214],
      [190, 258],
    ]),
    text(0, 244, understands, HEADING),
    ...facts.map(
      ([key, value], i) =>
        rect(0, 258 + i * 44, 380, 36, { fill: TINT, stroke: ACC, sw: 1, r: 7 }) +
        text(14, 281 + i * 44, key, { size: 14, fill: MUTED }) +
        text(366, 281 + i * 44, value, { size: 14.5, weight: 600, fill: ACC_TEXT, anchor: "end" }),
    ),
    rect(0, 392, 380, 120),
    text(14, 418, fromData, { size: 14.5, weight: 700 }),
    ...records.map(
      (row, i) =>
        check(14, 436 + i * 26) + text(36, 444 + i * 26, row, { size: 14.5, weight: 500 }),
    ),
    line(
      [
        [190, 512],
        [190, 556],
      ],
      { color: ACC, sw: 1.8 },
    ),
    text(0, 542, suggests, HEADING),
    rect(0, 556, 380, 210, { fill: ACC, stroke: ACC, sw: 1, r: 12 }),
    text(18, 596, advice, { size: 20, weight: 700, fill: WHITE }),
    ...reasons.map((row, i) => text(18, 628 + i * 25, row, { ...TEXT_ON_ACC, size: 14.5 })),
    rect(18, 704, 344, 44, { stroke: WHITE, sw: 1, r: 8 }),
    text(190, 732, decides, { size: 15.5, weight: 700, fill: ACC_TEXT, anchor: "middle" }),
    markers(
      [
        [362, 236, "a"],
        [352, 416, "b"],
        [344, 590, "c", true],
      ],
      ACC,
    ),
  ]);

  return wide + narrow;
}

function renderTwoLines(
  x: number,
  y: number,
  [first, second]: readonly [string, string],
  size: number,
) {
  return (
    text(x, y, first, { size, weight: 600, anchor: "middle" }) +
    text(x, y + 17, second, { size, weight: 600, anchor: "middle" })
  );
}

function renderFlowStep(x: number, y: number, w: number, lines: readonly [string, string]) {
  return rect(x, y, w, 48, { r: 8 }) + renderTwoLines(x + w / 2, y + 21, lines, 13.5);
}

function renderDiamond(cx: number, cy: number, w: number, h: number) {
  return `<path d="M${cx - w} ${cy}L${cx} ${cy - h}L${cx + w} ${cy}L${cx} ${cy + h}z" fill="${WHITE}" stroke="${INK}" stroke-width="1.4"/>`;
}

function renderEndpoint(cx: number, cy: number, r: number) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${WHITE}" stroke="${INK}" stroke-width="1.4"/>${circle(cx, cy, r - 6)}`;
}
