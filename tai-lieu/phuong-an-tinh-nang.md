# MGM MAX — Phương án tính năng (bản trình duyệt)

> Mục tiêu chính: **VIRAL ĐỂ NHẬN QUÀ** — người tham gia mời bạn bè/chia sẻ để mở khoá quà (sản phẩm số, khoá học, coupon), KHÔNG phải hệ affiliate trả hoa hồng tiền mặt.
> Căn cứ: [nghien-cuu-upviral.md](nghien-cuu-upviral.md) + [nghien-cuu-repo-oss.md](nghien-cuu-repo-oss.md) + [tong-hop-mgm-max.md](tong-hop-mgm-max.md).
> Ngày: 01/09/2026. Mỗi tính năng gắn nhãn **[MVP]** hoặc **[P2]** (sau MVP). Cuối tài liệu là **danh sách 8 điểm cần anh chốt**.

---

## 0. Bức tranh tổng — vòng lặp viral

```
   [Traffic: quảng cáo / list cũ / social]
              │
              ▼
   ① TRANG ĐĂNG KÝ (opt-in)
      điền tên + email → gửi mail xác nhận (double opt-in)
              │ xác nhận
              ▼
   ② TRANG CHIA SẺ (share page) — khoảnh khắc vàng
      link riêng + QR + nút share Zalo/FB/Messenger
      thanh tiến độ quà · bảng xếp hạng · nhiệm vụ cộng điểm
              │
              ▼
   ③ KIẾM ĐIỂM & MỜI BẠN
      bạn bấm link → đăng ký → XÁC MINH EMAIL → referrer +điểm
      (lead khả nghi → khu cách ly chờ duyệt, KHÔNG cộng điểm)
              │
              ▼
   ④ MỞ KHOÁ QUÀ THEO MỐC (tự động 100%)
      đủ 1/3/5/10 bạn xác minh → email trao quà + hiện trên share page
      người ĐƯỢC MỜI cũng nhận quà chào mừng (hai chiều)
              │
              ▼
   ⑤ KẾT THÚC KỲ (nếu là bốc thăm)
      leaderboard: giải nhất/nhì/ba · bốc thăm trọng số điểm
              │
              └──► mỗi người được mời quay lại ② với link riêng của họ
                   = VÒNG LẶP VIRAL
```

**3 vai trò:** Admin (tạo & vận hành chiến dịch) · Người tham gia/referrer (mời bạn nhận quà) · Người được mời/referee (đăng ký qua link, cũng nhận quà chào mừng rồi trở thành referrer).

---

## MODULE 1 — Chiến dịch (Campaign)

| Tính năng | Nhãn | Chi tiết |
|---|---|---|
| Chiến dịch **Mốc quà** (evergreen) | **[MVP]** | Không cần ngày kết thúc. Mời đủ N bạn xác minh → tự mở quà. Đây là loại chủ lực cho "viral nhận quà". |
| Chiến dịch **Bốc thăm** (có hạn) | **[MVP]** | Có ngày kết thúc. Điểm = vé số. Kết hợp được với mốc quà trong CÙNG 1 chiến dịch (điều Gleam không làm được). |
| Chiến dịch **Hàng chờ** (waitlist) | [P2] | Mời bạn để nhảy hạng trong hàng chờ ra mắt sản phẩm. |
| Đa chiến dịch song song | **[MVP]** | 1 hệ thống chạy nhiều campaign, mỗi campaign cấu hình độc lập (điểm, mốc, quà, kênh share, thời gian). |
| Vòng đời campaign | **[MVP]** | `nháp → chạy → tạm dừng → đóng`. Trang "đã đóng" vẫn hứng email người đến muộn (nuôi list cho campaign sau). |
| Nhân bản campaign làm template | [P2] | Copy campaign cũ, sửa quà + thời gian là chạy tiếp. |

---

## MODULE 2 — Hệ thống trang (Landing + Share)

### 2.1 Bốn trang chuẩn của một chiến dịch **[MVP]**

1. **Trang đăng ký (opt-in)**: headline + ảnh/video quà + form tối giản (tên, email; SĐT tuỳ chọn theo campaign) + checkbox điều khoản + đếm ngược (nếu có hạn). Một cột, tối ưu mobile.
2. **Trang chia sẻ (share page)** — trái tim của hệ thống, hiện NGAY sau xác minh:
   - Link riêng của tôi (bấm là copy) + **mã QR** (cho share offline/Zalo cá nhân).
   - Nút share từng kênh, **văn bản mời soạn sẵn cho từng kênh** (Zalo khác Facebook khác Messenger).
   - **Thanh tiến độ mốc quà**: "Bạn đã mời 2/3 bạn — còn 1 bạn nữa là nhận «Mini-course X»" + hàng quà đã/chưa mở khoá.
   - **Bảng xếp hạng** top 10 + vị trí của tôi.
   - **Trung tâm quà của tôi**: quà đã mở khoá, bấm nhận lại được (coupon/file/link).
   - Danh sách **nhiệm vụ cộng điểm** (module 4).
3. **Trang cảm ơn / chờ xác nhận email**: nhắc kiểm tra hộp thư (kèm nút mở Gmail), vì chưa xác minh thì chưa được tính điểm.
4. **Trang campaign đã đóng**: thông báo hết hạn + form nhận tin đợt sau.

### 2.2 Dựng trang & nhúng

| Tính năng | Nhãn | Chi tiết |
|---|---|---|
| Template có sẵn + tuỳ chỉnh nhanh | **[MVP]** | Chọn template → sửa logo, màu chủ đạo, headline, ảnh quà, nội dung — KHÔNG làm drag & drop builder ở MVP (đắt công, ít giá trị). |
| Hosted trên domain hệ thống + custom domain | **[MVP]** | `mgm.ten-mien.vn/c/ten-chien-dich`. |
| Widget nhúng vào web có sẵn | [P2] | Form embed + popup. |
| **Link one-click cho list cũ** | [P2] | Gửi email cho list có sẵn kèm link đặc biệt → bấm là vào thẳng share page, link riêng đã sinh sẵn, khỏi điền form. Vũ khí kích hoạt học viên cũ (học UpViral). |
| Ảnh OG cá nhân hoá khi share | [P2] | Ảnh preview trên Zalo/FB có tên người mời → tăng CTR lời mời. |
| Pixel/analytics gắn ngoài | [P2] | Chèn mã GA4/Facebook Pixel per campaign. |

---

## MODULE 3 — Link riêng & ghi nhận công (attribution)

| Tính năng | Nhãn | Chi tiết |
|---|---|---|
| Sinh mã riêng | **[MVP]** | Mã 8 ký tự Base32-Crockford (bỏ ký tự dễ nhầm I/L/O/U), sinh ngẫu nhiên + kiểm tra UNIQUE — **không dùng số tự tăng** (đoán được, giả được — học Gumroad mã hoá id). |
| Cấu trúc link | **[MVP]** | `domain/r/{mã}?ch={kênh}` — tham số `ch` (zalo/fb/ms/copy/qr) để đo kênh nào hiệu quả. |
| Attribution 2 pha (học Dub) | **[MVP]** | **Pha 1**: bấm link → ghi bảng `clicks` + cookie first-party (mặc định 30 ngày, cấu hình 7/30/90). **Pha 2**: đăng ký → chuyển từ cookie vào bản ghi DB vĩnh viễn `referrals(referee UNIQUE)` — từ đây về sau không phụ thuộc cookie nữa. |
| Nhiều cookie chồng nhau | **[MVP]** | **Last-click wins** — sort theo timestamp (chuẩn Gumroad/ngành). |
| Nhập mã tay lúc đăng ký | **[MVP]** | Ô "Mã giới thiệu (nếu có)" trên form — cứu các ca share mồm/offline không bấm link. |
| Chặn tự giới thiệu ngay tầng attribution | **[MVP]** | Cookie của chính mình / email trùng referrer → không tạo bản ghi referral. |

---

## MODULE 4 — Hệ điểm (thuật toán chấm điểm)

### 4.1 Bảng hành động → điểm (mặc định, cấu hình per campaign)

| Hành động | Điểm mặc định | Giới hạn | Điều kiện tính |
|---|---|---|---|
| Đăng ký + xác minh email | +10 | 1 lần | Sau double opt-in |
| **Mời 1 bạn xác minh thành công** | **+100** | không giới hạn | Referee đã xác minh email VÀ qua cửa chống gian lận |
| Bạn được mời hoàn thành "hành động sâu" (tải tài liệu, học bài 1) | +200 | 1 lần/referee | [P2] — chống mời rác, thưởng chất lượng |
| Bấm share một kênh (Zalo/FB/Messenger…) | +5/kênh | 1 lần/kênh/ngày | Ghi nhận bấm nút (mức tin thấp → điểm thấp) |
| **Có người bấm link tôi share từ kênh đó** | +2/click | tối đa 20 click/ngày | Click thật từ `?ch=` (mức tin cao hơn) |
| Nhiệm vụ tuỳ chỉnh (xem video, vào nhóm Zalo, trả khảo sát) | +10–30/nhiệm vụ | 1 lần/nhiệm vụ | Xác minh bằng câu hỏi/mã xác nhận (chuẩn ngành — không API nào verify được thật) |
| Điểm chuỗi ngày (check-in/share liên tục) | +5/ngày | 1 lần/ngày | [P2] — thứ UpViral KHÔNG có, Gleam có |

**Triết lý cân điểm**: mời-bạn-xác-minh phải nặng gấp ~20 lần share suông — điểm là để lái hành vi về đúng mục tiêu (referral thật), share chỉ là mồi.

### 4.2 Sổ cái điểm (point ledger) — thuật toán cộng điểm **[MVP]**

Mọi biến động điểm ghi vào bảng **`point_ledger` chỉ-ghi-thêm (append-only)**, không bao giờ UPDATE đè:

```
GHI ĐIỂM(user, hành_động, đối_tượng, điểm):
  khoá_duy_nhất = (user, hành_động, đối_tượng)   ← UNIQUE INDEX tầng DB
  INSERT point_ledger(khoá_duy_nhất, điểm, thời_điểm)
  → nếu trùng khoá: bỏ qua êm (idempotent — gọi 2 lần không cộng 2 lần)

ĐẢO ĐIỂM (khi referee bị kết luận gian lận / thu hồi):
  INSERT point_ledger(user, 'đảo:' + khoá_gốc, -điểm_gốc)
  → lịch sử minh bạch, đối soát được, không "bốc hơi" khó hiểu

ĐIỂM HIỆN TẠI(user) = SUM(point_ledger WHERE user)  ← cache lại, tính lại được bất cứ lúc nào
```

Với hành động có giới hạn ngày: `đối_tượng` chứa ngày (`share:zalo:2026-09-01`) → tự chặn vượt cap bằng chính UNIQUE index.

---

## MODULE 5 — Cơ chế thưởng (thuật toán phần thưởng)

### 5.1 Mốc quà — **tính theo SỐ BẠN XÁC MINH, không theo điểm tổng** **[MVP]**

Lý do (học từ review UpViral + Prelaunchr của Harry's): điểm tổng bị "lạm phát" bởi share/nhiệm vụ → người share 50 lần không mời được ai vẫn nhận quà = sai mục tiêu. Mốc quà đo đúng thứ mình cần: **referral thật**. (Điểm tổng dùng cho leaderboard + vé bốc thăm.)

```
Mốc mẫu:  1 bạn → mã giảm 20%      3 bạn → mini-course/ebook
          5 bạn → 1 chương khoá full   10 bạn → 1 suất học miễn phí

KHI referee CHUYỂN TRẠNG THÁI 'đã xác minh' (sự kiện duy nhất kích hoạt):
  n = ĐẾM referrals(referrer, trạng_thái='xác minh', gian_lận=false)
  VỚI TỪNG mốc CHƯA TRAO của referrer (tăng dần):
    NẾU n ≥ mốc.ngưỡng:
      INSERT reward_grants(referrer, mốc)   ← UNIQUE(referrer, mốc) — không trao trùng
      giao quà theo loại (5.3) + xếp email "🎁 Mở khoá quà" vào hàng đợi
      cập nhật thanh tiến độ trên share page
  (referee sau đó bị kết luận gian lận → đảo điểm; quà ĐÃ giao không thu hồi,
   nhưng n giảm nên KHÔNG mở được mốc kế — chấp nhận rủi ro này cho đơn giản)
```

### 5.2 Thưởng HAI CHIỀU — điểm vượt UpViral **[MVP]**

Người **được mời** cũng nhận quà chào mừng ngay khi xác minh (mã giảm giá / chương học thử / tài liệu). Hai tác dụng: lời mời dễ được chấp nhận hơn ("đăng ký đi, cậu cũng được quà") + referee có lý do quay lại thành referrer. Cấu hình bật/tắt + chọn quà per campaign.

### 5.3 Bốn loại quà & cách giao tự động **[MVP]**

| Loại quà | Cách giao | Ghi chú |
|---|---|---|
| **Mã coupon** | Kho mã nạp sẵn (CSV), mỗi grant rút 1 mã | Rút mã phải khoá hàng (`FOR UPDATE SKIP LOCKED`) — 2 người đạt mốc cùng lúc không được trùng mã; cảnh báo admin khi kho < 10% |
| **File tải về** | Link tải có chữ ký + hạn (signed URL) | ebook, template, preset… |
| **Secret URL** | Link nội dung ẩn | Bài học unlisted, video private |
| **Tự ghi danh khoá học** | Webhook/API sang LMS → enroll thẳng | [P2] — điểm vượt UpViral (UpViral chỉ gửi email) |

Quà giao qua **email + Trung tâm quà trên share page** (mất email vẫn lấy lại được).

### 5.4 Bốc thăm trọng số điểm (grand prize) **[MVP]**

```
CHỐT GIẢI (khi campaign kết thúc):
  ứng_viên = người tham gia đã xác minh, KHÔNG bị cờ gian lận
  vé[i] = điểm_hiện_tại(i)                    ← mỗi điểm = 1 vé số
  seed  = số ngẫu nhiên sinh 1 lần, LƯU LOG   ← tái lập được kết quả khi cần đối chất
  VỚI TỪNG giải (nhất → nhì → ba…):
    r = random(seed) trong [0, tổng_vé)
    duyệt cộng dồn vé, người đầu tiên có tích_luỹ > r → TRÚNG
    loại người trúng khỏi ứng_viên, trừ tổng_vé, bốc giải kế tiếp
  → danh sách trúng ở trạng thái "CHỜ DUYỆT" — admin xem hồ sơ 360° (module 7)
    rồi bấm xác nhận mới gửi email chúc mừng
```

**Hơn UpViral 2 điểm**: nhiều giải theo thứ tự trong 1 lần chốt (UpViral chỉ 1 grand prize) + seed ghi log để minh bạch. Ngoài bốc thăm, cấu hình được **giải theo hạng leaderboard** (top 1/2/3 nhận quà khác nhau).

---

## MODULE 6 — Xếp hạng (leaderboard)

| Tính năng | Nhãn | Chi tiết |
|---|---|---|
| Bảng xếp hạng trên share page | **[MVP]** | Top 10 + "vị trí của bạn: #47" (dù ngoài top — ai cũng thấy mình đang ở đâu). Cache 1–5 phút, không cần realtime tuyệt đối. |
| **Thuật toán xếp hạng** | **[MVP]** | Sắp theo: ① điểm tổng ↓ → ② số bạn xác minh ↓ (hoà điểm thì ai mời thật nhiều hơn thắng) → ③ ai đạt mức điểm đó SỚM hơn thắng (chống nước rút phút chót, thưởng người bền bỉ). |
| Ẩn danh một phần | **[MVP]** | Hiện "Nguyễn T. K." — không lộ email/tên đầy đủ của người khác. |
| Loại người bị cờ gian lận | **[MVP]** | Fraud flag → biến mất khỏi bảng ngay (điểm vẫn giữ chờ xử). |
| Leaderboard theo kỳ (tuần/tháng) | [P2] | Campaign dài hơi thì reset kỳ để người mới còn cửa đua. |

---

## MODULE 7 — Chống gian lận (điều kiện sống còn khi quà có giá trị)

### 7.1 Bốn lớp phòng thủ **[MVP]**

1. **Chặn cứng tại cửa**: tự giới thiệu (email/cookie trùng referrer) · quá 3 đăng ký/IP/ngày (cấu hình) · email thuộc danh sách domain rác dùng-một-lần (cập nhật định kỳ) · captcha tự bật khi tần suất bất thường.
2. **Double opt-in bắt buộc**: chưa xác minh email = chưa tồn tại trong hệ điểm. Lọc ~90% bot rẻ tiền.
3. **Chấm điểm rủi ro từng referee** — thuật toán:

```
điểm_rủi_ro = 0
+40  cùng IP với referrer (trong 7 ngày)
+30  email cấu trúc hàng loạt (tên+số tăng dần: abc1@, abc2@…, cùng domain lạ)
+25  nhiều referee của cùng referrer chung IP/thiết bị
+20  đăng ký dồn dập (>5 referee của 1 referrer trong 10 phút)
+10  không xác minh email sau 48h
─────────────────────────────────────────────
≥ 50 → CÁCH LY: không cộng điểm, không vào leaderboard,
       vào hàng "chờ duyệt" của admin
       admin DUYỆT → cộng điểm bù (qua ledger)  |  TỪ CHỐI → huỷ vĩnh viễn
< 50 → cho qua, vẫn lưu điểm rủi ro để soi lại khi trao giải
```

4. **Hồ sơ 360° + duyệt tay trước khi trao giải lớn**: mỗi người tham gia có trang hồ sơ: IP, thiết bị, **cây ai-mời-ai**, dòng thời gian điểm, điểm rủi ro từng referee → admin nhìn 30 giây là biết thật hay ảo. Giải chung cuộc LUÔN qua duyệt tay (5.4).

### 7.2 Nâng cao [P2]
Tích hợp dịch vụ verify email (kiểu EmailListVerify) · fingerprint thiết bị · phát hiện vòng lặp A-mời-B-mời-A trong cây referral · giới hạn địa lý.

---

## MODULE 8 — Email tự động

### 8.1 Bộ email theo sự kiện **[MVP]**

| # | Email | Kích hoạt | Mục đích |
|---|---|---|---|
| 1 | **Xác nhận đăng ký** (double opt-in) | Ngay khi đăng ký | Bấm nút xác nhận mới được tính điểm — vừa lọc bot vừa đúng luật |
| 2 | **Chào mừng + link riêng** | Sau xác minh | Kèm link + QR + giải thích mốc quà — CTA "mời ngay 1 bạn" |
| 3 | **Bạn vừa mời thành công** | Mỗi referral xác minh | "+100 điểm! Bạn đã mời 2/3 — còn 1 bạn nữa nhận «X»" (dopamine loop; gộp digest nếu >3 mail/giờ) |
| 4 | **Sắp chạm mốc** | Còn đúng 1 bạn tới mốc | Cú hích tâm lý mạnh nhất chuỗi |
| 5 | **🎁 Mở khoá quà** | Đạt mốc | Giao quà (coupon/file/link) + khoe mốc kế tiếp |
| 6 | **Chúc mừng trúng giải** | Admin duyệt winner | Kèm hướng dẫn nhận |
| 7 | Nhắc người im ắng | 3 & 7 ngày không hoạt động | [P2] "Bạn đang ở #12, chỉ cách top 10 có 30 điểm…" |
| 8 | Báo cáo cho admin | Hằng ngày | [P2] Tổng lead, referral, cảnh báo kho quà, hàng chờ fraud |

### 8.2 Hạ tầng gửi **[MVP]**

- Gửi qua provider cấu hình được (**Resend / SES / Postmark** — chọn 1 làm mặc định), sender domain riêng (SPF/DKIM) — không dính "gửi từ domain hệ thống" như UpViral bị chê.
- **Hàng đợi + retry**: email xếp hàng trong bảng `email_queue`, worker gửi dần, thất bại retry 3 lần giãn cách, log trạng thái (`đã gửi/nảy/hỏng`).
- Template tiếng Việt, biến cá nhân hoá: `{tên} {điểm} {hạng} {số_bạn_đã_mời} {còn_thiếu} {link_riêng} {tên_quà}`.
- Mọi email tự động đều sửa được nội dung per campaign; A/B test tiêu đề [P2].

---

## MODULE 9 — Dashboard admin & đo lường

| Tính năng | Nhãn | Chi tiết |
|---|---|---|
| Phễu chuyển đổi | **[MVP]** | Ghé trang → đăng ký → xác minh → có share → mời ≥1 bạn thành công (từng bước % rơi rụng). |
| **Hệ số viral K** (UpViral không có) | **[MVP]** | `K = số người xác minh MỚI đến từ giới thiệu trong kỳ ÷ số người hoạt động đầu kỳ`. K > 1 = tự tăng trưởng không cần đổ thêm quảng cáo. Vẽ theo tuần. |
| Hiệu quả theo kênh share | **[MVP]** | Từ tham số `?ch=`: Zalo vs Facebook vs Messenger vs copy/QR — click, đăng ký, tỉ lệ chuyển đổi từng kênh → biết dồn lực đâu. |
| Top người ảnh hưởng | **[MVP]** | Ai mời nhiều nhất, cây referral của họ. |
| Quản lý người tham gia | **[MVP]** | Tìm kiếm, hồ sơ 360°, sửa điểm tay (ghi ledger có lý do), hàng chờ duyệt fraud, cấm/khoá. |
| Quản lý kho quà | **[MVP]** | Nạp coupon CSV, đếm tồn, cảnh báo sắp hết. |
| Export CSV toàn bộ lead | **[MVP]** | Kèm điểm, số referral, nguồn, trạng thái — nạp vào hệ email/CRM riêng. |
| Webhook sự kiện + API | [P2] | `referral.verified`, `milestone.reached`, `reward.granted` → bắn sang LMS/CRM/Zapier. |
| Đồng bộ ESP trực tiếp | [P2] | Mailchimp/Klaviyo… (MVP dùng export CSV + webhook là đủ). |

---

## MODULE 10 — Nền tảng & vận hành

- **[MVP]** Đăng nhập admin (email + mật khẩu/OTP); 1 tổ chức, nhiều campaign. Phân quyền nhiều người quản trị: [P2] (UpViral bị chê thiếu).
- **[MVP]** Tuân thủ dữ liệu cá nhân (Nghị định 13/2023): checkbox đồng ý khi đăng ký, nút hủy đăng ký trong mọi email, API xoá dữ liệu theo yêu cầu.
- **[MVP]** Mọi giờ hiển thị múi giờ Việt Nam; toàn bộ UI + email tiếng Việt (đa ngôn ngữ [P2]).

---

## Mô hình dữ liệu (9 bảng chính) **[MVP]**

```
campaigns        cấu hình: loại, thời gian, cookie_days, điểm từng hành động,
                 mốc quà, kênh share, template email
participants     người tham gia: tên, email, trạng thái xác minh, mã riêng (UNIQUE),
                 điểm cache, điểm rủi ro    ← 1 dòng / người / campaign
clicks           log bấm link: mã, kênh (?ch=), IP, UA, thời điểm
referrals        ai mời ai: referrer, referee (UNIQUE — 1 người chỉ 1 người mời),
                 trạng thái: chờ xác minh → xác minh / cách ly / huỷ
point_ledger     sổ cái điểm append-only, UNIQUE(user, hành_động, đối_tượng)
milestones       mốc của campaign: ngưỡng (số bạn), quà gắn kèm
reward_grants    quà đã trao: UNIQUE(participant, milestone), loại, trạng thái giao
coupon_pool      kho mã: mã, trạng thái (còn/đã phát), grant_id
email_queue      hàng đợi email: loại, người nhận, biến, trạng thái, số lần retry
```

Ràng buộc chống lỗi nằm ở **UNIQUE tầng DB** (không chỉ check code): referee 1 người mời duy nhất · điểm không cộng trùng · quà không trao trùng · coupon không phát trùng.

---

## Phân kỳ đề xuất

**MVP** (đủ chạy chiến dịch thật đầu tiên): Module 1 (mốc quà + bốc thăm) · 4 trang chuẩn + template · attribution 2 pha + QR + nhập mã tay · hệ điểm + ledger · mốc quà tự động + thưởng hai chiều + 3 loại quà + bốc thăm trọng số · leaderboard · 4 lớp chống gian lận + hồ sơ 360° · 6 email tự động + hàng đợi · dashboard (phễu, K-factor, kênh share, kho quà, export CSV).

**P2** (ngay sau khi chiến dịch đầu chạy ổn): waitlist · one-click link cho list cũ · ảnh OG cá nhân hoá · điểm hành động sâu + streak ngày · auto-enroll LMS qua webhook · email nhắc im ắng + digest admin · A/B test · widget nhúng · ESP sync · phân quyền team.

---

## ✅ 8 ĐIỂM CẦN ANH DUYỆT

1. **Loại chiến dịch MVP**: Mốc quà + Bốc thăm (đề xuất) — hay chỉ Mốc quà cho gọn?
2. **Mốc quà tính theo số bạn XÁC MINH** (đề xuất — đúng mục tiêu, chống lạm phát điểm) — hay theo điểm tổng (dễ hiểu hơn với người chơi)?
3. **Điểm share**: mô hình 2 tầng "bấm nút +5 (cap ngày) & click thật quay lại +2/click" (đề xuất) — hay chỉ tính bấm nút cho đơn giản?
4. **Kênh share MVP**: Zalo + Facebook + Messenger + Copy link + QR (đề xuất cho thị trường VN) — có thêm TikTok/Telegram/X?
5. **Double opt-in bắt buộc mọi campaign** (đề xuất: có — nền của cả hệ điểm lẫn chống gian lận) — hay cho phép tắt per campaign?
6. **Trang**: template tuỳ chỉnh nhanh (đề xuất MVP) — có cần drag & drop builder ngay không?
7. **Stack**: Next.js + PostgreSQL (đề xuất — cùng hệ với Refferq/Dub để chép được nhiều nhất; anh quen stack nào hơn thì nói) + email qua **Resend** (rẻ, dễ) hay SES (rẻ nhất, cấu hình lâu hơn)?
8. **Chiến dịch đầu tiên chạy thử**: sản phẩm số/khoá học nào, quà các mốc 1/3/5/10 là gì? (Cần chốt để thiết kế template trang + email đúng thực tế.)

Anh duyệt/sửa trực tiếp vào 8 mục này, tôi sẽ chốt bản thiết kế kỹ thuật chi tiết (schema đầy đủ + API + kế hoạch dựng) rồi bắt tay code.
