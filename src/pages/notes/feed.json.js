import { getCollection } from "astro:content";

export async function GET(context) {
  const notes = (await getCollection("notes")).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Notes · Janis Schubert",
    home_page_url: new URL("/notes", context.site).href,
    feed_url: new URL("/notes/feed.json", context.site).href,
    items: notes.map((note) => ({
      id: note.id,
      url: new URL(`/notes/${note.id}`, context.site).href,
      title: note.data.title,
      date_published: note.data.date.toISOString(),
      content_text: note.body ?? "",
      tags: note.data.tags,
    })),
  };
  return new Response(JSON.stringify(feed, null, 2), { headers: { "Content-Type": "application/feed+json" } });
}
