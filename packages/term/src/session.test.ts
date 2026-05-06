import { describe, expect, it } from "vitest";
import type { Content } from "./content.ts";
import { createSession } from "./session.ts";

const content: Content = { projects: [], notes: [], uses: ["Zed"], now: ["testing"] };

describe("createSession", () => {
  it("echoes, runs and streams synchronously with delay 0", () => {
    const states: number[] = [];
    const session = createSession({ content, delay: 0, onChange: (s) => states.push(s.lines.length) });
    session.dispatch({ type: "type", value: "uses" });
    session.dispatch({ type: "submit" });
    const texts = session.getState().lines.map((l) => l.text);
    expect(texts[0]).toBe("uses");
    expect(texts[1]).toBe("Zed");
    expect(session.history.all()).toEqual(["uses"]);
  });

  it("resolves aliases from the default registry", () => {
    const session = createSession({ content, delay: 0, onChange: () => {} });
    expect(session.registry.get("ls")?.name).toBe("projects");
  });
});

describe("help", () => {
  it("lists every registered command once, sorted", () => {
    const session = createSession({ content, delay: 0, onChange: () => {} });
    const names = session.registry.list().map((c) => c.name);
    expect(names).toEqual([...names].sort());
    expect(new Set(names).size).toBe(names.length);
    expect(names).toContain("help");
  });
});
