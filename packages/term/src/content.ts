/** Everything the commands can print. Passed in at startup so the package knows nothing about files or Astro. */
import type { Repo } from "@shubrt/contracts";

/** A project is a repo from contracts, with everything but the name optional for hand-written entries. */
export type Project = Partial<Repo> & { name: string; description: string };

export interface Note {
  title: string;
  date: string;
  url: string;
}

export interface Content {
  projects: Project[];
  notes: Note[];
  uses: string[];
  now: string[];
}
