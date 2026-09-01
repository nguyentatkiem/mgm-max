// Thử pipeline email THẬT: nạp 1 email vào hàng đợi rồi chạy worker.
// Có RESEND_API_KEY hợp lệ → gửi thật; key sai → nhận lỗi 401 THẬT từ api.resend.com.
// Dùng: RESEND_API_KEY=... npx tsx scripts/thu-email.ts <email-nhận>
import { q } from "@/db";
import { xuLyHangDoi } from "@/services/email";

async function main() {
  const to = process.argv[2] || "test@example.com";
  await q(
    `insert into hang_doi_email (chien_dich_id, loai, den_email, den_ten, tieu_de, noi_dung)
     values (1,'test',$1,'Người nhận test',$2,$3)`,
    [to, "[MGM MAX] Test kết nối email thật", `Xin chào,\n\nĐây là email THẬT gửi từ hệ thống MGM MAX qua Resend để kiểm tra kết nối.\nNếu bạn nhận được, hệ thống email đã chạy thật 100%.\n\n— MGM MAX`]
  );
  console.log("→ Đã nạp email vào hàng đợi cho:", to);
  console.log("→ RESEND_API_KEY:", process.env.RESEND_API_KEY ? `có (${process.env.RESEND_API_KEY.slice(0, 6)}…)` : "KHÔNG (sẽ giả lập)");
  console.log("→ EMAIL_FROM:", process.env.EMAIL_FROM || "MGM MAX <onboarding@resend.dev> (mặc định)");
  const n = await xuLyHangDoi(5);
  const row = (await q(`select id, trang_thai, so_lan, left(loi,300) as loi, gui_luc from hang_doi_email where den_email=$1 order by id desc limit 1`, [to]))[0];
  console.log("→ Worker xử lý:", n, "email");
  console.log("→ Kết quả:", JSON.stringify(row, null, 2));
  process.exit(0);
}
main();
