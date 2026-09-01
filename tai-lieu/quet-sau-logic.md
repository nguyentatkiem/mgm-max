# MGM MAX — Quét sâu logic toàn bộ tính năng (01/09/2026)

> Chạy 9 agent review song song mức `max` trên `src/`. Dưới đây là các phát hiện đã gom nhóm, khử trùng lặp, xếp theo mức độ. **Chưa sửa — chờ duyệt.**

## ✅ KẾT QUẢ CHẠY THỬ THẬT (01/09/2026)

Đã chạy thử end-to-end thật (không phải lý thuyết):

**Luồng nghiệp vụ — ĐÚNG 100%** (curl thật + kiểm DB): A đăng ký → xác minh → B đăng ký qua link A → xác minh. Kết quả: A tổng **132 điểm** đúng từng nguồn (10 đăng ký + 100 mời + 5 share + 2 click + 15 nhiệm vụ); mốc 1 bạn tự trao coupon `GIAM20-C3D4`; B nhận quà chào mừng hai chiều `WELCOME10`; share lần 2 chặn đúng (idempotent/ngày); đáp án nhiệm vụ sai chặn đúng; captcha tự bật khi IP vượt ngưỡng.

**Nút bấm admin — 18/18 PASS** (Playwright click thật + kiểm DB): đăng nhập · wizard 2 bước tạo chiến dịch · đổi tên inline · thêm mốc quà (hiện ngay không cần F5 — `force-dynamic` che được bug revalidate) · nạp coupon · lưu cấu hình điểm · lưu thưởng giới thiệu · lưu giải đặc biệt · thêm nhiệm vụ · toggle email · editor lưu (nút cam) · **CHẠY CHIẾN DỊCH** · 6 mục Báo cáo · 4 tab Người tham gia · chạy bốc thăm · xoá chiến dịch.

**Bảo mật — đã XÁC NHẬN THẬT bằng tấn công:**
- 🔴 C1 `/nhanh` — 5 bot cùng IP → điểm người mời nhảy **132→632**, **0 bị cách ly**. LỖ HỔNG THẬT.
- 🔴 C2 `/api/cron` ẩn danh → HTTP 200, chạy được. LỖ HỔNG THẬT.
- 🔴 C3 `popup.js` — payload `alert(document.domain)` lọt nguyên vào JS. XSS THẬT.
- 🔴 C4 `base_url` poisoning — email xác minh nạn nhân trỏ `http://evil-phishing.com` (đã khôi phục sau test). LỖ HỔNG THẬT.
- 🔴 C6 campaign `tam_dung` vẫn cộng điểm share (`congDiem:true`). LỖ HỔNG THẬT.
- 🔴 C7 nhiệm vụ đáp án rỗng → `dung:true`, +50 điểm miễn phí. LỖ HỔNG THẬT.
- ✅ C5 admin auth CHẶT: `/admin` chưa login → 307 về đăng nhập; `/api/admin/csv` → 401.

→ 6 lỗ hổng 🔴 (mục 1–7 dưới) **đã kiểm chứng bằng khai thác thật**, không còn là nghi ngờ. Dữ liệu test đã dọn sạch, campaign demo nguyên vẹn.

## 🛡️ ĐÃ VÁ TOÀN BỘ 6 LỖ HỔNG 🔴 (01/09/2026, xác nhận bằng tấn công lại)

- **C1 `/nhanh`** → bắt buộc **token campaign** (HMAC, chỉ admin phát trong link one-click) + giới hạn IP/ngày. *Kiểm: gọi không token tạo 0 bot; token đúng vẫn hoạt động.* Đồng thời sửa `dangKyNhanh` trao đủ điểm đăng ký + quà chào mừng + công nhận referral (finding #9).
- **C2 `/api/cron`** → bắt buộc `CRON_SECRET` (query `?key=` hoặc `Authorization: Bearer`). *Kiểm: không/sai key → 401, đúng key → 200.* Cron nội bộ (instrumentation) gọi thẳng hàm nên không ảnh hưởng.
- **C3 `popup.js`** → validate `slug` `^[a-z0-9-]+$` + lọc host. *Kiểm: payload `alert(document.domain)` không còn lọt.*
- **C4 base_url poisoning** → link trong email dùng `baseUrlTinCay` (env `APP_BASE_URL` → base_url admin đặt trong Cài đặt → localhost), **không bao giờ lấy từ header**; bỏ mọi `ghiCaiDat("base_url")` từ luồng người dùng. *Kiểm: header `evil-phishing.com` không còn vào link email.*
- **C6 cộng điểm khi campaign đóng** → `chia-se` / `hanh-dong` / `r/[ma]` đều chặn khi `trang_thai≠'chay'` (và người bị chặn / chưa xác minh). *Kiểm: campaign tạm dừng → `congDiem:false`.*
- **C7 nhiệm vụ đáp án rỗng** → chặn cả khi tạo (`actThemHanhDong` bắt buộc đáp án) lẫn khi chấm (đáp án rỗng luôn `dung:false`). *Kiểm: `{dung:false, loi:"Nhiệm vụ chưa cấu hình đáp án."}`.*
- Bonus: `req.json()`/`JSON.parse` bọc try/catch (body rác → 200 thay vì 500); quà chào mừng idempotent (chống nhân đôi khi verify 2 lần).

Cần khi deploy thật: đặt `CRON_SECRET`, `APP_BASE_URL` (hoặc điền URL công khai trong Cài đặt hệ thống).

---

## 🔴 NGHIÊM TRỌNG — vá trước khi chạy thật

### 1. `/nhanh/[slug]` — endpoint công khai bỏ qua TOÀN BỘ chống gian lận
`GET /nhanh/{slug}?email=bất-kỳ&ref=MÃ` tạo ngay một người "đã xác minh" và **cộng điểm mời cho chủ mã** — không double opt-in, không rate-limit IP, không captcha, không chấm điểm rủi ro, không cách ly. Mã giới thiệu của bất kỳ ai đều lộ công khai trong link `/r/MÃ`. Kẻ xấu chỉ cần `curl` vòng lặp `?email=a1@x.com&ref=MÃ`, `a2@...`, … là **tự bơm điểm → tự thắng bốc thăm (mỗi điểm = 1 vé) + rút cạn kho coupon**. Đây là link one-click (F14) tôi định làm cho "list email có sẵn" nhưng để hở dạng GET công khai không ký.
→ Cần: ký HMAC token cho link one-click (chỉ admin phát), hoặc bắt buộc đi qua double opt-in + chấm rủi ro như luồng thường.

### 2. `/api/cron` không có xác thực
Bất kỳ ai `GET /api/cron` đều chạy được: **đóng sớm mọi campaign quá hạn, chạy bốc thăm sớm (đúng thời điểm kẻ xấu chọn), xả tối đa 100 email/lần** (đốt quota Resend). Trong khi `/api/admin/csv` thì có `laAdmin()`.
→ Cần: `CRON_SECRET` trong header, hoặc chỉ cho chạy nội bộ.

### 3. `popup.js` — XSS chèn mã vào mọi website nhúng
`slug` nhét thẳng (không escape) vào chuỗi JS phục vụ. Gọi `/nhung/a'-alert(document.domain)-'b/popup.js` là chèn được mã chạy trên **mọi site khách nhúng script**.
→ Cần: validate slug `^[a-z0-9-]+$` và encode trước khi nội suy.

### 4. Đầu độc `base_url` qua header giả
Mỗi lần đăng ký, hệ lưu `base_url` dựng từ header `x-forwarded-host` (client điều khiển được). Một request giả `X-Forwarded-Host: evil.com` khiến **link xác minh gửi cho nạn nhân trỏ về evil.com** (bắt token = chiếm trang) và **đầu độc link trong mọi email cron gửi cho toàn bộ người tham gia**.
→ Cần: chốt base_url bằng biến môi trường (allow-list host), không tin header.

### 5. Phiên admin: token cố định, không timing-safe, đăng xuất không vô hiệu hoá
Cookie phiên = `HMAC(mật_khẩu, "mgm-admin-phien")` — **giống nhau mọi phiên, sống vĩnh viễn** tới khi đổi mật khẩu; `actDangXuat` chỉ xoá cookie phía client. Ai bắt được cookie 1 lần là vào admin mãi. So sánh `===` không timing-safe.
→ Cần: session có hạn + nonce ngẫu nhiên lưu server, `crypto.timingSafeEqual`.

### 6. Các API cộng điểm không kiểm trạng thái chiến dịch (và `/r` không kiểm xác minh)
`/api/chia-se`, `/api/hanh-dong`, `/r/[ma]` vẫn cộng điểm **sau khi campaign đã đóng/tạm dừng** (kể cả sau khi cron tự đóng) → lệch bảng xếp hạng & vé bốc thăm sau ngày kết thúc. Riêng `/r/[ma]` cộng điểm click cho cả tài khoản **chưa xác minh**, điểm "kích hoạt" khi họ verify sau này.
→ Cần: một cửa chung trong `services/diem.ts` — chặn khi `trang_thai != 'chay'` hoặc `chan` hoặc `!xac_minh`.

### 7. Nhiệm vụ có đáp án rỗng = cộng điểm miễn phí
`traLoi.trim() === dap_an.trim()` với `dap_an=''` → nộp rỗng là đúng. Admin lỡ tạo nhiệm vụ quên đáp án là ai cũng lấy điểm.
→ Cần: chặn lưu nhiệm vụ đáp án rỗng + từ chối chấm khi đáp án rỗng.

## 🟠 LỖI ĐÚNG ĐẮN NGHIỆP VỤ

### 8. Hết coupon → mất quà vĩnh viễn
Khi kho mã cạn, `traoQuaMoc` vẫn ghi `qua_da_trao` với chuỗi placeholder → mốc bị đánh dấu "đã trao". Admin nạp thêm mã cũng **không bao giờ trao lại** (mốc đã bị lọc là đã trao).
→ Cần: không ghi qua_da_trao khi hết mã; để mốc "đang chờ", cron trao lại khi có mã.

### 9. `dangKyNhanh` (one-click/import) làm mất điểm + referral + quà chào mừng
Nếu người đó đã đăng ký thường (chưa verify, đang có referral chờ), rồi bị import/one-click: hệ chỉ flip `xac_minh=true` mà **bỏ cộng điểm đăng ký + bỏ công nhận referral cho người mời** (referral kẹt "chờ" mãi). Cũng là đường bypass double opt-in. Ngoài ra `dangKyNhanh` **không trao quà chào mừng hai chiều** dù campaign có bật — cùng một người được mời, có quà hay không tuỳ vào đi bằng đường nào.

### 10. Bốc thăm "theo hạng" không lọc điểm > 0
Nhánh `diem_cao` lấy top N bất kể điểm, nên người **0 hoặc âm điểm vẫn trúng Nhất/Nhì/Ba** (nhánh trọng số thì lọc đúng).

### 11. Biểu đồ theo ngày lệch múi giờ
`theoNgay` gom theo `tao_luc::date` giờ UTC, còn điểm share/click dùng giờ VN → sự kiện 0–7h sáng VN bị đếm sang ngày hôm trước.

### 12. `datetime-local` trôi 7 giờ mỗi lần lưu
Ô hạn chót prefill bằng `toISOString()` (UTC) nhưng lưu theo giờ server → **mở ra lưu lại là deadline dịch 7 tiếng**, cron đóng campaign + bốc thăm sai giờ. Dính cả trang "Tuỳ chọn chung" lẫn "Giải đặc biệt".

### 12b. Vài lỗi im lặng (không báo gì cho admin)
- **Chỉ định winner sai email**: `actChiDinhWinner` bỏ qua kết quả null → gõ nhầm email không phải người xác minh thì **không tạo gì, không báo lỗi**, admin tưởng đã chỉ định xong.
- **Link nguồn `/t/[cd]/[keyword]`**: route lưu keyword thô, còn `actThemNguon` chuẩn hoá về thường + gạch nối → ghé qua `/t/5/FB%20Ads` không khớp `fb-ads` khi thống kê → **lượt ghé/đăng ký của nguồn đó bị mất khỏi báo cáo**.

### 13. Vài chỗ không try/catch → lỗi 500 thô
`req.json()` (chia-se, hanh-dong), `JSON.parse(preset)` (wizard), `unique(email)` khi double-submit đăng ký, `cd` null ở `/toi/[ma]`, insert-retry cạn lượt (`nguoiId=0` vi phạm khoá ngoại).

### 14. Rủi ro vận hành
- **Prod quên `RESEND_API_KEY`** → mọi email âm thầm "giả lập", báo thành công mà **không ai nhận được** (cả link xác minh). Cần chặn: nếu `NODE_ENV=production` mà thiếu key thì báo lỗi rõ.
- **Webhook** không ký HMAC (bên nhận không phân biệt thật/giả) + chèn được host nội bộ (SSRF `169.254.169.254`).
- **CSV** không chặn ký tự công thức (`=`, `+`, `@`) → công thức chạy khi admin mở Excel.

## 🟡 ĐUA/KHOÁ (race conditions — hiếm nhưng hại)

- **duyetBocTham / chayBocTham**: check-rồi-act không khoá → 2 lần bấm (hoặc cron trùng) tạo **2 lượt bốc thăm / trao giải & gửi email 2 lần**.
- **xuLyHangDoi**: chọn email `cho` rồi mới đánh dấu `da_gui` sau khi gửi, không `FOR UPDATE SKIP LOCKED` → 2 worker gửi trùng.
- **xacMinh double-verify**: quà chào mừng hai chiều không có khoá idempotent → nhân đôi quà + email.
- **instrumentation cron** không có guard `globalThis` → dev/nhiều worker chạy chồng nhiều vòng cron.
- **pool `pg` không có listener `error`** → Postgres restart là **sập cả tiến trình** thay vì query đơn lẻ lỗi.

## 🔵 HIỆU NĂNG (khi quy mô lớn)

- **`bangXepHang` không LIMIT** + 3 subquery tương quan mỗi dòng, **chạy mỗi lần xem trang `/toi/[ma]`** (trang nóng nhất). 10k người → mỗi lượt xem kéo 10k dòng + ~30k subplan, render nhiều giây.
- **Thiếu index**: `gioi_thieu(nguoi_moi_id)` (cột nóng nhất), `hang_doi_email(trang_thai)` + `(den_email,loai,tao_luc)`.
- **cron** gọi `bangXepHang` tới 50 lần/tick (mỗi người im ắng một lần).
- **actBroadcast / actImportCsv / actNapCoupon** loop INSERT tuần tự — broadcast 10k người = 10k round-trip (~5 phút, treo browser).
- Nhiều trang `await` tuần tự thay vì `Promise.all` (share page, dashboard ~10 round-trip nối tiếp).

## ⚪ DỌN DẸP (không lỗi runtime, nhưng dễ sinh lỗi khi sửa sau)

- **Định nghĩa "ai đủ điều kiện thắng" bị chép 3 nơi** (`ungVienHopLe`, `bangXepHang`, `topNguoiMoi`) — bảng xếp hạng công khai và pool bốc thăm có thể lệch nhau nếu sửa một chỗ. Nên gộp 1 hàm dùng chung.
- **`canAdmin` trùng `yeuCauAdmin`**; **`layBaseUrl`/`layIp` có sẵn nhưng 4 route tự dựng lại** (đã drift: bản inline thiếu fallback `x-real-ip` → tắt nhầm rate-limit/captcha).
- **Action & route cũ**: `revalidatePath` trỏ route stub `/admin/chien-dich`, `/admin/boc-tham` → **bấm nút xong trang không refresh** (tưởng hỏng → bấm lại → tạo trùng). `actTaoChienDich`/`actSuaChienDich` là code chết. `?import=` counter không bao giờ hiện.
- **`ma_header_chia_se`** lưu được nhưng **không trang nào render** (chỉ trang đăng ký chèn mã, trang chia sẻ thì không).
- **Màu mặc định `#2563eb`** lặp 8 chỗ, đã drift sang `#1d4ed8/#3b82f6` ở trang `/toi`.
- **`actSuaGiaoDien`** update 10 cột một lần → 2 trang phải mang ~16 input hidden; quên 1 cái là xoá trắng cấu hình khác.

---

## Đề xuất thứ tự sửa
1. **Nhóm 🔴 (1–7)** — bắt buộc trước khi mở cho người thật. Ước ~1 phiên.
2. **Nhóm 🟠 (8–14)** — sửa cùng đợt, đây là chỗ làm sai kết quả/giải thưởng.
3. **🟡 race + 🔵 index** — thêm khoá idempotent + vài index + Promise.all. Ước ~1 phiên.
4. **⚪ dọn dẹp** — gộp dần, không gấp.
