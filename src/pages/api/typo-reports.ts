import type { APIRoute } from 'astro';

export const prerender = false;

async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const dateStr = new Date().toISOString().slice(0, 10);
  const data = encoder.encode(`${ip}-${dateStr}-sakayori-salt`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}

// POST /api/typo-reports
export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any)?.runtime?.env || {};
  const db = env.DB;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { novel = 'rezero', arc, chapter, selected_text, user_note, website_url, t0, turnstileToken } = body;

  // 1. Honeypot check
  if (website_url) {
    return new Response(JSON.stringify({ error: 'Bot detected' }), { status: 400 });
  }

  // 2. Minimum time-to-submit check (1.5 seconds)
  if (!t0 || Date.now() - t0 < 1500) {
    return new Response(JSON.stringify({ error: 'Submission too fast' }), { status: 429 });
  }

  // 3. Text length validation
  const quote = (selected_text || '').trim();
  const note = (user_note || '').trim();
  if (quote.length < 2 || quote.length > 200 || note.length > 300) {
    return new Response(JSON.stringify({ error: 'Invalid length' }), { status: 400 });
  }

  // 4. Ban URL links in typo notes
  const urlPattern = /https?:\/\/|[a-z0-9]+\.(com|vn|net|org|io|ru|xyz|top|cc)/i;
  if (urlPattern.test(quote) || urlPattern.test(note)) {
    return new Response(JSON.stringify({ error: 'Links are not permitted' }), { status: 400 });
  }

  // 5. Cloudflare Turnstile Verification
  const turnstileSecret = env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && turnstileToken) {
    try {
      const formData = new FormData();
      formData.append('secret', turnstileSecret);
      formData.append('response', turnstileToken);
      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json() as any;
      if (!data.success) {
        return new Response(JSON.stringify({ error: 'Turnstile verification failed' }), { status: 403 });
      }
    } catch {
      return new Response(JSON.stringify({ error: 'Verification error' }), { status: 500 });
    }
  }

  // 6. Rate limiting & IP hashing
  const clientIp = request.headers.get('cf-connecting-ip') || '127.0.0.1';
  const ipHash = await hashIp(clientIp);

  if (db) {
    try {
      const now = Date.now();
      const cutoff = now - 60000;
      const { results: recent } = await db
        .prepare('SELECT COUNT(*) as count FROM rl WHERE ip_hash = ? AND ts > ?')
        .bind(ipHash, cutoff)
        .all();

      if (recent && recent[0]?.count >= 5) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
      }

      await db.prepare('INSERT INTO rl (ip_hash, ts) VALUES (?, ?)').bind(ipHash, now).run();

      const res = await db
        .prepare(
          'INSERT INTO typo_reports (novel, arc, chapter, selected_text, user_note, ip_hash, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        )
        .bind(novel, arc, chapter, quote, note || null, ipHash, 'pending', now)
        .run();

      const newId = res?.meta?.last_row_id;

      // Notify Telegram Bot
      const botToken = env.TELEGRAM_BOT_TOKEN;
      const adminChatId = env.TELEGRAM_ADMIN_CHAT_ID;
      if (botToken && adminChatId && newId) {
        const msg = `✍️ <b>Báo lỗi chính tả</b>\n` +
          `• Vị trí: ${novel} (Arc ${arc} - Chương ${chapter})\n` +
          `• Đoạn lỗi: <code>${escapeHtml(quote)}</code>\n` +
          (note ? `• Ghi chú độc giả: <i>${escapeHtml(note)}</i>` : '');

        const replyMarkup = {
          inline_keyboard: [
            [
              { text: '✅ Đã sửa', callback_data: `typo_res_${newId}` },
              { text: '❌ Bỏ qua', callback_data: `typo_rej_${newId}` },
            ],
          ],
        };

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: adminChatId,
            text: msg,
            parse_mode: 'HTML',
            reply_markup: replyMarkup,
          }),
        }).catch(() => {});
      }

      return new Response(JSON.stringify({ success: true, pending: true }), { status: 201 });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: 'DB insert failed' }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ success: true, pending: true }), { status: 201 });
};

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
