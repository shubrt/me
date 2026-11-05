import { t, type Lang } from "../helper/i18n.ts";

/** `[x, y, width, height]` on a grid: 1120 wide on desktop, 360 wide on phones. */
type Box = readonly [number, number, number, number];

/** Where the windows sit, when they open (s) and how far they tilt (deg). */
const WINDOWS = {
  chat: { open: 0.1, tilt: -1.5, desk: [0, 0, 380, 254], phone: [0, 0, 232, 170] },
  calendar: { open: 1.1, tilt: 1.2, desk: [210, 40, 380, 254], phone: [128, 22, 232, 168] },
  sheet: { open: 1.9, tilt: -0.8, desk: [430, 0, 380, 262], phone: [120, 118, 240, 196] },
  macro: { open: 2.6, tilt: 1.6, desk: [720, 30, 380, 236], phone: [0, 166, 220, 170] },
  files: { open: 3.1, tilt: -1.1, desk: [40, 210, 400, 276], phone: [0, 330, 236, 196] },
  paper: { open: 3.5, tilt: 0.9, desk: [290, 240, 400, 216], phone: [124, 352, 236, 146] },
  reply: { open: 3.8, tilt: 1.4, desk: [560, 210, 400, 214], phone: [4, 506, 232, 130] },
  pc: { open: 4.1, tilt: -1.3, desk: [700, 300, 410, 232], phone: [116, 488, 244, 168] },
} satisfies Record<string, { open: number; tilt: number; desk: Box; phone: Box }>;

type WindowId = keyof typeof WINDOWS;

/** Where a toast sits on one grid. */
type Spot = readonly [x: number, y: number, tilt: number];

type CalendarSlot = readonly [
  column: number,
  offset: number,
  height: number,
  text: string,
  cls?: string,
];

/** `slot` marks a cell that breaks: its place in the order the errors appear. */
type SheetCell = {
  text: string;
  cls: string;
  slot?: number | undefined;
};

/** All copy of the stage in one language. Names and companies stay German, they are the fiction. */
export function buildChaosScene(lang: Lang) {
  const total = t(lang, "Summe", "Total");
  const anna = "#e6e1d3";
  const tom = "#d9e4dc";
  const listLeft = t(lang, "Bitte aus dem Verteiler nehmen.", "Please remove me from this list.");

  return {
    heading: t(lang, "Kommt das bekannt vor?", "Sound familiar?"),
    summary: t(
      lang,
      "Acht überlappende Fenster mit Chat, Kalender, Tabellen, Makro und E-Mails. Es gibt sieben Versionen der Kundenliste, und niemand weiß, welche gilt.",
      "Eight overlapping windows of chat, calendar, spreadsheets, macro and email. There are seven versions of the customer list, and nobody knows which one is current.",
    ),
    card: t(lang, "Eine Quelle für alle.", "One source for everyone."),
    tidy: t(lang, "Reicht. Aufräumen.", "Enough. Clean it up."),
    back: t(lang, "Zurück ins Chaos", "Back to chaos"),
    titles: {
      chat: t(lang, "# vertrieb", "# sales"),
      calendar: t(lang, "Kalender, KW 46", "Calendar, week 46"),
      sheet: t(lang, "Kundenliste_neu_final_v2.xlsx", "Customer_list_new_final_v2.xlsx"),
      macro: t(lang, "Makro_Klaus_FINAL.xlsm", "Macro_Klaus_FINAL.xlsm"),
      files: t(lang, "Vertrieb / Kunden", "Sales / Customers"),
      paper: t(lang, "Freigabe_Angebot.pdf", "Quote_approval.pdf"),
      reply: t(lang, "An: Alle (214)", "To: All (214)"),
      pc: t(lang, "Foto von Tom", "Photo from Tom"),
    } satisfies Record<WindowId, string>,
    windows: (Object.keys(WINDOWS) as WindowId[]).map((id, i) => ({
      id,
      style: buildWindowStyle(id, i),
    })),
    chat: [
      {
        who: "Anna",
        tint: anna,
        time: t(lang, "09:12", "9:12 AM"),
        text: t(
          lang,
          "Hat jemand die aktuelle Kundenliste?",
          "Does anyone have the current customer list?",
        ),
      },
      {
        who: "Tom",
        tint: tom,
        time: t(lang, "09:14", "9:14 AM"),
        text: t(lang, "Liegt im Ordner.", "It's in the folder."),
      },
      {
        who: "Anna",
        tint: anna,
        time: t(lang, "09:15", "9:15 AM"),
        text: t(lang, "Welche denn? Da sind sieben.", "Which one? There are seven."),
      },
      {
        who: "Tom",
        tint: tom,
        time: t(lang, "09:16", "9:16 AM"),
        text: t(lang, "Frag Sabine, die weiß das.", "Ask Sabine, she knows."),
      },
    ],
    days: t(lang, ["Mo", "Di", "Mi", "Do", "Fr"], ["Mon", "Tue", "Wed", "Thu", "Fri"]),
    slots: listCalendarSlots(lang),
    sheetHead: [t(lang, "Kunde", "Customer"), t(lang, "Okt", "Oct"), "Nov", total],
    sheet: listSheetRows(lang, total),
    error: t(lang, "#BEZUG!", "#REF!"),
    note: t(lang, "NICHT ÄNDERN! Klaus", "DO NOT TOUCH! Klaus"),
    macro: {
      comment: t(lang, "' Bitte nicht ändern! Klaus, 2009", "' Please do not change! Klaus, 2009"),
      code: t(
        lang,
        '\nSub Monatsabschluss()\n  Sheets("Tabelle1 (3)").Select\n  Range("A1:ZZ9999").Copy\n  Call Klaus_Spezial',
        '\nSub MonthEndClose()\n  Sheets("Sheet1 (3)").Select\n  Range("A1:ZZ9999").Copy\n  Call Klaus_Special',
      ),
      error: t(lang, "Laufzeitfehler 1004", "Run-time error 1004"),
      detail: t(lang, "Klaus_Spezial nicht gefunden.", "Klaus_Special not found."),
      end: t(lang, "Beenden", "End"),
      debug: t(lang, "Debuggen", "Debug"),
      foot: t(lang, "Klaus ist seit 2017 in Rente.", "Klaus retired in 2017."),
    },
    files: [
      [t(lang, "Kundenliste.xlsx", "Customer_list.xlsx"), "2021"],
      [t(lang, "Kundenliste_neu.xlsx", "Customer_list_new.xlsx"), "2023"],
      [
        t(lang, "Kundenliste_neu_final.xlsx", "Customer_list_new_final.xlsx"),
        t(lang, "März", "March"),
      ],
      [
        t(lang, "Kundenliste_neu_final_v2.xlsx", "Customer_list_new_final_v2.xlsx"),
        t(lang, "gestern", "yesterday"),
      ],
      [
        t(lang, "Kopie von Kundenliste_final (2).xlsx", "Copy of Customer_list_final (2).xlsx"),
        t(lang, "gestern", "yesterday"),
      ],
      [
        t(lang, "Kundenliste_ALT_aber_aktueller.xlsx", "Customer_list_OLD_but_newer.xlsx"),
        t(lang, "heute", "today"),
      ],
      [t(lang, "NICHT LÖSCHEN.xlsx", "DO NOT DELETE.xlsx"), "?"],
    ],
    paper: {
      ask: t(
        lang,
        "Bitte ausdrucken, unterschreiben, einscannen und zurückmailen.",
        "Please print, sign, scan and email back.",
      ),
      steps: [
        t(lang, "Ausdrucken", "Print"),
        t(lang, "Unterschreiben", "Sign"),
        t(lang, "Einscannen", "Scan"),
      ],
      failed: t(lang, "Zurückmailen", "Email back"),
      reason: t(lang, "Anhang zu groß", "Attachment too large"),
    },
    replies: [
      ["Tom", listLeft],
      ["Anna", t(lang, "Mich bitte auch.", "Me too, please.")],
      ["Markus", t(lang, "Bitte nicht allen antworten!", "Please stop replying all!")],
      ["Sabine", t(lang, "Automatische Antwort: Urlaub", "Automatic reply: on vacation")],
      ["Tom", listLeft],
    ],
    pc: {
      ask: t(
        lang,
        "Was macht eigentlich der Rechner unter Sabines Tisch?",
        "What does the computer under Sabine's desk actually do?",
      ),
      sign: t(lang, ["NICHT", "AUSSCHALTEN!"], ["DO NOT", "TURN OFF!"]),
      uptime: t(lang, "Läuft seit 2014", "Running since 2014"),
    },
    toasts: listToasts(lang),
  };
}

/** Custom properties that place a window, see `.chaos .window` in chaos.css. */
function buildWindowStyle(id: WindowId, i: number): string {
  const { open, tilt, desk, phone } = WINDOWS[id];
  const [x, y, w, h] = desk;
  const [mx, my, mw, mh] = phone;

  return `--i:${i};--t:${open}s;--r:${tilt}deg;--x:${x};--y:${y};--w:${w};--h:${h};--mx:${mx};--my:${my};--mw:${mw};--mh:${mh}`;
}

function listCalendarSlots(lang: Lang): ReadonlyArray<CalendarSlot> {
  const jourFixe = t(lang, "Jour fixe", "Standing meeting");
  const status = "Status";
  const meta = t(lang, "Abstimmung zur Abstimmung", "Meeting about the meeting");
  const figuresSync = t(lang, "Abstimmung Zahlen", "Numbers sync");
  const preMeeting = t(lang, "Vorbesprechung", "Pre-meeting");
  const quickSync = t(lang, "Kurzer Sync", "Quick sync");
  const debrief = t(lang, "Nachbesprechung", "Post-meeting");

  return [
    [0, 0, 40, jourFixe],
    [1, 0, 58, meta, "highlight"],
    [2, 0, 34, status],
    [3, 0, 46, figuresSync],
    [4, 0, 40, preMeeting],
    [0, 44, 50, figuresSync],
    [1, 62, 40, quickSync],
    [2, 38, 52, debrief],
    [3, 50, 40, jourFixe],
    [4, 44, 54, meta, "highlight"],
    [0, 98, 44, preMeeting],
    [1, 106, 50, status],
    [2, 94, 46, figuresSync],
    [3, 94, 58, quickSync],
    [4, 102, 44, jourFixe],
    [0, 146, 46, quickSync],
    [2, 144, 48, status],
    [4, 150, 42, status],
  ];
}

function listSheetRows(lang: Lang, total: string) {
  const locale = t(lang, "de-DE", "en-US");
  const figures: ReadonlyArray<readonly [string, number, number, number]> = [
    ["Müller GmbH", 8400, 7900, 16300],
    ["Weber & Sohn", 3200, 2950, 6150],
    ["Kaya Logistik", 4600, 5100, 9700],
    ["Novak KG", 6100, 6400, 12500],
    [total, 22300, 22350, 44650],
  ];
  const rows: SheetCell[][] = [];
  let brokenCount = 0;

  for (const [row, [name, ...values]] of figures.entries()) {
    const isTotal = row === 4;
    const cells: SheetCell[] = [{ text: name, cls: isTotal ? "bold" : "" }];

    for (const [index, value] of values.entries()) {
      cells.push({
        text: value.toLocaleString(locale),
        cls: isTotal ? "number bold" : "number",
        slot: isBrokenCell(row, index + 1) ? brokenCount++ : undefined,
      });
    }

    rows.push(cells);
  }

  return rows;
}

/** Every sum, and the two November cells, turn into an error one after the other. */
function isBrokenCell(row: number, col: number) {
  return col === 3 || row === 4 || (col === 2 && (row === 1 || row === 3));
}

/** In order of appearance. The first five stack in a column. */
function listToasts(lang: Lang) {
  const noResponse = t(lang, "Excel reagiert nicht", "Excel is not responding");
  const toasts: ReadonlyArray<{ text: string; at: number; desk: Spot; phone: Spot }> = [
    {
      text: t(lang, "Anna: Hast du die Liste?", "Anna: Do you have the list?"),
      at: 1.2,
      desk: [858, 8, 0],
      phone: [138, 8, 0],
    },
    {
      text: t(lang, "Tom: Welche Version?", "Tom: Which version?"),
      at: 1.92,
      desk: [858, 52, 0],
      phone: [138, 44, 0],
    },
    {
      text: t(lang, "Erinnerung: Abstimmung Zahlen", "Reminder: Numbers sync"),
      at: 2.54,
      desk: [858, 96, 0],
      phone: [138, 80, 0],
    },
    {
      text: t(lang, "Sabine: Automatische Antwort", "Sabine: Automatic reply"),
      at: 3.07,
      desk: [858, 140, 0],
      phone: [138, 116, 0],
    },
    {
      text: t(lang, "Chef: Wo sind die Zahlen?", "Boss: Where are the numbers?"),
      at: 3.53,
      desk: [858, 184, 0],
      phone: [138, 152, 0],
    },
    { text: "Anna: ???", at: 3.92, desk: [330, 60, -3], phone: [10, 60, -3] },
    {
      text: t(lang, "Mail: AW: AW: WG: Liste", "Email: RE: RE: FW: List"),
      at: 4.26,
      desk: [40, 150, 2],
      phone: [0, 176, 2],
    },
    { text: noResponse, at: 4.55, desk: [560, 300, -2], phone: [130, 236, -2] },
    {
      text: t(lang, "Buchhaltung: Stimmt das so?", "Accounting: Is this right?"),
      at: 4.8,
      desk: [250, 395, 3],
      phone: [20, 290, 3],
    },
    {
      text: t(lang, "Tom: Nicht die alte nehmen!", "Tom: Not the old one!"),
      at: 5.02,
      desk: [20, 300, -4],
      phone: [0, 372, -4],
    },
    {
      text: t(lang, "Chef: Bis wann?", "Boss: By when?"),
      at: 5.2,
      desk: [620, 150, 2],
      phone: [138, 348, 2],
    },
    {
      text: t(lang, "Speicherplatz fast voll", "Storage almost full"),
      at: 5.36,
      desk: [180, 40, -2],
      phone: [60, 430, -2],
    },
    {
      text: t(lang, "Anna: Hallo???", "Anna: Hello???"),
      at: 5.5,
      desk: [430, 440, 3],
      phone: [138, 492, 3],
    },
    { text: noResponse, at: 5.62, desk: [70, 450, -2], phone: [8, 536, -2] },
    {
      text: t(lang, "Chef: Können wir nicht einfach KI nehmen?", "Boss: Can't we just use AI?"),
      at: 5.74,
      desk: [380, 215, 0],
      phone: [64, 590, 0],
    },
  ];

  return toasts.map(({ text, at, desk, phone }, i) => ({
    text,
    isHot: i === toasts.length - 1,
    style: `--a:${at}s;--x:${desk[0]};--y:${desk[1]};--r:${desk[2]}deg;--mx:${phone[0]};--my:${phone[1]};--mr:${phone[2]}deg`,
  }));
}
