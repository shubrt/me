# shubrt.me

My personal page. A pnpm workspace:

- `apps/site`: the Astro site
- `packages/term`: the terminal core behind the prompt on the start page. Parsing, commands, history, completion. No DOM.

Commits follow conventional commits, checked by commitlint on commit.

```sh
pnpm install
pnpm dev
```

`npm run lint` runs Biome, `npm run format` fixes what it can.

Deployed with Cloudflare Pages on every push to `main`. Build command is `npm run build`, output is `dist`.

## Notes

The `/notes` page will hold short notes, one thing learned per note. Not a blog. Content will live in a collection once there is content.

## Pages

- `/`, `/uses`, `/now`, `/imprint`: plain Astro pages in `src/pages`
- `/projects`: `src/data/projects.json`, enriched from the GitHub API at build time
- `/notes`: markdown in `src/content/notes`, one note per file, with RSS and JSON feeds
