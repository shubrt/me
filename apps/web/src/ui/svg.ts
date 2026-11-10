/** String builders for the step diagrams. The output is emitted with `set:html`. */

export const INK = "var(--ink)";
export const MUTED = "var(--muted)";
export const GREY = "#a8a8a2";
export const LINE = "#dcdcd7";
export const SOFT = "var(--soft)";
export const ACC = "var(--acc)";
export const ACC_TEXT = "var(--acc-text)";
export const TINT = "var(--acc-wash)";
export const RED = "#d4322c";
const GREEN = "#179550";
export const WHITE = "#fff";
/** Secondary text on INK surfaces. */
export const ON_INK = "#d6d6d1";

type Point = readonly [x: number, y: number];

type RectStyle = {
  fill?: string;
  stroke?: string;
  sw?: number;
  r?: number;
  dash?: string;
};

export function rect(
  x: number,
  y: number,
  w: number,
  h: number,
  { fill = WHITE, stroke = INK, sw = 1.4, r = 9, dash }: RectStyle = {},
): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}

type TextStyle = {
  size?: number;
  weight?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
};

export function text(
  x: number,
  y: number,
  content: string,
  { size = 15, weight = 400, fill = INK, anchor = "start" }: TextStyle = {},
): string {
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${content}</text>`;
}

export function circle(cx: number, cy: number, r: number, fill = INK): string {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
}

type LineStyle = {
  color?: string;
  sw?: number;
  dash?: string;
  hasHead?: boolean;
};

/** Polyline, with an arrow head on the last segment unless `hasHead` is false. */
export function line(
  points: readonly Point[],
  { color = INK, sw = 1.5, dash, hasHead = true }: LineStyle = {},
): string {
  const d = points.map(([x, y]) => `${x} ${y}`).join("L");
  const path = `<path d="M${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  const [from, to] = points.slice(-2);
  if (!hasHead || !from || !to) return path;

  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const wing = (spread: number) =>
    `${(to[0] - 8 * Math.cos(angle + spread)).toFixed(1)} ${(to[1] - 8 * Math.sin(angle + spread)).toFixed(1)}`;
  return `${path}<path d="M${to[0]} ${to[1]}L${wing(-0.42)}L${wing(0.42)}z" fill="${color}"/>`;
}

type ChipStyle = {
  h?: number;
  fill?: string;
  stroke?: string;
  color?: string;
  size?: number;
};

export function chip(
  x: number,
  y: number,
  w: number,
  label: string,
  { h = 38, fill = WHITE, stroke = LINE, color = INK, size = 15 }: ChipStyle = {},
): string {
  return (
    rect(x, y, w, h, { fill, stroke, sw: 1.2, r: 8 }) +
    text(x + w / 2, y + h / 2 + 5.5, label, { size, weight: 500, fill: color, anchor: "middle" })
  );
}

const ROW_HEIGHT = 23;

/** Table card: a title row over muted field names. */
export function card(
  x: number,
  y: number,
  w: number,
  title: string,
  rows: readonly string[],
): string {
  const h = 36 + ROW_HEIGHT * rows.length + 8;
  const head = `<path d="M${x + 0.7} ${y + 36}V${y + 9}a8.3 8.3 0 0 1 8.3-8.3H${x + w - 9}a8.3 8.3 0 0 1 8.3 8.3V${y + 36}z" fill="${SOFT}"/>`;
  const divider = `<path d="M${x} ${y + 36}H${x + w}" stroke="${INK}" stroke-width="1"/>`;
  return (
    rect(x, y, w, h) +
    head +
    divider +
    text(x + 13, y + 24, title, { size: 15.5, weight: 700 }) +
    rows
      .map((row, i) => text(x + 13, y + 36 + ROW_HEIGHT * i + 21, row, { size: 14, fill: MUTED }))
      .join("")
  );
}

export function check(x: number, y: number): string {
  return `<path d="M${x} ${y}l4 4 8-9" fill="none" stroke="${GREEN}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

export function cross(x: number, y: number): string {
  return `<path d="M${x} ${y}l9 9M${x + 9} ${y}l-9 9" fill="none" stroke="${RED}" stroke-width="2.2" stroke-linecap="round"/>`;
}

export function svg(
  className: "diagram wide" | "diagram narrow" | "picture",
  width: number,
  height: number,
  label: string,
  body: readonly string[],
): string {
  return `<svg class="${className}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">${body.join("")}</svg>`;
}
