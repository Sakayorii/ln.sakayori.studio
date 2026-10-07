import type { APIRoute } from 'astro';

export const prerender = false;

// POST /api/telegram-webhook
export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any)?.runtime?.env || {};
  const db = env.DB;
  const botToken = env.TELEGRAM_BOT_TOKEN;
  const adminChatId = String(env.TELEGRAM_ADMIN_CHAT_ID || '');
  const webhookSecret = env.TELEGRAM_WEBHOOK_SECRET;

  // 1. Two-layer Security: Layer 1 - Webhook Secret Token header
  if (webhookSecret) {
    const receivedSecret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
    if (receivedSecret !== webhookSecret) {
      return new Response('Forbidden', { status: 403 });
    }
  }

  let update: any;
  try {
    update = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Handle Callback Queries (Button clicks)
  if (update.callback_query) {
    const cb = update.callback_query;
    const fromId = String(cb.from?.id || '');
    const data = String(cb.data || '');
    const callbackId = cb.id;
    const messageId = cb.message?.message_id;

    // Layer 2 - Check Admin Telegram User ID
    if (adminChatId && fromId !== adminChatId) {
      if (botToken) {
        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callback_query_id: callbackId, text: 'Bạn không có quyền thực hiện thao tác này.', show_alert: true }),
        }).catch(() => {});
      }
      return new Response('Unauthorized', { status: 401 });
    }

    let alertText = 'Thao tác hoàn tất.';
    if (db) {
      try {
        if (data.startsWith('cmt_appr_')) {
          const id = parseInt(data.replace('cmt_appr_', ''), 10);
          await db.prepare("UPDATE comments SET status = 'approved' WHERE id = ?").bind(id).run();
          alertText = 'Đã duyệt bình luận!';
        } else if (data.startsWith('cmt_del_')) {
          const id = parseInt(data.replace('cmt_del_', ''), 10);
          await db.prepare("DELETE FROM comments WHERE id = ?").bind(id).run();
          alertText = 'Đã xóa bình luận!';
        } else if (data.startsWith('typo_res_')) {
          const id = parseInt(data.replace('typo_res_', ''), 10);
          await db.prepare("UPDATE typo_reports SET status = 'resolved' WHERE id = ?").bind(id).run();
          alertText = 'Đã đánh dấu đã sửa lỗi chính tả!';
        } else if (data.startsWith('typo_rej_')) {
          const id = parseInt(data.replace('typo_rej_', ''), 10);
          await db.prepare("UPDATE typo_reports SET status = 'rejected' WHERE id = ?").bind(id).run();
          alertText = 'Đã bỏ qua báo cáo lỗi!';
        }
      } catch (err: any) {
        alertText = 'Lỗi cơ sở dữ liệu.';
      }
    }

    if (botToken) {
      // Answer callback
      await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callbackId, text: alertText }),
      }).catch(() => {});

      // Edit message to remove inline keyboard and append status
      if (cb.message?.chat?.id && messageId) {
        await fetch(`https://api.telegram.org/bot${botToken}/editMessageReplyMarkup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: cb.message.chat.id,
            message_id: messageId,
            reply_markup: { inline_keyboard: [] },
          }),
        }).catch(() => {});
      }
    }
  }

  return new Response('OK', { status: 200 });
};
