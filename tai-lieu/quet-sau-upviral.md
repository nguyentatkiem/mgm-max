# Quét sâu UpViral — kiểm kê tính năng mức setting (bản đầy đủ)

> Kết quả 3 mũi quét ngày 01/09/2026: **(1)** toàn bộ knowledge base support.upviral.com (13 folder, 174 bài, mở ~100 bài), **(2)** API docs + Zapier app chính thức, **(3)** toàn bộ upviral.com qua sitemap (features, editor, examples, pricing, 54 case study, trang so sánh) + review có ảnh chụp màn hình (Pitiya, RafflePress, MonkMarketers 03/2026).
> Tài liệu này **thay thế và đính chính** một phần [nghien-cuu-upviral.md](nghien-cuu-upviral.md). Mỗi chi tiết KB đều có mã bài (40001xxxxx) tra được tại support.upviral.com.

---

## A. ĐÍNH CHÍNH so với tài liệu nghiên cứu vòng 1

Vòng 1 dựa trên trang marketing + review; vòng này đọc KB nguyên văn, có mấy chỗ phải sửa:

1. **Mốc thưởng (incentives) unlock theo ĐIỂM, không phải theo số referral.** KB nguyên văn: incentives "automatically unlock when a participant gains the points needed" (4000158740). Trang marketing nói "3, 5, 10 referrals" chỉ là cách diễn đạt. Ví dụ thật trong app: 10đ = coupon, 100đ = ebook, 500đ = video course, 1.000đ = giảm 50%. → Phương án MGM MAX chọn mốc theo **số referral xác minh** vẫn giữ nguyên — giờ nó là điểm **khác biệt có chủ đích** so với UpViral (chống lạm phát điểm share), không phải bắt chước.
2. **Email tự động chỉ có 4 loại** trong tab Emails (Sign Up, Referral Alert, Fraud Detection, Grand Prize Winner) + email double opt-in nằm riêng ở Lead Quality — không phải 6 (4000075835). Và **không hề có broadcast/mass email, không segment, không hẹn giờ**.
3. **Điểm share cộng NGAY KHI BẤM NÚT share, không verify gì cả** (4000191103 nói thẳng; khuyến nghị chính thức của UpViral: để share = 1 điểm). Không có cơ chế "click quay lại mới tính". Riêng **nút Email Share không gán điểm được** vì mở mail client của người dùng (4000166048).
4. **Widget có 5 loại, không phải 4**: In Line (iframe), Popup (button/auto-load + delay), Slide In/Popover, **Connect Your Own Form** (= tên mới của Universal Capture, data đi song song 2 nơi), HTML Form (data chỉ về UpViral) (4000194494).
5. **Mọi email đều gửi từ info@upviral.com trên MỌI GÓI** — sender profile chỉ đổi tên hiển thị + reply-to; muốn "from" domain riêng bắt buộc cấu hình Postmark/SendGrid/SES (4000171507).
6. **Webhook chỉ có đúng 1 event**: reward unlocked, payload 4 field (reward_id, reward_name, user_email, user_total_points), cấu hình lẫn trong Advanced > UTM Tracking (4000160172). Zapier chỉ 2 trigger (New Lead, Unlock Rewards) + 3 action (Add Contact, Add Points, Unlock Rewards).

---

## B. KIỂM KÊ TÍNH NĂNG MỨC SETTING

### B1. Tạo & quản trị campaign
- 3 cách tạo: "2 Min" / từ template / custom. Wizard custom 8 bước: Overview → Rewards → Sharing & Actions → Share Message → Design Pages → Communication → Autoresponder → Advanced → Launch (4000127829). **Launch bắt buộc có đủ opt-in page + share page** (4000175835).
- Trạng thái: Draft / Inactive / Active; pause xong chọn trang đóng: **Default / Custom template / Redirect URL** (4000160180, 4000160225).
- **Clone campaign** (More Options > Clone) (4000160181); **Campaign Sharing giữa tài khoản** qua share link + Import Campaign, kèm/không kèm T&C text và "Critical Incentives Data", thu hồi được link (4000175117). Không share riêng template được.
- Evergreen = bỏ tick "Close the campaign when winners was chosen" (4000175565). **Không có field start-date độc lập** — lịch gắn với Winner Selection Date.
- Geo Targeting: allow-list "Restricted Area" theo region/quốc gia, mặc định mở toàn cầu (4000160443).
- Múi giờ: set ở My Profile > Other Settings, bắt buộc trước khi dùng countdown (4000175837).
- Referral AI (2024, chạy bằng credit 1/3/10/tháng, tặng 1 lần 3 credit): wizard 12 bước — template → brand (tên/website/màu) → **ngôn ngữ** → niche → top sản phẩm → audience → contact → AI sinh campaign + gợi ý grand prize (sửa được, "Get More") → upload ảnh → lịch (khuyên 2–3 tuần) + cách chọn winner → launch (4000203441).

### B2. Trang & editor
- Editor 3 view: **Desktop / Mobile / Widget**; ẩn/hiện từng element theo từng view bằng eye icon (4000179295, 4000179313).
- Element: Form (width 5 mức Min/Med/Max/Auto/Full; custom field thêm từ sidebar, tắt được field Name mặc định), Button (action "Open Pop-up" → tự dựng popup opt-in riêng), Video (YouTube/Vimeo; FullScreen/muted/autoplay), **Iframe** (nhúng Wistia/bất kỳ), Timer (**chỉ Business+**), Leaderboard (avatar **chỉ lấy Gravatar**, toggle "Show user avatar image"), **FB Optin** (đăng nhập Facebook chống email rác), Image/GIF, Text (toolbar đầy đủ + **Code View**), Block chia cột/nền (4000059109, 4000175564, 4000183793, 4000175837, 4000173530, 4000160226, 4000160264, 4000175465).
- **9 biến động chỉ dùng được trên share page**: `{{everyvisitor}} {{everysignup}} {{total_points}} {{pointsleft}} {{next_reward_points}} {{days_left}} {{campaign_end_date}} {{brandname}} {{companyname}}` (4000179297). Không có widget progress bar riêng — ghép từ biến.
- Share Message: title/description/image **tab riêng từng mạng**; tích hợp **Canva** thiết kế ảnh share ngay trong Setup (4000161831); FB cache ảnh → phải rescrape bằng Facebook Debugger (4000160227). **Khi share bằng nút UpViral, link demo UpViral tự gắn lên đầu post Facebook — không có setting gỡ** (4000176199).
- URL hosted: slug mặc định `lpXXXXXX`, đổi được trong Template Settings > Page Settings (4000166978). Favicon: cần **custom domain** trước, upload ≥32×32 (4000194232).
- Custom domain: **chỉ subdomain**, CNAME → app.upviral.com, SSL tự cấp 24–48h, kẹt thì xoá-thêm lại; **Referral Tracking Domain là field riêng** (mặc định rút gọn qua **upvir.al / sociali.io**) (4000059228, 4000160262, 4000168685).
- Người quay lại: nhận diện **bằng email đã đăng ký**, 2 toggle auto-redirect (đã đăng ký → share page; chưa → opt-in) (4000132033, 4000165897).
- T&C checkbox: 2 nguồn nội dung (Text nội bộ mở popup / URL ngoài) + toggle bắt buộc tick (4000160868).
- Nền khuyến nghị: share page 1920×1080, background 1330×650; chỉnh font-size riêng màn nhỏ; giới hạn thực tế **tối đa 7 kênh share/trang** (trang /editor).

### B3. Điểm
- 4 nguồn: Starting (khi submit form), Referral sign-up (cho chủ link khi lead mới vào qua link), Share per-network, Custom action. KB **không ghi** min/max hay mặc định (4000128949, 4000163450).
- Share: **bấm nút = có điểm ngay**, không verify (Facebook bỏ API từ lâu); khuyến nghị chính thức để 1 điểm; kéo-thả đổi thứ tự nút share, tick/untick từng mạng (4000191103, 4000165868). Email Share không gán điểm được (4000166048).
- Custom Actions: builder 3 phần Action–Content–Destination + URL đích + điểm + thiết kế button + **câu hỏi xác minh BẮT BUỘC** (nhiều đáp án, chọn đáp án đúng); không tự cộng điểm nếu chưa qua verify; bật/tắt giữa chừng làm nhiệm vụ giới hạn giờ (4000127817, 4000168684).
- Sửa điểm tay: lead detail chia **4 nhóm Signups / Visitors / Subscribers (= referrals) / Other**; xem breakdown từng nguồn; **không có log lịch sử sửa điểm** (4000160259, 4000170732).

### B4. Thưởng
- Incentives (mốc theo điểm) 4 loại: **Coupon** (2 chế độ: Multi-use 1 mã cho tất cả / Single-use nhập từng dòng — **không import CSV, không xử lý hết mã**), **File** (**max 5MB**), **Link to URL** (secret URL), **Other** (chỉ bắn email) (4000158740, 4000129712, 4000160173). Không ghi giới hạn số mốc.
- Grand Prize: 1 prize/campaign, **không tiered** ("not possible to have tiered grand prizes"); field: tên, số winner, ngày chọn, checkbox đóng campaign khi chọn xong, toggle disable; 3 cách chọn: Manually (mở tab Pick Winner) / Most Points Win / **At Random có trọng số điểm**; không có re-draw/disqualify chính thức (4000130124).
- Admin **mở khoá thưởng tay** được cho từng lead (manual reward unlock).

### B5. Lead & fraud
- Lead chỉ sửa được: điểm, unlock incentive, blacklist, đánh dấu winner, xoá — **không sửa được tên/email** (4000160230). Hồ sơ lead: danh sách referral (cả gian lận), dòng "referred by" (4000173257).
- **Không import CSV, không chuyển lead giữa campaign** — thay bằng **one-click registration link** (Promote > Auto-Invite Email List): 2 type (A vào thank-you / B vào màn share), merge tag theo từng ESP (`?uvemail=%EMAIL%&uvname=%NAME%`...), gắn `&ref_id=` để ghi công referrer (4000075972, 4000176086).
- Export: per-campaign (Selected/All, file lớn gửi qua email) + toàn tài khoản ở Other Settings (4000167117). GDPR: xoá lead theo email + cổng tự phục vụ **app.upviral.com/my-data/** (4000160230).
- Fraud 6 lớp (4000167118): ① CAPTCHA tự động mọi campaign, **không tắt được** — chỉ bypass bằng Whitelist IP (Other Settings > Whitelist) (4000165866); ② Fraud Detection (bật ở Lead Quality): lead khả nghi (nhiều email cùng IP/máy, email ảo, **referee cùng IP với referrer**) vào tab riêng — không vào list, không nhận email, không sync ESP; 3 nút xử lý Add/Delete/Blacklist Selected (4000160231, 4000160170); ③ Double opt-in — **lead chưa confirm KHÔNG được lưu, kể cả email** (4000075837); ④ Blacklist email+IP cấp tài khoản (4000160176); ⑤ **EmailListVerify** integration (API key riêng, custom error message); ⑥ **Facebook Login** element.
- KB **không công bố** ngưỡng same-IP, không có sensitivity setting, **không nói gì về trừ điểm referrer khi reject lead**.

### B6. Email & gửi
- 4 email + double opt-in (xem A2). **Referral Alert có option giới hạn số email** gửi mỗi referrer. Sender profile: Name/Email/Address, nhiều profile/campaign.
- Server riêng: Postmark (profile phải trùng Sender Signature, Server API Key) / SendGrid (API key) / Amazon SES (SMTP host + port 587) / mặc định server UpViral (4000075839...).
- **Ngưỡng treo email: bounce > 4% hoặc complaint > 0.05%** (chuẩn Amazon); user không tự xem được số liệu (4000172603). Không có bài SPF/DKIM.
- Editor email: HTML view, ảnh phải host ngoài, Send Test Email; biến cá nhân hoá có nhưng danh sách nằm trong ảnh KB (4000075838).

### B7. Tích hợp & API
- **~57 autoresponder** chính thức (ActiveCampaign, Aweber, ClickFunnels 2.0, ConvertKit, Drip, GetResponse, HubSpot, Infusionsoft, Intercom, Kartra, Klaviyo, MailChimp, MailerLite, Mautic, Omnisend, Ontraport, Sendy, Zoho... gồm cả webinar platform GoToWebinar/WebinarJam/Demio) (4000166269). Kết nối per-campaign, map custom fields + field đặc biệt **"Personal Invite Link"** đẩy sang ESP (4000057471). ESP lạ: "HTML Form" parse + map (4000160233).
- REST API: base `app.upviral.com/api/v1/`, **POST-only, 8 method** — add_contact (nhận referral_code, ip, custom_fields), get_lead_details (trả points, **fraud status**, referral link), get_leads, get_leads_points (operator so sánh), add_points, get_lead_details_by_email, get_custom_fields, lists. Auth `uvapikey` (sinh ở Other Settings). Rate limit không công bố (upviral.com/api).
- Webhook 1 event + Zapier 2 trigger/3 action (xem A6). Pabbly dùng chung Callback URL.

### B8. Analytics
- Reports: top bar (Leads/Visits, Referred/Ref Visits) + filter ngày; 4 ô (leads 15 ngày direct/referred, top 3 nguồn, top 5 services, email + % open); 4 tab phụ Traffic / Actions / Leads / Email + tab Split Test (4000161625).
- **UTM không hiện trong report — chỉ đẩy sang GA**; đo kênh nội bộ bằng **Custom Tracking Links** (keyword) (4000160236, 4000143624). "Compound Conversion Rate" = Total leads ÷ Direct visitors (4000160222).
- Tracking codes: 4 ô header/footer, **không hoạt động ở chế độ widget**; FB pixel bắn conversion khi lead rơi vào share page (URL `up.viral/thanks/...`); **không track purchase** (4000170731, 4000160228, 4000165867).
- Split test: **chỉ Business+**, 6 loại (Lead Capture / Share Page / Share Widget / Thank You / 2 loại email stats), chia random không đặt tỷ lệ, metric "chance to beat control" (4000075845). Reset số liệu: nút **Delete Analytics** (4000166936). Không export file báo cáo (chỉ Print).

### B9. Giá & gói (đối chiếu 2 nguồn)
- Pricing page: Starter $99 / Business $149 / Premium $399 (năm −20%); lead cap cứng 10k/25k/100k; custom domain + email identity 1/2/5; AI credit 1/3/10 tháng (yearly 12/36/120); Universal Capture, geo, API/Zapier, split-test từ Business; badge gỡ được từ Business; trial $1/14 ngày; hoàn tiền 30 ngày. Giá gạch $159/$259/$649; bonus stack "$2.882" (10 template dựng sẵn + 5 khoá training + community).
- ⚠️ Bài KB cập nhật 01/2025 (4000213628) ghi "entry-level $49/month" — mâu thuẫn, khả năng giá annual/legacy. Affiliate của UpViral: 50% đơn đầu + 30% recurring.

### B10. Công ty & tình trạng phát triển
- Founder **Wilco de Kreij** (Emarky, Hà Lan) launch 2015; **đã bán UpViral ~12/2023** (môi giới FE International, buyer không công bố). Sau đổi chủ: Referral AI (02/2024), redesign 2025, nhưng **changelog công khai chết từ 02/2020**, blog dừng ~04/2025 → chế độ "cash-cow + 1 cú relaunch AI".
- Quy mô claim: 32.600 businesses, 72,7M leads. Capterra 4.9/5 (~100 review). RafflePress chấm B-.

---

## C. NHỮNG THỨ UPVIRAL KHÔNG CÓ (đã xác minh)

Broadcast/mass email · segment/scheduling email · import CSV lead · chuyển lead giữa campaign · sửa tên/email lead · log sửa điểm · thưởng hai chiều · tiered grand prize · re-draw/disqualify winner · track purchase/doanh thu · K-factor · UTM trong report nội bộ · export file báo cáo · daily/recurring actions · entry code · SMS · team seats/phân quyền · 2FA · mobile app · status page · native Shopify/WooCommerce · affiliate ID pass-through · verify share thật · gỡ link demo UpViral khỏi post FB share · điểm cho Email Share · xử lý hết kho coupon · start-date độc lập · custom CSS/JS tự do.

**Đối thủ có mà UpViral không**: 90+ entry methods đa nền tảng (Gleam: IG/TikTok/Discord/Twitch) · SMS entry/verify/notify (KickoffLabs, ReferralHero) · thưởng theo đơn hàng thật trên Shopify (KickoffLabs, ReferralHero) · multi-step conversion events — UpViral bị chỉ đích danh "max 3 events, chỉ track sign-up" (ReferralHero) · two-sided + revenue rewards + K-factor + network analysis (ReferralHero) · white-label từ gói rẻ nhất (ReferralHero) · pricing co giãn + 1:1 onboarding (KickoffLabs) · template playbook theo tên công ty Dropbox/Airbnb (Viral Loops).

---

## D. PLAYBOOK TỪ 54 CASE STUDY CHÍNH THỨC

Pattern lặp lại: **giải từ chính sản phẩm** (tự lọc đúng audience) → **custom action điểm cao để điều hướng/pre-qualify** → **flash-sale cho người không trúng ngay sau công bố** → đo doanh thu 60 ngày.

1. **Bataleon (snowboard)**: 3 campaign chia THEO VÙNG trao giải riêng; CPL €0,20; custom action follow TikTok/YouTube + ghé trang sản phẩm → 30.791 leads, flash sale 20% → ~€34k.
2. **Bunkie Life (nhà gỗ $9.000)**: **18 custom actions** — "Trả lời bảng khảo sát" 300đ để **PRE-QUALIFY người có đất/ý định mua**, "Tải brochure" 150đ, "Xem video" 100đ/tập; công bố winner qua **livestream** + mở sale giảm $1.000 cho người không trúng → 180,6k leads, **$1,5M doanh số**.
3. **Sew Much Easier (đồ may)**: **giveaway ĐỊNH KỲ HÀNG THÁNG từ 2015** — clone campaign, mỗi tháng chỉ đổi quà + copy; giải $200–300 từ tồn kho; FB ads $10–20/ngày → 94.601 leads tích luỹ, tỉ trọng doanh thu từ email 9,6% → 23,6%.
4. **Friendly Rugs (thảm)**: coupon bậc thang theo điểm $10/$20/$40; custom action "Khám phá bộ sưu tập" đẩy 1.352 visit trang sản phẩm; **tự chế thưởng $100 cho NGƯỜI GIỚI THIỆU ra winner** → 30% lead từ referral, $4.775 doanh số từ business mới tinh.
5. **iSTYLE (3 MacBook Air/10 ngày)**: bắt tay influencer — widget nhúng trên site influencer + IG stories; follow Instagram 9đ × 3 tài khoản; form lấy SĐT → 12.677 leads (26% referred).

---

## E. ĐỐI CHIẾU VỚI PHƯƠNG ÁN MGM MAX — đề xuất bổ sung (chờ anh duyệt)

Đối chiếu từng dòng với [phuong-an-tinh-nang.md](phuong-an-tinh-nang.md):

### E1. Phương án ĐÃ phủ và cố ý làm KHÁC (giữ nguyên)
- Mốc quà theo **số referral xác minh** (UpViral theo điểm) — giữ, đây là khác biệt có chủ đích chống lạm phát điểm.
- Điểm share 2 tầng "bấm nút + click thật" — **hơn hẳn** cơ chế bấm-là-có-điểm của UpViral; giữ.
- Thưởng hai chiều, nhiều giải leaderboard, seed log bốc thăm, K-factor, sổ cái điểm có log (UpViral sửa điểm không log), double opt-in, hàng cách ly fraud — đều đã có và đều hơn UpViral.

### E2. Đề xuất BỔ SUNG vào phương án (đánh số để anh duyệt)

| # | Tính năng học từ quét sâu | Đề xuất | Lý do |
|---|---|---|---|
| B1 | **Nhận diện người quay lại → vào thẳng share page** (cookie/email) | **MVP** | UX cốt lõi của vòng lặp; UpViral làm bằng email, mình làm cookie + email |
| B2 | **Bộ biến động trên share page + email** (`{{diem}} {{con_thieu}} {{qua_ke_tiep}} {{ngay_con_lai}}`…) | **MVP** | Rẻ, tăng cá nhân hoá mọi template |
| B3 | **Coupon 2 chế độ: dùng chung / dùng một lần** (phương án mới có single-use) | **MVP** | 1 field thêm, phủ ca "mã GIAM20 cho tất cả" |
| B4 | Quà loại **"Khác"** (chỉ bắn email thông báo, admin tự xử) | **MVP** | Rẻ, phủ quà vật lý/dịch vụ |
| B5 | **Đếm ngược (countdown)** trên trang cho campaign bốc thăm | **MVP** | Đòn urgency chuẩn; UpViral khoá sau Business |
| B6 | **Whitelist IP** cho admin tự test không dính rate-limit/captcha | **MVP** | Nhỏ nhưng thiếu là khổ khi vận hành |
| B7 | **Import lead CSV + chuyển lead giữa campaign** | **P2** | UpViral KHÔNG làm được cả hai — điểm vượt rõ ràng |
| B8 | **Nút "Mời qua email" gửi từ server** (track + gán điểm được) | P2 | UpViral bó tay (mở mail client); mình làm được vì tự chủ hạ tầng |
| B9 | **Clone campaign** | P2 | Playbook "giveaway định kỳ hàng tháng" (case Sew Much Easier) cần nó |
| B10 | **Custom tracking links** (link nguồn cho ads/đối tác, ngoài `?ch=`) | P2 | Đo được nguồn trả phí vs organic |
| B11 | **Webhook nhiều event** (lead.verified, referral.verified, milestone.reached, reward.granted) + API đủ CRUD | P2 | UpViral chỉ có 1 event — vượt dễ dàng; đã có sẵn trong phương án, giờ chốt danh sách event |
| B12 | **Đăng nhập Zalo/Google** thay FB Optin để chống email rác | P2 | Phiên bản VN của lớp fraud thứ 6 |
| B13 | Tích hợp **dịch vụ verify email** (kiểu EmailListVerify) | P2 | Đã có disposable-list ở MVP; đây là nâng cấp |
| B14 | **Cổng tự phục vụ xoá dữ liệu** (kiểu my-data) | P2 | Tuân thủ NĐ13 trọn vẹn |
| B15 | **Giải cho người giới thiệu ra winner** ("bạn mời trúng → bạn cũng có quà") | P2 | Playbook Friendly Rugs tự chế — mình làm thành tính năng |
| B16 | **Nhiệm vụ giới hạn giờ** (bật/tắt custom action theo lịch) | P2 | "Nhiệm vụ flash" tạo sóng giữa campaign |
| B17 | **Câu hỏi khảo sát pre-qualify** làm custom action điểm cao, kết quả hiện trong hồ sơ lead | P2 | Playbook Bunkie Life — lọc lead mua thật cho khoá học |
| B18 | Trang đóng có tuỳ chọn **redirect URL** | P2 | 1 dòng cấu hình |

### E3. Bẫy vận hành cần né ngay từ thiết kế (bài học từ giới hạn của UpViral)
1. **Đừng khoá "hosting method"**: UpViral bắt chọn hosted/embed rồi không đổi được — MGM MAX thiết kế trang và widget cùng đọc một cấu hình campaign để đổi qua lại tự do.
2. **Email "from" phải là domain của mình từ ngày đầu** (SPF/DKIM chuẩn) — đừng lặp lại vụ info@upviral.com.
3. **Theo dõi bounce/complaint và tự hiển thị cho admin** — UpViral treo email ở bounce 4%/complaint 0,05% mà user không tự xem được số liệu.
4. **File quà đừng giới hạn 5MB** — dùng object storage + signed URL ngay từ đầu.
5. **Log mọi lần sửa điểm tay** (UpViral không log) — sổ cái điểm của phương án đã giải quyết sẵn.
6. **Đừng gắn quảng cáo hệ thống vào nội dung share của người dùng** (UpViral tự chèn link demo lên post FB, không gỡ được — bị ghét đúng).

---

*Nguồn: support.upviral.com (mã bài dẫn trong ngoặc) · upviral.com/api · zapier.com/apps/upviral · upviral.com (sitemap, /features, /editor, /examples, /pricing, /full-overview, /case-studies, /compare) · pitiya.com, rafflepress.com, monkmarketers.com (03/2026), referralhero.com/vs/upviral-alternative, gleam.io · LinkedIn Wilco de Kreij, wilco.io/review-2023, headwayapp.co/upviral-updates.*
