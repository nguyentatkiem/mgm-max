# Danh sách tính năng UpViral — bản duyệt đợt 2

> Đối chiếu TOÀN BỘ tính năng UpViral (theo [quet-sau-upviral.md](quet-sau-upviral.md)) với MGM MAX v0.1 hiện tại.
> Cột **Trạng thái**: ✅ đã có · 🟡 có một phần · ⬜ chưa có.
> Cột **Đề xuất**: ⭐ nên làm đợt 2 · 💡 đáng cân nhắc · ➖ bỏ qua (kèm lý do).
> **Cách duyệt**: anh chỉ cần trả lời số, ví dụ "làm F1–F8, F12, bỏ F30".

---

## NHÓM 1 — Trang & giao diện chiến dịch

| # | Tính năng (UpViral) | Trạng thái MGM MAX | Đề xuất |
|---|---|---|---|
| **F1** | **Tuỳ biến trang opt-in per campaign**: ảnh cover/banner, màu chủ đạo, logo, nội dung khối quà, video giới thiệu (YouTube embed) | ⬜ trang hiện cố định 1 kiểu xanh, chỉ đổi tên + mô tả | ⭐ Quan trọng nhất về "độ nhìn thấy được" — mỗi chiến dịch một bộ mặt riêng |
| **F2** | **Thư viện template trang** (UpViral có 8 lead page + 8 share page) + lưu template tái dùng | ⬜ | 💡 Sau F1 — F1 làm dạng cấu hình là đủ giai đoạn này |
| **F3** | **Widget nhúng vào website có sẵn**: form inline (iframe), popup, slide-in góc màn hình | ⬜ chỉ có trang hosted | ⭐ Cần cho người đã có website/landing riêng |
| **F4** | **Universal Capture / Connect Your Own Form**: dùng form của chính mình, data đi song song 2 nơi | ⬜ | 💡 Sau F3 (F3 phủ 80% nhu cầu) |
| **F5** | **Share message riêng từng mạng** (tiêu đề + mô tả + ảnh OG per kênh) + meta OG per campaign | ⬜ lời mời hiện là 1 câu chung | ⭐ Ảnh hưởng trực tiếp CTR lời mời |
| **F6** | **Ảnh OG cá nhân hoá** (preview có tên người mời) | ⬜ | 💡 Đòn tâm lý hay, làm sau F5 |
| **F7** | **Custom fields trên form** (SĐT, dropdown, checkbox…) + truyền sang export/API | ⬜ form hiện chỉ tên + email | ⭐ Bán khoá học rất cần SĐT |
| **F8** | **T&C checkbox cấu hình được** (nội dung text/URL riêng per campaign) | 🟡 checkbox có, nội dung cố định | 💡 Nhẹ, gộp làm cùng F1 |
| **F9** | Countdown timer trên trang | ✅ đã có (opt-in + share page) | — |
| **F10** | Trang campaign đã đóng: default/custom/redirect | ✅ đã có (default + redirect) | — |
| **F11** | **Nhận diện người quay lại** → vào thẳng share page (không phải điền form lại) | 🟡 qua email nhận link; cookie chưa tự nhận | ⭐ 1 cookie là xong, UX đáng giá |
| **F12** | Custom domain + favicon per campaign | ⬜ đang chạy trycloudflare | ➖ Chỉ có ý nghĩa khi deploy domain thật — để giai đoạn production |
| **F13** | Đa ngôn ngữ giao diện participant | ⬜ toàn tiếng Việt | ➖ Thị trường VN — chưa cần |

## NHÓM 2 — Kích hoạt & nguồn lead

| # | Tính năng | Trạng thái | Đề xuất |
|---|---|---|---|
| **F14** | **One-click signup link cho list email CÓ SẴN** (bấm link trong email là vào thẳng share page, mã sinh sẵn — vũ khí kích hoạt học viên cũ của UpViral) | ⬜ | ⭐ ROI cao nhất với người đã có danh sách học viên |
| **F15** | **Import lead từ CSV** (kèm gán người mời) — UpViral KHÔNG làm được | ⬜ | ⭐ Điểm vượt UpViral, cần cho F14 |
| **F16** | Thêm lead thủ công từng người (admin) | ⬜ | 💡 Gộp làm cùng F15 |
| **F17** | Chuyển lead giữa 2 chiến dịch — UpViral không làm được | ⬜ | 💡 Hữu ích khi chạy chiến dịch nối tiếp |
| **F18** | **Broadcast email cho toàn bộ participant** (nhắc giữa chiến dịch, thông báo kết quả) — UpViral KHÔNG có | ⬜ | ⭐ Điểm vượt UpViral, hạ tầng email queue đã sẵn |

## NHÓM 3 — Điểm & nhiệm vụ

| # | Tính năng | Trạng thái | Đề xuất |
|---|---|---|---|
| **F19** | Hệ điểm 4 nguồn cấu hình per campaign | ✅ (còn hơn UpViral: click thật có trần/ngày) | — |
| **F20** | Custom actions + câu hỏi xác minh | ✅ | — |
| **F21** | **Nhiệm vụ có thời hạn** (tự bật/tắt theo lịch — "nhiệm vụ flash 24h") | 🟡 bật/tắt tay đã có | 💡 Thêm 2 cột thời gian là xong |
| **F22** | **Hành động lặp theo ngày / chuỗi ngày (streak)** — Gleam có, UpViral không | ⬜ | 💡 Điểm vượt, hợp campaign dài |
| **F23** | Sửa điểm tay + breakdown điểm từng người | ✅ (hơn UpViral: có log lý do) | — |

## NHÓM 4 — Quà & giải

| # | Tính năng | Trạng thái | Đề xuất |
|---|---|---|---|
| **F24** | Mốc quà tự động + 4 loại quà + kho coupon | ✅ | — |
| **F25** | Thưởng hai chiều | ✅ (UpViral không có) | — |
| **F26** | **Chọn winner 3 cách: bốc thăm trọng số / nhiều điểm nhất thắng / admin chỉ định tay** | 🟡 mới có bốc thăm trọng số | ⭐ Thêm 2 cách còn lại + nhiều giải theo hạng leaderboard (top 1/2/3 quà khác nhau — UpViral cũng không có) |
| **F27** | **Hẹn giờ tự chốt giải + tự đóng campaign** đúng ngày kết thúc | ⬜ đang bấm tay | ⭐ Chiến dịch bốc thăm cần chạy tự động |
| **F28** | **Admin mở khoá quà tay cho 1 người** (manual reward unlock) | ⬜ | 💡 Nhỏ, tiện xử ngoại lệ |
| **F29** | Tuỳ chọn mốc theo ĐIỂM (thay vì chỉ theo số bạn xác minh) per campaign | ⬜ | 💡 Cho campaign thiên về nhiệm vụ |
| **F30** | Giải cho người giới thiệu ra winner ("bạn mời trúng → bạn cũng có quà") | ⬜ | 💡 Đòn playbook hay |
| **F31** | Instant win (cào trúng ngay) | ⬜ UpViral cũng chỉ nói marketing | ➖ Không đáng |

## NHÓM 5 — Chống gian lận

| # | Tính năng | Trạng thái | Đề xuất |
|---|---|---|---|
| **F32** | Double opt-in, chấm điểm rủi ro, cách ly duyệt tay, chặn tự giới thiệu, rate-limit IP, email rác | ✅ | — |
| **F33** | **CAPTCHA tự bật khi nghi ngờ** (đăng ký lặp cùng IP/trình duyệt) | ⬜ | ⭐ Lớp chặn bot rẻ mà hiệu quả (dùng Cloudflare Turnstile, miễn phí) |
| **F34** | Blacklist IP (đã có blacklist email) | 🟡 | ⭐ Nhẹ, làm cùng F33 |
| **F35** | Tích hợp verify email chuyên dụng (kiểu EmailListVerify) | ⬜ | ➖ Trả phí bên thứ ba — double opt-in đang gánh tốt |
| **F36** | Đăng nhập Google/Zalo thay email (chống email ảo triệt để) | ⬜ | 💡 Google OAuth làm được ngay; Zalo cần đăng ký app |

## NHÓM 6 — Email

| # | Tính năng | Trạng thái | Đề xuất |
|---|---|---|---|
| **F37** | 6 email tự động + sửa mẫu per campaign + hàng đợi retry | ✅ | — |
| **F38** | **Email nhắc người im ắng** (3/7 ngày không hoạt động, kèm "bạn đang #12, cách top 10 chỉ 30đ") | ⬜ | ⭐ Email ra tiền nhất giữa chiến dịch |
| **F39** | **Gộp digest email "mời thành công"** khi 1 người mời dồn dập (giới hạn kiểu Referral Alert limit) | ⬜ hiện mỗi referral 1 email | ⭐ Chống spam hộp thư người chơi |
| **F40** | SMTP/provider riêng nhiều lựa chọn (SES/Postmark/SendGrid) | 🟡 mới có Resend + giả lập | 💡 Thêm SMTP generic khi cần |
| **F41** | A/B test tiêu đề email | ⬜ | ➖ Để sau khi có số lượng thật |

## NHÓM 7 — Đo lường & tích hợp

| # | Tính năng | Trạng thái | Đề xuất |
|---|---|---|---|
| **F42** | Dashboard K-factor + phễu + kênh + top influencers + CSV | ✅ (UpViral không có K-factor) | — |
| **F43** | **Biểu đồ theo ngày + bộ lọc khoảng thời gian** (lead/ngày, tách direct vs referral) | ⬜ chỉ có số tổng | ⭐ Nhìn nhịp chiến dịch mới điều hành được |
| **F44** | **Webhook sự kiện** (lead.xac_minh, moc.mo, qua.trao, trung_giai) — UpViral chỉ có đúng 1 event | ⬜ | ⭐ Cửa ngõ nối LMS/CRM/Zapier — điểm vượt dễ |
| **F45** | **REST API** (thêm lead, lấy danh sách, cộng điểm — UpViral có 8 method) | ⬜ | 💡 Làm sau F44 (webhook phủ trước) |
| **F46** | Tracking pixel/GA per campaign + custom tracking links cho ads | ⬜ | 💡 Khi bắt đầu đổ quảng cáo |
| **F47** | A/B test trang opt-in/share | ⬜ | ➖ Đợt sau — cần traffic thật mới có ý nghĩa |
| **F48** | ESP sync trực tiếp (Mailchimp/Klaviyo…) | ⬜ | ➖ CSV + webhook (F44) phủ đủ |
| **F49** | Auto-enroll khoá học qua webhook khi đạt mốc (điểm vượt đã ghi trong phương án) | ⬜ | 💡 Dạng riêng của F44 — cần biết LMS anh dùng |

## NHÓM 8 — Hệ thống & AI

| # | Tính năng | Trạng thái | Đề xuất |
|---|---|---|---|
| **F50** | Clone campaign, campaign đa trạng thái | ✅ | — |
| **F51** | **Referral AI** (khai brand/niche/audience → AI sinh trọn chiến dịch: quà gợi ý, copy trang, 6 email) — tính năng đinh của UpViral 2.0 | ⬜ | 💡 Làm được bằng Claude API — khác biệt lớn nếu anh định thương mại hoá |
| **F52** | Geo-restriction theo vùng/quốc gia | ⬜ | ➖ Chạy nội địa VN |
| **F53** | Team nhiều admin + phân quyền | ⬜ | ➖ Một mình anh vận hành — để khi có đội |
| **F54** | Xuất/nhập cấu hình campaign giữa tài khoản | ⬜ | ➖ Clone đã đủ |
| **F55** | GDPR/NĐ13: cổng tự xoá dữ liệu + admin xoá lead | 🟡 có chặn, chưa có xoá | 💡 Thêm nút xoá lead là mức tối thiểu |
| **F56** | SMS entry/notify (KickoffLabs/ReferralHero có) | ⬜ | ➖ Chi phí SMS VN cao, email + Zalo đủ |
| **F57** | Thưởng theo đơn hàng thật (purchase tracking) | ⬜ | ➖ Cần nối cổng thanh toán — giai đoạn bán hàng thật |

---

## 🎯 Gói đề xuất "Đợt 2" (14 mục ⭐, ước ~2–3 phiên làm việc)

**Trang & lead**: F1 (tuỳ biến trang per campaign) · F3 (widget nhúng) · F5 (share message per kênh) · F7 (custom fields/SĐT) · F11 (nhận diện quay lại) · F14 (one-click link list cũ) · F15 (import CSV) · F18 (broadcast email)

**Giải & vận hành**: F26 (3 cách chọn winner + giải theo hạng) · F27 (hẹn giờ tự chốt)

**Chống gian lận & email**: F33+F34 (captcha + blacklist IP) · F38 (nhắc người im ắng) · F39 (digest)

**Đo & nối**: F43 (biểu đồ theo ngày) · F44 (webhook sự kiện)

Anh duyệt theo số (thêm/bớt tuỳ ý), tôi làm theo đúng danh sách chốt.
