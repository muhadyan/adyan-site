# adyan-site

Personal pitch site for Adyan Rohutomo, served at **https://adyan.admos.id**.
One page in Indonesian (`/`) and English (`/en/`), with the main button opening WhatsApp.

Built with Astro (static output), no client-side framework.

## Develop

```sh
bun install
bun run dev        # http://localhost:4321
bun run test       # unit tests (Vitest)
bun run e2e        # browser tests (Playwright; builds and previews the site)
bun run build      # type check + static build into dist/
```

## Edit content

| What | Where |
|---|---|
| All page text (ID and EN) | `src/content/id.ts`, `src/content/en.ts` (same shape, enforced by type and test) |
| Project links and screenshots | `src/data/work.ts` |
| WhatsApp number, email, links | `src/config.ts` |
| Colors, type, spacing | `src/styles/global.css` |

### Screenshots

- Public pages: `bun run shoot [name]` (script `scripts/shoot.ts`) writes to `src/assets/work/`.
- Logged-in screens come from **local dev instances seeded with fake data**, never production:
  `DEMO_EMAIL=… DEMO_PASSWORD=… bun scripts/shoot-local.ts admos`.
- Optional slots appear on the page as soon as the file exists:
  - `src/assets/work/laris-scan.png`: Laris camera-scan screen (portrait phone capture).
  - `src/assets/profile/<any>.jpg`: portrait photo; replaces the "AR" monogram.

### Link preview image

`public/og-id.png` and `public/og-en.png` are rendered from `/og/<lang>/`.
After changing the hero text, run `bun run dev` and then `bun run og`.

## Deploy

Hosting is Cloudflare Pages, project `adyan-site`.

**Automatic:** every push to `main` deploys to production; every pull request gets a preview URL.
Cloudflare Pages build settings: build command `bun run build`, output directory `dist`, env `BUN_VERSION=1.3.5`.

**Manual fallback** (if the Git integration is down):

```sh
bunx wrangler login   # once
bun run deploy        # builds and uploads dist/ to the production branch
```

### Domain

`adyan.admos.id` is a CNAME at Hostinger (DNS for `admos.id`):

| Type | Name | Target |
|---|---|---|
| CNAME | `adyan` | `adyan-site.pages.dev` |

Then add `adyan.admos.id` under Cloudflare Pages → `adyan-site` → Custom domains.
