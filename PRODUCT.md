# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro SSG (Static Site Generation) triển khai trên Cloudflare Pages, Pages Functions (Workers runtime), Cloudflare D1 Database (SQLite at edge), Pagefind (Client-side static search), CSS Variables + Vanilla JS (Reader engine), và phông chữ tự host WOFF2.

## Users

Độc giả Light Novel tiếng Việt trên thiết bị di động và máy tính để bàn. Họ cần một không gian đọc văn học yên tĩnh, mượt mà, không bị xao nhãng bởi quảng cáo, diễn đàn rườm rà hay giao diện chói mắt, đồng thời có thể dễ dàng lưu lại tiến độ đọc và đóng góp phát hiện lỗi chính tả trực tiếp cho ban biên tập.

## Product Purpose

Cổng đọc Light Novel đa tác phẩm (Multi-series) phi thương mại của Sakayori Studio. Khởi đầu với Re:Zero kara Hajimeru Isekai Seikatsu (Arc 7 đến Arc 10) và mở rộng cho các bộ tiểu thuyết khác trong tương lai. Mục tiêu là tạo ra chuẩn mực trải nghiệm đọc tiểu thuyết số: tải trang tức thì, nhẹ nhàng, tôn trọng thị giác và hoàn toàn độc lập về hạ tầng.

## Positioning

Kế thừa và nâng cấp linh hồn trải nghiệm đọc thân thiện của Hako Reader (nền vàng giấy dịu mắt, tùy chỉnh linh hoạt) trên nền tảng kỹ thuật hiện đại: hoàn toàn tĩnh, không FOUC (Flash of Unstyled Content), không phần mềm theo dõi hay quảng cáo, và bảo vệ bản quyền phi thương mại nghiêm ngặt.

## Operating Context

Môi trường đọc thực tế trên trình duyệt web điện thoại và máy tính. Người đọc thường trải qua các phiên đọc dài từ 15 đến 60 phút ở nhiều điều kiện ánh sáng. Họ cần hệ thống ghi nhớ tiến độ đọc tin cậy, điều hướng chương trước/sau tiện lợi ở cả hai đầu trang, và các công cụ tương tác tinh gọn (báo lỗi chính tả, bình luận phản hồi).

## Capabilities and Constraints

- **Kiến trúc Đa tác phẩm (Multi-series):** Phân cấp định tuyến `/[novel]/[arc-or-vol]/[chapter]`.
- **Hako Reader Engine:**
  - 4 Preset màu nền: Vàng giấy Hako mặc định (`#f4ecd8`), Kem sáng (`#faf7ef`), Xám dịu (`#d8d8d8`), và Đêm (`#18181b`).
  - Tùy chỉnh font chữ: Serif (Noto Serif) và Sans-serif (Be Vietnam Pro).
  - Tùy biến cỡ chữ (15px - 24px), giãn dòng (1.5 - 2.1), và độ rộng khung chữ (650px - 900px).
  - Cơ chế Zero-FOUC ngăn chặn nhấp nháy giao diện khi nạp trang.
- **Hệ thống Bình luận Độc lập (Cloudflare D1):**
  - Bình luận ẩn danh (chỉ cần tên hiển thị) lưu vào D1.
  - Phòng thủ 6 lớp: Cloudflare WAF rate limiting, Cloudflare Turnstile token server-side, bẫy Honeypot, kiểm tra thời gian thao tác tối thiểu, cấm hoàn toàn URL, và hàng đợi duyệt mặc định `status = pending`.
- **Báo lỗi chính tả (Typo Reports):** Bôi đen văn bản hiển thị nút nổi -> mở hộp thoại -> lưu bảng `typo_reports` (D1) -> gửi thông báo kiểm duyệt.
- **Kiểm duyệt Telegram Webhook hai lớp:** Xác thực qua header `X-Telegram-Bot-Api-Secret-Token` và kiểm tra `admin_user_id`.
- **Tìm kiếm tĩnh (Pagefind):** Chỉ lập chỉ mục metadata (Tác phẩm, Arc, Chương, Tiêu đề, và đoạn trích dẫn 150 ký tự đầu tiên).
- **Phông chữ tự host:** File `.woff2` lưu trực tiếp trong `public/fonts/`, không gọi mạng ngoài.
- **Dự phòng dữ liệu:** Sao lưu D1 qua `wrangler d1 export` định kỳ.

## Brand Commitments

- **Tên thương hiệu:** Sakayori Studio.
- **Nhận diện hình ảnh:** Tự thiết kế Logo SVG và OpenGraph Typography độc lập; không sử dụng hình ảnh nhân vật anime hoặc logo của nhà xuất bản gốc để đảm bảo an toàn bản quyền.
- **Quy ước văn bản giao diện (UI Copy):** Tiếng Việt chuẩn mực, tối giản, không sử dụng em dash trong UI, loại bỏ hoàn toàn các từ ngữ mang tính chất tiếp thị hoặc số liệu tuyệt đối.
- **Pháp lý:** Footer đính kèm tuyên bố miễn trừ trách nhiệm phi thương mại rõ ràng.

## Evidence on Hand

- Toàn bộ nội dung bản dịch Markdown chuẩn văn học của Re:Zero Arc 7 (từ Ch 49 đến hết), Arc 8 (78 chương), Arc 9 (63 chương), và Arc 10 (Ch 1 đến 7) sẵn sàng tại `rezero-vi/text/arc/`.

## Product Principles

1. **Reader First:** Mọi quyết định thiết kế đều phải phục vụ cảm giác đọc thoải mái nhất cho mắt, loại bỏ mọi hiệu ứng thừa thãi gây phân tâm.
2. **Zero Dependencies Overhead:** Không dùng framework nặng cho tương tác client; tận dụng CSS variables và vanilla JS để đạt hiệu năng tối đa.
3. **Uncompromising Data Independence:** Dữ liệu thuộc quyền sở hữu nội bộ trên Cloudflare D1, loại bỏ phụ thuộc vào các dịch vụ bên thứ ba kém ổn định.
4. **Multi-Series Architecture:** Cấu trúc dữ liệu và routing được thiết kế sẵn sàng cho việc bổ sung nhiều bộ tiểu thuyết khác nhau mà không cần tái cấu trúc mã nguồn.

## Accessibility & Inclusion

- Độ tương phản màu sắc đáp ứng tiêu chuẩn WCAG AA trên cả 4 bộ màu preset.
- Điều hướng phím tắt đầy đủ (mũi tên trái/phải chuyển chương, phím Escape đóng panel).
- Hỗ trợ trọn vẹn bộ gõ tiếng Việt và hiển thị sắc nét trên mọi mật độ điểm ảnh (Retina / OLED).
