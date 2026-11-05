import { whoamiSchema, type WhoamiGroup } from "@shubrt/contracts";

// The structured fields behind /whoami. The "offline" group doubles as the
// free-text answer for hobby questions, so its title must stay stable.
export const whoami: WhoamiGroup[] = whoamiSchema.parse([
  {
    title: "work",
    rows: [
      ["role", "software architect"],
      ["builds", "infrastructure, architecture"],
      ["focus", "automation & ai"],
    ],
  },
  {
    title: "stack",
    rows: [
      ["daily", "typescript"],
      ["shape", "modern web, edge, services"],
    ],
  },
  {
    title: "place",
    rows: [
      ["city", "mainz, germany"],
      ["open to", "selected work"],
    ],
  },
  {
    title: "offline",
    rows: [
      ["music", "piano, guitar"],
      ["sport", "basketball, gym"],
      ["likes", "coasters, wellness"],
    ],
  },
]);
