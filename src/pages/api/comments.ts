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

// GET /api/comments?novel=...&arc=...&chapter=...
export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  const novel = url.searchParams.get('novel') || 'rezero';
  const arc = parseInt(url.searchParams.get('arc') || '0', 10);
  const chapter = parseInt(url.searchParams.get('chapter') || '0', 10);

  const env = (locals as any)?.runtime?.env || {};
  const db = env.DB;

  if (!db) {
    // If D1 is not bound yet, return empty list cleanly
    return new Response(JSON.stringify({ comments: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { results } = await db
      .prepare(
        'SELECT id, author_name, content, created_at FROM comments WHERE novel = ? AND arc = ? AND chapter = ? AND status = ? ORDER BY created_at DESC LIMIT 50'
      )
      .bind(novel, arc, chapter, 'approved')
      .all();

    return new Response(JSON.stringify({ comments: results || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'DB query error', comments: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST /api/comments
export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any)?.runtime?.env || {};
  const db = env.DB;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { novel = 'rezero', arc, chapter, author_name, content, website_url, t0, turnstileToken } = body;

  // 1. Honeypot check
  if (website_url) {
    return new Response(JSON.stringify({ error: 'Bot detected' }), { status: 400 });
  }

  // 2. Minimum time-to-submit check (2 seconds)
  if (!t0 || Date.now() - t0 < 2000) {
    return new Response(JSON.stringify({ error: 'Submission too fast' }), { status: 429 });
  }

  // 3. Length validations
  const author = (author_name || '').trim();
  const text = (content || '').trim();
  if (author.length < 2 || author.length > 30 || text.length < 3 || text.length > 500) {
    return new Response(JSON.stringify({ error: 'Invalid length' }), { status: 400 });
  }

  // 4. No URL allowed
  const urlPattern = /https?:\/\/|[a-z0-9]+\.(com|vn|net|org|io|ru|xyz|top|cc)/i;
  if (urlPattern.test(text) || urlPattern.test(author)) {
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
      // Check 60s window
      const now = Date.now();
      const cutoff = now - 60000;
      const { results: recent } = await db
        .prepare('SELECT COUNT(*) as count FROM rl WHERE ip_hash = ? AND ts > ?')
        .bind(ipHash, cutoff)
        .all();

      if (recent && recent[0]?.count >= 5) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
      }

      // Record rate limit attempt
      await db.prepare('INSERT INTO rl (ip_hash, ts) VALUES (?, ?)').bind(ipHash, now).run();

      // Insert comment into pending queue
      const res = await db
        .prepare(
          'INSERT INTO comments (novel, arc, chapter, author_name, content, status, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        )
        .bind(novel, arc, chapter, author, text, 'pending', ipHash, now)
        .run();

      const newId = res?.meta?.last_row_id;

      // Notify Telegram if configured
      const botToken = env.TELEGRAM_BOT_TOKEN;
      const adminChatId = env.TELEGRAM_ADMIN_CHAT_ID;
      if (botToken && adminChatId && newId) {
        const msg = `💬 <b>Bình luận mới</b>\n` +
          `• Truyện: ${novel} (Arc ${arc} - Chương ${chapter})\n` +
          `• Tác giả: <b>${escapeHtml(author)}</b>\n` +
          `• Nội dung: <i>${escapeHtml(text)}</i>`;

        const replyMarkup = {
          inline_keyboard: [
            [
              { text: '✅ Duyệt', callback_data: `cmt_appr_${newId}` },
              { text: '❌ Xóa', callback_data: `cmt_del_${newId}` },
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
