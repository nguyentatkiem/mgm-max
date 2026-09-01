# MGM MAX — Tổng hợp nghiên cứu & định hướng

> Bản tổng hợp từ 2 tài liệu chi tiết: [nghien-cuu-upviral.md](nghien-cuu-upviral.md) và [nghien-cuu-repo-oss.md](nghien-cuu-repo-oss.md). Ngày: 01/09/2026.

---

## 1. Kết luận lớn nhất

**Có một khoảng trống thật sự trên thị trường OSS**: không tồn tại bản mã nguồn mở nào của "engine viral campaign" kiểu UpViral/Gleam/Viral Loops (hệ điểm + nhiệm vụ + mốc thưởng + leaderboard + chống gian lận). Thứ đang có chỉ là 2 mảnh rời:

- **Affiliate/referral tracking** (Dub, Gumroad, Refferq...) — giỏi attribution và hoa hồng, nhưng không có hệ điểm/gamification.
- **Viral waitlist** (Prelaunchr, waitlist-cloudflare...) — có mốc thưởng theo số referral, nhưng quá tối giản.

UpViral bán chính cái "keo dán" hai mảnh đó với giá $99–399/tháng. **MGM MAX = tự xây cái keo dán này cho sản phẩm số & khoá học**, và có thể làm tốt hơn UpViral ở đúng những chỗ người dùng phàn nàn.

## 2. Công thức lõi (chưng cất từ UpViral)

Một engine duy nhất chạy mọi loại chiến dịch (bốc thăm / mốc thưởng evergreen / hàng chờ pre-launch):

```
Đăng ký (opt-in, double opt-in lọc bot)
  → nhận LINK RIÊNG + vào SHARE PAGE ngay (khoảnh khắc vàng)
  → kiếm ĐIỂM: mời bạn (nặng nhất) + share từng mạng + custom action
  → mở khoá THƯỞNG theo mốc (coupon / file / secret URL — tự động)
  → leaderboard + giải chung cuộc (random có trọng số điểm)
  → mỗi người được mời lại thành người phát tán mới = viral loop
```

Ba đòn bẩy tâm lý: thưởng chắc chắn theo mốc (đại trà) + giải lớn xác suất theo điểm (luôn có lý do kiếm thêm) + leaderboard công khai (cạnh tranh top).

## 3. MGM MAX làm tốt hơn UpViral ở đâu (từ review + gap OSS)

1. **Thưởng hai chiều kiểu Dropbox**: người được mời cũng nhận quà → tăng tỉ lệ chấp nhận lời mời. UpViral không có.
2. **Tự động mở khoá trong hệ thống khoá học**: webhook → enroll thẳng vào bài học/khoá thay vì chỉ gửi email secret URL.
3. **Hiện K-factor** và conversion theo doanh thu cho admin — UpViral bắt tự tính.
4. **Nhiều giải theo hạng leaderboard** (top 1/2/3 khác nhau) thay vì 1 grand prize.
5. **Hành động lặp lại theo ngày** (daily share/check-in) — Gleam có, UpViral không.
6. **Giá**: self-host gần như 0 đồng so với $99+/tháng.

## 4. Kiến trúc rút ra từ code thật của các repo

**Mô hình dữ liệu 5 bảng** (hội tụ từ Dub/Gumroad/pinax/Refferq):

| Bảng | Vai trò | Điểm mấu chốt |
|---|---|---|
| `referral_codes` | mã/link riêng từng người theo chiến dịch | code UNIQUE, sinh lúc đăng ký |
| `clicks` | log lượt ghé qua link | session, IP, UA — tách khỏi DB giao dịch nếu lớn |
| `referrals` | ai mời ai, trạng thái | **UNIQUE trên referee** (1 người chỉ có 1 người mời), pending → verified |
| `rewards` | điểm/quà/hoa hồng phát sinh | pending → approved (qua kỳ chờ) → delivered; refund thì đảo |
| `payouts` | chi trả batch (nếu có tiền thật) | module riêng, ngưỡng tối thiểu, lịch NET |

**Các nguyên tắc không được bỏ:**
- **Attribution 2 pha, đóng băng sớm** (học Dub): cookie chỉ dùng đến lúc đăng ký; từ đó attribution nằm trong DB vĩnh viễn theo user — mua hàng 6 tháng sau vẫn tính đúng người giới thiệu.
- **Idempotency bằng ràng buộc UNIQUE ở tầng DB**, không chỉ check ở code.
- **Chống gian lận 4 lớp**: chặn self-referral (so email/user), rate-limit theo IP, double opt-in trước khi cộng điểm, hàng chờ duyệt tay cho lead khả nghi (Fraud Center kiểu UpViral). Mã hoá id trong cookie (học Gumroad).
- **Tách cơ chế khỏi chính sách**: tầng tracking bắn event, tầng thưởng tự quyết — đổi chiến dịch không đụng tracking.
- **Tham số hoá theo chương trình**: `cookie_days` (chuẩn ngành 7/30/90), `recurring_months`, `min_payout`, điểm cho từng hành động.

## 5. Repo đáng dùng nhất theo kịch bản

- **Fork làm nền full platform**: `Refferq/Refferq` (MIT, Next.js 15 + Prisma + Postgres) — ứng viên số 1.
- **Chép kiến trúc tracking**: `dubinc/dub` (lưu ý phần Partners nằm trong thư mục `(ee)` license thương mại).
- **Chép data model affiliate cho sản phẩm số**: `antiwork/gumroad` (MIT, đọc `Affiliate`, `affiliate_credits`).
- **Nhại cho pre-launch khoá học**: `harrystech/prelaunchr` (mốc quà 5/10/25/50 của Harry's) + `Metareignity/waitlist-cloudflare` (stack rẻ).

## 6. Phác thảo phạm vi MVP (đề xuất, chưa chốt)

**MVP — đủ chạy một chiến dịch mốc thưởng evergreen cho khoá học:**
1. Đăng ký + double opt-in → sinh mã riêng + Share Page (link, nút share Zalo/Facebook/Messenger — thị trường VN, thanh tiến độ mốc).
2. Hệ điểm cấu hình được: đăng ký / referral đã xác minh / share.
3. Mốc thưởng tự động: coupon, file, secret URL; thưởng hai chiều.
4. Chống gian lận: self-referral, IP, email ảo, hàng chờ duyệt.
5. Dashboard admin: leads, referred %, K-factor, top influencers.

**Sau MVP**: leaderboard + giải chung cuộc random trọng số, custom actions, one-click link cho list cũ, A/B test, webhook/API mở khoá LMS, email tự động qua SMTP riêng.

**Việc cần chốt trước khi code**: stack (Next.js + Postgres theo hệ sinh thái repo mạnh nhất, hay theo stack quen của mình), sản phẩm số/khoá học cụ thể nào chạy chiến dịch đầu tiên, và kênh share ưu tiên cho người dùng Việt (Zalo/Facebook thay vì X/Pinterest).
