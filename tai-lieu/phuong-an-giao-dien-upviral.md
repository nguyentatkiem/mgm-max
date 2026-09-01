# Phương án dựng lại giao diện MGM MAX theo bố cục UpViral (bản duyệt)

> Nguồn: đã xem kỹ **39/39 ảnh** chụp màn hình trong `~/Downloads/UPVIRAL`. Mục tiêu: **tái tạo bố cục, luồng màn hình và chức năng tương đương, toàn bộ chữ nghĩa tiếng Việt**, chạy trên nền MGM MAX hiện có (đợt 1+2 đã có sẵn phần lớn nghiệp vụ).
> Nguyên tắc sạch: giữ thương hiệu **MGM MAX** (logo, tên, hình minh hoạ tự dựng bằng SVG/lucide) — không dùng logo, linh vật, hình hoạ hay câu chữ của UpViral; text viết mới 100% tiếng Việt. Bố cục màn hình, cấu trúc điều hướng, thành phần chức năng thì làm tương đương 1:1.

---

## 0. Hệ thiết kế rút ra từ 39 ảnh (design tokens)

| Thứ | UpViral dùng | MGM MAX sẽ dùng |
|---|---|---|
| Nền app | xám rất nhạt `#f7f8fa` | giữ nguyên tông |
| Card | trắng, bo góc lớn 14–16px, viền mảnh, đổ bóng nhẹ | giữ |
| Màu chủ đạo | teal/mint (nút chính teal đậm, active = nền mint nhạt + chữ teal) | **Cần anh chốt**: (a) theo teal cho giống hệt, hay (b) giữ xanh dương brand MGM MAX hiện tại. Đề xuất: **(b) xanh dương** — cùng bố cục nhưng màu của mình |
| Nút phụ đặc biệt | nút **Save màu cam** trong editor | giữ quy ước: Lưu = cam trong editor |
| Font | tròn trịa kiểu Poppins/Nunito | **Be Vietnam Pro** (tương đồng, hỗ trợ tiếng Việt chuẩn) |
| Badge gói | ribbon "BUSINESS" góc card | bỏ (mình không bán gói) hoặc để "PRO" dự phòng |
| Icon | outline mảnh | lucide-react (đang dùng) |

**Từ điển thuật ngữ (dùng thống nhất):** Dashboard → **Tổng quan** · Setup → **Thiết lập** · Promote → **Quảng bá** · Reports → **Báo cáo** · Leads → **Người tham gia** · Launch Campaign → **Chạy chiến dịch** · Draft → **Nháp** · Opt-In Page → **Trang đăng ký** · Share Page → **Trang chia sẻ** · Closed page → **Trang khi đóng** · Embed → **Nhúng website** · Grand Prize → **Giải đặc biệt** · Tier Incentive → **Mốc quà** · Refer a friend → **Thưởng giới thiệu (2 chiều)** · Custom Actions → **Nhiệm vụ cộng điểm** · Lead Quality → **Chất lượng lead** · Points Collection → **Cấu hình điểm** · Autoresponder → **Kết nối Email/CRM** · Geo targeting → **Giới hạn khu vực** · Preview → **Xem trước**.

---

## 1. Thay đổi kiến trúc LỚN nhất: điều hướng THEO CHIẾN DỊCH

UpViral tổ chức toàn bộ app quanh **ngữ cảnh 1 chiến dịch** — khác hẳn admin MGM MAX hiện tại (sidebar toàn cục). Phải dựng lại khung:

### 1.1 Khung tài khoản (ngoài chiến dịch) — *ảnh 21*
- Top bar: logo MGM MAX + tabs **[Tổng quan | Học viện]** + chuông + avatar (menu: Cài đặt hệ thống, Đăng xuất).
- 3 ô thống kê tài khoản: **Tổng lượt ghé · Tổng lead (x/giới hạn) · Lead từ giới thiệu** (kèm % tăng).
- Khối "**N Chương trình & Chiến dịch**": thanh công cụ [tìm kiếm | lọc "Mọi chiến dịch" | lọc ngày | nút **+ Chiến dịch mới**].
- **Card chiến dịch** (mỗi campaign 1 hàng): thumbnail trang đăng ký | tên + badge trạng thái | chips (Giải đặc biệt · Mốc quà · Giới thiệu 2 chiều · Tạo N phút trước) | cảnh báo vàng "Chiến dịch đang thiếu cấu hình" + nút Sửa | link rút gọn + ⋮ Thêm (Nhân bản/Tạm dừng/Đóng/Xoá) | 2 ô số: Lượt ghé / Lead.

### 1.2 Khung trong chiến dịch (top bar ngữ cảnh) — *mọi ảnh Setup/Promote/Reports/Leads*
- Trái: **[tên chiến dịch (sửa inline ✏️) + badge Nháp/Đang chạy]**.
- Giữa: 5 tab lớn có icon: **Tổng quan · Thiết lập · Quảng bá · Báo cáo · Người tham gia** (active = nền nhạt màu chủ đạo).
- Phải: nút **Xem trước 👁** (tooltip "Xem chiến dịch").
- Route mới: `/admin/cd/[id]/(tong-quan|thiet-lap|quang-ba|bao-cao|nguoi-tham-gia)/...`

---

## 2. Wizard tạo chiến dịch 2 bước — *ảnh 34–39*

**Bước 1 — Chọn loại** (fullscreen, progress bar mảnh trên cùng): heading "Anh muốn chạy chiến dịch kiểu gì?"; **5 card**: 🏆 Bốc thăm & Minigame [chip: Bùng nổ viral] · 🕐 Danh sách chờ & Ra mắt sản phẩm [Gom sự chú ý] · 🎖 Mốc quà & Giới thiệu bạn [Gom lead bền vững] · 🤝 Chương trình giới thiệu [Lead chất lượng cao] · 🎁 Tự do [Tự trộn cơ chế]; mỗi card có "Tìm hiểu thêm ⓘ"; dưới cùng: accordion "Cách gắn MGM MAX vào việc kinh doanh của anh".

**Bước 2 — Chọn template** (fullscreen): cột trái = panel **"Dùng AI sinh chiến dịch"** (nút tím "Hoàn tất khai báo" → nối thẳng vào Referral AI F51 ĐÃ CÓ) + danh sách template theo loại (thumb + tên + chip loại thưởng); cột phải = **preview sống** trang đăng ký với biến `{{ten_thuong_hieu}}`, `[Giải đặc biệt]`, `{{ngay_ket_thuc}}`; giữa trên: step pill **[1 Trang đăng ký] [2 Trang chia sẻ]**; footer: ← Quay lại | **Tạo chiến dịch →**. Template đầu tay (5 cái/loại chính): "Máy gom lead", "Referral evergreen", "Ưu đãi độc quyền", "Khuyến mãi Tết", "Tăng list email" — nội dung tự viết tiếng Việt.

---

## 3. Tab THIẾT LẬP (sidebar trái trong chiến dịch) — *ảnh 1–20*

Sidebar: nút **CHẠY CHIẾN DỊCH 🚀** (xám khi chưa đủ điều kiện — điều kiện: có trang đăng ký + trang chia sẻ) + link rút gọn; nhóm menu:

| Mục | Nội dung màn hình (theo ảnh) | Nghiệp vụ MGM MAX |
|---|---|---|
| **Trang đăng ký** | màn chọn template (3 card "phổ biến" + Xem tất cả + nút "+ Tạo trang") → vào **editor** | đã có trang, thiếu editor (mục 7) |
| **Trang chia sẻ** | như trên, template share page | đã có |
| **Trang khi đóng** | 3 card: Mặc định / Trang tự dựng / Chuyển hướng URL + preview | đã có default+redirect; thêm "trang tự dựng" |
| **Nhúng website** | wizard 2 bước: nhập URL đích → chọn "form của MGM MAX" / "form của riêng anh" | đã có iframe+popup (F3); thêm màn wizard |
| **Giải đặc biệt** | modal: Tên giải, Mô tả, Ảnh cover (kéo-thả), "Cách chọn người thắng" (2 card: Tự động/Thủ công) | đã có (F26) — làm lại UI modal |
| **Mốc quà** | trang intro (mô tả + nút "+ Tạo mốc quà") + màn "Cơ chế hoạt động"; list mốc đã tạo | đã có — làm lại UI |
| **Thưởng giới thiệu** | 2 card: **Người mời** ⇄ **Người được mời**, mỗi bên nút "+ Tạo phần thưởng" riêng | đã có hai chiều — tách UI 2 phía như ảnh 8 |
| **Cài đặt › Email** | list email dạng hàng [icon | tên + mô tả | ✏️ sửa | 👁 xem | toggle]: Đăng ký, Báo có người được mời, Cảnh báo gian lận, Double opt-in; nhóm "Email phần thưởng": Trúng giải; toggle "Tách email cho traffic trực tiếp/giới thiệu"; khối "Người gửi email" + nút "+ Thêm email" | đã có 6 mẫu email + sửa per campaign — làm lại UI dạng toggle-row + preview |
| **Cài đặt › Lời mời chia sẻ** | khối "Preview link chia sẻ" (thumb + text + Sửa) + khối "Email mời" (tiêu đề + nội dung có biến link + Sửa) | đã có loi_moi per kênh + OG (F5) — gom về màn này |
| **Cài đặt › Nhiệm vụ** | trang intro + modal **"Chọn mẫu nhiệm vụ"** lưới 3 cột: Tự do, Theo dõi Instagram, Đăng Instagram Feed/Story, Chia sẻ Facebook/Nhóm FB, Chia sẻ X, Đăng ký YouTube, Bình luận YouTube (mỗi card icon màu thương hiệu + mô tả) — **thêm mẫu VN: Vào nhóm Zalo, Theo dõi TikTok** | đã có nhiệm vụ + quiz — thêm bộ mẫu |
| **Cài đặt › Chất lượng lead** | 4 hàng: Double opt-in (toggle) · Xác minh email (toggle) · Phát hiện gian lận (toggle + hàng con "Cảnh báo đăng ký khả nghi" ON + Sửa) · Kiểm tra cú pháp email (+ input "Thông báo khi email sai" + Xem trước) | đã có đủ nghiệp vụ — làm UI toggle |
| **Cài đặt › Điều khoản** | banner disclaimer vàng + input tiêu đề + dropdown Biến + **rich text editor** + nút Lưu | mới (thêm cột dieu_khoan cho campaign, editor dùng contenteditable đơn giản) |
| **Nâng cao › Cấu hình điểm** | 2 card lớn "Điểm đăng ký"/"Điểm mời bạn" (icon + mô tả + tip + stepper số); "ĐIỂM CHIA SẺ": hàng từng kênh [icon Zalo/FB/Messenger/Telegram | stepper] | đã có — làm lại UI stepper |
| **Nâng cao › Kết nối Email/CRM** | card "Kết nối nền tảng email" + nút "+ Thêm kết nối" (modal dropdown chọn: **Resend / SMTP / Webhook / Google Sheets**…) + khối Zapier→đổi thành "Webhook & API" | mình dùng Resend + webhook (F44) — gom về đây |
| **Nâng cao › Giới hạn khu vực** | 2 card radio: Toàn cầu / Giới hạn khu vực + minh hoạ | mới, làm mức đơn giản (allow-list quốc gia, check theo IP — dùng header CF) |
| **Nâng cao › UTM** | toggle-pill [UTM | Link tuỳ chỉnh]; form Nguồn/Kênh/Tên + Generate; ô kết quả + Copy; "MÃ TRACKING": 2 hàng Header codes trang đăng ký/chia sẻ + "Sửa mã" | custom tracking links (P10 cũ) + ô chèn script — mới, vừa |
| **Nâng cao › Tuỳ chọn chung** | Tên miền riêng (+ nút Thêm domain + banner "SSL mất tới 48h" + hướng dẫn); Domain link rút gọn + Đổi; **Webhook lead mới / Webhook mở quà** + Sửa | webhook đã có; domain riêng = ghi chú "khi deploy thật" |

---

## 4. Tab QUẢNG BÁ — *ảnh 22–24*

Sidebar 3 mục:
1. **Mã QR**: banner "Kéo traffic offline vào chiến dịch" + card "QR của chiến dịch" (tabs từng mã + nút "+ Tạo mã QR") + ảnh QR to + link — đã có QR per người; thêm **QR theo nguồn** (mỗi QR = 1 custom tracking link).
2. **Traffic sẵn có**: 4 hàng accordion: Chia sẻ mạng xã hội / **Mời list email sẵn có** (nối one-click F14 + import CSV F15) / Nhúng website (badge "Chưa kích hoạt" + nút "+ Thêm nhúng") / Mẹo & tài nguyên.
3. **Traffic bên ngoài**: banner + 4 card gợi ý: Influencer/KOC · Cộng đồng & nhóm (Facebook, Zalo, Reddit) · Danh bạ minigame · Quảng cáo trả phí (nút mở FB Ads) + ghi chú "chỉ là gợi ý" — thuần nội dung tĩnh.

---

## 5. Tab BÁO CÁO — *ảnh 25–29*

Sidebar 6 mục: **Tổng quan · Traffic · Nhiệm vụ · Người tham gia · Email · A/B test**.
- **Tổng quan**: 3 cụm donut % [Lead trực tiếp/lượt ghé · Lead giới thiệu/lượt ghé · Tổng] + pill "Phân tích chi tiết" + Refresh + lọc thời gian; 2 khung: "Lead trực tiếp & giới thiệu" (nối biểu đồ F43) / "Nguồn traffic hàng đầu"; nút "Xoá số liệu" (thùng rác, confirm).
- **Traffic**: pill [Trực tiếp/Giới thiệu/Chuyển đổi] + bảng nguồn + lọc.
- **Nhiệm vụ**: 4 stat (Tổng share · % tương tác · Tổng nhiệm vụ · % làm nhiệm vụ) + 2 khung Social/Nhiệm vụ.
- **Người tham gia**: pill [Trực tiếp/Giới thiệu/Tổng] + chart + khung Chuyển đổi (nối K-factor sẵn có).
- **Email**: 3 stat (Đã gửi/Đã mở/Chưa mở — "đã mở" ghi chú cần Resend webhook, P2) + 2 khung.
- **A/B test**: khung trống "Chưa có thử nghiệm" (nối P12 sau).

## 6. Tab NGƯỜI THAM GIA — *ảnh 30–33*

- 4 stat card icon màu: **Tổng lead (xanh) · Trực tiếp (chàm) · Từ giới thiệu (tím) · Gian lận (đỏ)**.
- Sidebar: Tổng / Trực tiếp / Giới thiệu / **Gian lận**.
- Toolbar: "N lead" + trạng thái "Email/CRM: Chưa kết nối ⊖" + 3 nút tròn [🔍 tìm | ⚙ lọc | ⬆ xuất CSV].
- Bảng sortable: ☑ | Tên | Email | Trạng thái | Ngày đăng ký | Số bạn mời | Điểm; tab Giới thiệu thêm cột **"Được mời bởi"**; tab Gian lận: cột Gian lận + Loại gian lận (nối khu cách ly hiện có — duyệt/từ chối ngay trên hàng); phân trang "Hiện 10 / N".
- Bấm 1 hàng → hồ sơ 360° hiện có (giữ nguyên, restyle).

## 7. Editor trang (nặng nhất — làm 2 mức) — *ảnh 2*

- **Mức 1 (đợt này): "Cài đặt template"** — đúng tab phải của ảnh 2: Tiêu đề trang, URL slug, Màu nền (hex picker), Ảnh nền (upload URL + gallery), màu chính/phụ, đổi từng khối văn bản qua form (headline, mô tả, nút CTA, chân trang) + preview live iframe giữa màn + 3 nút xem Desktop/Mobile/Widget + nút Thoát/Xem trước/**Lưu (cam)**.
- **Mức 2 (đợt sau): kéo-thả block** — palette trái (Chữ, Nút, Ảnh, Video, Iframe, Khoảng cách, Đăng nhập Google/Zalo, Form); lưu layout JSON; render server-side.

---

## 8. Khớp với code hiện có & việc phải làm

**Đã có nghiệp vụ, chỉ thay UI (đa số):** điểm, mốc quà, coupon, hai chiều, bốc thăm 3 cách, cách ly gian lận, email queue + mẫu, broadcast, import CSV, one-click, nhúng, webhook, QR, biểu đồ, K-factor, Referral AI.
**Phải làm mới:** khung điều hướng theo chiến dịch + dashboard tài khoản (1) · wizard 2 bước (2) · bộ template trang + preview biến (2,7) · trang "Cài đặt template" (7 mức 1) · Điều khoản + rich text (3) · Giới hạn khu vực (3) · UTM builder + ô chèn script (3) · màn Báo cáo tách 6 mục (5) · bảng Người tham gia 4 tab + sort + phân trang (6) · bộ mẫu nhiệm vụ có icon thương hiệu (3).

**Lộ trình đề xuất (4 đợt, làm tuần tự):**
1. **Đợt A — Khung**: design tokens + font Be Vietnam Pro + khung tài khoản + top bar chiến dịch + route `/admin/cd/[id]/...` + chuyển các trang hiện có vào đúng chỗ. *(nặng vừa)*
2. **Đợt B — Thiết lập**: toàn bộ sidebar Thiết lập theo bảng mục 3 (UI mới trên nghiệp vụ cũ) + wizard 2 bước + modal Giải đặc biệt/Nhiệm vụ. *(nặng nhất)*
3. **Đợt C — Quảng bá + Báo cáo + Người tham gia**: 3 tab còn lại. *(vừa)*
4. **Đợt D — Editor mức 1** + trang template + preview biến; (kéo-thả để đợt sau). *(vừa–nặng)*

**2 câu hỏi cần anh chốt trước khi code:**
1. **Màu chủ đạo**: teal/mint giống hệt bố cục gốc, hay giữ xanh dương MGM MAX? (đề xuất: xanh dương)
2. Làm **cả 4 đợt A–D liền mạch**, hay dừng duyệt sau từng đợt? (đề xuất: A+B trước, anh xem trên link Cloudflare rồi tiếp C+D)
