# shubrt.me / Umsetzungsplan

Auftrag für einen umsetzenden Agenten. Ziel ist eine lauffähige, deploybare
Seite: ein Coding-Agent-Terminal als Portfolio, gebaut mit Astro 7 und einer
einzigen React-Insel, in einem Monorepo, dessen Rahmen sich am Repo
`shubrt/pushdraft` orientiert.

Der Plan ist so geschrieben, dass er ohne Rückfragen ausführbar ist. Wo eine
Entscheidung offen bleibt, steht sie unter „Offene Punkte" und hat einen
Default, der ohne Nachfrage gilt.

---

## 0. Rahmen

### 0.1 Annahmen

1. Es entsteht ein **neues Repo** `shubrt/me`. `shubrt/pushdraft` ist die
   **Vorlage für Tooling und Konventionen**, wird aber nicht verändert und nicht
   als Ziel des Codes verwendet.
2. Domain ist `shubrt.me`, Deploy auf Cloudflare Workers Static Assets.
3. Die GitHub-Repodaten werden **zur Buildzeit** geholt, nicht im Browser.
4. Node 22+ lokal, CI auf Node 24, pnpm 11.1.1, Bun 1.3.10, `vp` (Vite+) als
   Task-Runner. Genau wie in der Vorlage.

### 0.2 Definition of Done

- `pnpm run qa` ist grün: Format, Lint, `sherif`, Typecheck, Tests.
- `vp run -F @shubrt/web dev` zeigt die Seite lokal, alle Commands laufen.
- `vp run -F @shubrt/web build` erzeugt statisches `dist/` ohne Netzwerkfehler,
  auch ohne GitHub-Token (Fallback greift).
- `wrangler deploy` veröffentlicht die Seite, `shubrt.me` liefert sie aus.
- Die Abnahme-Checkliste in Abschnitt 8 ist Punkt für Punkt erfüllt.

### 0.3 Nicht-Ziele

Kein SSR pro Request, keine Datenbank, kein Auth, kein CMS, kein Router,
kein State-Management, kein CSS-Framework, keine Analytics, kein i18n.
Keine zweite Seite. Wer eines davon einbaut, hat den Auftrag verlassen.

---

## 1. Zielarchitektur

```
shubrt-me/
├── .bun-version                  1.3.10
├── .env.example
├── .github/workflows/ci.yml      QA auf PR und main
├── .github/workflows/deploy.yml  Build und Deploy: push, cron, manuell
├── .gitignore
├── .vite-hooks/                  von `vp config` erzeugt, nicht per Hand
├── commitlint.config.ts
├── package.json                  Root, privat, nur Skripte und Dev-Tooling
├── pnpm-workspace.yaml           apps/*, libs/*, tools/* plus catalog
├── vite.config.ts                vp: test, lint, fmt, staged
├── t3.json
├── wrangler.jsonc                Worker mit Static Assets
├── README.md
├── tools/typescript/             @tool/tsconfig: core.json, lib.json, react.json
├── libs/
│   ├── contracts/                Zod-Schemata und Typen für alle Daten
│   │   ├── src/index.ts
│   │   └── test/contracts.test.ts
│   └── session/                  Terminal-Kern, kein React, kein DOM
│       ├── src/index.ts          öffentliche API
│       ├── src/registry.ts       Commands und freie Antworten
│       ├── src/rows.ts           Eintragstypen zu Zeilen
│       ├── src/session.ts        Reducer und Ablaufplanung
│       ├── src/tokens.ts         Tokenmodell
│       ├── src/format.ts         blocks(), fmt(), ageVersion()
│       └── test/*.test.ts
└── apps/
    └── web/
        ├── astro.config.mjs
        ├── tsconfig.json
        ├── package.json
        ├── src/content.config.ts     Collections und Loader
        ├── src/data/github.ts        Fetch, Normalisierung, Fallback
        ├── src/data/whoami.ts        die strukturierten Felder
        ├── src/pages/index.astro     statische Hülle
        ├── src/components/Mascot.astro
        ├── src/islands/Terminal.tsx  die einzige Insel
        ├── src/styles/terminal.css
        └── data/repos.cache.json     committeter Fallback
```

**Abhängigkeitsrichtung:** `apps/web` → `libs/session` → `libs/contracts`.
`libs/session` darf React, DOM und `astro:*` nicht importieren. Das ist die
Regel, die den Stack später austauschbar hält, und sie wird im Review geprüft.

---

## 2. Phase 1: Rahmen aufsetzen

Ziel: leeres, aber vollständig geprüftes Monorepo. Keine Anwendungslogik.

### 2.1 Dateien

**`package.json`** (Root)

```json
{
  "name": "shubrt-me",
  "private": true,
  "scripts": {
    "build": "vp run -r build",
    "dev": "vp run -r --parallel dev",
    "typecheck": "vp run -r typecheck",
    "clean": "vp run -r clean && git clean -xdf node_modules .vite",
    "check": "vp check",
    "fix": "vp check --fix",
    "sherif": "vp exec sherif",
    "qa": "vp check && vp run sherif && vp run typecheck && vp test run",
    "prepare": "test -z \"$CI\" && vp config || true",
    "commitlint": "commitlint --edit"
  },
  "devDependencies": {
    "@commitlint/cli": "^21.0.1",
    "@commitlint/config-conventional": "^19.8.1",
    "@commitlint/types": "^20.2.0",
    "sherif": "^1.11.1",
    "typescript": "catalog:",
    "vite-plus": "catalog:"
  },
  "engines": { "bun": ">=1.3.10", "node": ">=22", "pnpm": ">=11.0.0" },
  "packageManager": "pnpm@11.1.1"
}
```

**`pnpm-workspace.yaml`**

```yaml
packages:
  - "apps/*"
  - "libs/*"
  - "tools/*"

allowBuilds:
  bun: true
  esbuild: true
  sharp: true

publicHoistPattern:
  - "*types*"

catalog:
  astro: ^7.2.0
  "@astrojs/react": ^4.4.0
  "@astrojs/check": ^0.9.5
  react: ^19.2.0
  react-dom: ^19.2.0
  "@types/react": ^19.2.0
  "@types/react-dom": ^19.2.0
  zod: ^4.1.5
  typescript: ^5.9.2
  vite-plus: ^0.1.21
  wrangler: ^4.0.0
```

Versionen bei `vp i` gegen die Registry prüfen und auf die jeweils aktuelle
Minor anheben, ohne Major-Sprung. `astro` muss 7.x sein.

**`vite.config.ts`**: aus der Vorlage übernehmen. Zwei Anpassungen:

- `lint.ignorePatterns` und `fmt.ignorePatterns` zusätzlich um
  `"**/dist/**"`, `"**/.astro/**"`, `"apps/web/data/*.json"` ergänzen.
- `test.include` bleibt `["{apps,libs}/*/test/**/*.test.ts"]`.

**`tools/typescript/`**: `package.json`, `core.json`, `lib.json`, `react.json`
eins zu eins aus der Vorlage übernehmen. Nicht verändern.

**`commitlint.config.ts`**, **`.gitignore`**, **`.bun-version`**,
**`t3.json`**: eins zu eins aus der Vorlage, in `.gitignore` zusätzlich
`.astro/` und `.wrangler/`.

**`.env.example`**

```
# Optional. Ohne Token gilt das unauthentifizierte GitHub-Limit von
# 60 Anfragen pro Stunde und IP. Für lokale Builds reicht das.
GITHUB_TOKEN=
```

**`.github/workflows/ci.yml`**: aus der Vorlage übernehmen, unverändert
(Node 24, pnpm 11.1.1, Bun 1.3.10, `pnpm install --frozen-lockfile`,
`pnpm run qa`). Action-Versionen als SHA pinnen, wie in der Vorlage.

### 2.2 Abnahme Phase 1

```bash
vp i
pnpm run qa      # muss grün sein, auch ohne einen einzigen Testfall
```

---

## 3. Phase 2: `libs/contracts`

Ziel: jede Datenform hat ein Schema und einen abgeleiteten Typ. Keine
Anwendungslogik.

**`package.json`** analog zur Vorlage (`@pushdraft/contracts`), Name
`@shubrt/contracts`, `exports` auf `./src/index.ts`, Dependency `zod: catalog:`,
Scripts `build` und `typecheck`, tsconfig-Paar `tsconfig.json` und
`tsconfig.build.json` aus der Vorlage.

**`src/index.ts`** definiert und exportiert:

```ts
// Repos
export const repoSchema = z.object({
  id: z.string(), // "01" .. "06", Anzeigeindex
  name: z.string(), // "shubrt/skills"
  url: z.string().url(), // https://github.com/shubrt/skills
  description: z.string(), // leerer String erlaubt
  language: z.string(), // lowercase, "" wenn null
  stars: z.number().int().nonnegative(),
  pushedAt: z.string().datetime({ offset: true }),
  pushedLabel: z.string(), // "2h", "3d", "2w", "1mo"
  activity: z.array(z.number().int().nonnegative()).length(12),
});
export const reposSchema = z.array(repoSchema).min(1).max(12);

// whoami
export const whoamiGroupSchema = z.object({
  title: z.string(),
  rows: z.array(z.tuple([z.string(), z.string()])).min(1),
});
export const whoamiSchema = z.array(whoamiGroupSchema).min(1);

// Typen
export type Repo = z.infer<typeof repoSchema>;
export type WhoamiGroup = z.infer<typeof whoamiGroupSchema>;
```

**Tests** (`test/contracts.test.ts`, Import aus `vite-plus/test`):
gültige Beispiele parsen, `activity` mit 11 Werten muss fehlschlagen,
`pushedAt` ohne Offset muss fehlschlagen.

### Abnahme Phase 2

`pnpm run qa` grün, mindestens 3 Testfälle.

---

## 4. Phase 3: `libs/session`, der Terminal-Kern

Das ist das Herz. Reine Funktionen, testbar ohne Browser. Kein Import von
`react`, `react-dom`, `astro:*` oder DOM-Globals.

### 4.1 Öffentliche API

```ts
export type Row = /* siehe Anhang A2, diskriminierte Union über `kind` */;
export type SessionState = {
  rows: Row[];
  input: string;
  caret: number;
  menuIndex: number;
  dismissed: boolean;
  tokens: number;      // Kontextfüllung
  busy: boolean;
};
export type SessionAction =
  | { type: "input"; value: string; caret: number }
  | { type: "caret"; caret: number }
  | { type: "menuMove"; delta: number }
  | { type: "menuDismiss" }
  | { type: "menuComplete" }
  | { type: "submit"; value: string }
  | { type: "runStarted"; job: Job }
  | { type: "runStep"; job: Job; stepIndex: number }
  | { type: "runTick"; elapsedMs: number }
  | { type: "runFinished"; job: Job; seconds: number }
  | { type: "note"; row: Row };

export function createInitialState(data: SessionData): SessionState;
export function reduce(state: SessionState, action: SessionAction): SessionState;
export function resolve(input: string, data: SessionData): Job;
export function menuList(state: SessionState, data: SessionData): CommandMeta[];
export const CONTEXT_LIMIT = 250_000;
```

`SessionData` bündelt `{ repos: Repo[]; whoami: WhoamiGroup[] }` und wird von
außen hereingegeben. Der Kern kennt keine Datenquelle.

`Job` ist ein vorbereiteter Lauf: `{ label, steps, out, res, input, durationMs }`.
`resolve()` erzeugt ihn vollständig, inklusive gewürfelter Schrittlängen und
Tokenzahlen. Ein Job ist damit deterministisch abspielbar, was ihn testbar macht.

**Zufall injizierbar halten:** `resolve(input, data, rng = Math.random)`.
Tests übergeben ein festes `rng`. Ohne das ist der Kern nicht prüfbar.

`Step` und `CommandMeta` sind die Bausteine, aus denen ein Job entsteht:

```ts
export type Step =
  | { kind: "tool"; title: string; arg: string; meta?: string; result?: number; chance?: number }
  | { kind: "text"; lines: string[] }
  | { kind: "groups"; groups: WhoamiGroup[] }
  | { kind: "repos" }
  | { kind: "kv"; rows: [string, string][] }
  | { kind: "files"; rows: [string, string, string][] }
  | { kind: "commandTable" }
  | { kind: "hint"; text: string }
  | { kind: "status"; text: string }
  | { kind: "error"; text: string };

export type CommandMeta = { name: `/${string}`; description: string; steps: Step[] };
```

`chance` markiert optionale Schritte. `resolve()` verwirft sie mit der
angegebenen Wahrscheinlichkeit, bevor Dauer und Tokens berechnet werden.
Dadurch schwankt auch die Zahl der Tool Calls von Lauf zu Lauf.

### 4.2 Regeln, die der Reducer garantiert

1. `submit` mit leerem Trim ändert nichts.
2. Läuft schon etwas (`busy`), wird der neue Job in eine Warteschlange gelegt
   und nach `runFinished` gestartet.
3. `runStarted` hängt Command-Zeile und Pending-Zeile an. Die Pending-Zeile ist
   **immer die letzte Zeile**, solange der Lauf dauert.
4. `runStep` fügt die Zeilen des Schritts **vor** der Pending-Zeile ein.
5. `runFinished` entfernt die Pending-Zeile, hängt die Cooked-Zeile an,
   setzt `busy: false` und erhöht `tokens` um `out + res + input`.
6. `tokens` ist monoton steigend und wird nie zurückgesetzt.

### 4.3 Zeitplanung

Jeder Schritt hat ein relatives Basisgewicht (Anhang A3). `resolve()` skaliert
alle Gewichte so, dass die Summe eine gewürfelte Zieldauer zwischen **2200 ms
und 4600 ms** trifft. Untergrenze pro Schritt 120 ms. Die gemeldete Dauer ist
`min(gemessen, geplant)`, damit ein gebremster Hintergrundtab die Zahl nicht
über fünf Sekunden treibt.

### 4.4 Tokenmodell

Zwei getrennte Größen, Details und Formeln in Anhang A3:

- **`out`**: was das Modell geschrieben hat. Aus der Länge des gerenderten
  Textes. Das ist die Zahl, die live hochläuft und die der Turn meldet.
- **`res`**: was Tools zurückgaben. Unsichtbar, füllt nur den Kontext.

Startwert des Kontexts: gewürfelt zwischen 11200 und 13800, auf 100 gerundet.
Das steht für System-Prompt plus Tool-Definitionen.

### 4.5 Tests (Pflicht)

| Test                                      | Erwartung                                                                           |
| ----------------------------------------- | ----------------------------------------------------------------------------------- |
| `resolve("/whoami")`                      | Label `/whoami`, mindestens ein Tool-Schritt, `out` zwischen 80 und 400             |
| Dauer aller Commands über 200 Durchläufe  | immer `2200 <= durationMs <= 4600`                                                  |
| Optionale Schritte                        | mit fixem `rng` reproduzierbar an- und abwesend                                     |
| `reduce` Abfolge submit → step → finished | Pending-Zeile ist zwischenzeitlich letzte Zeile, danach weg, Cooked-Zeile vorhanden |
| Kontext nach drei Läufen                  | streng monoton steigend, Summe gleich `out+res+input` je Lauf                       |
| `blocks()`                                | normalisiert gegen das globale Maximum, ruhiges Repo ergibt niedrige Blöcke         |
| `ageVersion(new Date("2026-08-22"))`      | `"v27.11.4"`                                                                        |
| `ageVersion(new Date("2026-09-18"))`      | `"v28.0.0"`                                                                         |
| `menuList` Filter `/pro`                  | genau `/projects`                                                                   |
| `resolve("/nope")`                        | Fehlerzeile plus Hinweiszeile, `out` klein                                          |

---

## 5. Phase 4: `apps/web`

### 5.1 `package.json`

```json
{
  "name": "@shubrt/web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "typecheck": "astro check && tsc --noEmit",
    "deploy": "wrangler deploy"
  },
  "dependencies": {
    "@astrojs/react": "catalog:",
    "@shubrt/contracts": "workspace:*",
    "@shubrt/session": "workspace:*",
    "astro": "catalog:",
    "react": "catalog:",
    "react-dom": "catalog:"
  },
  "devDependencies": {
    "@astrojs/check": "catalog:",
    "@tool/tsconfig": "workspace:*",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "typescript": "catalog:",
    "vite-plus": "catalog:",
    "wrangler": "catalog:"
  }
}
```

### 5.2 `tsconfig.json`

```json
{
  "extends": "@tool/tsconfig/react.json",
  "compilerOptions": {
    "types": ["astro/client"],
    "jsx": "react-jsx"
  },
  "include": [".astro/types.d.ts", "src/**/*", "*.mjs"],
  "exclude": ["dist"]
}
```

### 5.3 `astro.config.mjs`

```js
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://shubrt.me",
  output: "static",
  integrations: [react()],
  devToolbar: { enabled: false },
});
```

Kein Adapter. Die Seite ist vollständig statisch. Ein Adapter kommt erst, wenn
Server Islands gebraucht werden.

### 5.4 Daten

**`src/data/github.ts`**

```ts
export async function loadRepos(): Promise<Repo[]>;
```

Ablauf:

1. `GET https://api.github.com/users/shubrt/repos?per_page=100&sort=pushed`
   mit Headern `Accept: application/vnd.github+json`,
   `User-Agent: shubrt.me-build`, und `Authorization: Bearer <GITHUB_TOKEN>`
   nur wenn die Variable gesetzt ist.
2. Filtern: `fork === false`, `archived === false`, `private === false`.
   Nach `pushed_at` absteigend sortieren, die ersten **6** behalten.
3. Pro Repo `GET /repos/shubrt/<name>/stats/commit_activity`. Antwort ist ein
   Array von 52 Wochen. **Status 202 bedeutet: GitHub rechnet noch.** Dann
   einmal nach 1500 ms erneut versuchen, danach mit Nullen weitermachen.
   Aus den 52 Wochen die letzten 12 `total`-Werte nehmen.
4. `pushedLabel` aus dem Abstand zu jetzt bilden: `<60m` → `"Xm"`,
   `<24h` → `"Xh"`, `<7d` → `"Xd"`, `<5w` → `"Xw"`, sonst `"Xmo"`.
5. `id` als zweistellige Position `"01"` bis `"06"`.
6. Ergebnis gegen `reposSchema` parsen. Erfolg: nach
   `apps/web/data/repos.cache.json` schreiben (formatiert, mit Zeilenumbruch am
   Ende), damit der Fallback frisch bleibt.
7. **Jeder Fehler** (Netzwerk, Rate Limit, Schemafehler) wird geloggt und führt
   zum Lesen von `repos.cache.json`. Ist auch der kaputt, bricht der Build ab.
   Der Build darf nie mit leerer Repo-Liste durchlaufen.

**`src/content.config.ts`**

```ts
import { defineCollection } from "astro:content";
import { loadRepos } from "./data/github.ts";

const repos = defineCollection({
  loader: async () => (await loadRepos()).map((repo) => ({ ...repo, id: repo.id })),
});

export const collections = { repos };
```

Bewusst **ohne** `schema`. Die Validierung passiert vorher in
`libs/contracts` mit dem Zod aus dem Catalog. Astro bringt ein eigenes Zod
mit (`astro/zod`); zwei Zod-Instanzen im selben Schema führen zu
Typfehlern, die schwer zu lesen sind. Diese Trennung ist Absicht.

**`src/data/whoami.ts`**: exportiert `WhoamiGroup[]` mit den Werten aus
Anhang A4, geparst gegen `whoamiSchema`.

### 5.5 Hülle und Insel

**`src/pages/index.astro`** rendert statisch:

- `<head>`: Titel `shubrt.me`, Description, `og:*` und `twitter:*`,
  `color-scheme: dark`, Canonical, kein externes Font-Laden.
- Fensterrahmen: `.page > .terminal`, darin `.windowbar` mit drei Punkten und
  mittig `shubrt.me`.
- Die Profilbox als Astro-Markup inklusive `Mascot.astro`.
- Die Statusleiste unten: Composer-Rahmen, Context-Anzeige, `>> auto mode on`,
  `sh-1 (250k context)`, drei Social-Buttons.
- Dazwischen die Insel:
  `<Terminal repos={repos} whoami={whoami} client:load />`

Wichtig: Profilbox und Statusleiste sind statisch, **aber** die Profilbox muss
zusammen mit dem Verlauf scrollen und der Composer braucht Zustand. Deshalb
gilt folgende Schnittführung:

- `.windowbar` und `.control-rail` sind statisch in Astro.
- **Alles zwischen ihnen** (Session-Bereich inklusive Profilbox als erste Zeile,
  Slash-Menü, Composer-Zeile, Context-Anzeige) gehört in die Insel, weil es
  Zustand hat oder mit ihm scrollt.
- Die Profilbox wird als `children` an die Insel übergeben, damit ihr Markup
  im HTML steht und ohne JavaScript sichtbar ist.

Der Mascot ist statisches SVG in `Mascot.astro`, die Animationen sind reines
CSS. Er braucht kein React.

**`src/islands/Terminal.tsx`**: Funktionskomponente,
`useReducer(reduce, createInitialState(data))`, `useRef` für Session-Element
und Eingabefeld, `useEffect` für Timer und globalen Keydown-Listener.
Enthält **keine** Ablauflogik, nur:

- Zeilen rendern (eine `switch` über `row.kind`, ein Block pro Typ)
- Events in Actions übersetzen
- die Schritt-Timer starten und bei Unmount aufräumen
- nach jedem Update scrollen, wenn `stick` gesetzt ist

### 5.6 Styles

`src/styles/terminal.css` wird aus Anhang A1 übernommen. Keine Utility-Klassen,
keine Präprozessoren. Eine Datei, importiert in `index.astro`.

### Abnahme Phase 4

```bash
vp run -F @shubrt/web dev      # Seite lädt, leere Session, Profilbox sichtbar
vp run -F @shubrt/web build    # dist/ entsteht, repos.cache.json aktualisiert
GITHUB_TOKEN= vp run -F @shubrt/web build   # läuft auch ohne Token
```

Zusätzlich: `dist/index.html` enthält Profilbox und Statusleiste als Text.
Das ist der Beweis, dass die Hülle ohne JavaScript ankommt.

---

## 6. Phase 5: Deploy

**`wrangler.jsonc`**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "shubrt-me",
  "compatibility_date": "2026-08-01",
  "assets": {
    "directory": "./apps/web/dist",
    "not_found_handling": "404-page",
  },
}
```

Kein Worker-Skript. Statische Assets liegen auf dem schnellen Pfad, ohne
Cold Start.

**`.github/workflows/deploy.yml`**

- Trigger: `push` auf `main`, `schedule` mit `cron: "17 4 * * *"`,
  `workflow_dispatch`.
- Schritte: Checkout, Node 24, pnpm 11.1.1, Bun 1.3.10, `pnpm install
--frozen-lockfile`, `pnpm run qa`, dann Build mit
  `GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}`, dann `wrangler deploy` über
  `cloudflare/wrangler-action` mit `CLOUDFLARE_API_TOKEN` und
  `CLOUDFLARE_ACCOUNT_ID` aus den Repo-Secrets.
- `permissions: contents: read`.

```yaml
name: Deploy

on:
  push:
    branches: [main]
  schedule:
    - cron: "17 4 * * *"
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: deploy
  cancel-in-progress: false

jobs:
  deploy:
    name: Build and deploy
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: "24"
          package-manager-cache: false
      - uses: pnpm/action-setup@v6
        with:
          version: "11.1.1"
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: "1.3.10"
      - run: pnpm install --frozen-lockfile
      - run: pnpm run qa
      - run: pnpm run build
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

Action-Versionen wie in der Vorlage auf einen Commit-SHA pinnen, die Tags oben
sind nur zur Lesbarkeit.

Der eingebaute `GITHUB_TOKEN` reicht für öffentliche Repodaten und hebt das
Limit deutlich über die 60 Anfragen pro Stunde und IP.

Custom Domain `shubrt.me` einmalig im Cloudflare-Dashboard an den Worker binden.

### Abnahme Phase 5

Ein manueller `workflow_dispatch` läuft grün durch und die Seite ist unter
`shubrt.me` erreichbar. Der Cron erscheint in der Actions-Übersicht.

---

## 7. Phase 6: README und Aufräumen

`README.md` nach dem Muster der Vorlage: kurze Beschreibung, Abschnitt
`Packages`, `Local setup`, `Checks`, `Deploy`, `License`. Keine Screenshots,
keine Badges.

Diesen Plan nach `docs/implementation-plan.md` verschieben oder löschen.

---

## 8. Abnahme-Checkliste

Verhalten, Punkt für Punkt prüfbar im Browser:

- [ ] Beim Laden zeigt die Session nur die Profilbox, kein vorgerenderter Command
- [ ] Der Rahmen der Profilbox ist `#ff805c`
- [ ] Mittig im Fensterrahmen steht `shubrt.me`
- [ ] Version in der Box entspricht dem Alter, heute geprüft gegen Anhang A3
- [ ] Klick auf `/whoami`, `/projects`, `/help` schreibt den Befehl in den
      Composer und führt ihn **nicht** aus
- [ ] `/` öffnet das Menü, `/pro` filtert auf `/projects`, Treffer ist fett
- [ ] Pfeiltasten wechseln, Enter führt aus, Escape schließt, Tab vervollständigt,
      Klick führt aus
- [ ] Während eines Laufs steht unten `Cooking… (2s · ↓ 150 tokens)`, Sekunden
      und Tokens laufen hoch, neue Ausgaben erscheinen darüber
- [ ] Jeder Lauf dauert zwischen 2,2 und 4,6 Sekunden und ist unterschiedlich lang
- [ ] Abschlusszeile nennt dieselbe Tokenzahl wie der Zähler zuletzt
- [ ] Die Zahl in der Command-Zeile und in der Abschlusszeile sind identisch
- [ ] Context unten wächst pro Turn, `/projects` erkennbar stärker als `/help`
- [ ] Hochscrollen und dann einen Command ausführen springt nach unten
- [ ] Hochscrollen während eines Laufs stoppt das Nachziehen
- [ ] Repo-Zeilen öffnen GitHub in einem neuen Tab, Mittelklick funktioniert
- [ ] Aktivitätsbalken: das aktivste Repo hat die höchsten Blöcke, ein ruhiges
      Repo eine flache Linie
- [ ] Der breite Cursor sitzt an der Schreibposition, kein zweiter Strich-Cursor
- [ ] Marke blinzelt, zwinkert, lächelt, Antenne wippt, Kopf kippt; beim
      Überfahren zwinkert sie sofort; während eines Laufs wippt die Antenne schneller
- [ ] `prefers-reduced-motion: reduce` schaltet alle Animationen ab
- [ ] Bei 390 px Breite: kein horizontaler Scroll, Composer erreichbar,
      Touch-Ziele mindestens 44 px
- [ ] Ohne JavaScript sind Profilbox, Rahmen und Statusleiste sichtbar

---

## 9. Offene Punkte mit Default

| Punkt                               | Default, wenn nicht anders entschieden                                     |
| ----------------------------------- | -------------------------------------------------------------------------- |
| GitHub-Handles für die Social-Icons | Buttons bleiben, Klick schreibt eine Statuszeile `<name> link not set yet` |
| E-Mail-Adresse                      | nicht in die Seite schreiben, Icon verhält sich wie oben                   |
| Zahl der gezeigten Repos            | 6                                                                          |
| Wochen im Aktivitätsbalken          | 12                                                                         |
| Anzahl Commands                     | genau `/whoami`, `/projects`, `/help`                                      |
| Weitere freie Antworten             | die fünf aus Anhang A4, keine weiteren erfinden                            |

---

# Anhang

## A1 / Stylesheet

Vollständig übernehmen. Die Werte sind abgestimmt, nicht nachjustieren.

```css
:root {
  color-scheme: dark;
  --mono: "SFMono-Regular", "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  --page: #000;
  --terminal: #060606;
  --bar: #111;
  --ink: #f4f3ef;
  --muted: #aaa9a5;
  --quiet: #747474;
  --line: #2c2c2c;
  --command: #222;
  --accent: #ff805c;
  --gold: #ffd05c;
  --gutter: 18px;
}
* {
  box-sizing: border-box;
}
html,
body {
  margin: 0;
  background: var(--page);
}
body {
  color: var(--ink);
  font: 14px/1.5 var(--mono);
  font-synthesis: none;
}
a {
  color: var(--accent);
  text-decoration: none;
}
a:hover {
  color: #ffa389;
}
button {
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
input {
  font: inherit;
}
:focus-visible {
  outline: 1px solid var(--accent);
  outline-offset: 1px;
}

.page {
  display: grid;
  height: 100vh;
  padding: 14px;
  place-items: center;
  overflow: hidden;
  background: var(--page);
}
.terminal {
  display: grid;
  width: min(100%, 1440px);
  height: min(920px, calc(100vh - 28px));
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--terminal);
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.7);
}

.windowbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 14px;
  align-items: center;
  min-height: 46px;
  padding: 0 16px;
  border-bottom: 1px solid var(--line);
  background: var(--bar);
  font-size: 0.72rem;
}
.traffic {
  display: flex;
  gap: 8px;
  align-items: center;
}
.dot {
  width: 12px;
  height: 12px;
  border: 1px solid rgba(0, 0, 0, 0.24);
  border-radius: 50%;
}
.dot-red {
  background: #ff5f57;
}
.dot-yellow {
  background: #febc2e;
}
.dot-green {
  background: #28c840;
}
.window-title {
  overflow: hidden;
  color: #b3b2af;
  font-weight: 650;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session {
  min-height: 0;
  padding: 28px 30px 24px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-color: #333 transparent;
}
.log {
  display: block;
}
.slot {
  display: block;
}
.gap-lg {
  margin-top: 24px;
}
.gap-md {
  margin-top: 14px;
}
.gap-sm {
  margin-top: 10px;
}
.gap-xs {
  margin-top: 4px;
}

.terminal-line {
  display: grid;
  grid-template-columns: var(--gutter) minmax(0, 1fr);
  gap: 8px;
  align-items: baseline;
  min-width: 0;
  padding-left: 12px;
  overflow-wrap: anywhere;
}
.command-line {
  min-height: 38px;
  padding: 8px 12px;
  grid-template-columns: var(--gutter) minmax(0, 1fr) auto;
  background: var(--command);
}
.line-marker {
  width: var(--gutter);
  text-align: left;
}
.mk-white {
  color: #fff;
}
.mk-accent {
  color: var(--accent);
}
.mk-tool {
  color: #6f8f6a;
}
.mk-gold {
  color: var(--gold);
}
.mk-red {
  color: #ff6b5c;
}
.mk-quiet {
  color: #8c8c8c;
}
.mk-dim {
  color: #3f3f3e;
}

.cmd-label {
  color: #f5f4f0;
  font-weight: 650;
}
.command-stats {
  color: #898986;
  font-size: 0.68rem;
  white-space: nowrap;
}
.tx-ink {
  color: var(--ink);
}
.tx-muted {
  color: var(--muted);
}
.tx-quiet {
  color: var(--quiet);
  font-size: 0.75rem;
}
.tx-dim {
  color: #5c5c5a;
}
.tx-gold {
  color: #d8c79c;
  font-size: 0.78rem;
}
.tx-red {
  color: #f2b3ab;
  font-size: 0.78rem;
}
.tx-tool {
  color: #eceae5;
  font-weight: 650;
}
.tx-arg {
  color: #b9b7b2;
  font-weight: 400;
}
.pending-label {
  color: var(--accent);
}

.profile-panel {
  border: 1px solid var(--accent);
  background: #090807;
}
.profile-main {
  display: flex;
  gap: 18px;
  align-items: center;
  min-height: 100px;
  padding: 18px 22px;
}
.identity {
  min-width: 0;
}
.id-name {
  font-size: 1rem;
  font-weight: 750;
  letter-spacing: -0.025em;
}
.id-ver {
  color: var(--muted);
  font-weight: 600;
}
.id-role {
  margin-top: 3px;
  color: #b8b7b3;
  font-size: 0.78rem;
}
.id-path {
  color: #8d8c89;
  font-size: 0.78rem;
}
.command-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0 6px;
  align-items: center;
  min-height: 44px;
  padding: 0 16px;
  border-top: 1px solid #6b3a2c;
}
.nav-btn {
  min-height: 34px;
  padding: 0 6px;
  color: #bab7b3;
  font-size: 0.73rem;
}
.nav-btn:hover {
  color: #fff;
}

.mascot {
  width: 62px;
  height: 56px;
  flex: 0 0 auto;
  color: var(--accent);
  overflow: visible;
  shape-rendering: crispEdges;
}
.mascot g {
  transform-box: fill-box;
  transform-origin: center;
}
.g-lidL,
.g-lidR,
.g-wink,
.g-smCover,
.g-smHole {
  opacity: 0;
}
.m-all {
  animation: m-tilt 9s ease-in-out 0.4s infinite;
}
.g-ant {
  animation: m-pulse 9s ease-in-out infinite;
}
.g-lidL,
.g-lidR {
  animation: m-blink 6.5s steps(1, end) 1.4s infinite;
}
.g-wink {
  animation: m-wink 23s steps(1, end) 6s infinite;
}
.g-smCover,
.g-smHole {
  animation: m-smile 17s steps(1, end) 11s infinite;
}
.is-busy .g-ant {
  animation-duration: 2.4s;
}
.profile-main:hover .g-wink {
  animation: m-wink-once 760ms steps(1, end) 1;
}
@keyframes m-tilt {
  0% {
    transform: rotate(0);
  }
  2.4% {
    transform: rotate(-6deg);
  }
  5.4% {
    transform: rotate(5deg);
  }
  8.4%,
  100% {
    transform: rotate(0);
  }
}
@keyframes m-pulse {
  0% {
    transform: translateY(0);
  }
  2% {
    transform: translateY(-38%);
  }
  4.4% {
    transform: translateY(0);
  }
  6.6% {
    transform: translateY(-26%);
  }
  8.9%,
  100% {
    transform: translateY(0);
  }
}
@keyframes m-blink {
  0%,
  2% {
    opacity: 0;
  }
  2.1%,
  3.7% {
    opacity: 1;
  }
  3.8%,
  6.5% {
    opacity: 0;
  }
  6.6%,
  8.2% {
    opacity: 1;
  }
  8.3%,
  100% {
    opacity: 0;
  }
}
@keyframes m-wink {
  0%,
  1% {
    opacity: 0;
  }
  1.1%,
  2.9% {
    opacity: 1;
  }
  3%,
  100% {
    opacity: 0;
  }
}
@keyframes m-wink-once {
  0%,
  8% {
    opacity: 0;
  }
  10%,
  72% {
    opacity: 1;
  }
  75%,
  100% {
    opacity: 0;
  }
}
@keyframes m-smile {
  0%,
  1% {
    opacity: 0;
  }
  1.2%,
  7.5% {
    opacity: 1;
  }
  7.7%,
  100% {
    opacity: 0;
  }
}

.repo-row {
  display: grid;
  width: 100%;
  grid-template-columns: 26px minmax(120px, 1fr) 104px 58px 92px 48px;
  gap: 10px;
  align-items: center;
  min-height: 32px;
  border-bottom: 1px solid #1e1c1b;
  color: inherit;
  font-size: 0.74rem;
  text-decoration: none;
}
.repo-row:hover {
  background: #131110;
  color: inherit;
}
.repo-hd {
  display: grid;
  width: 100%;
  grid-template-columns: 26px minmax(120px, 1fr) 104px 58px 92px 48px;
  gap: 10px;
  align-items: center;
  min-height: 26px;
  border-bottom: 1px solid var(--line);
  color: var(--quiet);
  font-size: 0.66rem;
  text-transform: uppercase;
}
.rp-idx {
  color: var(--accent);
}
.rp-name {
  color: #f0efeb;
  font-weight: 650;
  white-space: nowrap;
}
.rp-ext {
  color: #4a4947;
  font-weight: 400;
}
.repo-row:hover .rp-ext {
  color: var(--gold);
}
.rp-act {
  color: var(--accent);
  letter-spacing: 1px;
  white-space: nowrap;
}
.rp-meta {
  color: var(--quiet);
  white-space: nowrap;
}

.grp-title {
  color: #f0efeb;
  font-weight: 700;
  font-size: 0.78rem;
}
.kv-row {
  display: grid;
  grid-template-columns: minmax(90px, 130px) minmax(0, 1fr);
  gap: 12px;
  align-items: baseline;
  font-size: 0.75rem;
}
.kv-ind {
  display: grid;
  grid-template-columns: minmax(66px, 96px) minmax(0, 1fr);
  gap: 12px;
  align-items: baseline;
  padding-left: 14px;
  font-size: 0.75rem;
}
.kv-key {
  color: var(--quiet);
}
.kv-val {
  color: #e6e5e1;
}
.kv-ph {
  color: var(--gold);
}

.file-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 74px 64px;
  gap: 10px;
  align-items: baseline;
  border-bottom: 1px solid #191716;
  font-size: 0.73rem;
  min-height: 24px;
}
.file-name {
  color: #e6e5e1;
}
.file-size,
.file-mtime {
  color: var(--quiet);
  text-align: right;
}
.cmdtable-row {
  display: grid;
  grid-template-columns: minmax(110px, 150px) minmax(0, 1fr);
  gap: 12px;
  align-items: baseline;
  font-size: 0.75rem;
  min-height: 26px;
}
.cmdtable-name {
  color: var(--accent);
}
.cmdtable-desc {
  color: var(--muted);
}

.terminal-bottom {
  min-width: 0;
  border-top: 1px solid var(--line);
}
.cmd-menu {
  max-height: 42vh;
  padding: 6px 0;
  overflow-y: auto;
  border-bottom: 1px solid var(--line);
  background: #0b0b0b;
}
.cmd-row {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(120px, 210px) minmax(0, 1fr);
  gap: 16px;
  align-items: baseline;
  min-height: 30px;
  padding: 3px 14px 3px 12px;
  border-left: 2px solid transparent;
  font-size: 0.78rem;
}
.cmd-row-name {
  color: #b6b5b1;
  white-space: nowrap;
}
.cmd-row-desc {
  overflow: hidden;
  color: #7b7b78;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cmd-row-sel {
  border-left-color: var(--accent);
  background: #161514;
}
.cmd-name-sel {
  color: var(--accent);
  white-space: nowrap;
}
.cmd-desc-sel {
  overflow: hidden;
  color: #a9a8a4;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cmd-hit {
  color: #fff;
  font-weight: 750;
}

.composer-row {
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(0, 1fr) minmax(250px, 320px);
  border-bottom: 1px solid var(--line);
  background: #080808;
}
.composer {
  display: grid;
  min-width: 0;
  min-height: 66px;
  padding: 10px 12px;
  grid-template-columns: var(--gutter) minmax(0, 1fr);
  gap: 8px;
  align-items: center;
}
.prompt-marker {
  width: var(--gutter);
  color: #fff;
  font-weight: 750;
}
.input-wrap {
  position: relative;
  display: flex;
  min-width: 0;
  align-items: center;
}
.composer-input {
  position: relative;
  z-index: 1;
  min-width: 0;
  flex: 1;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--ink);
  caret-color: transparent;
}
.composer-input::placeholder {
  color: #6e6d6b;
}
.composer-input:focus {
  outline: none;
}
.is-empty {
  text-indent: 1ch;
}
.cursor {
  position: absolute;
  top: 50%;
  z-index: 0;
  width: 1ch;
  height: 19px;
  margin-top: -10px;
  background: var(--accent);
  animation: cursor-blink 1.1s steps(1, end) infinite;
  pointer-events: none;
}
@keyframes cursor-blink {
  0%,
  48% {
    opacity: 1;
  }
  49%,
  100% {
    opacity: 0;
  }
}

.context-window {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  padding: 10px 14px;
  border-left: 1px solid var(--line);
  color: #82827f;
  font-size: 0.66rem;
}
.context-label {
  color: #9b9b98;
  text-transform: uppercase;
}
.context-meter {
  position: relative;
  width: 90px;
  height: 3px;
  flex: 0 0 auto;
  background: #2b2b2b;
}
.context-fill {
  display: block;
  height: 3px;
  background: var(--accent);
}
.context-usage {
  color: var(--accent);
  white-space: nowrap;
}

.control-rail {
  display: flex;
  flex-wrap: wrap;
  gap: 0 20px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  min-height: 46px;
  padding: 0 8px;
  background: #070707;
}
.mode-model {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  align-items: center;
  min-height: 44px;
  padding: 0 10px;
  font-size: 0.78rem;
}
.mode-arrows {
  color: var(--accent);
}
.mode-active {
  color: #fff;
  font-weight: 650;
  white-space: nowrap;
}
.model-info {
  color: #8c8c89;
  white-space: nowrap;
}
.socials {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
}
.social-icon {
  display: inline-grid;
  width: 44px;
  height: 44px;
  place-items: center;
  color: #ddd;
}
.social-icon:hover {
  color: var(--accent);
}
.social-svg {
  width: 19px;
  height: 19px;
}

@media (pointer: coarse) {
  .cmd-row,
  .repo-row,
  .nav-btn {
    min-height: 44px;
  }
}
@media (max-width: 860px) {
  .repo-row,
  .repo-hd {
    grid-template-columns: 26px minmax(0, 1fr) 104px 58px;
  }
  .rp-lang,
  .rp-push {
    display: none;
  }
}
@media (max-width: 760px) {
  body {
    font-size: 13px;
  }
  .page {
    padding: 6px;
  }
  .terminal {
    height: calc(100vh - 12px);
    border-radius: 8px;
  }
  .windowbar {
    padding: 0 12px;
  }
  .session {
    padding: 14px 14px 18px;
  }
  .gap-lg {
    margin-top: 18px;
  }
  .profile-main {
    padding: 15px;
  }
  .mascot {
    width: 50px;
    height: 46px;
  }
  .command-nav {
    padding: 4px 10px;
  }
  .file-row {
    grid-template-columns: minmax(0, 1fr) 60px;
  }
  .file-mtime {
    display: none;
  }
  .cmd-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
    padding-top: 6px;
    padding-bottom: 6px;
  }
  .cmd-row-desc,
  .cmd-desc-sel {
    white-space: normal;
  }
  .composer-row {
    grid-template-columns: 1fr;
  }
  .context-window {
    justify-content: flex-start;
    border-top: 1px solid var(--line);
    border-left: 0;
  }
  .control-rail {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }
  .socials {
    align-self: stretch;
    justify-content: flex-end;
    border-top: 1px solid #222;
  }
}
@media (max-width: 520px) {
  .repo-row,
  .repo-hd {
    grid-template-columns: 22px minmax(0, 1fr) 92px;
  }
  .rp-stars {
    display: none;
  }
  .repo-hd {
    display: none;
  }
}
@media (max-width: 430px) {
  .profile-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .mascot {
    width: 44px;
    height: 40px;
  }
  .command-stats {
    display: none;
  }
  .kv-row,
  .kv-ind,
  .cmdtable-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .cursor,
  .m-all,
  .g-ant,
  .g-lidL,
  .g-lidR,
  .g-wink,
  .g-smCover,
  .g-smHole,
  .profile-main:hover .g-wink {
    animation: none;
  }
}
```

## A2 / Zeilentypen

Der Verlauf ist eine **flache Liste**. Kein verschachtelter Baum. Jede Zeile ist
ein `.slot`-Container mit einer Abstandsklasse, darin genau ein Grid.
Das hält das Rendern zu einem `switch` und die Ausrichtung über alle
Eintragstypen hinweg stabil.

| `kind`       | Markup                                    | Inhalt                                                                                                            |
| ------------ | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `profile`    | `.profile-panel`                          | Marke, Identität, Command-Chips. Kommt als `children` aus Astro                                                   |
| `command`    | `.terminal-line.command-line`             | `›`, Label, rechts `187 tok / 3.2s`                                                                               |
| `pending`    | `.terminal-line`                          | Glyph, `Cooking…`, `(3s · ↓ 187 tokens)`                                                                          |
| `line`       | `.terminal-line`                          | Marker plus Text. Deckt Antwort, Hinweis, Status, Fehler, Abschluss ab, unterschieden über Marker- und Textklasse |
| `tool`       | `.terminal-line`                          | `⏺`, Titel fett, Argument gedämpft                                                                                |
| `group`      | `.terminal-line`                          | `●` plus Gruppentitel                                                                                             |
| `kv`         | `.terminal-line > .kv-row` oder `.kv-ind` | Schlüssel und Wert                                                                                                |
| `repoHead`   | `.terminal-line > .repo-hd`               | Spaltenköpfe `repo 52w stars lang push`                                                                           |
| `repo`       | `.terminal-line > a.repo-row`             | Index, Name mit `↗`, Blöcke, Sterne, Sprache, Push                                                                |
| `file`       | `.terminal-line > .file-row`              | Name, Größe, Alter                                                                                                |
| `commandRow` | `.terminal-line > .cmdtable-row`          | Command und Beschreibung                                                                                          |

Marker der ersten Zeile eines Blocks ist `●` in `--accent`, Folgezeilen haben
einen leeren Marker. Abstände: neuer Turn `gap-lg`, Blockanfang `gap-sm`,
Folgezeile `gap-xs`, Abschlusszeile `gap-md`.

Marker und Farben:

| Zweck        | Marker                       | Markerklasse | Textklasse                       |
| ------------ | ---------------------------- | ------------ | -------------------------------- |
| Antwort      | `●`                          | `mk-accent`  | `tx-ink`, Folgezeilen `tx-muted` |
| Tool         | `⏺`                          | `mk-tool`    | `tx-tool` plus `tx-arg`          |
| Toolergebnis | leer                         | `mk-dim`     | `tx-quiet`                       |
| Hinweis      | `›`                          | `mk-dim`     | `tx-quiet`                       |
| Status       | `⚠`                          | `mk-gold`    | `tx-gold`                        |
| Fehler       | `✗`                          | `mk-red`     | `tx-red`                         |
| Abschluss    | `✻`                          | `mk-quiet`   | `tx-quiet`                       |
| Laufend      | `✳ ✻ ✽ ✻` im Wechsel, 130 ms | `mk-accent`  | `pending-label`                  |

## A3 / Kernalgorithmen

Diese Funktionen sind erprobt. Übernehmen, nicht neu erfinden.

```ts
// Version aus dem Geburtsdatum: volle Jahre . Monate seit dem letzten
// Geburtstag . zusätzliche Tage. Geburtsdatum 18.09.1998.
export function ageVersion(now = new Date()): string {
  let y = now.getFullYear() - 1998;
  let m = now.getMonth() - 8;
  let d = now.getDate() - 18;
  if (d < 0) {
    m -= 1;
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  return `v${y}.${m}.${d}`;
}

// Grobe Tokenzahl für Text in einer Monospace-Oberfläche.
export const tk = (s: string) => Math.max(1, Math.round(s.length / 3.6));

// Wochenwerte als Blockzeichen, skaliert gegen das globale Maximum aller
// Repos, nicht gegen die eigene Zeile. Sonst wirkt ein ruhiges Repo aktiv.
const BLOCKS = " ▁▂▃▄▅▆▇█";
export function blocks(values: number[], globalMax: number): string {
  const top = globalMax || 1;
  return values.map((v) => BLOCKS.charAt(Math.min(8, Math.round((v / top) * 8)))).join("");
}

// Tokens, die das Modell geschrieben hat. Pro Zeile drei bis vier Tokens
// Strukturkosten obendrauf.
export function outTokens(step: Step): number {
  switch (step.kind) {
    case "tool":
      return 34;
    case "text":
      return step.lines.reduce((n, l) => n + tk(l) + 3, 0);
    case "groups":
      return step.groups.reduce(
        (n, g) => n + tk(g.title) + 3 + g.rows.reduce((m, [k, v]) => m + tk(k + v) + 4, 0),
        0,
      );
    case "repos":
      return 14 + repos.reduce((n, r) => n + tk(r.name + r.language + r.pushedLabel) + 16, 0);
    case "kv":
      return step.rows.reduce((n, [k, v]) => n + tk(k + v) + 4, 0);
    case "files":
      return step.rows.reduce((n, f) => n + tk(f.join(" ")) + 4, 0);
    case "commandTable":
      return commands.reduce((n, c) => n + tk(c.name + c.description) + 4, 0);
    default:
      return step.text ? tk(step.text) + 3 : 6;
  }
}

// Was ein Tool zurückgab. Sichtbar wird es nicht, es füllt nur den Kontext.
// Dateilesevorgänge skalieren mit der gemeldeten Zeilenzahl.
export function resTokens(step: Step): number {
  if (step.kind !== "tool") return 0;
  if (step.result !== undefined) return step.result;
  const hit = /(\d+)\s+lines/.exec(step.meta ?? "");
  return hit ? Number(hit[1]) * 11 : 120;
}
```

**Zeitplanung.** Basisgewichte pro Schritt: `tool` 340, `groups` 360,
`repos` 380, `kv` 280, `text` 300, `files` 280, `commandTable` 260,
`hint` 100, `status` 120, `error` 240. Danach:

```ts
const target = 2200 + rng() * 2400; // 2200 bis 4600 ms
const scale = target / Math.max(1, sumOfWeights);
const delay = Math.max(120, Math.round(weight * scale));
```

**Live-Zähler.** Intervall 130 ms.
`ms = min(now - start, durationMs)`, Anzeige
`(${Math.floor(ms / 1000)}s · ↓ ${Math.min(out, Math.round((out * ms) / durationMs))} tokens)`.

**Kontext.** `tokens += out + res + tk(label) + 8`. Anzeige
`fmt(tokens) + " (" + Math.round((tokens / 250000) * 100) + "%)"`, Balkenbreite
in Prozent. `fmt(n)` gibt `n >= 1000 ? (n/1000).toFixed(1) + "k" : String(n)`.

## A4 / Inhalte

**`/whoami`**, Beschreibung `Who I am, as structured data`, Ablauf:
`tool Read ~/dev/whoami.json` (Meta `Read <24..38> lines`), optional mit 40
Prozent Wahrscheinlichkeit `tool Read ~/dev/now.md` (Meta
`Read <12..20> lines, cached`), dann `groups`:

| Gruppe  | Zeilen                                                                                                |
| ------- | ----------------------------------------------------------------------------------------------------- |
| work    | `role` = `software architect`, `builds` = `infrastructure, architecture`, `focus` = `automation & ai` |
| stack   | `daily` = `typescript`, `shape` = `modern web, edge, services`                                        |
| place   | `city` = `mainz, germany`, `open to` = `selected work`                                                |
| offline | `music` = `piano, guitar`, `sport` = `basketball, gym`, `likes` = `coasters, wellness`                |

Zeilenzahlen wie `24..38` werden **einmal pro Session** gewürfelt und bleiben
dann stabil. Dieselbe Datei meldet nie zwei verschiedene Größen.

**`/projects`**, Beschreibung `Public repos, sorted by activity`, Ablauf:
`tool Fetch api.github.com/users/shubrt/repos` (Meta
`<n> public repos, sorted by push`, `result: 1780`), optional mit 55 Prozent
`tool Fetch stats/commit_activity` (Meta `52 weeks per repo, cached`,
`result: 690`), dann `repos`, dann Hinweis
`select a row to open the repo on github`.

**`/help`**, Beschreibung `List every command in this session`, Ablauf:
`text` mit `Commands are local. Plain questions work too.`, dann
`commandTable`, dann Hinweis
`type / to open the list, arrows to select, enter to run`.

**Freie Antworten**, erster Treffer gewinnt, Vergleich in Kleinschreibung
über `includes`:

| Auslöser                                                              | Antwort                                                                                                                                                                                                                                                               |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `what do you build`, `what do you do`, `build`                        | `tool Search ~/dev` (`Matched 3 files`, `result: 160`), `files` mit `whoami.json`, `repos.cache.json`, `stack.md`, dann zwei Textzeilen: `Infrastructure and architecture for the web, mostly typescript.` und `Currently a lot of automation and ai infrastructure.` |
| `stack`, `tech`, `tools`, `language`                                  | `tool Read ~/dev/stack.md`, dann `kv`: `daily` = `typescript, sql`, `runtime` = `node, edge functions`, `data` = `postgres, sqlite`, `infra` = `containers, boring pipelines`                                                                                         |
| `available`, `hire`, `freelance`, `work with`                         | Text `Open to selected work. Architecture reviews and greenfield systems fit best.`, Hinweis `run /whoami for the rest`                                                                                                                                               |
| `music`, `piano`, `guitar`, `basketball`, `sport`, `hobby`, `offline` | nur die Gruppe `offline` aus `/whoami`                                                                                                                                                                                                                                |
| `who are you`, `who is shubrt`, `about you`, `janis`                  | Text `Janis Schubert, software architect in mainz. Structured version under /whoami.`                                                                                                                                                                                 |

**Rückfall** ohne Treffer: `tool Search ~/dev` oder `tool Grep ~/dev` zufällig
(Meta `No local match`, `result: 40`), Text `Nothing local answers that yet.`,
Hinweis `try /whoami, /projects or /help`.

**Unbekannter Command**: Fehlerzeile `unknown command <name>`, Hinweiszeile
`available: /whoami /projects /help`.

**Feste Texte.** Platzhalter im Composer:
`Ask a question or type / for commands`. Statusleiste: `>> auto mode on` und
`sh-1 (250k context)`. Fenstertitel: `shubrt.me`. Identität:
`janis schubert · software architect` und `mainz, de`.

## A5 / Die Marke

Raster 11 Spalten mal 10 Zeilen, ein `<rect>` pro gesetzter Zelle,
`viewBox="0 0 11 10"`. Buchstaben sind Gruppen, nicht Farben.

```
....aaa....
.....a.....
.#########.
###########
##ee###ww##
##ee###ww##
###########
###.....###
###########
.##.....##.
```

| Zeichen | Gruppe   | Bedeutung                                         |
| ------- | -------- | ------------------------------------------------- |
| `#`     | `m-body` | Körper, `fill="currentColor"`                     |
| `a`     | `g-ant`  | Antenne, wippt                                    |
| `e`     | `g-lidL` | linkes Lid, standardmäßig unsichtbar              |
| `w`     | `g-lidR` | rechtes Lid für das Blinzeln                      |
| `.`     | kein     | Loch, nichts zeichnen. Augen und Mund sind Löcher |

Zusätzlich, nicht im Raster, per Hand ergänzen:

- `g-wink`: dieselben vier Zellen wie `g-lidR`, aber **eigene Gruppe**.
  Blinzeln und Zwinkern animieren beide `opacity`; auf derselben Gruppe würde
  die zuletzt notierte Animation gewinnen und das Blinzeln rechts ausfallen.
- `g-smCover`: `(4,7) (5,7) (6,7)` in `currentColor`, verdeckt die Mundmitte.
- `g-smHole`: `(4,8) (5,8) (6,8)` in `#090807`, öffnet eine Reihe tiefer.
  Beide zusammen sichtbar ergeben das Lächeln: Enden oben, Mitte unten.

Reihenfolge im SVG: `m-body`, `g-ant`, `g-lidL`, `g-lidR`, `g-wink`,
`g-smCover`, `g-smHole`. Alles in einer äußeren Gruppe `m-all`, die gekippt wird.

## A6 / Bekannte Fallen

1. **Zwei Zod-Instanzen.** Astro bringt `astro/zod` mit. Collections deshalb
   ohne `schema` definieren und stattdessen im Loader mit dem Catalog-Zod
   validieren.
2. **`stats/commit_activity` antwortet mit 202.** Beim ersten Aufruf rechnet
   GitHub die Statistik noch. Einmal nachfassen, dann Nullen. Nicht abbrechen.
3. **Pending-Zeile.** Sie muss während des Laufs die letzte Zeile bleiben.
   Neue Ausgaben werden davor eingefügt, nicht angehängt.
4. **Blinken des Cursors.** Der native Caret ist `caret-color: transparent`.
   Der Block sitzt bei `left: <caret>ch`. Bei leerem Feld steht er auf 0 und
   der Platzhalter bekommt `text-indent: 1ch`, sonst überdeckt der Block das
   erste Zeichen.
5. **Listenpunkte niemals als Grid-Container.** Ein `<li style="display:grid">`
   macht jedes Inline-Element darin zu einem eigenen Grid-Item, Text und `code`
   landen in verschiedenen Spalten. Marker über `position: absolute` setzen.
6. **Repo-Zeilen sind `<a>`**, nicht Buttons: `target="_blank"`,
   `rel="noopener noreferrer"`. Mittelklick und Kontextmenü müssen gehen.
7. **Globaler Keydown-Listener** darf Tasten nicht abfangen, wenn das Ziel ein
   `button` oder `a` ist, sonst funktioniert Leertaste auf fokussierten
   Elementen nicht mehr.
8. **`vp check` ist typbewusst.** `.astro`-Dateien gehören nicht in den
   TS-Lint. Falls `vp check` daran scheitert, `**/*.astro` in
   `lint.ignorePatterns` aufnehmen und `astro check` im `typecheck`-Skript
   die Arbeit machen lassen.
9. **Testfundort.** `vite.config.ts` sammelt nur
   `{apps,libs}/*/test/**/*.test.ts`. Logik, die getestet werden soll, gehört
   nach `libs/`, nicht in die Insel.
10. **`sherif`** meckert bei abweichenden Versionen zwischen Paketen. Alle
    gemeinsam genutzten Abhängigkeiten über `catalog:` beziehen.

## A7 / Referenz

Der interaktive Prototyp, aus dem diese Spezifikation stammt, liegt in
Claude Design unter dem Projekt "shubrt.me, Agent Terminal", Datei
`Agent Terminal.dc.html`. Er ist die visuelle Wahrheit bei Zweifeln.
