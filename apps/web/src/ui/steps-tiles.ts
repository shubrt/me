import { t, type Lang } from "../helper/i18n.ts";
import {
  ACC,
  ACC_TEXT,
  check,
  chip,
  circle,
  cross,
  GREY,
  INK,
  line,
  LINE,
  MUTED,
  ON_INK,
  rect,
  RED,
  svg,
  text,
  TINT,
  WHITE,
} from "./svg.ts";

/** The three building blocks of each step, each with a 320 x 214 picture. */

type Tile = {
  title: string;
  text: string;
  picture: string;
};

export function listStructureTiles(lang: Lang): readonly Tile[] {
  return [
    {
      title: t(lang, "Datenmodell", "Data model"),
      text: t(lang, "Was es gibt und wie es zusammenhängt.", "What exists and how it connects."),
      picture: renderModelPicture(lang),
    },
    {
      title: t(lang, "Eine Quelle", "One source"),
      text: t(
        lang,
        "Jede Information liegt genau einmal.",
        "Every fact lives in exactly one place.",
      ),
      picture: renderSourcePicture(lang),
    },
    {
      title: t(lang, "Schnittstellen", "APIs"),
      text: t(
        lang,
        "Systeme tauschen Daten von selbst aus.",
        "Systems exchange data on their own.",
      ),
      picture: renderApiPicture(lang),
    },
  ];
}

export function listWorkflowTiles(lang: Lang): readonly Tile[] {
  return [
    {
      title: t(lang, "Automatisierung", "Automation"),
      text: t(lang, "Was sich wiederholt, läuft von selbst.", "What repeats runs by itself."),
      picture: renderAutomationPicture(lang),
    },
    {
      title: t(lang, "Prüfregeln", "Validation"),
      text: t(
        lang,
        "Fehler fallen auf, bevor sie stören.",
        "Errors show up before they cause trouble.",
      ),
      picture: renderRulesPicture(lang),
    },
    {
      title: t(lang, "Integrationen", "Integrations"),
      text: t(lang, "Systeme reden direkt miteinander.", "Systems talk to each other directly."),
      picture: renderIntegrationsPicture(lang),
    },
  ];
}

export function listAgentTiles(lang: Lang): readonly Tile[] {
  return [
    {
      title: t(lang, "KI-Assistenten", "AI assistants"),
      text: t(
        lang,
        "Lesen, einordnen, Vorschläge machen.",
        "Reading, sorting, making suggestions.",
      ),
      picture: renderAssistantPicture(lang),
    },
    {
      title: t(lang, "Eigene Daten", "Company data"),
      text: t(
        lang,
        "Antworten aus der Datenbasis, nicht geraten.",
        "Answers from the database, not guesses.",
      ),
      picture: renderDataPicture(lang),
    },
    {
      title: t(lang, "Klare Grenzen", "Clear limits"),
      text: t(
        lang,
        "Der Agent bereitet vor, der Mensch entscheidet.",
        "The agent prepares, the human decides.",
      ),
      picture: renderLimitsPicture(lang),
    },
  ];
}

function renderPicture(label: string, body: readonly string[]) {
  return svg("picture", 320, 214, label, body);
}

function renderModelPicture(lang: Lang) {
  const boxes = [
    [28, 30, t(lang, "Kunde", "Customer")],
    [188, 30, t(lang, "Auftrag", "Order")],
    [108, 132, t(lang, "Rechnung", "Invoice")],
  ] as const;
  return renderPicture(
    t(
      lang,
      "Kunde, Auftrag und Rechnung hängen zusammen",
      "Customer, order and invoice are connected",
    ),
    [
      ...boxes.map(
        ([x, y, name]) =>
          rect(x, y, 104, 52, { r: 8 }) +
          text(x + 52, y + 32, name, { size: 14.5, weight: 600, anchor: "middle" }),
      ),
      line(
        [
          [132, 56],
          [188, 56],
        ],
        { hasHead: false },
      ),
      line(
        [
          [240, 82],
          [186, 132],
        ],
        { hasHead: false },
      ),
    ],
  );
}

function renderSourcePicture(lang: Lang) {
  const sheets = [
    [28, 28, -8],
    [52, 92, 5],
    [32, 150, -4],
    [110, 40, 7],
    [102, 136, -7],
  ] as const;
  return renderPicture(
    t(lang, "Viele Dateien werden zu einer Quelle", "Many files become one source"),
    [
      ...sheets.map(
        ([x, y, angle]) =>
          line(
            [
              [x + 46, y + 28],
              [200, 107],
            ],
            { color: GREY, sw: 1, hasHead: false },
          ) +
          `<g transform="rotate(${angle} ${x + 22} ${y + 28})">${rect(x, y, 44, 56, { stroke: GREY, sw: 1.2, r: 4 })}</g>`,
      ),
      rect(200, 64, 92, 86, { fill: INK, sw: 1 }),
      text(246, 118, "1", { size: 30, weight: 700, fill: WHITE, anchor: "middle" }),
    ],
  );
}

function renderApiPicture(lang: Lang) {
  const renderSystem = (x: number, name: string) =>
    rect(x, 66, 104, 82) + text(x + 52, 112, name, { size: 16, weight: 600, anchor: "middle" });
  return renderPicture(t(lang, "CRM und Shop tauschen Daten aus", "CRM and shop exchange data"), [
    renderSystem(26, "CRM"),
    renderSystem(190, "Shop"),
    line(
      [
        [130, 92],
        [190, 92],
      ],
      { sw: 1.6 },
    ),
    line(
      [
        [190, 122],
        [130, 122],
      ],
      { sw: 1.6 },
    ),
    ...[142, 158, 174].map((x) => circle(x, 92, 3)),
  ]);
}

function renderAutomationPicture(lang: Lang) {
  return renderPicture(
    t(lang, "Vier Rechnungen sind automatisch verbucht", "Four invoices were posted automatically"),
    [4711, 4712, 4713, 4714].map((number, i) => {
      const y = 26 + i * 42;
      return (
        rect(16, y, 288, 34, { stroke: LINE, sw: 1.1, r: 7 }) +
        text(30, y + 22, `${t(lang, "Rechnung", "Invoice")} ${number}`, {
          size: 14.5,
          weight: 500,
        }) +
        text(196, y + 22, t(lang, "verbucht", "posted"), { size: 13.5, fill: MUTED }) +
        check(278, y + 19)
      );
    }),
  );
}

function renderRulesPicture(lang: Lang) {
  const rows = [
    [t(lang, "Kunde", "Customer"), "Müller GmbH", true],
    [t(lang, "Betrag", "Amount"), t(lang, "8.400 €", "€8,400"), true],
    [t(lang, "Fällig", "Due"), t(lang, "fehlt", "missing"), false],
  ] as const;
  return renderPicture(
    t(lang, "Eine Prüfregel findet ein fehlendes Feld", "A validation rule finds a missing field"),
    rows.map(([key, value, isValid], i) => {
      const y = 30 + i * 54;
      return (
        rect(16, y, 288, 44, { stroke: isValid ? LINE : RED, sw: 1.2, r: 7 }) +
        text(30, y + 27, key, { size: 14, fill: MUTED }) +
        text(252, y + 27, value, { weight: 600, fill: isValid ? INK : RED, anchor: "end" }) +
        (isValid ? check(272, y + 24) : cross(274, y + 18))
      );
    }),
  );
}

function renderIntegrationsPicture(lang: Lang) {
  const nodes = [
    [t(lang, "Mail", "Email"), 24, 28],
    ["Shop", 24, 138],
    ["Bank", 206, 28],
    ["CRM", 206, 138],
  ] as const;
  return renderPicture(
    t(
      lang,
      "Mail, Shop, Bank und CRM hängen an denselben Daten",
      "Email, shop, bank and CRM share the same data",
    ),
    [
      ...nodes.map(([, x, y]) =>
        line(
          [
            [x + 45, y + 23],
            [160, 107],
          ],
          { sw: 1.4, hasHead: false },
        ),
      ),
      ...nodes.map(([name, x, y]) => chip(x, y, 90, name, { h: 46 })),
      circle(160, 107, 27),
      text(160, 112, t(lang, "Daten", "Data"), {
        size: 12.5,
        weight: 600,
        fill: WHITE,
        anchor: "middle",
      }),
    ],
  );
}

function renderAssistantPicture(lang: Lang) {
  return renderPicture(t(lang, "Ein Assistent gibt einen Rat", "An assistant gives advice"), [
    rect(102, 30, 194, 44, { stroke: LINE, sw: 1.1, r: 14 }),
    text(199, 58, t(lang, "Soll ich mahnen?", "Send a reminder?"), {
      weight: 500,
      anchor: "middle",
    }),
    circle(42, 118, 17, ACC),
    rect(70, 90, 226, 88, { fill: TINT, stroke: ACC, sw: 1.1, r: 12 }),
    text(84, 118, t(lang, "Lieber anrufen.", "Better to call."), {
      size: 15.5,
      weight: 700,
      fill: ACC_TEXT,
    }),
    text(84, 142, t(lang, "Müller zahlt sonst", "Müller always"), { size: 14, fill: MUTED }),
    text(84, 161, t(lang, "immer pünktlich.", "pays on time."), { size: 14, fill: MUTED }),
  ]);
}

function renderDataPicture(lang: Lang) {
  const tables = [
    t(lang, "Kunden", "Customers"),
    t(lang, "Rechnungen", "Invoices"),
    t(lang, "Verträge", "Contracts"),
  ];
  return renderPicture(
    t(lang, "Der Agent liest aus der Datenbasis", "The agent reads from the database"),
    [
      circle(80, 107, 40, ACC),
      text(80, 112, "Agent", { weight: 700, fill: WHITE, anchor: "middle" }),
      line(
        [
          [120, 107],
          [188, 107],
        ],
        { sw: 1.6 },
      ),
      rect(188, 34, 120, 146, { fill: INK, sw: 1, r: 10 }),
      text(248, 62, t(lang, "Datenbasis", "Database"), {
        size: 13.5,
        weight: 700,
        fill: WHITE,
        anchor: "middle",
      }),
      ...tables.map(
        (name, i) =>
          rect(200, 76 + i * 32, 96, 25, { stroke: WHITE, sw: 0, r: 5 }) +
          text(248, 93 + i * 32, name, { size: 13, weight: 500, anchor: "middle" }),
      ),
    ],
  );
}

function renderLimitsPicture(lang: Lang) {
  const verbs = [
    t(lang, "Entwirft", "Drafts"),
    t(lang, "Prüft", "Checks"),
    t(lang, "Schlägt vor", "Suggests"),
  ];
  return renderPicture(
    t(
      lang,
      "Der Agent bereitet vor, der Mensch entscheidet",
      "The agent prepares, the human decides",
    ),
    [
      rect(20, 24, 180, 166, { stroke: ACC, sw: 1.5, r: 12, dash: "7 5" }),
      circle(110, 66, 22, ACC),
      ...verbs.map((verb, i) =>
        text(110, 118 + i * 24, verb, { size: 14.5, weight: 600, anchor: "middle" }),
      ),
      line(
        [
          [200, 107],
          [230, 107],
        ],
        { sw: 1.6 },
      ),
      rect(230, 80, 76, 54, { fill: INK, sw: 1 }),
      text(268, 103, "Tom", { size: 13.5, weight: 700, fill: WHITE, anchor: "middle" }),
      text(268, 122, t(lang, "sendet", "sends"), { size: 12.5, fill: ON_INK, anchor: "middle" }),
    ],
  );
}
