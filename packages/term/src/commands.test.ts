import { describe, expect, it } from "vitest";
import { notes, projects, uses } from "./commands.ts";
import type { Content } from "./content.ts";

const content: Content = {
  projects: [{ name: "me", description: "this site", url: "https://github.com/shubrt/me", language: "Astro" }],
  notes: [
    { title: "a", date: "2026-01-02", url: "/notes/a" },
    { title: "b", date: "2026-01-01", url: "/notes/b" },
  ],
  uses: ["Ghostty", "Zed"],
  now: ["building this"],
};

describe("content commands", () => {
  it("projects prints one line per project with the url", () => {
    expect(projects(content).run([]).slice(2)).toEqual(["me    this site"]);
    expect(projects({ ...content, projects: [{ ...content.projects[0]!, stars: 3, pushedAt: "2026-02-18T19:00:00Z" }] }).run([]).slice(2)).toEqual(["me    this site  ★ 3  pushed 2026-02-18"]);
  });

  it("notes takes a count and ignores nonsense", () => {
    expect(notes(content).run(["1"])).toHaveLength(1);
    expect(notes(content).run(["many"])).toHaveLength(2);
  });

  it("uses prints the list as is", () => {
    expect(uses(content).run([])).toEqual(["Ghostty", "Zed"]);
  });
});

describe("aliases", () => {
  it("resolve to the target and show up in help", async () => {
    const { Registry } = await import("./registry.ts");
    const { help, whoami } = await import("./commands.ts");
    const registry = new Registry().register(whoami).alias("cat", "whoami");
    registry.register(help(registry));
    expect(registry.get("cat")?.name).toBe("whoami");
    expect(help(registry).run([]).find((l) => l.startsWith("whoami"))).toContain("(also: cat)");
  });
});
