# Nghiên cứu sâu: UpViral (upviral.com)

> ⚠️ **Đã có bản quét sâu hơn**: [quet-sau-upviral.md](quet-sau-upviral.md) (01/09/2026) rà toàn bộ 174 bài knowledge base + API docs + 54 case study, và **đính chính vài điểm** của tài liệu này (mốc thưởng unlock theo ĐIỂM chứ không theo số referral; chỉ 4 email tự động; điểm share cộng ngay khi bấm nút; webhook chỉ 1 event; 5 loại widget). Đọc bản quét sâu trước.

> Tài liệu nghiên cứu cho dự án **MGM MAX** — cơ chế member-get-member cho sản phẩm số & khoá học.
> Nguồn: upviral.com (trang chủ, /features, /pricing, /rewards, /sweepstakes, /waiting-lists), knowledge base support.upviral.com, review độc lập (Pitiya, Systeme.io, Capterra/GetApp/TrustRadius, SocialRails 2026), bài so sánh của đối thủ (Viral Loops, KickoffLabs, QueueForm). Cập nhật: 01/09/2026.

---

## 1. Loại chiến dịch

UpViral có 3 "sản phẩm" chính + ~12 template chuyên biệt, tất cả chạy trên cùng một engine điểm-referral:

| Loại | Cách vận hành |
|---|---|
| **Viral Sweepstakes (bốc thăm)** | Người tham gia đăng ký → nhận link riêng → kiếm điểm bằng mời bạn/share. Kết thúc chiến dịch, hệ thống chọn người thắng Grand Prize (thủ công / nhiều điểm nhất / random có trọng số điểm). Có ngày kết thúc cụ thể. |
| **Viral Rewards / Milestone (mốc thưởng)** | KHÔNG cần ngày kết thúc — evergreen. Mời đủ N bạn (3, 5, 10…) thì tự động mở khoá phần thưởng tương ứng. Hệ thống tự theo dõi và tự gửi email trao thưởng khi đạt mốc. Ví dụ mẫu: 1 bạn = giảm 15%, 3 bạn = sản phẩm miễn phí, 5 bạn = quà giá trị cao. |
| **Viral Waiting List (danh sách chờ)** | Cho pre-launch: đăng ký vào hàng chờ, mời bạn để "nhảy hạng" / nhận đặc quyền (early access, bản limited, giảm giá). Kèm chuỗi email tự động giữ nhiệt đến ngày ra mắt. |

Template có sẵn: Contest, Sweepstake, Email List Growth, Milestone Campaign, Waiting List, Promotional, Seasonal (Halloween/Christmas...), **Reputation Engine** (gom review + video testimonial), **Event Filling** (mời bạn dự webinar/workshop), **Calendar Booking** (thưởng khi giới thiệu người đặt lịch), Newsletter Growth, và Custom (tự trộn).

Điểm đáng chú ý: **có thể dùng Grand Prize + Milestone Rewards trong CÙNG một chiến dịch** — Pitiya nhận xét đây là thứ Gleam không làm được (Gleam tách thành 2 app Competitions/Rewards riêng).

---

## 2. Hệ thống ĐIỂM

Các nguồn điểm, tất cả **cấu hình tự do số điểm**:

1. **Starting Points (điểm đăng ký)** — cộng ngay khi điền form và bấm CTA.
2. **Referral Signup Points** — cộng cho người giới thiệu khi có người đăng ký qua link riêng của họ (điểm "nặng ký" nhất, mặc định ví dụ 10đ/referral). Nếu bật double opt-in, chỉ tính khi bạn bè xác nhận email → điểm referral = referral ĐÃ XÁC MINH.
3. **Social Share Points** — cấu hình điểm riêng cho từng mạng: Facebook, X/Twitter, LinkedIn, Pinterest, WhatsApp, Messenger, Instagram... Lưu ý kỹ thuật quan trọng UpViral tự thừa nhận: **không mạng nào cho verify share thật** (Facebook đã bỏ API này) — hệ thống chỉ ghi nhận "đã bấm nút share" hoặc "có click quay lại từ link đã share" tuỳ mạng.
4. **Custom Actions** — builder 3 mảnh "Action – Content – Destination" (VD: *Join* a *Group* on *Facebook*, *Watch* a *Video* on *YouTube*, *Visit* a *Page*, *Follow* on Instagram, *Answer* a *Survey*...). Gắn URL đích + số điểm tuỳ ý + nút bấm hiển thị trên Share Page. Vì không thể detect hành vi trên site bên thứ ba, UpViral xác minh bằng **câu hỏi trắc nghiệm xác nhận** (creator soạn câu hỏi + đáp án đúng). Custom action có thể bật/tắt giữa chừng chiến dịch (dùng làm "nhiệm vụ giới hạn thời gian").

Quản trị điểm:
- Xem breakdown điểm từng người (điểm từ share, từ custom action, từ referral) và **sửa điểm thủ công** được.
- **Điểm yếu bị review chỉ ra**: KHÔNG có hành động lặp lại — không thể cho điểm share hằng ngày / hành động recurring (Gleam có "daily entries"). Không có "entry code" (nhập mã nhận điểm).
- Thưởng theo **điểm**, không theo **số referral thuần** ở phần chọn winner — Pitiya phàn nàn "rewarding based on referrals is impossible" (mốc milestone thì tính theo số referral, nhưng leaderboard/draw tính theo điểm tổng).

---

## 3. Cơ chế THƯỞNG

**a) Milestone unlock (Incentives)** — trái tim của mô hình evergreen:
- Đặt nhiều mốc (mốc theo số referral: 3/5/10...).
- Đạt mốc → hệ thống **tự động gửi email trao thưởng** — không cần tay người.
- Định dạng phần thưởng: **mã coupon** (quản lý kho coupon cho e-commerce), **file tải về** (ebook, phần mềm), **secret URL** (link nội dung ẩn), hoặc phần thưởng tuỳ nghĩa.

**b) Grand Prize (giải chung cuộc)**:
- 3 cách chọn winner: **Manual** (tab "Pick Winner"), **Most Points Win** (leaderboard tự chọn), **At Random** — random NHƯNG **có trọng số theo điểm**: càng nhiều điểm càng dễ trúng (tương đương "mỗi điểm = thêm vé số").
- Đặt số lượng winner tuỳ ý (Gleam giới hạn số lần chọn winner — UpViral không).
- Hạn chế: **chỉ 1 Grand Prize/chiến dịch** — muốn giải nhất/nhì/ba phải chọn nhiều winner rồi tự trao khác nhau bằng tay. Việc GIAO giải chung cuộc là thủ công (hệ thống chỉ xác định người thắng + gửi email chúc mừng).
- Có toggle tắt prize cũ mà không xoá.

**c) Leaderboard**: "Smart Leaderboards" realtime hiển thị trên share page, tạo cạnh tranh + urgency.

**d) Không có**: thưởng hai chiều (referrer + referee cùng nhận — kiểu Dropbox), trả thưởng tiền mặt/tự động qua cổng thanh toán.

---

## 4. Trang & Widget

- **4 định dạng hiển thị**: Full Page (landing page UpViral host), Embedded Form (nhúng vào site), Pop-up (auto-trigger/hẹn giờ/click text-link), Pop-over widget góc màn hình.
- **Landing page builder**: drag & drop WYSIWYG (mới nâng cấp, được khen trong review 2025), cột, ảnh nền, video embed, custom fields (dropdown, checkbox, tối đa 10 trường custom data), checkbox Điều khoản, chèn HTML/script tracking tuỳ ý, layout riêng cho mobile, đa ngôn ngữ.
- **Cấu trúc trang chuẩn của một chiến dịch**: **Opt-in Page** (đăng ký) → **Share Page** (trang sau đăng ký: hiện link referral riêng, nút share từng mạng, tiến độ mốc thưởng, leaderboard, custom action buttons) → **Thank-you page** → **Closed campaign page** (đón traffic đến muộn sau khi đóng — bắt lead tiếp).
- **One-click signup link**: tạo link đặc biệt (dùng liquid tag của ESP) gửi cho list email CÓ SẴN — subscriber bấm link là **vào thẳng Share Page với link referral đã sinh sẵn, không cần điền form**. Đây là vũ khí kích hoạt list cũ.
- **Universal Capture** (gói Business+): dùng FORM CỦA CHÍNH BẠN trên website — data submit đi song song vào cả UpViral lẫn server/CMS/ESP của bạn. Có hướng dẫn riêng cho Shopify, WordPress, ClickFunnels.
- Custom domain + SSL miễn phí; participant tự theo dõi số referral của mình ("Unique Tracking System").

---

## 5. Email automation

6 loại email tự động: **Welcome**, thông báo subscriber mới (cho admin), cảnh báo anti-fraud, **double opt-in confirmation** (bật/tắt, tự soạn subject + nội dung; khuyến nghị bật để lọc bot), **thông báo mở khoá thưởng khi đạt mốc**, **email chúc mừng người thắng**.

- Email theo trigger hành vi + hẹn giờ (scheduled sequences), template có sẵn, nút share nhúng trong email, personalization bằng liquid tags, A/B test cả subject lẫn body.
- **Sender profile** riêng (Settings → Email Settings): tên, email, địa chỉ người gửi.
- **Custom email server**: hỗ trợ gửi qua **Postmark, SendGrid, AWS (SES)** hoặc server UpViral mặc định — tức có SMTP/API riêng để email mang domain của bạn và vào inbox tốt hơn. (Nếu chưa cấu hình, mail đi từ info@upviral.com — có bài KB riêng giải thích.)

---

## 6. Chống gian lận

- **Fraud Detection Center** riêng trong menu chiến dịch: MỌI lead khả nghi bị giữ ở đây, **không tự vào danh sách lead** — duyệt tay mới được vào list + mới sync sang autoresponder.
- Tín hiệu: **nhiều đăng ký cùng IP**, email ảo/fake (email verification; Pitiya ghi nhận tích hợp EmailListVerify), hành vi bất thường tự động phát hiện; theo dõi bằng cookie + IP.
- Công cụ: **Google CAPTCHA tự bật khi traffic khả nghi**, **blacklist/whitelist IP + email + domain**, toggle "Automatically deactivate fraudulent leads" (lead gian lận mặc định Inactive), double opt-in như lớp lọc đầu.
- **Hồ sơ 360°** mỗi participant: IP, vị trí, chuỗi referral (ai mời ai), tiến độ thưởng → dùng để **xác minh người thắng** trước khi trao (kiểm tra chuỗi referral có tự-giới-thiệu không). Việc verify cuối vẫn là con người quyết.

---

## 7. A/B testing, analytics, tracking

- **"Triple A/B Testing"**: test đồng thời Opt-in page, Share page (+ thank-you page) và email follow-up. Tạo bao nhiêu biến thể tuỳ ý, hệ thống random hiển thị; xem kết quả ở Stats → Split Tests rồi chọn winner. **Chỉ có từ gói Business trở lên.**
- **Dashboard**: Leads/Visits ratio, referred leads vs referred visits, **traffic theo nguồn** (direct vs referred, theo từng mạng xã hội), chuyển đổi theo ngày phân tách direct/referral, % lead thực hiện share/custom action, số email gửi + open rate, top influencers.
- Tracking: retargeting pixel, conversion/retargeting script chèn được vào trang, UTM + custom tracking parameters tự động gắn, custom tracking domain.
- **KHÔNG có**: chỉ số **viral coefficient / K-factor** hiển thị sẵn (phải tự tính từ referred leads / total leads), hệ thống conversion tracking doanh thu thực sự (Pitiya: "No conversion tracking system"), UTM inbound không được track trong report chính.

---

## 8. Tích hợp

- **ESP/CRM trực tiếp (30+)**: ActiveCampaign, Mailchimp, ConvertKit/Kit, AWeber, HubSpot, Intercom, Klaviyo, Drip, GetResponse, Sendlane, Sendy, Mautic, Zoho, WebinarJam...; sync tên, phone, DOB, location, custom fields; **gắn tag phân khúc** lead theo hành vi; đẩy cả **link referral của từng người sang ESP** (để bạn tự gửi email nhắc bằng hệ thống của mình).
- **Automation**: Zapier (1000+ apps), Pabbly, Integrately, Pipedream, Make/Integromat.
- **Kỹ thuật**: **Webhooks**, **REST API** (có API key; thêm participant thủ công qua API), HTML form integration (điểm mạnh hiếm có — nhúng vào mọi page builder), Universal Capture.
- Site builders: WordPress, ClickFunnels, Webflow, Shopify, Jotform, WuFoo, ThriveLeads, Instabuilder.
- **Lưu ý gói**: API/Webhook/Zapier chỉ từ **Business** trở lên (theo trang pricing hiện tại).

---

## 9. Giá 2025–2026 (trang pricing chính thức)

| | **Starter** | **Business** | **Premium** |
|---|---|---|---|
| Tháng | $99 | $149 | $399 |
| Năm (trả trước, -20%) | $79/th | $119/th | $319/th |
| Lead tối đa | 10.000 | 25.000 | 100.000 |
| Brands / custom domain | 1 | 2 | 5 |
| Referral AI credits | 1/th | 3/th | 10/th |
| Riêng có | — | Universal Capture, geo-restriction, **API/Webhook/Zapier**, split-test | + Dedicated account manager, priority support |

- Mọi gói: **unlimited campaigns** + unlimited page views, drag & drop, anti-fraud, leaderboard, GDPR, bỏ branding, chat/email support.
- Trial **$1/14 ngày**, hoàn tiền 30 ngày, không hợp đồng. **Không có gói free.**
- Bẫy chi phí: lead cap cứng (vượt giữa chiến dịch = buộc nâng gói); AI credit ít.
- So giá đối thủ (SocialRails/LaunchList 2026): Viral Loops từ $35–49/th, Gleam free–$10+/th (Competitions) hoặc bundle $79+, KickoffLabs từ $29/th, RafflePress $39.5/năm, KingSumo lifetime $49–198, GrowSurf $99/th → **UpViral thuộc phân khúc đắt nhất cho người mới**.
- **Referral AI** (2025): nhập brand, niche, sản phẩm, audience → AI sinh nguyên chiến dịch (template, copy, landing page, gợi ý grand prize) — mỗi lần tốn credit.

---

## 10. Điểm yếu người dùng phàn nàn (cơ hội làm tốt hơn)

1. **Giá cao so với phạm vi tính năng** — "pricey for its limited capabilities"; chỉ làm đúng một việc là referral/giveaway, vẫn phải mua thêm ESP, funnel, hosting.
2. **Không có thưởng hai chiều** (referrer + referee cùng nhận) — chuẩn Dropbox mà Viral Loops/ReferralHero có.
3. **Không có hành động lặp lại** (daily share/daily entry) — Gleam có.
4. **Chỉ 1 Grand Prize/chiến dịch**; trao giải chung cuộc thủ công.
5. **Custom action verify bằng câu hỏi trắc nghiệm** — dễ gian lận, không verify thật (dù đây là giới hạn API chung của ngành).
6. **Widget đôi lúc lỗi/không load** ("spinning wheel" có hẳn bài KB); một số user nói "buggy".
7. **Support chậm** (~48h), phàn nàn về refund quá hạn 30 ngày bị từ chối, khó liên hệ; có ca tố không tích hợp được ClickFunnels như quảng cáo.
8. **Không có team/collaboration** (nhiều người cùng quản trị).
9. **Không hiển thị K-factor, không conversion tracking doanh thu, không track UTM inbound** trong báo cáo.
10. **Giao diện ban đầu rối** với người mới; trial 14 ngày quá ngắn để thấy kết quả viral; A/B test + API bị khoá sau paywall Business.
11. Ít mạng share hơn Gleam (thiếu Tumblr, Mix...; Gleam có 100+ entry actions).

---

## Công thức UpViral — luồng end-to-end

```
[Traffic: ads/email list cũ/social]
        │
        ▼
1. OPT-IN PAGE (hoặc popup/widget/form riêng qua Universal Capture)
   → điền email → +Starting Points → (double opt-in xác nhận)
   → lead sync sang ESP kèm tag + link referral riêng
        │
        ▼
2. SHARE PAGE (ngay sau đăng ký — khoảnh khắc vàng)
   → thấy: link referral riêng + nút share FB/X/WhatsApp…
     + thanh tiến độ mốc thưởng + leaderboard + custom actions
   → list email CŨ vào thẳng đây bằng one-click signup link
        │
        ▼
3. KIẾM ĐIỂM
   → bạn bè đăng ký qua link = +Referral Points (verify bằng double opt-in)
   → share mỗi mạng = +X điểm (cấu hình riêng từng mạng)
   → custom action (xem video, join group, follow, survey) = +Y điểm
   → lead khả nghi (trùng IP, email ảo) rơi vào Fraud Center chờ duyệt
        │
        ▼
4. VÒNG LẶP GIỮ NHIỆT (email automation)
   → welcome → nhắc mốc → "bạn vừa mở khoá thưởng!" (tự gửi coupon/file/secret URL)
   → mỗi người được mời quay lại bước 1 với link riêng của họ = VIRAL LOOP
        │
        ▼
5. KẾT THÚC
   → Grand Prize: manual / most points / random-có-trọng-số-điểm
   → verify người thắng qua hồ sơ 360° + chuỗi referral → email chúc mừng
   → closed page tiếp tục hứng lead muộn → export/sync toàn bộ list
```

Ba đòn bẩy tâm lý cốt lõi: (1) **thưởng chắc chắn theo mốc** (ai cũng được gì đó → động lực đại trà), (2) **giải lớn xác suất theo điểm** (mỗi điểm = thêm vé → luôn có lý do kiếm thêm điểm), (3) **leaderboard công khai** (cạnh tranh ở top).

### Áp dụng cho sản phẩm số & khoá học online — phần nào "ăn" nhất

- **Milestone reward là mảnh ghép hoàn hảo nhất**: phần thưởng là hàng số (chi phí biên ≈ 0) — mời 1 bạn = mở khoá 1 chương/template, 3 bạn = mini-course, 5 bạn = mã giảm 50% khoá full, 10 bạn = 1 suất học miễn phí. UpViral giao đúng bằng 3 định dạng có sẵn: **coupon code, file download, secret URL** — secret URL trỏ thẳng vào bài học ẩn/unlisted là khớp 100% với khoá học.
- **Waiting list cho launch khoá học**: gom hàng chờ trước ngày mở cổng, mời bạn để nhận early-bird/bonus module; chuỗi email giữ nhiệt tới ngày mở bán.
- **One-click signup link**: kích hoạt học viên/subscriber CŨ làm máy phát tán — với người bán khoá học đã có list, đây là đòn ROI cao nhất.
- **Custom actions** dùng làm "micro-engagement" đúng chất khoá học: xem video giới thiệu (+điểm), trả lời khảo sát nhu cầu (+điểm), join group cộng đồng (+điểm) — vừa cộng điểm vừa làm nóng lead trước khi bán.
- **Event Filling template** → lấp đầy webinar bán khoá học bằng cơ chế mời bạn.
- Những gì NÊN LÀM TỐT HƠN UpViral nếu tự xây cho sản phẩm số: thưởng **hai chiều** (người được mời cũng nhận quà → tăng tỉ lệ chấp nhận lời mời), **tự động mở khoá quyền truy cập trong LMS** thay vì chỉ gửi email (webhook → enroll thẳng vào khoá), hiển thị **K-factor** cho admin, hành động lặp lại theo ngày, và nhiều giải theo hạng leaderboard (top 1/2/3 khác nhau) thay vì 1 grand prize.

---

## Nguồn tham khảo

- [UpViral homepage](https://www.upviral.com/) · [Features](https://www.upviral.com/features) · [Pricing](https://www.upviral.com/pricing) · [Rewards](https://www.upviral.com/rewards) · [Waiting Lists](https://www.upviral.com/waiting-lists)
- KB: [Set up Points](https://support.upviral.com/support/solutions/articles/4000128949-how-to-set-up-points-for-your-campaign-) · [Custom Actions](https://support.upviral.com/support/solutions/articles/4000127817-how-to-use-custom-actions) · [Grand Prize](https://support.upviral.com/support/solutions/articles/4000130124-how-to-set-up-grandprize) · [Fraud Prevention](https://support.upviral.com/support/solutions/articles/4000160231-what-is-fraud-prevention-and-how-do-i-use-it-) · [Fraud Detection](https://support.upviral.com/support/solutions/articles/4000160170-how-does-the-fraud-detection-work-) · [Double Opt-in](https://support.upviral.com/support/solutions/articles/4000075837-how-to-enable-double-opt-in-confirmation-emails-for-my-campaign-) · [Own Email Server](https://support.upviral.com/support/solutions/articles/4000075839-how-to-send-emails-using-your-own-email-server-) · [Split-test](https://support.upviral.com/support/solutions/articles/4000075845-how-to-split-test-my-opt-in-and-thank-you-pages-) · [Reporting Dashboard](https://support.upviral.com/support/solutions/articles/4000161625-reporting-main-dashboard) · [One-click Registration Links](https://support.upviral.com/support/solutions/articles/4000075972-how-to-send-one-click-registration-links-to-my-existing-email-list-eg-importing-contacts-to-upviral) · [Universal Capture](https://support.upviral.com/support/solutions/articles/4000194153-how-to-install-the-universal-capture-opt-in-code-in-your-website-) · [Referral AI Guide](https://support.upviral.com/support/solutions/articles/4000203441-referral-ai-a-step-by-step-guide)
- Reviews/so sánh: [Pitiya UpViral Review](https://www.pitiya.com/upviral-review.html) · [Systeme.io Review](https://systeme.io/blog/upviral-review) · [SocialRails Pricing 2026](https://socialrails.com/blog/upviral-pricing) · [Capterra Reviews](https://www.capterra.com/p/230137/UpViral/reviews/) · [TrustRadius](https://www.trustradius.com/products/upviral/reviews) · [QueueForm Alternatives](https://www.queueform.com/blog/what-are-the-7-best-upviral-alternatives) · [KickoffLabs Giveaway Tools 2026](https://kickofflabs.com/blog/best-giveaway-software-tools-2026/) · [LaunchList Alternatives](https://getlaunchlist.com/blog/best-viral-loops-alternatives-2026)
