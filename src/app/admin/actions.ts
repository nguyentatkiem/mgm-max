"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { mot, q } from "@/db";
import { dangNhapAdmin, dangXuatAdmin, laAdmin } from "@/services/auth";
import { ghiCaiDat } from "@/services/cai-dat";
import { ghiDiem } from "@/services/diem";
import { xuLyHangDoi } from "@/services/email";
import { xacNhanGioiThieu } from "@/services/nguoi-tham-gia";
import { chayBocTham, duyetBocTham } from "@/services/boc-tham-svc";
import { layBaseUrl } from "@/services/http";

async function canAdmin() {
  if (!(await laAdmin())) redirect("/admin/dang-nhap");
}

export async function actDangNhap(form: FormData) {
  const ok = await dangNhapAdmin(String(form.get("mat_khau") || ""));
  redirect(ok ? "/admin" : "/admin/dang-nhap?loi=1");
}

export async function actDangXuat() {
  await dangXuatAdmin();
  redirect("/admin/dang-nhap");
}

// ————— Chiến dịch —————
export async function actTaoChienDich(form: FormData) {
  await canAdmin();
  const slug = String(form.get("slug") || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const cd = await mot(
    `insert into chien_dich (slug, ten, mo_ta, giai_boc_tham, so_giai, qua_chao_mung, qua_chao_mung_gia_tri)
     values ($1,$2,$3,$4,$5,$6,$7) returning id`,
    [slug, String(form.get("ten") || "Chiến dịch mới"), String(form.get("mo_ta") || ""),
     String(form.get("giai_boc_tham") || ""), Number(form.get("so_giai") || 3),
     String(form.get("qua_chao_mung") || ""), String(form.get("qua_chao_mung_gia_tri") || "")]
  );
  redirect(`/admin/chien-dich/${cd!.id}`);
}

export async function actSuaChienDich(form: FormData) {
  await canAdmin();
  const id = Number(form.get("id"));
  await q(
    `update chien_dich set ten=$2, mo_ta=$3, diem_dang_ky=$4, diem_moi_ban=$5, diem_share=$6, diem_click=$7,
       cap_click_ngay=$8, cookie_ngay=$9, kenh_share=$10, hai_chieu=$11, qua_chao_mung=$12, qua_chao_mung_gia_tri=$13,
       giai_boc_tham=$14, so_giai=$15, che_do_demo=$16, ket_thuc_luc=$17, redirect_khi_dong=$18
     where id=$1`,
    [id, String(form.get("ten")), String(form.get("mo_ta") || ""),
     Number(form.get("diem_dang_ky")), Number(form.get("diem_moi_ban")), Number(form.get("diem_share")),
     Number(form.get("diem_click")), Number(form.get("cap_click_ngay")), Number(form.get("cookie_ngay")),
     String(form.get("kenh_share") || "zalo,facebook,messenger,telegram,copy"),
     form.get("hai_chieu") === "on", String(form.get("qua_chao_mung") || ""), String(form.get("qua_chao_mung_gia_tri") || ""),
     String(form.get("giai_boc_tham") || ""), Number(form.get("so_giai") || 3), form.get("che_do_demo") === "on",
     String(form.get("ket_thuc_luc") || "") || null, String(form.get("redirect_khi_dong") || "")]
  );
  revalidatePath(`/admin/chien-dich/${id}`);
}

export async function actDoiTrangThai(form: FormData) {
  await canAdmin();
  const id = Number(form.get("id"));
  await q(`update chien_dich set trang_thai=$2 where id=$1`, [id, String(form.get("trang_thai"))]);
  revalidatePath("/admin/chien-dich");
  revalidatePath(`/admin/chien-dich/${id}`);
}

export async function actCloneChienDich(form: FormData) {
  await canAdmin();
  const id = Number(form.get("id"));
  const goc = await mot(`select * from chien_dich where id=$1`, [id]);
  const slugMoi = `${goc.slug}-ban-sao-${Date.now().toString(36).slice(-4)}`;
  const moi = await mot(
    `insert into chien_dich (slug, ten, mo_ta, giai_boc_tham, so_giai, cookie_ngay, diem_dang_ky, diem_moi_ban,
       diem_share, diem_click, cap_click_ngay, kenh_share, hai_chieu, qua_chao_mung, qua_chao_mung_gia_tri, che_do_demo)
     select $2, ten || ' (bản sao)', mo_ta, giai_boc_tham, so_giai, cookie_ngay, diem_dang_ky, diem_moi_ban,
       diem_share, diem_click, cap_click_ngay, kenh_share, hai_chieu, qua_chao_mung, qua_chao_mung_gia_tri, che_do_demo
     from chien_dich where id=$1 returning id`, [id, slugMoi]);
  await q(`insert into moc_qua (chien_dich_id, nguong, ten_qua, loai_qua, gia_tri, coupon_dung_chung)
           select $2, nguong, ten_qua, loai_qua, gia_tri, coupon_dung_chung from moc_qua where chien_dich_id=$1`, [id, moi!.id]);
  await q(`insert into hanh_dong_tuy_chinh (chien_dich_id, ten, mo_ta, url, diem, cau_hoi, dap_an, bat)
           select $2, ten, mo_ta, url, diem, cau_hoi, dap_an, bat from hanh_dong_tuy_chinh where chien_dich_id=$1`, [id, moi!.id]);
  await q(`insert into mau_email (chien_dich_id, loai, tieu_de, noi_dung)
           select $2, loai, tieu_de, noi_dung from mau_email where chien_dich_id=$1`, [id, moi!.id]);
  redirect(`/admin/chien-dich/${moi!.id}`);
}

// ————— Mốc quà + coupon —————
export async function actThemMoc(form: FormData) {
  await canAdmin();
  const cdId = Number(form.get("chien_dich_id"));
  await q(
    `insert into moc_qua (chien_dich_id, nguong, ten_qua, loai_qua, gia_tri, coupon_dung_chung)
     values ($1,$2,$3,$4,$5,$6) on conflict (chien_dich_id, nguong) do update
       set ten_qua=excluded.ten_qua, loai_qua=excluded.loai_qua, gia_tri=excluded.gia_tri, coupon_dung_chung=excluded.coupon_dung_chung`,
    [cdId, Number(form.get("nguong")), String(form.get("ten_qua")), String(form.get("loai_qua")),
     String(form.get("gia_tri") || ""), String(form.get("coupon_dung_chung") || "")]
  );
  revalidatePath(`/admin/chien-dich/${cdId}`);
}

export async function actXoaMoc(form: FormData) {
  await canAdmin();
  await q(`delete from moc_qua where id=$1`, [Number(form.get("id"))]);
  revalidatePath(`/admin/chien-dich/${Number(form.get("chien_dich_id"))}`);
}

export async function actNapCoupon(form: FormData) {
  await canAdmin();
  const mocId = Number(form.get("moc_id"));
  const cdId = Number(form.get("chien_dich_id"));
  const cacMa = String(form.get("danh_sach") || "").split(/\s+/).map((m) => m.trim()).filter(Boolean);
  for (const ma of cacMa) await q(`insert into kho_coupon (moc_id, ma) values ($1,$2)`, [mocId, ma]);
  revalidatePath(`/admin/chien-dich/${cdId}`);
}

// ————— Nhiệm vụ tuỳ chỉnh —————
export async function actThemHanhDong(form: FormData) {
  await canAdmin();
  const cdId = Number(form.get("chien_dich_id"));
  await q(
    `insert into hanh_dong_tuy_chinh (chien_dich_id, ten, mo_ta, url, diem, cau_hoi, dap_an)
     values ($1,$2,$3,$4,$5,$6,$7)`,
    [cdId, String(form.get("ten")), String(form.get("mo_ta") || ""), String(form.get("url") || ""),
     Number(form.get("diem") || 10), String(form.get("cau_hoi") || ""), String(form.get("dap_an") || "")]
  );
  revalidatePath(`/admin/chien-dich/${cdId}`);
}

export async function actBatTatHanhDong(form: FormData) {
  await canAdmin();
  await q(`update hanh_dong_tuy_chinh set bat = not bat where id=$1`, [Number(form.get("id"))]);
  revalidatePath(`/admin/chien-dich/${Number(form.get("chien_dich_id"))}`);
}

export async function actXoaHanhDong(form: FormData) {
  await canAdmin();
  await q(`delete from hanh_dong_tuy_chinh where id=$1`, [Number(form.get("id"))]);
  revalidatePath(`/admin/chien-dich/${Number(form.get("chien_dich_id"))}`);
}

// ————— Mẫu email —————
export async function actLuuMauEmail(form: FormData) {
  await canAdmin();
  const cdId = Number(form.get("chien_dich_id"));
  await q(
    `insert into mau_email (chien_dich_id, loai, tieu_de, noi_dung) values ($1,$2,$3,$4)
     on conflict (chien_dich_id, loai) do update set tieu_de=excluded.tieu_de, noi_dung=excluded.noi_dung`,
    [cdId, String(form.get("loai")), String(form.get("tieu_de")), String(form.get("noi_dung"))]
  );
  revalidatePath(`/admin/chien-dich/${cdId}`);
}

// ————— Lead + fraud —————
export async function actDuyetCachLy(form: FormData) {
  await canAdmin();
  const gtId = Number(form.get("gioi_thieu_id"));
  const dongY = String(form.get("quyet_dinh")) === "duyet";
  if (dongY) {
    await xacNhanGioiThieu(gtId, await layBaseUrl());
  } else {
    await q(`update gioi_thieu set trang_thai='huy' where id=$1`, [gtId]);
  }
  revalidatePath("/admin/lead");
}

export async function actSuaDiemTay(form: FormData) {
  await canAdmin();
  const nguoiId = Number(form.get("nguoi_id"));
  const delta = Number(form.get("delta") || 0);
  const lyDo = String(form.get("ly_do") || "").trim();
  if (delta !== 0 && lyDo) {
    const ng = await mot(`select chien_dich_id from nguoi_tham_gia where id=$1`, [nguoiId]);
    await ghiDiem(ng!.chien_dich_id, nguoiId, "tay", `tay:${Date.now()}`, delta, lyDo);
  }
  revalidatePath(`/admin/lead/${nguoiId}`);
}

export async function actChanNguoi(form: FormData) {
  await canAdmin();
  const nguoiId = Number(form.get("nguoi_id"));
  await q(`update nguoi_tham_gia set chan = not chan where id=$1`, [nguoiId]);
  revalidatePath(`/admin/lead/${nguoiId}`);
  revalidatePath("/admin/lead");
}

// ————— Bốc thăm —————
export async function actChayBocTham(form: FormData) {
  await canAdmin();
  await chayBocTham(Number(form.get("chien_dich_id")));
  revalidatePath("/admin/boc-tham");
}

export async function actDuyetBocTham(form: FormData) {
  await canAdmin();
  await duyetBocTham(Number(form.get("id")), await layBaseUrl());
  revalidatePath("/admin/boc-tham");
}

export async function actHuyBocTham(form: FormData) {
  await canAdmin();
  await q(`update boc_tham set trang_thai='huy' where id=$1 and trang_thai='cho_duyet'`, [Number(form.get("id"))]);
  revalidatePath("/admin/boc-tham");
}

// ————— Email + cài đặt —————
export async function actXuLyEmail() {
  await canAdmin();
  await xuLyHangDoi(100);
  revalidatePath("/admin/email");
}

export async function actLuuCaiDat(form: FormData) {
  await canAdmin();
  await ghiCaiDat("whitelist_ip", String(form.get("whitelist_ip") || ""));
  await ghiCaiDat("blacklist_email", String(form.get("blacklist_email") || ""));
  revalidatePath("/admin/cai-dat");
}
