// Seed chiến dịch demo cho khoá học
import { Pool } from "pg";

const url = process.env.DATABASE_URL || "postgres://localhost:5432/mgm_max";
const pool = new Pool({ connectionString: url });

async function main() {
  const co = await pool.query("select id from chien_dich where slug='khoa-hoc-ai'");
  if (co.rows.length) { console.log("✓ Đã có chiến dịch demo, bỏ qua"); await pool.end(); return; }

  const cd = await pool.query(
    `insert into chien_dich (slug, ten, mo_ta, trang_thai, giai_boc_tham, so_giai, qua_chao_mung, qua_chao_mung_gia_tri, che_do_demo)
     values ('khoa-hoc-ai', 'Khoá học AI thực chiến — Mời bạn nhận quà',
             'Mời bạn bè tham gia danh sách học sớm: mời càng nhiều, quà càng lớn. Bạn của bạn cũng có quà chào mừng!',
             'chay', '1 suất học miễn phí trọn đời', 3,
             'Mã giảm 10% khoá học', 'WELCOME10', true)
     returning id`
  );
  const id = cd.rows[0].id;

  const m1 = await pool.query(
    `insert into moc_qua (chien_dich_id, nguong, ten_qua, loai_qua, coupon_dung_chung) values
     ($1, 1, 'Mã giảm 20% khoá học', 'coupon', '') returning id`, [id]);
  await pool.query(
    `insert into kho_coupon (moc_id, ma) values ($1,'GIAM20-A1B2'),($1,'GIAM20-C3D4'),($1,'GIAM20-E5F6'),($1,'GIAM20-G7H8'),($1,'GIAM20-K9L0')`,
    [m1.rows[0].id]);
  await pool.query(
    `insert into moc_qua (chien_dich_id, nguong, ten_qua, loai_qua, gia_tri) values
     ($1, 3, 'Ebook «Prompt như dân pro» (PDF)', 'file', 'https://example.com/ebook-prompt-pro.pdf'),
     ($1, 5, 'Chương 1 khoá học (link bí mật)', 'link', 'https://example.com/hoc-thu-chuong-1'),
     ($1, 10, '1 suất học miễn phí toàn khoá', 'khac', '')`, [id]);

  await pool.query(
    `insert into hanh_dong_tuy_chinh (chien_dich_id, ten, mo_ta, url, diem, cau_hoi, dap_an) values
     ($1, 'Xem video giới thiệu khoá học', 'Xem hết video 3 phút trên YouTube', 'https://youtube.com', 15,
      'Trong video, giảng viên nói khoá học kéo dài mấy tuần?', '8'),
     ($1, 'Tham gia nhóm Zalo cộng đồng', 'Vào nhóm để nhận tài liệu miễn phí hằng tuần', 'https://zalo.me', 10,
      'Tin ghim đầu nhóm có từ khoá gì?', 'AI2026')`, [id]);

  console.log("✓ Seed xong: chiến dịch demo 'khoa-hoc-ai' (mốc 1/3/5/10 + 2 nhiệm vụ + bốc thăm 3 giải)");
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
