# ln.sakayori.studio

Cổng đọc light novel phi lợi nhuận của Sakayori Studio. Bản dịch tiếng Việt.

## Branches

- `main` — nhánh build chính (local agent).
- `muse` — nhánh song song: giao diện riêng của Rui, triển khai cùng plan nhưng
  thiết kế visual độc lập (không trùng giao diện với main).

## Stack

- Astro 5 (SSG) + Cloudflare Pages (free)
- Cloudflare D1 (comments, typo reports) + Pages Functions (API)
- Pagefind (tìm kiếm tĩnh), Turnstile (chống bot)

## Phát triển

```bash
npm install
# tạo D1 một lần:
npx wrangler d1 create ln-sakayori-db
npx wrangler d1 execute ln-sakayori-db --remote --file=schema.sql
npm run dev
```

Secrets (dashboard hoặc `wrangler secret put`):
`TURNSTILE_SECRET_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`,
`TELEGRAM_WEBHOOK_SECRET`. Public: `PUBLIC_TURNSTILE_SITE_KEY`.

## Nội dung

Markdown chương đặt tại `src/content/chapters/[novel]/[arc]/chapter-[n].md`
với frontmatter `{novel, arc, chapter, title}`. Các chương song song (vd 54/54b)
đã gộp thành 1 file theo Quy tắc 2.6 của dự án dịch.
