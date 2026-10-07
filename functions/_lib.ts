/* Shared helpers for Pages Functions: anti-abuse + Telegram. */

export interface Env {
  DB: D1Database;
  TURNSTILE_SECRET_KEY?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_ADMIN_CHAT_ID?: string;
  TELEGRAM_WEBHOOK_SECRET?: string;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export function escHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function clientIp(req: Request): string {
  return req.headers.get('cf-connecting-ip') || '0.0.0.0';
}

/** Salt rotates daily (UTC): rate-limit windows stay short, stored hashes go stale fast. */
export function dailySalt(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Turnstile server-side verification.
 * Fails OPEN only when the secret is not configured at all (dev / not yet set up):
 * the moderation queue (pending by default) remains the backstop, and rate
 * limiting still applies. In production, always set TURNSTILE_SECRET_KEY.
 */
export async function verifyTurnstile(token: string | undefined, env: Env, ip: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

const URL_RE = /(https?:\/\/|www\.|[a-z0-9-]+\.(com|vn|net|org|info|biz|xyz|top|site|online|shop|click|link|me|io)\b)/i;
export function containsUrl(text: string): boolean {
  return URL_RE.test(text);
}

/** D1-backed per-IP attempt counter. Returns true when the attempt is allowed. */
export async function checkRateLimit(db: D1Database, ipHash: string, limit = 5, windowSec = 60): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const cutoff = now - windowSec;
  await db.prepare('DELETE FROM rl WHERE ts < ?').bind(cutoff).run();
  const row = await db
    .prepare('SELECT COUNT(*) AS n FROM rl WHERE ip_hash = ? AND ts >= ?')
    .bind(ipHash, cutoff)
    .first<{ n: number }>();
  if ((row?.n ?? 0) >= limit) return false;
  await db.prepare('INSERT INTO rl (ip_hash, ts) VALUES (?, ?)').bind(ipHash, now).run();
  return true;
}

export async function notifyTelegram(env: Env, html: string, keyboard?: unknown): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_ADMIN_CHAT_ID) return;
  const body: Record<string, unknown> = {
    chat_id: env.TELEGRAM_ADMIN_CHAT_ID,
    text: html,
    parse_mode: 'HTML',
  };
  if (keyboard) body.reply_markup = keyboard;
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function modKeyboard(kind: 'c' | 't', id: number | bigint): unknown {
  return {
    inline_keyboard: [[
      { text: 'Duyệt', callback_data: `${kind}:approve:${id}` },
      { text: 'Xóa', callback_data: `${kind}:reject:${id}` },
    ]],
  };
}
