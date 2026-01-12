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
    expect(projects(content).run([])).toEqual(["me           this site  https://github.com/shubrt/me"]);
  });

  it("notes takes a count and ignores nonsense", () => {
    expect(notes(content).run(["1"])).toHaveLength(1);
    expect(notes(content).run(["many"])).toHaveLength(2);
  });

  it("uses prints the list as is", () => {
    expect(uses(content).run([])).toEqual(["Ghostty", "Zed"]);
  });
});
