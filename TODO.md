# KẾ HOẠCH TRIỂN KHAI CHI TIẾT (GEMINI BRANCH) - ln.sakayori.studio

> **Mục tiêu:** Xây dựng cổng đọc Light Novel đa tác phẩm (Multi-series) tĩnh cho Sakayori Studio trên Cloudflare Pages + Astro SSG, tái hiện trọn vẹn trải nghiệm đọc Hako Reader (nền vàng dịu mắt, Zero-FOUC), tính năng độc quyền Báo lỗi chính tả qua bôi đen chữ, và hệ thống bình luận tự chủ trên Cloudflare D1.

---

## GIAI ĐOẠN 1: KHỞI TẠO NỀN TẢNG KỸ THUẬT & HẠ TẦNG (SCAFFOLD & PIPELINE)
- [x] Khởi tạo dự án Astro core với TypeScript, CSS tokens tối giản.
- [x] Cấu hình adapter Cloudflare Pages (`@astrojs/cloudflare`).
- [x] Cấu hình Content Collections đa tác phẩm tại `src/content.config.ts`:
  - Phân cấp schema: `novel` -> `arc` -> `chapter`.
  - Validate nghiêm ngặt bằng Zod: `chapter` là số nguyên dương, tiêu đề chuỗi không rỗng.
- [x] Tích hợp phông chữ tự host `.woff2` trong `public/fonts/`:
  - `Noto Serif` (400, 400-italic, 700, 700-italic).
  - `Be Vietnam Pro` (400, 700).
  - Cấu hình `@font-face` nạp trước (preload) trong layout, hoàn toàn không phụ thuộc CDN ngoài.
- [x] Tích hợp `@astrojs/sitemap` và tạo `public/robots.txt`.
- [x] Cấu hình build script cho Pagefind (tìm kiếm tĩnh).

---

## GIAI ĐOẠN 2: BỘ NHẬN DIỆN THƯƠNG HIỆU ĐỘC LẬP (BRAND ASSETS)
- [x] Thiết kế `public/logo.svg` và `public/logo-flat.svg`:
  - Vector SVG sạch, nhẹ dưới 3KB, không dùng ảnh raster.
  - Nhận diện thương hiệu Sakayori Studio: Typography kết hợp biểu tượng hình học văn học (trang sách mở / cánh hạc origami tối giản).
  - Không sử dụng hình ảnh anime hay logo Kadokawa/MF Bunko J để bảo vệ bản quyền.
- [x] Thiết kế `public/og-cover.png`:
  - Tỉ lệ 1200×630px chuẩn metadata mạng xã hội.
  - Phong cách bìa sách văn học cổ điển (Editorial Book Cover).
  - Màu nền giấy ngà Hako (`#f4ecd8`), typography trang nhã, nhận diện Sakayori Studio.
- [x] Tạo `public/favicon.svg` đồng bộ trên nền tile Mực than `#1c1917` tương phản cao.

---

## GIAI ĐOẠN 3: ĐỒNG BỘ NỘI DUNG & BỘ PARSER PHÒNG THỦ (DATA INGESTION)
- [x] Viết script nạp dữ liệu `scripts/sync-chapters.py` nạp từ `/root/project02/rezero-vi/text/arc/` sang `src/content/chapters/rezero/`:
  - Đồng bộ đầy đủ 258 chương: Arc 7 (110 chương), Arc 8 (78 chương), Arc 9 (63 chương), Arc 10 (7 chương).
- [x] Xây dựng bộ Defensive Parser:
  - Tách tiêu đề: regex `# Chương (?<ch>\d+): (?<title>.+)`.
  - Bơm frontmatter YAML chuẩn xác.
  - Xử lý các chương gộp song song (như Arc 7 Chương 54 có `△▼△▼△▼△` và `## Tiết II: Che phủ trời xanh`) thành luồng đọc liền mạch.
  - Render dấu ngắt cảnh `△▼△▼△▼△` thành `<hr class="scene-break">` với ký hiệu hoa văn `— ◇ —` thanh lịch.
- [x] Đã cam kết và đẩy toàn bộ 258 chương lên nhánh `main` và đồng bộ vào `gemini`.
- [x] Đánh dấu `data-pagefind-body` chỉ vào metadata: Tác phẩm, Arc, Chương, Tiêu đề, và 150 ký tự trích dẫn đầu tiên (không index toàn văn để tối ưu dung lượng).

---

## GIAI ĐOẠN 4: HAKO READER ENGINE (TRẢI NGHIỆM ĐỌC ĐỈNH CAO)
- [x] Xây dựng module điều phối cài đặt `src/utils/reader-settings.ts` (Single Source of Truth):
  - Quản lý 6 biến CSS: `--read-bg`, `--read-fg`, `--read-font`, `--read-size`, `--read-lh`, `--read-width`.
  - Cung cấp hàm `getSettings()`, `saveSettings()`, `applySettings()`.
- [x] Cài đặt Inline Script Zero-FOUC trong `<head>` của `ReaderLayout.astro` để áp dụng CSS variables ngay trước khi trình duyệt vẽ trang đầu tiên.
- [x] Xây dựng 4 Preset màu nền:
  - **Vàng giấy Hako (Mặc định):** `#f4ecd8` / chữ `#3d3428`.
  - **Kem sáng:** `#faf7ef` / chữ `#2c2c2c`.
  - **Xám dịu:** `#d8d8d8` / chữ `#333333`.
  - **Đêm:** `#18181b` / chữ `#d4d4d8`.
- [x] Xây dựng Slide-out Utility Drawer (Thanh trượt tiện ích độc lập):
  - Modal tùy chỉnh 5 thông số: Màu nền (4 presets), Font chữ (Serif/Sans), Cỡ chữ (15px–24px), Giãn dòng (1.5–2.1), Độ rộng khung đọc (650px–900px).
- [x] Thanh tiến trình cuộn mỏng (Reading Progress Bar) trên cùng màn hình.
- [x] Cụm điều hướng chương kép (đỉnh và đáy trang): Nút Trước / Sau + Dropdown nhảy nhanh mục lục.
- [x] Điều hướng bằng phím tắt bàn phím: phím mũi tên `←` (chương trước) và `→` (chương sau).
- [x] Nút cuộn về đầu trang (Back to top) và toast thông báo nhẹ.

---

## GIAI ĐOẠN 5: TÍNH NĂNG BÁO LỖI CHÍNH TẢ (TYPO REPORTS - SIGNATURE FEATURE)
- [x] Bắt sự kiện chọn văn bản (`selectionchange`) trong vùng đọc.
- [x] Hiển thị nút nổi [Báo lỗi chính tả] cạnh đoạn bôi đen.
- [x] Modal báo lỗi: hiển thị đoạn trích dẫn (tối đa 200 ký tự) + ô nhập ghi chú đề xuất sửa.
- [x] Xây dựng endpoint `POST /api/typo-reports` với 6 lớp phòng thủ:
  - Cloudflare WAF rate limiting.
  - Cloudflare Turnstile token xác thực server-side.
  - Bẫy Honeypot & kiểm tra thời gian thao tác tối thiểu.
  - Cấm toàn bộ liên kết URL trong nội dung báo cáo.
  - Lưu trữ vào bảng `typo_reports` trong Cloudflare D1 với trạng thái `pending`.
- [x] Gửi thông báo tức thì tới Telegram Bot của ban biên tập kèm trích dẫn và thông tin chương.

---

## GIAI ĐOẠN 6: HỆ THỐNG BÌNH LUẬN TỰ CHỦ (FLAT COMMENTS & MODERATION)
- [x] Khởi tạo schema D1: bảng `comments` (`id`, `novel`, `arc`, `chapter`, `author_name`, `content`, `status`, `ip_hash`, `created_at`).
- [x] Xây dựng endpoint `GET /api/comments`: chỉ trả về bình luận có `status = approved`.
- [x] Xây dựng endpoint `POST /api/comments` với đầy đủ 6 lớp chống spam (Turnstile, Honeypot, time-to-submit, cấm URL, WAF rate limit).
- [x] Xây dựng Webhook duyệt bình luận Telegram hai lớp bảo mật:
  - Lớp 1: Xác thực header `X-Telegram-Bot-Api-Secret-Token`.
  - Lớp 2: Xác thực `admin_user_id` người thao tác bấm nút `[Duyệt]` / `[Xóa]`.
- [x] Script sao lưu D1: `scripts/backup-d1.sh` chạy `wrangler d1 export`.

---

## GIAI ĐOẠN 7: GIAO DIỆN THƯ VIỆN ĐA TÁC PHẨM (LIBRARY & HOMEPAGE)
- [x] Header chính: Wordmark Sakayori Studio, Lối tắt mục lục, Nút mở tìm kiếm Pagefind.
- [x] Hero Section: Phong cách Literary Showcase & Atrium trang trọng, trang nhã.
- [x] Khối "Đọc tiếp" (Resume Reading): Tự động nạp từ `localStorage`, hiển thị chương gần nhất người đọc đang xem dở.
- [x] Bảng ma trận tiến độ dịch thuật theo Arc (Arc 7, 8, 9, 10).
- [x] Footer: Tuyên bố miễn trừ trách nhiệm pháp lý phi thương mại, chính sách bản quyền và ghi chú xuất bản.

---

## GIAI ĐOẠN 8: KIỂM TOÁN CHẤT LƯỢNG (AUDIT, DETECT & VERIFICATION)
- [x] Toàn bộ 260 trang HTML (258 chương + 2 trang chủ/mục lục) prerender thành công trong 3.6 giây.
- [x] Pagefind lập chỉ mục tĩnh thành công 258 chương trong 1.3 giây.
- [x] Chạy công cụ kiểm định Impeccable: `/root/.config/opencode/skills/impeccable/scripts/impeccable detect --json` -> Đạt 0 lỗi `[]`.
- [x] Đã đẩy toàn bộ mã nguồn lên nhánh `main` và nhánh `gemini` trên GitHub, sẵn sàng cho việc triển khai Cloudflare Pages và so sánh visual.
