# shubrt.me

Personal site: a coding-agent terminal as a portfolio. Astro 7 with a single
React island, deployed as static assets on Cloudflare Workers.

Production runs at `https://shubrt.me`.

## Packages

- `apps/web`: Astro site, the terminal shell and the one React island
- `libs/session`: terminal core — commands, reducer, scheduling; no React, no DOM
- `libs/contracts`: zod schemas and types for every data shape

GitHub repo data is fetched at build time and cached in
`apps/web/data/repos.cache.json`; the committed cache is the fallback when the
API is unreachable. A daily deploy cron keeps repos and the age-based version
fresh.

## Local setup

Requirements: [Vite+](https://viteplus.dev) (`vp`), pnpm 11, Node 22+ and Bun 1.3.10+.

```bash
vp i
vp run -F @shubrt/web dev
```

`GITHUB_TOKEN` is optional; without it the unauthenticated GitHub rate limit
applies, which is enough for local builds.

## Checks

```bash
vp run qa
```

`qa` runs formatting, linting, `sherif`, typechecks and the test suite. Tests
live in each package's `test/` directory and run from the repository root:

```bash
vp test run     # single pass
vp test watch   # watch mode
```

## Deploy

Every push to `main` (and a daily cron) builds and deploys via GitHub Actions
using `wrangler deploy`. Required repo secrets: `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID`. Manual deploy:

```bash
vp run build
vp run -F @shubrt/web deploy
```

## Docs

- `docs/implementation-plan.md`: the brief the first version was built from
- `docs/reference-prototype.html`: the static prototype the terminal design follows

## License

Private, all rights reserved.
