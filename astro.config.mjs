import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
  // MDX powers the blogs: Markdown + components, so posts can drop in
  // gallery-style <Photo> / <Gallery> blocks. Generate sitemap-index.xml +
  // sitemap-0.xml (referenced from robots.txt).
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.endsWith('/robots.txt') && !page.endsWith('/llms.txt'),
    }),
  ],
  // Content-Security-Policy is delivered as an HTTP header from public/_headers
  // (not an Astro <meta>). That lets `frame-ancestors` take effect and lets
  // script-src use 'unsafe-inline' — required because Cloudflare injects inline
  // JS (Rocket Loader / Bot Fight Mode) whose hash changes per deploy and so
  // can't be allow-listed. Astro's security.csp is intentionally left off: it
  // would emit script hashes, and the browser ignores 'unsafe-inline' whenever a
  // hash is present.
  // Your production domain — used for canonical URLs, Open Graph tags, the
  // sitemap, robots.txt, llms.txt, and the JSON-LD. CHANGE THIS to your own
  // domain; everything URL-bound is derived from it.
  site: 'https://example.com',

  // Markdown for the blogs. Prism highlights code with CSS *classes* (themed in
  // global.css) rather than inline styles, so syntax colors work under the strict
  // CSP without needing 'unsafe-inline' for styles.
  markdown: {
    syntaxHighlight: 'prism',
    // Emit GFM table column alignment as `align` attributes rather than inline
    // `style="text-align:…"`, so tables stay within the strict CSP (no
    // style-src 'unsafe-inline'). Styled in global.css. Set on the default
    // unified() processor — the old `markdown.remarkRehype` shortcut is
    // deprecated in Astro 6 and slated for removal in a future major.
    processor: unified({ remarkRehype: { tableCellAlignToStyle: false } }),
  },

  // Fully static output — perfect for Cloudflare's free tier.
  // Images are optimized at build time with sharp.
  build: {
    // Inline ALL stylesheets into the HTML. With 'auto', global.css exceeded
    // the inlining threshold and shipped as an external file; whenever the
    // first paint beat that file, the page rendered unstyled and then snapped
    // into the sidebar layout — a near-whole-viewport Cumulative Layout Shift
    // attributed to html>body>main.main (seen on /calendar/). Inlining
    // guarantees the first paint already matches the final layout, and drops a
    // render-blocking request.
    inlineStylesheets: 'always',
  },
});
