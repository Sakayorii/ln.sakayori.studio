# KẾ HOẠCH TRIỂN KHAI CHI TIẾT (GEMINI BRANCH) - ln.sakayori.studio

> **Mục tiêu:** Xây dựng cổng đọc Light Novel đa tác phẩm (Multi-series) tĩnh cho Sakayori Studio trên Cloudflare Pages + Astro SSG, tái hiện trọn vẹn trải nghiệm đọc Hako Reader (nền vàng dịu mắt, Zero-FOUC), tính năng độc quyền Báo lỗi chính tả qua bôi đen chữ, và hệ thống bình luận tự chủ trên Cloudflare D1.

---

## GIAI ĐOẠN 1: KHỞI TẠO NỀN TẢNG KỸ THUẬT & HẠ TẦNG (SCAFFOLD & PIPELINE)
- [ ] Khởi tạo dự án Astro core với TypeScript, TailwindCSS/CSS tokens tối giản.
- [ ] Cấu hình adapter Cloudflare Pages (`@astrojs/cloudflare`).
- [ ] Cấu hình Content Collections đa tác phẩm tại `src/content/config.ts`:
  - Phân cấp schema: `novel` -> `arc` -> `chapter`.
  - Validate nghiêm ngặt bằng Zod: `chapter` là số nguyên dương, tiêu đề chuỗi không rỗng.
- [ ] Tích hợp phông chữ tự host `.woff2` trong `public/fonts/`:
  - `Noto Serif` (phông có chân chuẩn sách in tiếng Việt).
  - `Be Vietnam Pro` (phông không chân hiện đại).
  - Cấu hình `@font-face` nạp trước (preload) trong layout, hoàn toàn không phụ thuộc CDN ngoài.
- [ ] Tích hợp `@astrojs/sitemap` và tạo `public/robots.txt`.
- [ ] Cấu hình build script cho Pagefind (tìm kiếm tĩnh).

---

## GIAI ĐOẠN 2: BỘ NHẬN DIỆN THƯƠNG HIỆU ĐỘC LẬP (BRAND ASSETS)
- [ ] Thiết kế `public/logo.svg`:
  - Vector SVG sạch, nhẹ dưới 5KB, không dùng ảnh raster.
  - Nhận diện thương hiệu Sakayori Studio: Typography kết hợp biểu tượng hình học văn học (trang sách mở / cánh hạc origami tối giản).
  - Không sử dụng hình ảnh anime hay logo Kadokawa/MF Bunko J để bảo vệ bản quyền.
- [ ] Thiết kế `public/og-cover.png`:
  - Tỉ lệ 1200×630px chuẩn metadata mạng xã hội.
  - Phong cách bìa sách văn học cổ điển (Editorial Book Cover).
  - Màu nền giấy ngà Hako (`#f4ecd8`), typography trang nhã, nhận diện Sakayori Studio.
- [ ] Tạo `public/favicon.svg` đồng bộ.

---

## GIAI ĐOẠN 3: ĐỒNG BỘ NỘI DUNG & BỘ PARSER PHÒNG THỦ (DATA INGESTION)
- [ ] Viết script nạp dữ liệu từ `/root/project02/rezero-vi/text/arc/` sang `src/content/novels/rezero/`:
  - Đồng bộ đầy đủ: Arc 7, Arc 8, Arc 9, Arc 10 (Chương 1–7).
- [ ] Xây dựng bộ Defensive Parser:
  - Tách tiêu đề: regex `# Chương (?<ch>\d+): (?<title>.+)`.
  - Xử lý các chương gộp song song (như Arc 7 Chương 54 có `△▼△▼△▼△` và `## Tiết II: Che phủ trời xanh`) thành luồng đọc liền mạch.
  - Render dấu ngắt cảnh `△▼△▼△▼△` thành `<hr class="scene-break">` với ký hiệu hoa văn `⁂` căn giữa.
  - Xử lý ghi chú dịch giả / chú thích thành khung trích dẫn chuyên biệt.
- [ ] Đánh dấu `data-pagefind-body` chỉ vào metadata: Tác phẩm, Arc, Chương, Tiêu đề, và 150 ký tự trích dẫn đầu tiên (không index toàn văn để tối ưu dung lượng).

---

## GIAI ĐOẠN 4: HAKO READER ENGINE (TRẢI NGHIỆM ĐỌC ĐỈNH CAO)
- [ ] Xây dựng module điều phối cài đặt `src/utils/reader-settings.ts` (Single Source of Truth):
  - Quản lý 6 biến CSS: `--read-bg`, `--read-fg`, `--read-font`, `--read-size`, `--read-lh`, `--read-width`.
  - Cung cấp hàm `getSettings()`, `saveSettings()`, `applySettings()`.
- [ ] Cài đặt Inline Script Zero-FOUC trong `<head>` của `ReaderLayout.astro` để áp dụng CSS variables ngay trước khi trình duyệt vẽ trang đầu tiên.
- [ ] Xây dựng 4 Preset màu nền:
  - **Vàng giấy Hako (Mặc định):** `#f4ecd8` / chữ `#3d3428`.
  - **Kem sáng:** `#faf7ef` / chữ `#2c2c2c`.
  - **Xám dịu:** `#d8d8d8` / chữ `#333333`.
  - **Đêm:** `#18181b` / chữ `#d4d4d8`.
- [ ] Xây dựng Floating Gear Panel (Nút bánh răng nổi):
  - Modal tùy chỉnh 5 thông số: Màu nền (4 presets), Font chữ (Serif/Sans), Cỡ chữ (15px–24px), Giãn dòng (1.5–2.1), Độ rộng khung đọc (650px–900px).
- [ ] Thanh tiến trình cuộn mỏng (Reading Progress Bar) 2px trên cùng màn hình.
- [ ] Cụm điều hướng chương kép (đỉnh và đáy trang): Nút Trước / Sau + Dropdown nhảy nhanh mục lục.
- [ ] Điều hướng bằng phím tắt bàn phím: phím mũi tên `←` (chương trước) và `→` (chương sau).
- [ ] Nút sao chép liên kết chương (Copy Link Toast) và nút cuộn về đầu trang (Back to top).

---

## GIAI ĐOẠN 5: TÍNH NĂNG BÁO LỖI CHÍNH TẢ (TYPO REPORTS - SIGNATURE FEATURE)
- [ ] Bắt sự kiện chọn văn bản (`selectionchange` / `mouseup`) trong vùng đọc.
- [ ] Hiển thị nút nổi [Báo lỗi chính tả] cạnh đoạn bôi đen.
- [ ] Modal báo lỗi: hiển thị đoạn trích dẫn (tối đa 200 ký tự) + ô nhập ghi chú đề xuất sửa.
- [ ] Xây dựng endpoint `POST /api/typo-reports` với 6 lớp phòng thủ:
  - Cloudflare WAF rate limiting (tối đa 5 request/60s).
  - Cloudflare Turnstile token xác thực server-side.
  - Bẫy Honeypot & kiểm tra thời gian thao tác tối thiểu.
  - Cấm toàn bộ liên kết URL trong nội dung báo cáo.
  - Lưu trữ vào bảng `typo_reports` trong Cloudflare D1 với trạng thái `pending`.
- [ ] Gửi thông báo tức thì tới Telegram Bot của ban biên tập kèm trích dẫn và thông tin chương.

---

## GIAI ĐOẠN 6: HỆ THỐNG BÌNH LUẬN TỰ CHỦ (FLAT COMMENTS & MODERATION)
- [ ] Khởi tạo schema D1: bảng `comments` (`id`, `novel`, `arc`, `chapter`, `author_name`, `content`, `status`, `ip_hash`, `created_at`).
- [ ] Xây dựng endpoint `GET /api/comments`: chỉ trả về bình luận có `status = approved`.
- [ ] Xây dựng endpoint `POST /api/comments` với đầy đủ 6 lớp chống spam (Turnstile, Honeypot, time-to-submit, cấm URL, WAF rate limit).
- [ ] Xây dựng Webhook duyệt bình luận Telegram hai lớp bảo mật:
  - Lớp 1: Xác thực header `X-Telegram-Bot-Api-Secret-Token`.
  - Lớp 2: Xác thực `admin_user_id` người thao tác bấm nút `[Duyệt]` / `[Xóa]`.
- [ ] Script sao lưu D1: `scripts/backup-d1.sh` chạy `wrangler d1 export`.

---

## GIAI ĐOẠN 7: GIAO DIỆN THƯ VIỆN ĐA TÁC PHẨM (LIBRARY & HOMEPAGE)
- [ ] Header chính: Wordmark Sakayori Studio, Menu tác phẩm, Nút mở tìm kiếm Pagefind.
- [ ] Hero Section: Định vị studio dịch thuật văn học phi thương mại, trang trọng, trang nhã.
- [ ] Khối "Đọc tiếp" (Resume Reading): Tự động nạp từ `localStorage`, hiển thị chương gần nhất người đọc đang xem dở.
- [ ] Lưới danh mục tác phẩm (Library Grid):
  - Thẻ thông tin bộ truyện Re:Zero: Tóm tắt, số lượng Arc đã hoàn thành, huy hiệu cập nhật [Mới].
  - Sẵn sàng mở rộng cho các bộ tiểu thuyết khác.
- [ ] Accordion mục lục các Arc (Arc 7, Arc 8, Arc 9, Arc 10) với số lượng chương và liên kết truy cập nhanh.
- [ ] Footer: Tuyên bố miễn trừ trách nhiệm pháp lý phi thương mại, chính sách bản quyền và thông tin liên hệ.

---

## GIAI ĐOẠN 8: KIỂM TOÁN CHẤT LƯỢNG (AUDIT, DETECT & VERIFICATION)
- [ ] Kiểm tra toàn diện WCAG AA về độ tương phản màu sắc trên cả 4 theme presets.
- [ ] Chạy linter kiểm tra cú pháp, lỗi viết hoa, và không sử dụng em dash trong UI copy.
- [ ] Chạy công cụ kiểm định Impeccable: `/root/.config/opencode/skills/impeccable/scripts/impeccable detect`.
- [ ] Build kiểm tra tĩnh `astro build` và kiểm tra Pagefind index.
- [ ] Đẩy toàn bộ mã nguồn lên nhánh `gemini` trên GitHub và chuẩn bị bàn giao so sánh.
