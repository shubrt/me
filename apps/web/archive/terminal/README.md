# Parked terminal

The previous shubrt.me: a coding-agent terminal as a portfolio, one Astro page with
a React island and GitHub repo data fetched at build time. The one-pager replaced
it, and the code sits here unmodified.

Nothing in this folder is part of the build. The `include` list in
`apps/web/tsconfig.json` does not name it, and `vite.config.ts` keeps it out of lint
and format.

## What is parked

| Parked file                | Original path                         |
| -------------------------- | ------------------------------------- |
| `components/Mascot.astro`  | `apps/web/src/components/Mascot.astro` |
| `content.config.ts`        | `apps/web/src/content.config.ts`      |
| `data/github.ts`           | `apps/web/src/data/github.ts`         |
| `data/repos.cache.json`    | `apps/web/data/repos.cache.json`      |
| `data/whoami.ts`           | `apps/web/src/data/whoami.ts`         |
| `islands/Terminal.tsx`     | `apps/web/src/islands/Terminal.tsx`   |
| `pages/index.astro`        | `apps/web/src/pages/index.astro`      |
| `styles/terminal.css`      | `apps/web/src/styles/terminal.css`    |

Note that `repos.cache.json` lived in `apps/web/data/`, not under `src/`.

`libs/session` and `libs/contracts` stay in the workspace. The session package
keeps its tests, and `repoSchema` and `whoamiSchema` stay in the contracts, so
neither needs restoring.

## Bringing it back

1. Move every file to its original path. `pages/index.astro` collides with the
   one-pager's page, so decide first where each of them lives. The site has since
   moved to the layout in `.agents/structure.md`, so these paths are the terminal's
   own and its files still need renaming to fit that layout:

   ```bash
   cd apps/web
   mkdir -p data src/components src/data src/islands src/styles
   git mv archive/terminal/components/Mascot.astro src/components/Mascot.astro
   git mv archive/terminal/content.config.ts src/content.config.ts
   git mv archive/terminal/data/github.ts src/data/github.ts
   git mv archive/terminal/data/repos.cache.json data/repos.cache.json
   git mv archive/terminal/data/whoami.ts src/data/whoami.ts
   git mv archive/terminal/islands/Terminal.tsx src/islands/Terminal.tsx
   git mv archive/terminal/styles/terminal.css src/styles/terminal.css
   git mv -f archive/terminal/pages/index.astro src/pages/index.astro
   ```

2. Add the React entries back to `catalog` in `pnpm-workspace.yaml`:

   ```yaml
   "@astrojs/react": ^6.0.4
   react: ^19.2.0
   react-dom: ^19.2.0
   "@types/react": ^19.2.0
   "@types/react-dom": ^19.2.0
   ```

   Then re-add the dependencies in `apps/web/package.json` and run `vp i`:

   ```json
   "dependencies": {
     "@astrojs/react": "catalog:",
     "@shubrt/session": "workspace:*",
     "react": "catalog:",
     "react-dom": "catalog:"
   },
   "devDependencies": {
     "@types/react": "catalog:",
     "@types/react-dom": "catalog:"
   }
   ```

3. In `apps/web/astro.config.mjs`, import `react` from `@astrojs/react` and add
   `react()` to `integrations`.

4. In `vite.config.ts`, add `apps/web/data/*.json` back to `ignorePatterns` under
   both `lint` and `fmt`.

5. For fresh repo data, restore the daily build: the `schedule` trigger
   (`cron: "17 4 * * *"`) in `.github/workflows/deploy.yml` and `GITHUB_TOKEN` as env
   of its build step. Recreate `.env.example` with a `GITHUB_TOKEN=` line and put
   `!/.env.example` back in `.gitignore`, otherwise git ignores the file. Without a
   token the unauthenticated GitHub limit of 60 requests per hour applies, which is
   enough for local builds.
