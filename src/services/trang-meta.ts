import { mot, q } from "@/db";
import type { MetaTrang } from "@/ui/puck/config";

// Dựng metadata cơ bản (dùng chung editor + public) cho trình kéo-thả.
// Phần phụ thuộc request — ref, kenh, loi, captcha — do trang public gắn thêm.
export async function metaTrangCoBan(cd: Record<string, any>): Promise<MetaTrang> {
  const cacMoc = await q<{ nguong: number; ten_qua: string }>(
    `select nguong, ten_qua from moc_qua where chien_dich_id=$1 order by nguong`, [cd.id]);
  const soThamGia = await mot<{ so: string }>(
    `select count(*) as so from nguoi_tham_gia where chien_dich_id=$1 and xac_minh`, [cd.id]);
  return {
    slug: cd.slug,
    cdId: cd.id,
    mau: cd.mau_chinh || "#2563eb",
    nenDuoi: cd.mau_nen || "#f8fafc",
    nutCta: cd.nut_cta || "Đăng ký nhận quà ngay",
    ref: "", kenh: "", loi: "", captcha: null,
    truongThem: cd.truong_them || [],
    soThamGia: Number(soThamGia?.so || 0),
    cacMoc: cacMoc.map((m) => ({ nguong: m.nguong, tenQua: m.ten_qua })),
    giaiBocTham: cd.giai_boc_tham || "",
    dieuKhoan: cd.dieu_khoan || "",
    dieuKhoanTieuDe: cd.dieu_khoan_tieu_de || "",
    ketThuc: cd.ket_thuc_luc ? new Date(cd.ket_thuc_luc).toISOString() : "",
  };
}
