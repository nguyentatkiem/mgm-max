# MGM MAX 🚀

Nền tảng chiến dịch viral **member-get-member** (mời bạn → nhận quà) cho sản phẩm số & khoá học. Tự xây theo mô hình UpViral nhưng hơn ở: thưởng hai chiều, mốc quà theo số bạn **đã xác minh**, sổ cái điểm có log, bốc thăm seed minh bạch, K-factor, kênh share cho thị trường Việt (Zalo/Facebook/Messenger).

## Chạy local

```bash
createdb mgm_max          # Postgres local
pnpm install
pnpm db:init              # áp schema
pnpm db:seed              # chiến dịch demo "khoa-hoc-ai"
pnpm dev                  # http://localhost:3005
```

- Trang công khai: `http://localhost:3005/c/khoa-hoc-ai`
- Quản trị: `http://localhost:3005/admin` — mật khẩu mặc định `mgmmax123` (đổi bằng biến `ADMIN_MAT_KHAU`)
- Test core: `pnpm test`

## Đưa lên Cloudflare (quick tunnel)

```bash
pnpm build && pnpm start &
./deploy/len-cloudflare.sh    # in ra link https://….trycloudflare.com
```

## Email

Mặc định chạy **giả lập**: mọi email nằm trong Admin → Email để xem nội dung. Muốn gửi thật: điền `RESEND_API_KEY` (+ `EMAIL_FROM`) vào `.env`. Chiến dịch có **chế độ demo** (bật/tắt trong admin): hiện nút "Xác minh ngay" trên trang cảm ơn để chạy thử trọn vòng lặp không cần hộp thư thật.

## Kiến trúc

- `src/core/` — logic thuần có test (`pnpm test`): mã Base32 Crockford, bốc thăm trọng số seed tất định, chấm điểm rủi ro, mốc quà, xếp hạng, K-factor.
- `src/services/` — nghiệp vụ chạm DB: đăng ký + attribution 2 pha (cookie → DB), xác minh double opt-in, sổ cái điểm append-only (UNIQUE idempotent), trao quà (kho coupon khoá hàng `FOR UPDATE SKIP LOCKED`), hàng đợi email có retry, thống kê.
- `src/app/` — Next.js App Router: trang opt-in `/c/[slug]`, link giới thiệu `/r/[ma]?ch=kenh`, trang riêng `/toi/[ma]`, xác minh `/xac-minh/[token]`, admin đầy đủ tại `/admin`.
- `db/schema.sql` — 12 bảng; mọi ràng buộc chống trùng (1 người 1 người mời, điểm không cộng đôi, quà không trao đôi, coupon không phát đôi) nằm ở UNIQUE tầng DB.

Tài liệu nghiên cứu & phương án: xem thư mục [`tai-lieu/`](tai-lieu/).
