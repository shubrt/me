# shubrt.me

One-pager for Janis Schubert's software architecture work, in German and English.
Astro 7 builds static pages, and one small Cloudflare Worker handles the contact
form.

Production runs at `https://shubrt.me`.

## Packages

- `apps/web`: the Astro site and the contact worker in `src/`, and the parked
  terminal in `archive/terminal/`, which stays out of the build
- `libs/contracts`: zod schemas and types, including the contact form
- `libs/session`: core of the parked terminal; the site no longer uses it

## Local setup

Requirements: [Vite+](https://viteplus.dev) (`vp`), pnpm 11, Node 22+ and Bun 1.3.10+.

```bash
vp i
vp run -F @shubrt/web dev
```

`astro dev` serves the pages only. The contact form needs the worker.

## Preview with the worker

```bash
vp run build
vp run -F @shubrt/web preview
```

`preview` runs `wrangler dev` on `http://localhost:8787` with the built pages and
the worker. Wrangler simulates the mail binding: each send prints sender,
recipient and subject and writes the body to a local file, and no mail leaves the
machine. `"remote": true` on the binding would send real mail, so leave it off.

```bash
curl -i localhost:8787/api/contact -d 'name=Eva&email=eva@example.com&lang=de'
```

## Contact form

`apps/web/src/handler/contact.ts` answers `POST /api/contact`. Only `/api/*` starts
the worker (`assets.run_worker_first`), every other path is a static asset.

The worker gives spam a fake success and sends nothing: a filled honeypot, or a
form sent less than 3 seconds after the page loaded. A body declared over 64 KB stays
unread and fails validation. Everything else goes through
`contactSchema` and then out as plain text from `kontakt@shubrt.me` to
`shubrt.me@gmail.com`, with the visitor as reply-to. The worker stores nothing. It
logs only which spam trap fired and the Email Service error code.

The subject holds only the time, because Cloudflare keeps sender, recipient and subject
of every mail in its event data for 31 days. Visitor data belongs in the body only, or
the privacy page has to change.

## Checks

```bash
vp run qa
```

`qa` runs formatting, linting, `sherif`, typechecks and the test suite. Tests
live in each package's `src/test/` directory and run from the repository root:

```bash
vp test run     # single pass
vp test watch   # watch mode
```

## Deploy

Every push to `main` builds and deploys via GitHub Actions using `wrangler deploy`.
Required repo secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Manual
deploy:

```bash
vp run build
vp run -F @shubrt/web deploy
```

## Before go-live

These steps happen in the Cloudflare dashboard. Without the first two, every form
submission ends on the error anchor.

1. **Sender domain.** Under Compute > Email Service > Email Routing, onboard
   `shubrt.me`. Cloudflare adds MX, SPF and DKIM records, and onboarding fails if
   another provider's MX records exist. Email Routing is enough and works on
   Workers Free, because all mail goes to one verified address. Onboarding the
   domain under Email Sending needs Workers Paid and only matters for mailing
   arbitrary recipients.
2. **Destination.** Under Email Routing > Destination Addresses, add
   `shubrt.me@gmail.com` and confirm the verification mail.
3. **Contact address.** Under Email Routing > Routing Rules, create the custom
   address `kontakt@shubrt.me` with the action Send to an email and the verified
   `shubrt.me@gmail.com` as destination. The contact section and the legal pages
   show this address, and mail to it bounces until the rule exists.
4. **www.** Add a proxied DNS record for `www.shubrt.me` and a redirect rule to
   `https://shubrt.me` that keeps path and query. The custom domain in
   `wrangler.jsonc` binds the apex only.
5. **HTTPS.** Under SSL/TLS > Edge Certificates, turn on Always Use HTTPS. The
   `Strict-Transport-Security` header in `apps/web/public/_headers` only reaches
   visitors who already came in over HTTPS. Then check that
   `curl -I http://shubrt.me/` and `curl -I http://www.shubrt.me/` both answer with
   a redirect to `https://`.
6. **Cookies and analytics.** The privacy page says the site sets no cookies and
   uses no analytics. Leave Bot Fight Mode (it sets `__cf_bm`) and Cloudflare Web
   Analytics off, or update the page.
7. **Email preview.** If `shubrt.me` ever moves to Email Sending, turn Email preview
   off for the domain. New sending domains get it by default, and it keeps full
   messages for about seven days, which the privacy page does not cover.

After the first deploy, send one real form and check the Gmail inbox. If it fails,
`wrangler tail` shows the error code, for example `E_SENDER_DOMAIN_NOT_AVAILABLE`.

## Docs

- `AGENTS.md` and `.agents/`: the rules for code, structure, naming, tests and local work
- `docs/implementation-plan.md`: the brief the parked terminal was built from
- `docs/reference-prototype.html`: the static prototype that terminal follows

## License

All rights reserved. The code is public to read but comes with no license.
