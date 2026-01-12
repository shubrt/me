/** Everything the commands can print. Passed in at startup so the package knows nothing about files or Astro. */
export interface Project {
  name: string;
  description: string;
  url?: string;
  language: string;
}

export interface Note {
  title: string;
  date: string;
  url: string;
}

export interface Content {
  projects: Project[];
  notes: Note[];
  uses: string[];
}
