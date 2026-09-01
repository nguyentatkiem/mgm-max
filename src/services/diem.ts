import { q, mot } from "@/db";

/** Ghi điểm idempotent: khoá UNIQUE (nguoi, hanh_dong, doi_tuong) ở tầng DB.
 *  Trả về true nếu ghi mới, false nếu đã có (gọi lặp không cộng đôi). */
export async function ghiDiem(
  chienDichId: number, nguoiId: number, hanhDong: string, doiTuong: string, diem: number, ghiChu = ""
): Promise<boolean> {
  const rows = await q(
    `insert into so_diem (chien_dich_id, nguoi_id, hanh_dong, doi_tuong, diem, ghi_chu)
     values ($1,$2,$3,$4,$5,$6) on conflict (nguoi_id, hanh_dong, doi_tuong) do nothing returning id`,
    [chienDichId, nguoiId, hanhDong, doiTuong, diem, ghiChu]
  );
  return rows.length > 0;
}

/** Đảo điểm bằng bút toán âm — không sửa đè lịch sử. */
export async function daoDiem(chienDichId: number, nguoiId: number, khoaGoc: string, diemGoc: number, lyDo: string) {
  await ghiDiem(chienDichId, nguoiId, "dao", `dao:${khoaGoc}`, -diemGoc, lyDo);
}

export async function tongDiem(nguoiId: number): Promise<number> {
  const r = await mot<{ tong: string }>(`select coalesce(sum(diem),0) as tong from so_diem where nguoi_id=$1`, [nguoiId]);
  return Number(r?.tong || 0);
}

/** Tổng điểm click hôm nay (để áp trần cap_click_ngay). */
export async function soClickHomNay(nguoiId: number): Promise<number> {
  const r = await mot<{ so: string }>(
    `select count(*) as so from so_diem where nguoi_id=$1 and hanh_dong='click' and doi_tuong like $2`,
    [nguoiId, `click:${ngayHomNay()}:%`]
  );
  return Number(r?.so || 0);
}

export function ngayHomNay(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" }); // YYYY-MM-DD giờ VN
}
