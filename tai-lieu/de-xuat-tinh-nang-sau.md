# MGM MAX — Đề xuất tính năng SÂU & MẠNH (Đợt 3, bản duyệt)

> Sau đợt 2, MGM MAX đã ngang/hơn UpViral ở phần lõi. Đợt 3 không bắt chước nữa — nhắm vào 4 đòn bẩy mà **không đối thủ nào trong tầm giá làm trọn**: (1) đo và thưởng theo TIỀN THẬT, (2) gamification giữ người chơi quay lại mỗi ngày, (3) AI vận hành thay admin, (4) nền tảng hoá để bán như SaaS.
> Cách duyệt như cũ: chọn số P1–P20. Cột **Công**: S ≤ nửa buổi · M ≤ 1 buổi · L = nhiều buổi. Ngày: 01/09/2026.

---

## NHÓM A — TIỀN THẬT: từ đo lead sang đo doanh thu 💰

*Đây là nhóm "sâu" nhất — điểm yếu chí mạng của UpViral ("không track purchase") và là thứ ReferralHero/KickoffLabs bán đắt.*

### P1 ⭐ Ghi nhận MUA HÀNG thật + thưởng theo đơn — qua webhook ngân hàng VN (Công: L)
**Cơ chế:** thêm sự kiện `mua_hang` vào phễu.
- Mỗi participant có **mã thanh toán riêng** (chính mã giới thiệu: "MGM QCCX1Z9Y") in trong hướng dẫn chuyển khoản.
- Nối **SePay/Casso** (dịch vụ VN đọc biến động số dư ngân hàng, có webhook): tiền vào tài khoản kèm nội dung chứa mã → `POST /api/thanh-toan` → hệ thống match mã → ghi `don_hang(nguoi_id, so_tien, attribution referrer từ DB — không cần cookie vì attribution đã đóng băng từ lúc đăng ký)`.
- Ngoài bank: endpoint chung nhận webhook PayOS/Stripe/LMS ("học viên X đã thanh toán").
- **Thưởng theo đơn**: cấu hình per campaign — người giới thiệu ra đơn được quà đặc biệt/điểm lớn (VD +1.000đ điểm), mốc quà loại mới "N đơn hàng từ bạn bè".
- Idempotency: UNIQUE theo mã giao dịch ngân hàng; refund thì đảo bằng bút toán âm (sổ cái điểm đã sẵn).
**Vì sao mạnh:** phễu hiện dừng ở "xác minh email". Có P1, dashboard trả lời được câu duy nhất đáng hỏi: *chiến dịch này ra bao nhiêu TIỀN* — và trả thưởng đúng người mang tiền về, không phải người giỏi spam link.

### P2 ⭐ Dashboard ROI & LTV theo nguồn (Công: M — cần P1)
**Cơ chế:** tổng chi quà (đếm coupon đã phát × mệnh giá admin khai + giải thưởng) vs doanh thu referral; doanh thu trung bình/lead theo nguồn (trực tiếp vs giới thiệu vs kênh Zalo/FB); **cohort theo tuần đăng ký** (tuần 35 vào 100 người → tuần sau bao nhiêu người mua); **viral cycle time** = median(thời điểm referee xác minh − thời điểm referrer xác minh) — con số quyết định tốc độ lan.
**Vì sao mạnh:** biến MGM MAX thành công cụ ra quyết định ngân sách, không chỉ bảng đếm.

### P3 Phễu chuyển đổi sâu nhiều bước (Công: M)
**Cơ chế:** ngoài `mua_hang`, cho admin định nghĩa **sự kiện chuyển đổi tuỳ tên** (`hoc_thu`, `vao_nhom`, `dat_lich`) bắn qua API/webhook từ hệ thống ngoài, mỗi sự kiện gắn điểm/quà riêng và một cột trong phễu. Referrer được thưởng khi bạn mình đi SÂU chứ không chỉ đăng ký (chặn mời rác tận gốc — điểm ReferralHero chê UpViral "max 3 events").

---

## NHÓM B — GAMIFICATION GIỮ CHÂN: lý do quay lại mỗi ngày 🎮

### P4 ⭐ Vòng quay may mắn — instant win THẬT (Công: L)
**Cơ chế:** đủ X điểm = 1 lượt quay (điểm bị TRỪ khi quay → điểm có chỗ tiêu, hết lạm phát).
- Kho giải cấu hình: `{giải, xác suất, số lượng tối đa/ngày, tổng kho}` — thuật toán: random tất định theo seed ghi log (tái lập được như bốc thăm), rơi vào giải đã hết kho thì tự trượt xuống giải kế (weighted alias có trần ngân sách).
- "Chúc bạn may mắn lần sau" là một ô hợp lệ → admin kiểm soát chi phí kỳ vọng chính xác: `E[chi] = Σ p_i × giá_i`.
- UI vòng quay SVG animate trên trang riêng, lịch sử quay công khai (3 người trúng gần nhất — social proof).
**Vì sao mạnh:** UpViral quảng cáo "Instant Win" nhưng không có thật (đã xác minh KB). Đây là cỗ máy dopamine biến điểm share/nhiệm vụ thành lý do hành động NGAY.

### P5 ⭐ Cấp bậc + huy hiệu + chuỗi ngày (streak) (Công: M)
**Cơ chế:**
- **Cấp bậc** theo điểm trọn đời: Đồng(0) → Bạc(200) → Vàng(500) → Kim cương(1500); mỗi bậc có đặc quyền cấu hình được: hệ số điểm ×1.1/×1.25, +1 lượt quay/tuần, quà riêng khi thăng bậc.
- **Huy hiệu** sự kiện: "Người mở đường" (5 bạn đầu), "Tia chớp" (3 bạn trong 24h), "Bền bỉ" (streak 7 ngày) — hiện trên leaderboard + share page.
- **Streak**: check-in/hành động mỗi ngày +5đ, chuỗi ×2 sau 7 ngày; đứt chuỗi về 0 (loss aversion). Idempotent bằng khoá `streak:YYYY-MM-DD` trên sổ cái sẵn có.
**Vì sao mạnh:** Gleam có daily entries thô sơ; cấp bậc + hệ số điểm là vòng lặp giữ chân mà cả UpViral, Gleam, Viral Loops đều không có.

### P6 Giới thiệu 2 TẦNG (bạn của bạn) (Công: M)
**Cơ chế:** khi C đăng ký qua B, và B từng được A mời: B +100đ (tầng 1 như cũ), **A +20đ (tầng 2)** — hệ số cấu hình, khoá cứng tối đa 2 tầng và chỉ thưởng quà/điểm, không tiền → không dính mô hình đa cấp. Sổ cái ghi `moi_ban_t2:gt_id` idempotent. Dashboard thêm "cây lan truyền" — ai là super-connector thật sự (đo bằng tổng con cháu 2 tầng).
**Vì sao mạnh:** phần thưởng cho việc mời được "người biết mời" — đúng bản chất viral, thứ không nền tảng phổ thông nào làm.

### P7 Đua theo ĐỘI (Công: M)
**Cơ chế:** admin tạo đội (lớp A/B, miền Bắc/Nam) hoặc tự sinh link đội `?doi=`; điểm cá nhân cộng dồn vào đội; leaderboard đội riêng + giải cho cả đội thắng. Hợp khoá học có nhiều lớp/cộng đồng — kích hoạt tâm lý "vì màu cờ sắc áo".

### P8 Điểm hết hạn + FOMO kho quà (Công: S)
**Cơ chế:** (a) điểm không hoạt động sau N ngày bị trừ dần k%/tuần (bút toán âm `decay:tuần` — minh bạch trên sổ cái); (b) mốc quà hiển thị **"chỉ còn 7/50 suất"** theo kho coupon thật + thanh cạn dần. Hai công tắc urgency rẻ nhất trong toàn danh sách.

---

## NHÓM C — AI VẬN HÀNH THAY ADMIN 🤖 (đã có nền F51)

### P9 ⭐ Growth Copilot — AI đọc số liệu, chẩn bệnh, kê đơn, THỰC THI 1 CLICK (Công: L)
**Cơ chế:** nút "Phân tích chiến dịch" trong dashboard → gom toàn bộ số liệu (phễu, K, kênh, cohort, top referrer, giờ vàng đăng ký, tỉ lệ rơi từng bước) đưa Claude kèm system prompt chuyên gia growth →  trả về **chẩn đoán + 3 hành động cụ thể, mỗi hành động là MỘT NÚT BẤM**:
- "Tỉ lệ xác minh 62% là thấp → [Gửi lại email xác minh cho 38 người treo]"
- "80% referral đến từ Zalo nhưng lời mời Zalo đang dùng bản chung → [Áp lời mời AI viết riêng cho Zalo]"
- "12 người đạt 2/3 bạn rồi khựng 5 ngày → [Broadcast riêng nhóm 'sắp chạm mốc' với nội dung AI soạn]"
Mỗi nút map vào action có sẵn (broadcast phân khúc, sửa lời mời, gửi lại xác minh). Log lại lời khuyên → tuần sau AI tự chấm lời khuyên cũ hiệu quả không.
**Vì sao mạnh:** UpViral 2.0 chỉ có AI *tạo* chiến dịch; không ai có AI *lái* chiến dịch đang chạy. Đây là tính năng định giá được nếu thương mại hoá.

### P10 Lời mời cá nhân hoá từng người bằng AI (Công: M)
**Cơ chế:** nút "✨ Viết lời mời cho tôi" trên share page → Claude (Haiku cho rẻ) nhận tên, trường form (nghề nghiệp…), tên khoá học → sinh 3 biến thể lời mời giọng cá nhân; cache theo người (1 lần gọi/người); đo CTR biến thể AI vs mẫu chung ngay trong bảng kênh.

### P11 AI gác cổng gian lận (Công: M)
**Cơ chế:** thay vì chỉ cộng trọng số cứng, mỗi đêm cron đưa các cụm nghi vấn (danh sách referee của referrer top, IP, pattern email, khoảng cách thời gian) cho Claude chấm + GIẢI THÍCH bằng tiếng Việt → hiện trong khu cách ly: "9/10 referee của A đăng ký cách nhau đúng 61–63 giây, email đều dạng họ+số — khả năng script". Admin vẫn quyết, nhưng đọc 5 giây thay vì soi tay 5 phút.

### P12 A/B test tự lái (Công: L)
**Cơ chế:** admin tạo 2–3 biến thể (headline trang, tiêu đề email, lời mời); hệ chia traffic **multi-armed bandit** (Thompson sampling — không phải chia 50/50 chờ đủ mẫu): biến thể tốt tự chiếm dần traffic, có nút "chốt winner". Sâu hơn hẳn split-test tĩnh của UpViral (vốn khoá sau gói Business).

---

## NHÓM D — KÊNH VIỆT NAM & CHẠM NGƯỜI DÙNG 📱

### P13 ⭐ Zalo OA + ZNS: thông báo mốc quà qua Zalo (Công: L — cần anh có OA)
**Cơ chế:** người tham gia nhập SĐT (trường form đã có) → các sự kiện đắt nhất (mở khoá quà, sắp chạm mốc, trúng giải) gửi **ZNS template** thay/kèm email. Kiến trúc: bảng `hang_doi_thong_bao` đa kênh (email|zns) dùng chung worker retry sẵn có; ZNS chỉ là transport thứ hai.
**Vì sao mạnh:** ở VN, tỉ lệ mở email ~15–25%, Zalo gần như 100%. Một mình tính năng này có thể nhân đôi tốc độ vòng lặp viral. *Điều kiện: OA xác thực + template ZNS được duyệt (~vài ngày thủ tục).*

### P14 Trang riêng thành PWA + nút nhắc trình duyệt (Công: S)
**Cơ chế:** manifest + service worker tối giản để "Thêm vào màn hình chính"; Web Push (không cần app) cho sự kiện mốc quà với người từ chối cho SĐT. Chi phí gần 0, tăng tần suất quay lại trang riêng.

### P15 Poster chia sẻ cá nhân hoá tự sinh (Công: M)
**Cơ chế:** endpoint `/anh/{ma}.png` vẽ ảnh 1200×630 server-side (satori/canvas): tên người mời + QR + tiến độ "đã mời 3 bạn" + màu campaign → làm ảnh OG động (link của A hiện poster của A trên Zalo/FB) + nút "Tải poster" để đăng story. Ảnh có tên thật của bạn mình = CTR lời mời tăng mạnh; UpViral phải dùng Canva thủ công.

---

## NHÓM E — NỀN TẢNG HOÁ: bán như SaaS 🏢

### P16 ⭐ Multi-tenant + phân quyền (Công: L)
**Cơ chế:** bảng `to_chuc` (tenant) + `tai_khoan_admin` (email/mật khẩu/2FA TOTP, vai trò chủ/biên tập/xem); mọi bảng thêm `to_chuc_id`; mỗi tenant giới hạn theo gói (số campaign, số lead). Đây là bước "MGM MAX từ công cụ của anh → sản phẩm anh bán $29–49/tháng" — đúng khoảng giá UpViral bỏ trống dưới $99.

### P17 White-label + custom domain per tenant (Công: M — cần deploy thật)
Ẩn mọi dấu MGM MAX, tenant trỏ CNAME domain riêng, favicon/logo riêng — ReferralHero tính tiền tính năng này từ gói thấp nhất, UpViral khoá đến $149.

### P18 Public API + API key per tenant (Công: M)
8 endpoint kiểu UpViral nhưng đủ hơn: thêm/tra lead, cộng điểm, mở khoá quà, danh sách theo điểm, bắn sự kiện chuyển đổi (nối P3). Kèm trang docs tự sinh.

---

## NHÓM F — VÒNG LẶP KHOÁ HỌC (đúng nghề của anh) 🎓

### P19 ⭐ Learn-to-Earn: tiến độ HỌC = điểm, quà = MỞ KHOÁ BÀI HỌC (Công: M–L tuỳ LMS)
**Cơ chế:** LMS bắn webhook `hoan_thanh_bai(email, bai)` → +điểm (idempotent theo bài); ngược lại khi đạt mốc referral, MGM MAX gọi API LMS **enroll thẳng** chương thưởng (hết cảnh gửi link thủ công). Vòng lặp kép: học → điểm → khoe/mời → bạn vào học → quà là nội dung học tiếp. Retention và viral nuôi nhau — mô hình Duolingo áp vào bán khoá.

### P20 Chứng chỉ/thành tích chia sẻ được có mã giới thiệu nhúng (Công: M)
**Cơ chế:** hoàn thành khoá/mốc → trang chứng chỉ công khai đẹp `/cc/{ma}` (tên, thành tích, ngày) — mọi nút share trên đó dùng chính link giới thiệu của chủ chứng chỉ; người xem bấm "Tôi cũng muốn học" là rơi vào phễu với attribution đúng. Khoảnh khắc tự hào = khoảnh khắc dễ share nhất, và share nào cũng có mã.

---

## 🎯 Gói đề xuất "Đợt 3" (chọn theo mục tiêu)

| Mục tiêu chính của anh | Gói nên chốt |
|---|---|
| **Ra tiền, chứng minh ROI** (đề xuất của tôi) | **P1 + P2 + P8 + P9** — tiền thật vào phễu, dashboard ROI, urgency rẻ, AI kê đơn |
| Tối đa viral & giữ chân | P4 + P5 + P6 + P15 |
| Thị trường VN tuyệt đối | P13 + P15 + P14 |
| Hướng bán SaaS | P16 + P17 + P18 (+P9 làm tính năng đinh) |

Lưu ý điều kiện ngoài: P1 cần tài khoản SePay/Casso (hoặc PayOS) · P13 cần Zalo OA xác thực + template ZNS duyệt · P17 cần deploy domain thật (hết thời trycloudflare). Anh chốt số (VD: *"làm P1, P2, P4, P5, P8, P9"*), tôi lên kế hoạch dựng theo đúng thứ tự phụ thuộc.
