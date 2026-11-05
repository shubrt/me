import { blocks, fmt } from "../helper/format.ts";
import type { SessionData, Step } from "./registry.ts";

/**
 * The transcript is a flat list of rows, no nested tree. Every row becomes
 * one `.slot` container whose `cls` carries the spacing class.
 */
export type Row =
  | { kind: "profile"; cls: string }
  | { kind: "command"; cls: string; label: string; stats: string }
  | { kind: "pending"; cls: string; glyph: string; elapsed: string }
  | { kind: "line"; cls: string; marker: string; mkCls: string; text: string; txCls: string }
  | { kind: "tool"; cls: string; title: string; arg: string }
  | { kind: "group"; cls: string; title: string }
  | {
      kind: "kv";
      cls: string;
      marker: string;
      mkCls: string;
      rowCls: string;
      k: string;
      v: string;
      valCls: string;
    }
  | { kind: "repoHead"; cls: string }
  | {
      kind: "repo";
      cls: string;
      marker: string;
      mkCls: string;
      id: string;
      name: string;
      url: string;
      act: string;
      stars: string;
      lang: string;
      push: string;
    }
  | {
      kind: "file";
      cls: string;
      marker: string;
      mkCls: string;
      name: string;
      size: string;
      mtime: string;
    }
  | { kind: "commandRow"; cls: string; marker: string; mkCls: string; name: string; desc: string };

const LEAD = "line-marker mk-accent";
const PLAIN = "line-marker";

/** One flow step turns into a flat list of terminal rows. */
export function expandStep(step: Step, data: SessionData): Row[] {
  const out: Row[] = [];

  switch (step.kind) {
    case "tool":
      out.push({ kind: "tool", cls: "slot gap-sm", title: step.title, arg: step.arg });
      if (step.meta) out.push(line("", "mk-dim", step.meta, "tx-quiet", "slot"));
      return out;

    case "text":
      step.lines.forEach((l, i) => {
        out.push(
          line(
            i === 0 ? "●" : "",
            i === 0 ? "mk-accent" : "mk-dim",
            l,
            i === 0 ? "tx-ink" : "tx-muted",
            i === 0 ? "slot gap-sm" : "slot gap-xs",
          ),
        );
      });
      return out;

    case "groups":
      for (const g of step.groups) {
        out.push({ kind: "group", cls: "slot gap-sm", title: g.title });
        for (const [k, v] of g.rows) out.push(kvRow(k, v, "", PLAIN, "slot", true));
      }
      return out;

    case "repos":
      out.push({ kind: "repoHead", cls: "slot gap-sm" });
      data.repos.forEach((r, i) => {
        out.push({
          kind: "repo",
          cls: "slot",
          marker: i === 0 ? "●" : "",
          mkCls: i === 0 ? LEAD : PLAIN,
          id: r.id,
          name: r.name,
          url: r.url,
          act: blocks(r.activity, data.activityMax),
          stars: String(r.stars),
          lang: r.language,
          push: r.pushedLabel,
        });
      });
      return out;

    case "kv":
      step.rows.forEach(([k, v], i) => {
        out.push(
          kvRow(
            k,
            v,
            i === 0 ? "●" : "",
            i === 0 ? LEAD : PLAIN,
            i === 0 ? "slot gap-sm" : "slot",
            false,
          ),
        );
      });
      return out;

    case "files":
      step.rows.forEach(([name, size, mtime], i) => {
        out.push({
          kind: "file",
          cls: i === 0 ? "slot gap-sm" : "slot",
          marker: i === 0 ? "●" : "",
          mkCls: i === 0 ? LEAD : PLAIN,
          name,
          size,
          mtime,
        });
      });
      return out;

    case "commandTable":
      data.commands.forEach((c, i) => {
        out.push({
          kind: "commandRow",
          cls: i === 0 ? "slot gap-sm" : "slot",
          marker: i === 0 ? "●" : "",
          mkCls: i === 0 ? LEAD : PLAIN,
          name: c.name,
          desc: c.description,
        });
      });
      return out;

    case "status":
      return [line("⚠", "mk-gold", step.text, "tx-gold", "slot gap-sm")];
    case "error":
      return [line("✗", "mk-red", step.text, "tx-red", "slot gap-sm")];
    case "hint":
      return [line("›", "mk-dim", step.text, "tx-quiet", "slot gap-sm")];
  }
}

export function commandRow(label: string): Row {
  return { kind: "command", cls: "slot gap-lg", label, stats: "" };
}

export function pendingRow(): Row {
  return { kind: "pending", cls: "slot gap-sm", glyph: "✳", elapsed: "(0s · ↓ 0 tokens)" };
}

export function cookedRow(out: number, seconds: number, tools: number): Row {
  const calls = `${tools} tool call${tools === 1 ? "" : "s"}`;
  return line(
    "✻",
    "mk-quiet",
    `Cooked for ${seconds.toFixed(1)}s · ${fmt(out)} tokens · ${calls}`,
    "tx-quiet",
    "slot gap-md",
  );
}

export function line(marker: string, mk: string, text: string, txCls: string, cls: string): Row {
  return { kind: "line", cls, marker, mkCls: `line-marker ${mk}`, text, txCls };
}

function kvRow(
  k: string,
  v: string,
  marker: string,
  mkCls: string,
  cls: string,
  isIndented: boolean,
): Row {
  const isPlaceholder = /^\[.*\]$/.test(v);
  return {
    kind: "kv",
    cls,
    marker,
    mkCls,
    k,
    v,
    rowCls: isIndented ? "kv-ind" : "kv-row",
    valCls: isPlaceholder ? "kv-ph" : "kv-val",
  };
}
