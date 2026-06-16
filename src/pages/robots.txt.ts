import type { APIRoute } from 'astro';

// Crawler stance: the site IS discoverable by search engines and AI *search /
// citation* crawlers (which drive referral traffic), but AI *training* / bulk
// dataset crawlers are blocked. Anything not listed falls under "*" → allowed.

// Explicitly welcomed (search + AI answer/citation engines).
const ALLOW = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Claude-SearchBot',
  'Claude-User',
];

// Blocked: AI training / bulk dataset crawlers (incl. image scrapers). This is
// also ENFORCED at the edge — the Worker (worker/index.js, BLOCKED_BOT_RE) returns
// 403 to these User-Agents, so ignoring the rule below still gets them no pages
// and no images. Keep the two lists in sync.
const BLOCK = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'CCBot',
  'Google-Extended',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'meta-externalagent',
  'FacebookBot',
  'Bytespider',
  'ImagesiftBot',
  'Diffbot',
  'Omgilibot',
  'Omgili',
  'PanguBot',
  'cohere-ai',
  'AI2Bot',
];

export const GET: APIRoute = ({ site }) => {
  const sitemap = site ? new URL('sitemap-index.xml', site).href : '/sitemap-index.xml';

  const lines = [
    '# Search engines and AI search/citation crawlers are welcome.',
    '# AI training / bulk dataset crawlers are blocked — the photography and',
    '# writing here is discoverable, not training data.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# Explicitly welcomed AI search / citation crawlers.',
    ...ALLOW.map((bot) => `User-agent: ${bot}`),
    'Allow: /',
    '',
    '# Blocked AI training / bulk-scraping crawlers (pages and images alike). Also',
    '# enforced at the edge, so ignoring this still gets them nothing.',
    ...BLOCK.map((bot) => `User-agent: ${bot}`),
    'Disallow: /',
    '',
    `Sitemap: ${sitemap}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
