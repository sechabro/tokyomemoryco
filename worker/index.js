/**
 * First-party, privacy-friendly page-view counter (Cloudflare Worker + D1).
 *
 * The site is still a static build served from ./dist via the ASSETS binding;
 * this Worker only handles one dynamic route — POST /api/views — which registers
 * a view for a path and returns the running total. Everything else falls through
 * to the static assets, so normal pages keep full CDN performance and cost no D1.
 *
 * The three properties asked for:
 *   • bot filtering  — crawler User-Agents get no D1 access at all (not counted,
 *                      not even a read), so a crawl can't burn the row quota.
 *   • dedup          — one count per (visitor, path) per UTC day, so refreshes
 *                      and same-visitor repeats don't inflate the number.
 *   • race-safety    — the increment is a single atomic D1 statement, and the
 *                      dedup insert (INSERT OR IGNORE) decides the winner under
 *                      concurrency, so simultaneous hits can't double-count.
 *
 * No cookies, and no raw IP/User-Agent is ever stored: the dedup key is a salted
 * SHA-256 hash that the daily cron discards once its day has passed.
 */

// Naive crawler match — deliberately broad. Bots that run JS still won't be
// counted; bots that don't run JS never reach this endpoint at all.
const BOT_RE =
  /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|quora link preview|pinterest|vkshare|w3c_validator|whatsapp|telegram|discordbot|headless|lighthouse|gptbot|ccbot|claudebot|bytespider|petalbot|ahrefs|semrush|mj12|dotbot|yandex/i;

const MAX_PATH = 256;

// Reduce an incoming value to a safe, canonical site path or null if it's junk.
function normalizePath(p) {
  if (typeof p !== 'string') return null;
  try {
    if (p.includes('://')) p = new URL(p).pathname; // tolerate a full URL
  } catch {
    return null;
  }
  p = p.split('?')[0].split('#')[0];
  if (!p.startsWith('/') || p.length > MAX_PATH) return null;
  if (/[^\x20-\x7E]/.test(p)) return null; // ASCII printable only
  p = p.replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

async function visitorKey(ip, ua, path, day, salt) {
  const data = `${salt}|${ip}|${ua}|${path}|${day}`;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function handleViews(request, env) {
  if (request.method !== 'POST') return json({ error: 'method' }, 405);

  // Same-origin guard: a browser fetch from the site sends an Origin matching the
  // host. Deters casual off-site calls (not a hard boundary — headers can be
  // forged by non-browsers, but the dedup + bot checks still bound the damage).
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== url.host) return json({ error: 'origin' }, 403);
    } catch {
      return json({ error: 'origin' }, 403);
    }
  }

  // Bots never touch D1: crawlers are neither counted nor served a count, so a
  // crawl can't run up the row quota (and most don't execute this JS anyway).
  const ua = request.headers.get('user-agent') || '';
  if (!ua || BOT_RE.test(ua)) return json({ count: null, counted: false });

  let path = null;
  try {
    const body = await request.json();
    path = normalizePath(body && body.path);
  } catch {
    path = null;
  }
  if (!path) return json({ error: 'path' }, 400);

  const ip = request.headers.get('cf-connecting-ip') || '';
  const day = Math.floor(Date.now() / 86400000); // UTC epoch-day
  const salt = env.VIEW_SALT || 'change-me'; // set a private VIEW_SALT secret in production
  const key = await visitorKey(ip, ua, path, day, salt);

  // Dedup: only the first (visitor, path, day) inserts a row. Under a race,
  // SQLite serializes writes, so exactly one insert reports changes === 1.
  const dedup = await env.DB.prepare('INSERT OR IGNORE INTO view_dedup (k, d) VALUES (?, ?)')
    .bind(key, day)
    .run();
  const firstToday = dedup.meta && dedup.meta.changes === 1;

  let count;
  if (firstToday) {
    // Atomic upsert increment — a single statement, so it's race-safe.
    const row = await env.DB.prepare(
      'INSERT INTO page_views (path, count) VALUES (?, 1) ' +
        'ON CONFLICT(path) DO UPDATE SET count = count + 1 RETURNING count'
    )
      .bind(path)
      .first();
    count = row ? row.count : 1;
  } else {
    const row = await env.DB.prepare('SELECT count FROM page_views WHERE path = ?')
      .bind(path)
      .first();
    count = row ? row.count : 0;
  }

  return json({ count, counted: firstToday });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/views') {
      try {
        return await handleViews(request, env);
      } catch {
        return json({ error: 'server' }, 500);
      }
    }
    return env.ASSETS.fetch(request); // static site
  },

  // Daily housekeeping: only the current day's dedup rows are ever needed.
  async scheduled(_event, env, ctx) {
    const day = Math.floor(Date.now() / 86400000);
    ctx.waitUntil(env.DB.prepare('DELETE FROM view_dedup WHERE d < ?').bind(day).run());
  },
};
