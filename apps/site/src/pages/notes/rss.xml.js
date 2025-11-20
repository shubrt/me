import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const notes = (await getCollection("notes")).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: "Notes · Janis Schubert",
    description: "Short notes on things I learned.",
    site: context.site,
    items: notes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.date,
      link: `/notes/${note.id}`,
      description: note.body?.split(/\n\s*\n/)[0] ?? "",
    })),
  });
}
