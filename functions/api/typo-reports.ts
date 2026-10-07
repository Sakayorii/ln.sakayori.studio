/* POST /api/typo-reports -> same 6-layer anti-abuse as comments, stored pending */
import {
  Env, json, escHtml, sha256Hex, clientIp, dailySalt,
  verifyTurnstile, containsUrl, checkRateLimit, notifyTelegram, modKeyboard,
} from '../_lib';

const MAX_SELECTED = 200;
const MAX_NOTE = 300;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) return json({ error: 'db not configured' }, 503);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ error: 'bad json' }, 400); }

  const novel = String(body.novel || 'rezero').slice(0, 32);
  const arc = body.arc as number;
  const chapter = body.chapter as number;
  const selected = String(body.selected_text || '').trim().slice(0, MAX_SELECTED);
  const noteRaw = body.user_note;
  const note = noteRaw == null ? null : String(noteRaw).trim().slice(0, MAX_NOTE) || null;
  if (!Number.isInteger(arc) || !Number.isInteger(chapter) || arc < 1 || chapter < 1 || selected.length < 2) {
    return json({ error: 'invalid' }, 400);
  }
  if (body.website_url) return json({ ok: true });                       // honeypot
  if (typeof body.t0 === 'number' && Date.now() - body.t0 < 2000) return json({ ok: true }); // time-to-submit
  if (containsUrl(selected) || (note && containsUrl(note))) return json({ error: 'no links' }, 400);
  const ip = clientIp(request);
  const ipHash = await sha256Hex(ip + '|' + dailySalt());
  if (!(await checkRateLimit(env.DB, ipHash))) return json({ error: 'rate' }, 429);
  if (!(await verifyTurnstile(body.turnstileToken as string | undefined, env, ip))) {
    return json({ error: 'captcha' }, 403);
  }

  const now = Math.floor(Date.now() / 1000);
  const r = await env.DB.prepare(
    `INSERT INTO typo_reports (novel, arc, chapter, selected_text, user_note, ip_hash, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`
  ).bind(novel, arc, chapter, selected, note, ipHash, now).run();

  await notifyTelegram(
    env,
    `<b>[BÁO LỖI]</b> ${escHtml(novel)} Arc ${arc} - Ch.${chapter}\n“${escHtml(selected)}”${note ? `\nGhi chú: ${escHtml(note)}` : ''}`,
    modKeyboard('t', r.meta.last_row_id as number),
  );
  return json({ ok: true });
};
