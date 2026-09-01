import { randomBytes } from "node:crypto";
import { mot, q } from "@/db";
import { bocTham, type UngVien } from "@/core/boc-tham";
import { xepEmail } from "./email";

/** Chạy bốc thăm trọng số điểm → lưu kết quả CHỜ DUYỆT (admin xem hồ sơ rồi mới xác nhận). */
export async function chayBocTham(chienDichId: number): Promise<number> {
  const cd = await mot(`select * from chien_dich where id=$1`, [chienDichId]);
  if (!cd || !cd.giai_boc_tham) throw new Error("Chiến dịch chưa cấu hình giải bốc thăm");
  const rows = await q(
    `select n.id, n.ten, n.email, coalesce((select sum(diem) from so_diem s where s.nguoi_id=n.id),0) as diem
     from nguoi_tham_gia n
     where n.chien_dich_id=$1 and n.xac_minh and not n.chan
       and not exists (select 1 from gioi_thieu g where g.nguoi_duoc_moi_id=n.id and g.trang_thai='cach_ly')`,
    [chienDichId]
  );
  const ungVien: UngVien[] = rows.map((r) => ({ id: r.id, ten: r.ten, email: r.email, diem: Number(r.diem) }));
  const seed = randomBytes(8).toString("hex");
  const ketQua = bocTham(ungVien, cd.so_giai, seed);
  const luu = await mot(
    `insert into boc_tham (chien_dich_id, seed, ket_qua) values ($1,$2,$3) returning id`,
    [chienDichId, seed, JSON.stringify(ketQua)]
  );
  return luu!.id;
}

/** Admin duyệt kết quả → trao quà + gửi email chúc mừng từng người thắng. */
export async function duyetBocTham(bocThamId: number, baseUrl: string) {
  const bt = await mot(`select * from boc_tham where id=$1`, [bocThamId]);
  if (!bt || bt.trang_thai !== "cho_duyet") return;
  const cd = await mot(`select * from chien_dich where id=$1`, [bt.chien_dich_id]);
  const tenGiai = (giai: number) => (giai === 1 ? "Giải Nhất" : giai === 2 ? "Giải Nhì" : giai === 3 ? "Giải Ba" : `Giải #${giai}`);
  for (const w of bt.ket_qua as { giai: number; id: number; ten: string; email: string }[]) {
    await q(
      `insert into qua_da_trao (nguoi_id, loai, ten_qua, loai_qua, gia_tri) values ($1,'boc_tham',$2,'khac','')`,
      [w.id, `${tenGiai(w.giai)}: ${cd.giai_boc_tham}`]
    );
    const ng = await mot(`select ma from nguoi_tham_gia where id=$1`, [w.id]);
    await xepEmail(cd.id, "trung_giai", w.email, w.ten, {
      ten: w.ten, ten_chien_dich: cd.ten, giai: `${tenGiai(w.giai)} — ${cd.giai_boc_tham}`,
      link_rieng: `${baseUrl}/toi/${ng?.ma}`,
    });
  }
  await q(`update boc_tham set trang_thai='da_duyet' where id=$1`, [bocThamId]);
}
