# Photography Portfolio + Blog — Astro Template

A minimal, fast photography portfolio with two blogs and a fixed left-hand
navigation (**Digital · Analog · Calendar · Tech Blog · Photo Blog · About ·
Contact · License**) and responsive photo galleries. Built with
[Astro](https://astro.build) and deployable on
[Cloudflare](https://developers.cloudflare.com/workers/static-assets/) — static
pages plus a tiny optional Worker that powers a first-party page-view counter.

It ships with **tasteful, generated placeholder images and example posts**, so it
looks complete the moment you run it. Swap in your own name, links, and photos
and you have a finished site.

- **Digital** is the home page — your digital photographs.
- **Analog** is a second gallery for film work.
- **Calendar** shows one photo per month, newest first.
- **Tech Blog** and **Photo Blog** are Markdown/MDX blogs with a share button and
  an optional per-page view count.
- **About / Contact / License / Privacy** are simple, editable pages.
- Layout adapts from a sidebar (desktop) to a top bar + menu (tablet & phone).
- Click any photo for a full-screen lightbox (arrow keys / swipe-friendly).
- Light/dark theme toggle, privacy-friendly by default, strong SEO out of the box.

> **Everything you see is a placeholder.** The photos are generated gradients,
> the name is "Your Name", and the two blog posts are examples. The steps below
> walk you through making it your own.

---

## 1. Quick start

**Requirements:** Node **≥ 22.12** (required by Astro 6; this repo's `.nvmrc`
pins major `22`).

```bash
# Use this repo as a GitHub template (green "Use this template" button), or clone:
git clone https://github.com/XD-QIN/astro-photo-folio.git my-site
cd my-site
npm install
npm run dev
```

Open **http://localhost:4321**. Edits to pages, styles, `src/config.ts`, and
photos in `src/assets/**` hot-reload instantly. Press `Ctrl+C` to stop.

To preview the **real production build** (optimized WebP, sitemap, etc.):

```bash
npm run build
npm run preview
```

> Security headers in `public/_headers` are applied by Cloudflare, so they won't
> appear under `npm run preview` — that's expected.

---

## 2. Make it yours

Work top to bottom; each step is independent.

### 2.1 Name, links & description → `src/config.ts`

This one file drives the brand, page titles, SEO, JSON-LD, and `llms.txt`:

```ts
export const site = {
  name: 'Your Name',
  nameZh: '',                 // optional second-script name (see §4); '' hides it
  title: 'Your Name',
  description: 'A minimal photography portfolio and blog…',
};

export const social = {
  instagram: 'https://www.instagram.com/yourusername',
  linkedin:  'https://www.linkedin.com/in/yourusername',
  github:    'https://github.com/yourusername',
};
```

To change the social icons themselves, edit the `<Icon>` list in
`src/components/Sidebar.astro` and the `links` array in `src/pages/contact.astro`
(both reference `social`). An unused icon (`scholar`) is included if you'd rather
swap one out.

### 2.2 Your photos → `src/assets/digital/` and `src/assets/analog/`

- Drop `.jpg`, `.png`, or `.webp` files into the folder for that gallery — they
  appear automatically.
- **Filename = order + caption.** Files sort by name, so prefix them to order
  (`01-…`, `02-…`); the rest becomes the caption: `01-golden-hour.jpg` →
  *"Golden hour."*
- Delete the bundled `digital-01.jpg …` / `analog-01.jpg …` placeholders once you
  add your own.
- **Upload full-resolution exports** — see *§3 How photos are served* for how
  they're downscaled for the web.
- Optional richer captions ("Month Year, Location") live in
  `src/data/galleries.ts`, keyed by filename.

### 2.3 Calendar → `src/data/calendar.ts` + `src/assets/calendar/`

The **Calendar** shows one photo per month — every entry that has a matching
image, newest first. To add a month:

1. Drop the image in `src/assets/calendar/` (e.g. `2026-07.jpg`).
2. Add an entry in `src/data/calendar.ts`:

   ```ts
   { year: 2026, month: 7, location: 'Lisbon, Portugal', file: '2026-07.jpg' },
   ```

It renders as **"July 2026, Lisbon, Portugal."** Entries whose image isn't
present yet are skipped, so you can stage future months.

### 2.4 About / Contact / License / Privacy pages

- `src/pages/about.astro` — your bio and the little "fact" cards (rename/remove
  them freely).
- `src/pages/contact.astro` — the social links shown as cards.
- `src/pages/license.astro` — image-usage terms shown to visitors.
- `src/pages/privacy.astro` — a privacy-friendly starting policy. **Review it
  before publishing** (it's a sensible default, not legal advice) and update the
  `lastUpdated` date.

### 2.5 Blog posts → `src/content/tech/` and `src/content/photography/`

Each blog is a folder of Markdown files. **Drop in a `.md` (or `.mdx`) file and
it appears** — newest first, with the filename becoming the URL slug
(`my-post.md` → `/blog/tech/my-post`). The template includes one example post in
each folder (`getting-started.md`, `a-first-walk.mdx`) — read them, then delete
them. Until a blog has a post, it shows *"Please wait patiently for the first
post."*

Start every file with frontmatter:

```yaml
---
title: 'A clear, specific title'
description: 'One or two sentences — shown on the index and as the meta description.'
pubDate: 2026-06-01
tags: ['astro', 'web']                    # optional
cover: '../../assets/blog/my-cover.jpg'   # optional lead image
coverAlt: 'Describe the image for screen readers.'
draft: false                              # true = hidden from the production build
---
```

- **Code blocks** are highlighted with **Prism** via CSS classes; theme colors
  live in `global.css` under *"Prism syntax theme."*
- **In-post photos & galleries** (same responsive WebP pipeline + lightbox as the
  galleries): put images in `src/assets/blog/` and use the `.mdx` extension so
  you can drop in components — no `import` of the image needed, just reference by
  filename:

  ```mdx
  import Photo from '../../components/Photo.astro';
  import Gallery from '../../components/Gallery.astro';

  <Photo src="lake-fog.jpg" caption="Lake, fog" />
  <Gallery photos={["01-ridge.jpg", "02-coast.jpg"]} />
  ```

### 2.6 Your domain → `astro.config.mjs`

Set `site` to your real URL:

```js
site: 'https://your-domain.com',
```

Everything URL-bound — canonical tags, Open Graph, `sitemap-index.xml`,
`robots.txt`, `llms.txt`, JSON-LD — derives from this single value.

### 2.7 Your logo (optional)

The template generates a neutral "aperture seal" mark. To use your own, replace
`src/assets/logo-seal-light.png` (your mark on a transparent background) and
`src/assets/logo-seal-dark.png` (your mark on white), then run `npm run gen:icons`
(see §5). Or just replace `src/assets/seal.png` / `seal-dark.png` directly.

---

## 3. How photos are served (web-resolution only)

The site **never serves your full-resolution original**. At build time every
photo is converted to responsive **WebP** and capped at **`MAX_WEB` = 3840px**
(4K) on the long edge — crisp on high-res displays, but a downscaled,
recompressed derivative rather than your printable original. A post-build step
(`scripts/strip-unreferenced-assets.mjs`) then deletes any source originals Astro
copies out while transforming, so only the web renditions ship.

- **Sharper 8K viewing:** raise `MAX_WEB` in `src/lib/photos.ts` (e.g. `5120`).
  Lower it for more protection.
- Right-click, drag-to-save, and selection are disabled on photos (a deterrent —
  screenshots are always possible). **No watermark.**
- Note: the full-resolution files you place in `src/assets/**` live in your Git
  repo (not on the website). If the repo is public and you don't want originals
  there either, keep a private repo or store originals elsewhere.

---

## 4. Regenerating the bundled placeholders & brand

These scripts produce everything the template ships with — handy if you change
your name, tweak the logo, or want fresh placeholders. They need no network and
use the `sharp` that ships with Astro.

```bash
npm run setup              # runs all three of the steps below, in order
# — or individually —
npm run gen:brand          # writes the two source seals (your logo mark)
npm run gen:icons          # derives seal.png/seal-dark.png + favicons from them
npm run gen:placeholders   # rebuilds gallery/calendar/blog placeholders + og.jpg
```

- The **OG share image** (`public/og.jpg`) reads your name from `src/config.ts`,
  so re-run `npm run gen:placeholders -- --og-only` after a name change to refresh
  just that image.
- Once you've added your own photos and logo, you can delete the `scripts/` you no
  longer need.

### A second-script name (optional)

If you set `site.nameZh` (e.g. a Chinese 中文名), it shows under the brand and on a
couple of pages, using your system's CJK serif. For pixel-identical rendering on
every device, self-host a tiny font subset containing just your characters:

```bash
pip install fonttools brotli
pyftsubset NotoSerifCJKsc-Regular.otf --text="你的名字" \
  --flavor=woff2 --output-file=public/fonts/name.woff2
```

Then add an `@font-face` (and a `unicode-range` for just those characters) in
`src/styles/global.css` and put its family first in `--serif-cjk`. See the
comments at the top of `global.css`.

---

## 5. Blog: view counts, sharing & comments

### View counts (first-party, Cloudflare D1) — optional

Every page can show a **"Page Viewed N"** total in the footer, served entirely
from your own domain: a small Worker (`worker/index.js`) backed by a
[Cloudflare D1](https://developers.cloudflare.com/d1/) database — no third-party
analytics. It's privacy-friendly: no cookies, no raw IP/User-Agent stored, repeat
views de-duplicated per IP/day with a salted hash that a daily cron discards, and
crawlers make no database call at all.

**One-time setup on Cloudflare** (comfortably within the free tier):

1. **Create the database**, then paste the printed `database_id` into the
   `[[d1_databases]]` block in `wrangler.toml`:

   ```sh
   npx wrangler d1 create astro-photo-folio
   ```

2. **Create the tables** from the migration:

   ```sh
   npx wrangler d1 execute astro-photo-folio --remote --file=./migrations/0001_init.sql
   ```

3. (Recommended) set a private salt for the dedup hash:

   ```sh
   npx wrangler secret put VIEW_SALT
   ```

4. **Deploy** (or just push, if the repo is connected to Cloudflare):

   ```sh
   npm run build && npx wrangler deploy
   ```

Until `database_id` is filled in, the site still builds and serves normally — the
footer counter simply stays hidden. The wording/placement live in the
`.site-footer__views` markup in `src/layouts/Layout.astro`; the counting logic
lives in `worker/index.js`.

**Abuse-resistance.** The endpoint is public (every visitor's browser calls it), so
it's hardened in `worker/index.js`: it counts a path only if it resolves to a real
HTML page (no junk rows in `page_views`), de-duplicates per IP + path + day (so
rotating the `User-Agent` can't re-count), and honors two optional Workers
rate-limit bindings already declared in `wrangler.toml` (`RATE_LIMITER` per client,
`GLOBAL_LIMITER` as a whole-endpoint backstop). Both checks are skipped
automatically if their binding is absent, so local dev still works.

> Don't want the counter at all? You can ignore `wrangler.toml`/`worker/` and
> deploy the static `dist/` to any static host — the footer counter just stays
> hidden.

### Private analytics (optional): Cloudflare Web Analytics

For your own dashboard, enable **Web Analytics** in the Cloudflare dashboard. The
CSP in `public/_headers` already allows its beacon.

### Share button

Every post has a **Share** button using the device's native share sheet where
available, otherwise copying the link to the clipboard — entirely client-side, no
third-party script.

### Comments (not wired up)

There's a placeholder slot in `src/layouts/BlogPost.astro` marked
`── Comments ──`. Free options: **[Giscus](https://giscus.app)** (GitHub
Discussions — best for a tech blog), [utterances](https://utteranc.es) (GitHub
Issues), [Cusdis](https://cusdis.com) (self-hosted, anonymous), or
[Cactus Comments](https://cactus.chat) (Matrix). Any embedded widget loads a
third-party script, so also add its domain to the `Content-Security-Policy` in
`public/_headers`.

---

## 6. Discoverability (search engines & AI)

Built to be **found and cited** by search engines and AI answer engines, while
staying **out of AI training sets**.

- **Crawler stance** (`src/pages/robots.txt.ts`): search + AI *search/citation*
  crawlers are allowed; AI *training* / bulk crawlers (`GPTBot`, `CCBot`,
  `ClaudeBot`, …) are blocked. Edit the `ALLOW` / `BLOCK` lists to change it. The
  block list is also **enforced** at the edge when the Worker is deployed:
  `worker/index.js` (`BLOCKED_BOT_RE`) returns `403` to those crawlers, so one that
  ignores `robots.txt` still can't download pages or images. (Search engines, incl.
  Google Images, aren't on the list and pass through untouched.)
- **Sitemap** via `@astrojs/sitemap`, linked from `robots.txt`.
- **`llms.txt`** (`src/pages/llms.txt.ts`): a curated Markdown index for AI tools
  (see https://llmstxt.org/).
- **Structured data (JSON-LD):** a `Person` + `WebSite` graph on every page, plus
  an `ImageGallery` of `ImageObject`s per gallery.
- **Per-page** `<title>`, meta description, Open Graph + Twitter card, and a
  branded share image at `public/og.jpg`.
- **Photo SEO is text-driven** — name files descriptively (`lake-fog.jpg`, not
  `IMG_2451.jpg`): the name becomes the image's `alt` text.

> `robots.txt` is advisory; the edge enforcement above (when the Worker is
> deployed) covers the block list. The `Cross-Origin-Resource-Policy` header also
> blocks other sites from hot-linking your images.

---

## 7. Security & privacy

- **Content-Security-Policy** served as an HTTP header from `public/_headers`:
  `default-src 'self'` locks scripts/styles/images/fonts to the same origin. The
  only third-party allowance is Cloudflare Web Analytics.
- Security headers in `public/_headers`: `X-Frame-Options`,
  `Cross-Origin-Resource-Policy` (anti-hotlinking), HSTS, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`. These apply once served by Cloudflare.
- **Privacy policy** at `src/pages/privacy.astro` — a sensible, cookieless
  default. Review and adjust it for your jurisdiction before publishing.

---

## 8. Commands

| Command                    | Action                                            |
| -------------------------- | ------------------------------------------------- |
| `npm run dev`              | Start the dev server                              |
| `npm run build`            | Build into `dist/` (also strips orphaned sources) |
| `npm run preview`          | Preview the production build locally              |
| `npm run gen:brand`        | Regenerate the placeholder logo "seal" sources    |
| `npm run gen:icons`        | Derive seal/favicons from the seal sources        |
| `npm run gen:placeholders` | Regenerate placeholder photos + the OG image      |

---

## 9. Deploy to Cloudflare Workers (Static Assets)

The site's pages are served from `./dist` as a Cloudflare Workers static-assets
deployment, alongside the optional Worker (`worker/index.js`) for the
`/api/views` counter (see §5).

### Option A — Connect your Git repo (recommended)

1. Push this repository to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Workers → Connect to Git**.
3. Pick the repo. Confirm the build settings:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
4. **Save and Deploy.** Every push then redeploys automatically.

### Option B — Wrangler CLI

```bash
npm run build
npx wrangler deploy              # uses wrangler.toml ([assets] directory = ./dist)
```

### Custom domain

Add it under your project → **Custom domains**, then set `site` in
`astro.config.mjs` to that URL (see §2.6). After deploying, submit
`https://your-domain/sitemap-index.xml` to Google Search Console and Bing
Webmaster Tools.

> **Just want static hosting?** Since `npm run build` outputs a plain static site
> to `dist/`, you can deploy it to any static host (Netlify, GitHub Pages, etc.).
> You only need Cloudflare Workers + D1 if you want the built-in view counter.

---

## 10. Project structure

```
src/
├── assets/
│   ├── digital/        # ← Digital gallery images
│   ├── analog/         # ← Analog (film) gallery images
│   ├── calendar/       # ← Calendar images (YYYY-MM.jpg)
│   └── blog/           # ← Blog photos (referenced by <Photo> / <Gallery>)
├── components/         # Sidebar, PhotoGrid, Calendar, Lightbox, Logo, Icon,
│                       #   Photo, Gallery, ShareButton, PostCard, BaseSchema
├── content/            # ← Blog posts (Markdown / MDX)
│   ├── tech/           #     Tech Blog   (example: getting-started.md)
│   └── photography/    #     Photo Blog  (example: a-first-walk.mdx)
├── content.config.ts   # ← Blog collections + frontmatter schema
├── data/
│   ├── calendar.ts     # ← Calendar entries (month + location)
│   └── galleries.ts    # ← Optional per-photo captions for the galleries
├── lib/photos.ts       # web-resolution image rendering (MAX_WEB)
├── layouts/            # Layout.astro, BlogPost.astro
├── pages/              # index (Digital), analog, calendar, about, contact, blog/*
├── styles/global.css
└── config.ts           # ← name, nav, social links  (START HERE)
scripts/
├── generate-brand.mjs            # placeholder logo "seal" sources
├── generate-icons.mjs            # derives seal + favicons from the sources
├── generate-placeholders.mjs     # placeholder photos + OG share image
└── strip-unreferenced-assets.mjs # post-build: removes orphaned originals
worker/index.js          # ← optional Worker for the /api/views counter (D1-backed)
migrations/0001_init.sql # ← D1 schema for the view counter
```

---

## License

The template **code** is released under the [MIT License](./LICENSE) — use it
freely, including for commercial projects.

Once you add your own work, **your photographs and writing are yours** — MIT
covers the template, not your content. The visitor-facing
[image-licensing page](src/pages/license.astro) defaults to "all rights
reserved"; edit it to suit you.
