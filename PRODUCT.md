# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro SSG (Static Site Generation) triển khai trên Cloudflare Pages, Pages Functions (Workers runtime), Cloudflare D1 Database (SQLite at edge), Pagefind (Client-side static search), CSS Variables + Vanilla JS (Reader engine), và phông chữ tự host WOFF2.

## Users

Độc giả Light Novel tiếng Việt trên thiết bị di động và máy tính để bàn. Họ cần một không gian đọc văn học yên tĩnh, mượt mà, không bị xao nhãng bởi quảng cáo, diễn đàn rườm rà hay giao diện chói mắt, đồng thời có thể dễ dàng lưu lại tiến độ đọc và đóng góp phát hiện lỗi chính tả trực tiếp cho ban biên tập.

## Product Purpose

Cổng đọc Light Novel đa tác phẩm (Multi-series) phi thương mại của Sakayori Studio. Hiện có Re:Zero kara Hajimeru Isekai Seikatsu, Arc 7 đến Arc 10. Người dùng vào để tìm truyện, chọn chương và đọc; không phải để mua sản phẩm hay xem trang giới thiệu dịch vụ. Thành công là dễ tìm đúng chương, tiếp tục chỗ đang đọc và đọc lâu mà không bị giao diện cản trở.

### Ranh giới được người dùng yêu cầu (2026-10-11)

- Đây là **web đọc LN, không phải web bán hàng hoặc landing page**. Không tự thêm cấu trúc tiếp thị, pricing, khối quảng bá chất lượng, testimonial hay CTA bán hàng.
- Người dùng muốn remake giao diện hiện tại, không chỉ chỉnh đẹp lại giao diện cũ. Remake không đồng nghĩa xóa nội dung truyện, định tuyến, dữ liệu hoặc chức năng đọc.
- Bố cục chi tiết chưa được người dùng chốt; người dùng không có sẵn phương án UX. Mọi đề xuất bố cục phải phục vụ việc tìm và đọc truyện, không biến đề xuất của agent thành yêu cầu đã được duyệt.
- Không tự mở rộng sang tài khoản, thanh toán, diễn đàn, xếp hạng, gamification hoặc tính năng sản phẩm mới trong đợt remake.

## Positioning

Cổng truy cập bản dịch của Sakayori Studio với công cụ đọc tùy chỉnh và lưu tiến độ cục bộ. Không quảng cáo hoặc phần mềm theo dõi. Hako Reader là tham chiếu chức năng đọc từ tài liệu cũ, không phải yêu cầu giữ nguyên giao diện hoặc màu sắc hiện tại khi remake. Nội dung chương được tạo tĩnh; các tương tác gửi dữ liệu dùng Pages Functions.

## Operating Context

Môi trường đọc trên trình duyệt điện thoại và máy tính, ở nhiều điều kiện ánh sáng. Ưu tiên các phiên đọc dài; chưa có nghiên cứu xác nhận thời lượng đọc cụ thể. Luồng chính là tìm tác phẩm → chọn Arc/chương → đọc → chuyển chương hoặc trở lại chỗ đang đọc. Ghi nhớ tiến độ, điều hướng chương trước/sau và cài đặt đọc phải dễ dùng. Bình luận và báo lỗi là công cụ phụ, không được lấn át văn bản.

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

Các khả năng trên mô tả kiến trúc và chức năng hiện có/dự kiến, không phải bằng chứng đã kiểm thử trên production. D1, Turnstile và webhook phụ thuộc cấu hình môi trường; chưa xác nhận chúng hoạt động trên preview. Remake giao diện không bao gồm tự cấu hình backend hoặc deploy. Giữ định dạng Markdown/frontmatter, URL chương và khóa localStorage để không mất liên kết hay tiến độ đọc cũ. Các preset và thông số hiện hành là dữ liệu tương thích cần xét, không phải bảng màu khóa cho giao diện mới.

## Brand Commitments

- **Tên thương hiệu:** Sakayori Studio.
- **Nhận diện hình ảnh:** Giữ thương hiệu Sakayori Studio. Theo xác nhận mới 2026-10-11, được dùng **bìa truyện có nguồn**; không còn cấm tuyệt đối ảnh bìa như tài liệu cũ. Ghi nguồn và xác minh điều kiện sử dụng trước khi đưa tài sản ngoài vào web; có nguồn không tự chứng minh có quyền sử dụng. Không tạo ấn tượng là trang chính thức của tác giả/nhà xuất bản. Chưa chọn bìa cụ thể.
- **Quy ước văn bản giao diện (UI Copy):** Tiếng Việt chuẩn mực, tối giản, không sử dụng em dash trong UI, loại bỏ hoàn toàn các từ ngữ mang tính chất tiếp thị hoặc số liệu tuyệt đối.
- **Pháp lý:** Footer đính kèm tuyên bố miễn trừ trách nhiệm phi thương mại rõ ràng.

## Evidence on Hand

- Nội dung web nằm tại `src/content/chapters/rezero/`, metadata tác phẩm tại `src/content/novels/rezero.json`. Sau push 2026-10-11: 278 tệp chương, gồm Arc 7: 110, Arc 8: 78, Arc 9: 63, Arc 10: 27. Arc 10 tệp 28–30 chưa được đưa lên web.
- Nguồn dịch workspace: `/root/project02/rezero-vi/text/arc/`; trạng thái biên tập/QA được quản lý riêng tại `/root/project02/rezero-translation/`. Có tệp hoặc được push không đồng nghĩa đã nghiệm thu độc lập; không dùng số lượng làm lời quảng bá chất lượng.
- Logo và font hiện có trong `public/`. Chưa có bằng chứng duyệt quyền sử dụng một bìa ngoài cụ thể. Không bịa nhãn “Chính thức”, cam kết chất lượng tuyệt đối, người dùng, đánh giá hay chứng nhận.

## Product Principles

1. **Reader First:** Mọi quyết định thiết kế đều phải phục vụ cảm giác đọc thoải mái nhất cho mắt, loại bỏ mọi hiệu ứng thừa thãi gây phân tâm.
2. **Zero Dependencies Overhead:** Không dùng framework nặng cho tương tác client; tận dụng CSS variables và vanilla JS để đạt hiệu năng tối đa.
3. **Giữ dữ liệu và tính liên tục:** Nội dung truyện lưu trong repo, tương tác dùng hạ tầng nội bộ D1; giữ tiến độ cục bộ và URL cũ. Không đánh đổi chức năng để trang nhìn đẹp hơn.
4. **Multi-Series Architecture:** Cấu trúc dữ liệu và routing được thiết kế sẵn sàng cho việc bổ sung nhiều bộ tiểu thuyết khác nhau mà không cần tái cấu trúc mã nguồn.

## Accessibility & Inclusion

- Mục tiêu: WCAG AA về tương phản, điều khiển dùng được bằng bàn phím, focus rõ, hỗ trợ giảm chuyển động. Không ghi là đã đạt nếu chưa kiểm chứng.
- Bảo toàn phím tắt chuyển chương/đóng panel, không kích hoạt khi người đọc đang nhập nội dung vào form.
- Font phải đủ dấu tiếng Việt; bố cục không cắt chữ/điều khiển trên màn hình nhỏ hoặc khi tăng cỡ chữ. Mobile web vẫn là web, không giả lập ứng dụng native.
