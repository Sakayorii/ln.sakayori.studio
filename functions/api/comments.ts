/* GET /api/comments?novel=&arc=&chapter=  -> approved comments (newest first)
   POST /api/comments -> 6-layer anti-abuse, stored as pending, Telegram notify */
import {
  Env, json, escHtml, sha256Hex, clientIp, dailySalt,
  verifyTurnstile, containsUrl, checkRateLimit, notifyTelegram, modKeyboard,
} from '../_lib';

const MAX_NAME = 30;
const MAX_CONTENT = 500;

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const novel = url.searchParams.get('novel') || 'rezero';
  const arc = parseInt(url.searchParams.get('arc') || '0', 10);
  const chapter = parseInt(url.searchParams.get('chapter') || '0', 10);
  if (!arc || !chapter) return json({ error: 'missing params' }, 400);
  if (!env.DB) return json([]);
  const rows = await env.DB.prepare(
    `SELECT id, author_name, content, created_at FROM comments
     WHERE novel = ? AND arc = ? AND chapter = ? AND status = 'approved'
     ORDER BY created_at DESC LIMIT 100`
  ).bind(novel, arc, chapter).all();
  return json(rows.results ?? []);
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) return json({ error: 'db not configured' }, 503);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ error: 'bad json' }, 400); }

  // layer 1: shape + length limits
  const novel = String(body.novel || 'rezero').slice(0, 32);
  const arc = body.arc as number;
  const chapter = body.chapter as number;
  const name = String(body.author_name || '').trim();
  const text = String(body.content || '').trim();
  if (!Number.isInteger(arc) || !Number.isInteger(chapter) || arc < 1 || chapter < 1
      || name.length < 2 || name.length > MAX_NAME
      || text.length < 3 || text.length > MAX_CONTENT) {
    return json({ error: 'invalid' }, 400);
  }
  // layer 2: honeypot (fake success so bots learn nothing)
  if (body.website_url) return json({ ok: true });
  // layer 3: time-to-submit >= 2s
  if (typeof body.t0 === 'number' && Date.now() - body.t0 < 2000) return json({ ok: true });
  // layer 4: URL ban (kills SEO/gambling spam incentive)
  if (containsUrl(name) || containsUrl(text)) return json({ error: 'no links' }, 400);
  // layer 5: per-IP rate limit (5 req / 60s)
  const ip = clientIp(request);
  const ipHash = await sha256Hex(ip + '|' + dailySalt());
  if (!(await checkRateLimit(env.DB, ipHash))) return json({ error: 'rate' }, 429);
  // layer 6: Turnstile server-side verification
  if (!(await verifyTurnstile(body.turnstileToken as string | undefined, env, ip))) {
    return json({ error: 'captcha' }, 403);
  }

  const now = Math.floor(Date.now() / 1000);
  const r = await env.DB.prepare(
    `INSERT INTO comments (novel, arc, chapter, author_name, content, status, ip_hash, created_at)
     VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`
  ).bind(novel, arc, chapter, name, text, ipHash, now).run();

  await notifyTelegram(
    env,
    `<b>[BÌNH LUẬN MỚI]</b> ${escHtml(novel)} Arc ${arc} - Ch.${chapter}\n<b>${escHtml(name)}</b>: ${escHtml(text.slice(0, 300))}`,
    modKeyboard('c', r.meta.last_row_id as number),
  );
  return json({ ok: true });
};
