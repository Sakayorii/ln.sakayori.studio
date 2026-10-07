/* POST /api/telegram-webhook
   2-layer auth:
     1. X-Telegram-Bot-Api-Secret-Token header === TELEGRAM_WEBHOOK_SECRET
        (set via Telegram setWebhook secret_token)
     2. callback_query.from.id === TELEGRAM_ADMIN_CHAT_ID
   Handles [Duyệt]/[Xóa] inline buttons for comments (c) and typo reports (t). */
import { Env } from '../_lib';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const secret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
  if (!env.TELEGRAM_WEBHOOK_SECRET || secret !== env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response('forbidden', { status: 403 });
  }
  let update: Record<string, unknown>;
  try { update = await request.json(); } catch { return new Response('ok'); }

  const cq = update.callback_query as { from?: { id?: number }; data?: string; id?: string } | undefined;
  if (!cq) return new Response('ok');
  if (String(cq.from?.id) !== String(env.TELEGRAM_ADMIN_CHAT_ID)) return new Response('ok');

  const m = /^([ct]):(approve|reject):(\d+)$/.exec(cq.data || '');
  if (!m || !env.DB) return new Response('ok');
  const [, kind, action, id] = m;
  const table = kind === 'c' ? 'comments' : 'typo_reports';
  const status = kind === 'c'
    ? (action === 'approve' ? 'approved' : 'rejected')
    : (action === 'approve' ? 'resolved' : 'rejected');
  await env.DB.prepare(`UPDATE ${table} SET status = ? WHERE id = ?`).bind(status, Number(id)).run();

  if (env.TELEGRAM_BOT_TOKEN && cq.id) {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ callback_query_id: cq.id, text: action === 'approve' ? 'Đã duyệt' : 'Đã xóa' }),
    });
  }
  return new Response('ok');
};
