# Nghiên cứu repo mã nguồn mở về cơ chế Member-Get-Member (referral) cho sản phẩm số & khoá học online

> Tài liệu nghiên cứu cho dự án **MGM MAX**.
> Đã xác minh toàn bộ số sao / ngày commit cuối / license qua GitHub API ngày 01/09/2026, và đọc README + code thật của các repo chính.

---

## NHÓM 1 — Nền tảng referral/affiliate hoàn chỉnh (self-host được)

### 1. Dub (Dub Partners) — `dubinc/dub`
- **URL:** https://github.com/dubinc/dub — **24.637 sao** — bảo trì rất tích cực (commit 31/08/2026)
- **Stack:** TypeScript, Next.js (monorepo Turborepo), MySQL/PlanetScale + Prisma, Tinybird (event analytics), Upstash Redis
- **Cơ chế:** Mỗi partner được cấp short link riêng có bật conversion tracking. Client script bắt query param `dub_id` → lưu **first-party cookie**; server gọi `POST /track/lead` (đăng ký) và `POST /track/sale` (mua hàng). **Lead event là "source of truth" về danh tính khách** — sau khi lead gắn với link, mọi sale về sau tự attribute theo customer (qua `externalId`), không phụ thuộc cookie nữa. Reward cấu hình theo click/lead/sale, hỗ trợ hoa hồng % hoặc cố định, recurring; có fraud & risk detection ở tầng Partners (phần lớn tính năng Partners nằm trong thư mục `(ee)`).
- **License:** AGPL-3.0, **NGOẠI TRỪ** thư mục `apps/web/app/(ee)` theo license thương mại riêng — phần Partners/payouts chủ yếu nằm trong ee. Đây là điểm phải soi kỹ nếu định dùng nguyên.
- **Tái sử dụng:** Không nên "dùng nguyên" cho MGM nhỏ (quá nặng, phần hay nhất là ee). **Mượn kiến trúc thì hạng nhất:** mô hình click→lead→sale, `dub_id` cookie, lead-as-identity-anchor, tách analytics event (Tinybird) khỏi DB giao dịch.

### 2. Gumroad — `antiwork/gumroad`
- **URL:** https://github.com/antiwork/gumroad — **9.646 sao** — commit 01/09/2026, **MIT**
- **Stack:** Ruby on Rails, MySQL, Sidekiq — nền tảng bán **sản phẩm số** production thật, khớp bài toán nhất
- **Cơ chế (đọc từ code):**
  - `Affiliate` STI: `DirectAffiliate` (seller tự mời, cookie **30 ngày**, % hoa hồng theo từng sản phẩm qua bảng nối `affiliates_links.affiliate_basis_points`) và `GlobalAffiliate` (chương trình toàn sàn, cookie **7 ngày**, cứng 10% = 1000 basis points).
  - Link dạng `?affiliate_id=` hoặc `?a=`; controller redirect set cookie tên `_gumroad_affiliate_id_<id-đã-mã-hoá>` (mã hoá bằng `ObfuscateIds` — không lộ ID thật), cross-subdomain.
  - Nhiều cookie affiliate cùng tồn tại → sort theo timestamp giảm dần = **last-click wins**.
  - **Chống gian lận trong code:** `eligible_for_purchase_credit?` từ chối khi `purchaser_email == affiliate_user.email` (chặn tự mua qua link của mình), affiliate bị suspend thì loại khỏi scope `valid_for_product`.
  - Hoa hồng ghi vào `affiliate_credits` gắn với `purchases` → refund/chargeback đảo credit.
- **Tái sử dụng:** Nếu làm Rails: fork được từng phần. Với stack khác: **mẫu tham chiếu tốt nhất về data model affiliate cho sản phẩm số** (basis points per-product, credit gắn purchase, cookie mã hoá).

### 3. RefRef — `amicalhq/refref`
- **URL:** https://github.com/amicalhq/refref — **215 sao** — commit gần nhất 20/03/2026 (chậm lại, đang alpha)
- **Stack:** TypeScript monorepo (Turborepo), Next.js, Drizzle ORM + PostgreSQL, Better-Auth, các app webapp/api/refer portal, Docker Compose
- **Cơ chế:** JS snippet attribution; reward engine linh hoạt; portal cho referrer + portal cho partner; landing cá nhân hoá; **nudges** (nhắc tự động); **fraud monitoring**; duyệt thưởng thủ công/tự động, chi thưởng thủ công/tự động; sandbox test chương trình; tích hợp Stripe cho payout.
- **License:** AGPL-3.0
- **Tái sử dụng:** Đúng bài "Tolt/Rewardful open source" nhưng còn alpha + AGPL. **Mượn kiến trúc schema Drizzle + luồng approve reward** rất đáng; dùng nguyên thì rủi ro breaking changes.

### 4. Refferq — `Refferq/Refferq`
- **URL:** https://github.com/Refferq/Refferq — **109 sao** — commit 20/08/2026, **MIT**
- **Stack:** Next.js 15 + React 19 + TypeScript, PostgreSQL + Prisma, JWT (jose) + bcrypt + OTP email, Resend, Recharts; 38+ API endpoints
- **Cơ chế:** Affiliate có **referral link + referral code** riêng; affiliate có thể **submit lead thủ công**; admin duyệt lead (Pending/Approved/Rejected); hoa hồng % hoặc cố định; lịch payout NET-15/NET-30, nhiều kênh (PayPal/Bank/Stripe/Wise); cấu hình cookie tracking, **chặn theo quốc gia**; email automation trọn vòng đời; user mới mặc định ở trạng thái chờ kích hoạt.
- **Tái sử dụng:** MIT + stack phổ thông → **ứng viên tốt nhất để dùng nguyên hoặc fork** cho hệ MGM khoá học quy mô vừa. Điểm trừ: tracking nghiêng về "submit lead + admin duyệt" hơn là auto-attribution chuẩn xác kiểu Dub.

### 5. RefearnApp — `ZAK123DSFDF/refearnapp`
- **URL:** https://github.com/ZAK123DSFDF/refearnapp — **33 sao** — commit 22/08/2026
- **Stack:** Next.js + React, Cloudflare Workers (edge tracking), Upstash Redis, Drizzle, Docker; tự nhận là alternative của Rewardful/FirstPromoter/Tolt
- **Cơ chế:** Track click/conversion tại edge (độ trễ thấp), tích hợp **Stripe & Paddle**, **PayPal mass payouts**, **coupon code tracking** (attribution bằng mã giảm giá — hữu ích khi không dùng được link), tuỳ biến affiliate portal, team management.
- **License:** AGPL-3.0
- **Tái sử dụng:** Sao còn ít, 1 tác giả chính, có mô hình cloud trả phí kèm. Tham khảo ý tưởng **edge tracking + coupon-as-attribution**; chưa nên đặt cược dùng nguyên.

---

## NHÓM 2 — Viral waitlist kiểu Robinhood/Harry's

### 6. Prelaunchr — `harrystech/prelaunchr` ⭐ kinh điển
- **URL:** https://github.com/harrystech/prelaunchr — **887 sao** — **ARCHIVED 2019, dependencies có lỗ hổng**, MIT
- **Stack:** Rails 4, Ruby 2.5, PostgreSQL, Devise
- **Cơ chế (đọc từ code `user.rb`):** Chính là campaign thật của Harry's (100k email/1 tuần). Mỗi `User` có `referral_code` unique (sinh lúc `before_create`); người được giới thiệu lưu `referrer_id` (self-join ngay trên bảng users); `REFERRAL_STEPS` định nghĩa **mốc quà 5/10/25/50 referrals** (kem cạo râu → dao → bộ Winston → 1 năm lưỡi dao miễn phí). **Chống gian lận: chặn >2 signup cùng IP**, README khuyên nâng cấp bằng Rack::Attack.
- **Tái sử dụng:** Không chạy nguyên (đã chết). **Nhưng là bản thiết kế chuẩn của MGM theo mốc quà** — mô hình dữ liệu tối giản nhất có thể (1 bảng users + referrer_id + count), rất đáng nhại lại cho chiến dịch pre-launch khoá học.

### 7. waitlist-cloudflare — `Metareignity/waitlist-cloudflare`
- **URL:** https://github.com/Metareignity/waitlist-cloudflare — **14 sao** — commit 07/2026, MIT
- **Stack:** Next.js 15 + React 19, Cloudflare Workers + **D1 (SQLite edge)**, OpenNext adapter — 100% Cloudflare, không cần service ngoài
- **Cơ chế:** Tự sinh referral code nhẹ cho mỗi người đăng ký, track "referring nodes"; **rate limiting theo IP ngay trong D1** (bảng `rate_limits`) không cần Redis.
- **Tái sử dụng:** Boilerplate gọn để dựng waitlist + referral chi phí ~0 đồng. Dùng nguyên được cho landing chờ khoá học.

### 8. Các repo waitlist nhỏ khác (tham khảo nhanh)
- `alinearonsky/refqueue` (3★, MIT, Next.js + Supabase, 07/2026) — "mời bạn để nhảy hàng", đúng mô hình Robinhood trên Supabase.
- `zaidazmi/open-waitlist` (0★, MIT, Next.js + Supabase + Resend) — có **verified signup (double opt-in) + dynamic ranking**.
- `earlypass/earlypass` (3★) — widget waitlist viral nhúng bằng 1 thẻ script.
- `AdrianArtiles/viral-waitlist-api` (9★, GPL-3.0, TS, ngừng 2021) — API thuần cho viral waitlist.
- `jbeyers/django-prelaunch` (35★, ngừng 2012) — bản Django của ý tưởng prelaunch + referral.

---

## NHÓM 3 — Thư viện/module theo framework

### 9. pinax-referrals — `pinax/pinax-referrals` (Django)
- **URL:** https://github.com/pinax/pinax-referrals — **218 sao** — commit 28/07/2026, MIT, trên PyPI
- **Cơ chế:** Model `Referral` (user, `code`, `redirect_to`, có thể gắn vào object bất kỳ qua GFK; hỗ trợ cả **mã ẩn danh** cho chiến dịch marketing) + `ReferralResponse` ghi lại từng lượt truy cập (session, IP, `action`); template tag sinh link chia sẻ; **signals** để tự xử thưởng — thư viện chỉ lo attribution, phần thưởng để app tự quyết.
- **Tái sử dụng:** Nền attribution sạch, đúng triết lý "cơ chế tách khỏi chính sách". Dùng nguyên nếu backend Django.

### 10. django-referral-system — `soldatov-ss/django-referral-system`
- **URL:** https://github.com/soldatov-ss/django-referral-system — **56 sao** — commit 04/2026, MIT, Python 3.9–3.14 / Django 4.2+
- **Cơ chế:** Promoter với token + link riêng; đếm click; commission rate theo **referral program đang active (chỉ 1 program active tại một thời điểm)**; **tự động đảo hoa hồng khi refund**; payout xuất **CSV cho Wise**, tự bỏ qua promoter dưới ngưỡng rút tối thiểu; gửi email mời.
- **Tái sử dụng:** Trẻ, test coverage tốt, đúng trọng tâm "commission + payout". Dùng nguyên được cho Django; schema đáng chép.

### 11. Laravel: `voocx/laravel-referral` + `pdazcom/laravel-referrals` + `junaidnasir/larainvite`
- **voocx/laravel-referral** — https://github.com/voocx/laravel-referral — **138 sao**, MIT, **ngừng từ 2022**. Middleware `CheckReferral` bắt param → cookie; trait `UserReferral` gắn referrer khi tạo user; `getReferralLink()`. Mẫu tối giản dễ hiểu nhất về pattern middleware+cookie+trait.
- **pdazcom/laravel-referrals** — https://github.com/pdazcom/laravel-referrals — **31 sao**, MIT, còn bảo trì (05/2026), hỗ trợ Laravel 11–13. Điểm hay: **nhiều chương trình referral áp lên cùng 1 user**, cookie lưu JSON `{ref_id: expires_timestamp}` (mỗi ref có hạn riêng), hỗ trợ cả UUID link lẫn mã thân thiện qua `?ref=`, có **reward hooks**.
- **junaidnasir/larainvite** — https://github.com/junaidnasir/larainvite — **142 sao**, MIT, v12 hỗ trợ Laravel 12 (05/2026) nhưng README ghi "MAINTAINER REQUIRED". Mô hình **invite qua email với mã một lần + hạn dùng** (bảng `user_invitation`, trạng thái pending/successful/expired/canceled, đủ event để gắn thưởng). Hợp cho MGM "mời đích danh" hơn là link công khai.

### 12. byteweaver/django-referral
- **URL:** https://github.com/byteweaver/django-referral — **96 sao**, MIT, **cũ (Django 1.4–1.11, commit cuối 2023)**
- **Cơ chế:** `ReferrerMiddleware` bắt `?ref=` → lưu **session** (không cookie riêng), khi user đăng ký gọi `apply_referrer(user, request)`; gom referrer thành **campaign** theo pattern; tự tạo referrer lạ. Chỉ nên tham khảo ý tưởng "referrer cache trong session đến khi signup".

### 13. jazzband/django-invitations (liên quan)
- **URL:** https://github.com/jazzband/django-invitations — **601 sao**, GPL-3.0, commit 31/08/2026 — invitation-only signup (tích hợp allauth), không có tầng thưởng. Đáng dùng làm nền "mời qua email" rồi tự xây reward lên trên.

---

## NHÓM 4 — Giveaway/contest kiểu UpViral/Gleam

Kết luận sau nhiều lượt tìm: **không tồn tại clone mã nguồn mở nào đáng kể của Gleam/UpViral/Viral Loops** (chỉ có crawler gom giveaway của gleam.io, vài app raffle MERN 0–5 sao, và công cụ chọn người thắng bằng hash). Hướng khả thi: lấy waitlist-referral (nhóm 2) + bảng `actions/points` tự thêm để mô phỏng "làm nhiệm vụ lấy điểm". **Đây là khoảng trống thật sự trong hệ sinh thái OSS** — và là cơ hội cho MGM MAX.

---

## NHÓM 5 — Riêng cho khoá học / LMS

### 14. Moodle
- **`hn-88/moodle-plugin-local-referrals`** — https://github.com/hn-88/moodle-plugin-local-referrals — 0 sao, MIT, mới (09/2025). Local plugin bắt referral id từ GET request và map vào self-enrolment của khoá. Sơ khai, chỉ minh hoạ đúng chỗ cần móc vào Moodle (enrolment hook).
- **`enrol_invitation`** (moodle.org/plugins/enrol_invitation) — plugin mời học viên vào khoá qua email, GPL, không có tầng thưởng.
- Không có plugin MGM/reward hoàn chỉnh cho Moodle dạng OSS — muốn có phải tự viết local plugin quanh sự kiện `user_enrolment_created`.

### 15. Open edX
Không tìm thấy plugin referral chuyên dụng. `mitodl/open-edx-plugins` và `openedx/openedx-tutor-plugins` là bộ plugin chung, không có referral. Tự xây thì làm Django app cắm vào (Open edX là Django) — dùng pattern của pinax-referrals được.

### 16. WordPress (phân định mở/đóng rõ ràng)
- **AffiliateWP** — mã GPL (bản chất plugin WP) nhưng **bán trả phí, KHÔNG có repo công khai chính thức** → coi như mã đóng về mặt thực dụng.
- **SliceWP** — bản **free trên wordpress.org** (GPL) + bản Pro trả phí; bản free đủ: affiliate đăng ký, link `?aff=`, cookie, hoa hồng cho WooCommerce/LearnDash/MemberPress…
- **`itthinx/affiliates`** — https://github.com/itthinx/affiliates — 25 sao, **GPL-3.0, có repo công khai, còn bảo trì (04/2026)**. Framework affiliate free: link `?affiliates=<id>`, cookie, bảng referrals + hits, API hooks; tích hợp thương mại (WooCommerce…) nằm ở bản Pro. → Đây là lựa chọn OSS thật sự trên WP; ghép với LMS WordPress (LearnDash/Tutor) là ra MGM khoá học nhanh nhất trong hệ WP.

### 17. Bài học cơ chế từ Teachable/Thinkific (mã đóng, chỉ học mô hình)
- **Teachable:** hoa hồng tới 30%, **recurring giới hạn 12 tháng đầu**, cookie **30 ngày**, ngưỡng chi trả tối thiểu $50, trả ngày 1 hàng tháng.
- **Thinkific:** 30% **lifetime recurring**, cookie **90 ngày**.
- Bài học: với khoá học/subscription, biến số cạnh tranh là **độ dài cookie window + recurring bao lâu + ngưỡng payout** — thiết kế schema phải để 3 tham số này cấu hình được theo chương trình, đừng hard-code.

---

## BẢNG TÓM TẮT

| # | Repo | Sao | Stack | License | Còn sống? | Mức tái sử dụng cho MGM sản phẩm số/khoá học |
|---|------|-----|-------|---------|-----------|---------------------------------------------|
| 1 | dubinc/dub | 24.637 | Next.js, MySQL, Tinybird | AGPL-3 + ee thương mại | Rất tích cực | Mượn kiến trúc tracking (đỉnh nhất) |
| 2 | antiwork/gumroad | 9.646 | Rails, MySQL | MIT | Rất tích cực | Mẫu data model affiliate cho sản phẩm số |
| 3 | amicalhq/refref | 215 | Next.js, Drizzle, Postgres | AGPL-3 | Chậm (03/2026), alpha | Mượn schema + luồng duyệt thưởng |
| 4 | pinax/pinax-referrals | 218 | Django | MIT | Còn | Dùng nguyên (Django) — attribution thuần |
| 5 | junaidnasir/larainvite | 142 | Laravel | MIT | Cầm chừng | Dùng nguyên cho invite-email |
| 6 | voocx/laravel-referral | 138 | Laravel | MIT | Ngừng 2022 | Học pattern middleware+cookie+trait |
| 7 | Refferq/Refferq | 109 | Next.js 15, Prisma, Postgres | MIT | Tích cực | **Ứng viên fork số 1** (full platform, MIT) |
| 8 | byteweaver/django-referral | 96 | Django (cũ) | MIT | Ngừng | Chỉ tham khảo ý tưởng session-cache |
| 9 | harrystech/prelaunchr | 887 | Rails 4 | MIT | Archived | Bản thiết kế chuẩn MGM theo mốc quà |
| 10 | soldatov-ss/django-referral-system | 56 | Django 4.2+ | MIT | Tích cực | Dùng nguyên (Django) — commission+payout |
| 11 | ZAK123DSFDF/refearnapp | 33 | Next.js + CF Workers | AGPL-3 | Tích cực | Ý tưởng edge tracking + coupon attribution |
| 12 | pdazcom/laravel-referrals | 31 | Laravel 11–13 | MIT | Tích cực | Dùng nguyên (Laravel) — đa chương trình |
| 13 | itthinx/affiliates | 25 | PHP/WordPress | GPL-3 | Tích cực | Dùng nguyên nếu hệ WP + LMS WP |
| 14 | Metareignity/waitlist-cloudflare | 14 | Next.js + CF D1 | MIT | Tích cực | Dùng nguyên cho waitlist pre-launch |
| 15 | jazzband/django-invitations | 601 | Django | GPL-3 | Tích cực | Nền invite, tự xây thưởng lên trên |

---

## 7 BÀI HỌC KIẾN TRÚC RÚT RA

1. **Mô hình dữ liệu hội tụ về 5 bảng:** `referral_codes/links` (owner, code UNIQUE, đích redirect, chương trình) → `clicks/responses` (session/IP/UA/timestamp — pinax gọi là ReferralResponse) → `referrals/conversions` (referrer_id, referee_id UNIQUE, status pending/approved/rejected) → `commissions/rewards` (số tiền hoặc điểm, status) → `payouts` (batch, kênh chi trả). Bản tối giản nhất là Prelaunchr: chỉ `users.referrer_id` self-join + đếm — đủ cho waitlist. Gumroad thêm bảng nối `affiliates_links` để **hoa hồng khác nhau theo từng sản phẩm** (basis points) — rất đáng chép cho bán nhiều khoá học.

2. **Attribution 2 pha, "đóng băng" sớm:** Pha 1 (click): param `?ref=`/`?a=`/`?dub_id=` → cookie/session first-party có hạn. Pha 2 (signup/purchase): chuyển attribution từ cookie vào bản ghi DB vĩnh viễn. Dub làm rõ nhất: **lead event là source of truth về danh tính** — từ đó về sau attribute theo customer (externalId), không theo cookie; nhờ vậy sale tháng thứ 6 của subscription vẫn tính đúng người giới thiệu dù cookie chết lâu rồi. Đây là điểm các package đơn giản (voocx, byteweaver) không có.

3. **Idempotency khi ghi nhận conversion:** ràng buộc UNIQUE ở tầng DB, không chỉ check ở code: referee chỉ được gắn 1 referrer duy nhất (UNIQUE trên referee_id), mỗi purchase chỉ sinh 1 credit (Gumroad gắn `affiliate_credit` vào `purchase`), customer định danh bằng `externalId` duy nhất (Dub). Kèm theo: **refund/chargeback phải đảo hoa hồng tự động** (django-referral-system làm sẵn) — nên hoa hồng phải ở trạng thái `pending` qua kỳ NET-15/NET-30 (Refferq) rồi mới `approved`.

4. **Chống gian lận — 4 lớp thấy lặp lại trong code thật:** (a) chặn self-referral bằng so khớp email/user_id — Gumroad từ chối khi `purchaser_email == affiliate_user.email`; (b) rate-limit theo IP — Prelaunchr chặn >2 signup/IP, waitlist-cloudflare có bảng `rate_limits` ngay trong D1; (c) **double opt-in email trước khi cộng điểm** (open-waitlist) — điểm chỉ tính trên referee đã verify; (d) hàng chờ duyệt thủ công + trạng thái suspend affiliate (Refferq, RefRef, Gumroad `User.not_suspended`). Bonus của Gumroad: **mã hoá affiliate id trong cookie** (ObfuscateIds) để không đoán/giả được.

5. **Ba mô hình thưởng, chọn theo giai đoạn:** (a) **mốc quà** (Harry's 5/10/25/50) — hợp pre-launch khoá học, không cần payout tiền; (b) **hoa hồng %** một chiều — chuẩn affiliate, tham số hoá theo sản phẩm/chương trình; (c) **hai chiều** (referee được giảm giá + referrer được credit) — không repo nào làm sẵn trọn vẹn, thường ghép ở tầng checkout bằng coupon; RefearnApp gợi ý hay: **dùng chính coupon code làm phương tiện attribution** khi người dùng không bấm link.

6. **Cookie window là tham số cấu hình, có chuẩn ngành:** 7 ngày (Gumroad global) → 30 ngày (Gumroad direct, Teachable) → 90 ngày (Thinkific). Nhiều cookie cùng lúc thì **last-click wins** (Gumroad sort theo timestamp). Với khoá học kiểu subscription, quyết định thêm: recurring commission bao lâu (Teachable cắt sau 12 tháng, Thinkific lifetime) — schema `program` nên có `cookie_days`, `recurring_months`, `min_payout`.

7. **Tách "cơ chế" khỏi "chính sách" và tách "ghi nhận" khỏi "chi trả":** các thư viện sống lâu (pinax-referrals 10+ năm) chỉ làm attribution rồi bắn **signal/event/hook** để app tự quyết thưởng — phần thưởng thay đổi theo chiến dịch, phần tracking thì không. Payout luôn là module riêng chạy batch (Wise CSV, PayPal mass payout, Stripe), có ngưỡng rút tối thiểu và lịch NET — đừng trộn vào luồng ghi nhận conversion.

---

## Khuyến nghị nhanh theo kịch bản

- Dựng full platform ngay → fork **Refferq** (MIT) hoặc chờ **RefRef** chín.
- Tự xây trên Next.js/Postgres → chép data model **Gumroad** + luồng tracking **Dub**.
- Pre-launch khoá học → nhại **Prelaunchr** trên stack **waitlist-cloudflare/refqueue**.
- Hệ WordPress LMS → **SliceWP free** hoặc **itthinx/affiliates**.
- Django → **pinax-referrals + django-referral-system**.

---

## Nguồn chính

[dubinc/dub](https://github.com/dubinc/dub) · [Dub conversions docs](https://dub.co/docs/conversions/quickstart) · [antiwork/gumroad](https://github.com/antiwork/gumroad) · [harrystech/prelaunchr](https://github.com/harrystech/prelaunchr) · [amicalhq/refref](https://github.com/amicalhq/refref) · [Refferq/Refferq](https://github.com/Refferq/Refferq) · [ZAK123DSFDF/refearnapp](https://github.com/ZAK123DSFDF/refearnapp) · [pinax/pinax-referrals](https://github.com/pinax/pinax-referrals) · [soldatov-ss/django-referral-system](https://github.com/soldatov-ss/django-referral-system) · [byteweaver/django-referral](https://github.com/byteweaver/django-referral) · [voocx/laravel-referral](https://github.com/voocx/laravel-referral) · [pdazcom/laravel-referrals](https://github.com/pdazcom/laravel-referrals) · [junaidnasir/larainvite](https://github.com/junaidnasir/larainvite) · [jazzband/django-invitations](https://github.com/jazzband/django-invitations) · [itthinx/affiliates](https://github.com/itthinx/affiliates) · [Metareignity/waitlist-cloudflare](https://github.com/Metareignity/waitlist-cloudflare) · [hn-88/moodle-plugin-local-referrals](https://github.com/hn-88/moodle-plugin-local-referrals) · [SliceWP trên wordpress.org](https://wordpress.org/plugins/slicewp/) · [Thinkific affiliates](https://support.thinkific.com/hc/en-us/articles/360030718573-Become-a-Thinkific-Affiliate) · [Teachable partners](https://www.teachable.com/partners)
