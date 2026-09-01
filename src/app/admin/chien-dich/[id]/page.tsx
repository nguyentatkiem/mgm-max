import { redirect } from "next/navigation";
import { Gift, Mail, Save, Ticket, Trash2, Zap } from "lucide-react";
import { mot, q } from "@/db";
import { MAU_MAC_DINH } from "@/services/email";
import { yeuCauAdmin } from "../../bao-ve";
import {
  actBatTatHanhDong, actLuuMauEmail, actNapCoupon, actSuaChienDich, actThemHanhDong, actThemMoc, actXoaHanhDong, actXoaMoc,
} from "../../actions";

export const dynamic = "force-dynamic";

export default async function SuaChienDich(props: { params: Promise<{ id: string }> }) {
  await yeuCauAdmin();
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  if (!cd) redirect("/admin/chien-dich");
  const cacMoc = await q(
    `select m.*, (select count(*) from kho_coupon k where k.moc_id=m.id and not k.da_phat) as con_ma,
            (select count(*) from kho_coupon k where k.moc_id=m.id) as tong_ma
     from moc_qua m where m.chien_dich_id=$1 order by m.nguong`, [cd.id]);
  const hanhDong = await q(`select * from hanh_dong_tuy_chinh where chien_dich_id=$1 order by id`, [cd.id]);
  const mauGhiDe = await q(`select * from mau_email where chien_dich_id=$1`, [cd.id]);
  const ketThuc = cd.ket_thuc_luc ? new Date(cd.ket_thuc_luc).toISOString().slice(0, 16) : "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">{cd.ten}</h1>
        <p className="text-sm text-slate-500">/c/{cd.slug} · Trạng thái: <b>{cd.trang_thai}</b></p>
      </div>

      {/* Cấu hình chung + điểm */}
      <form action={actSuaChienDich} className="the space-y-4 p-6">
        <h2 className="font-bold text-slate-900">Cấu hình chung &amp; hệ điểm</h2>
        <input type="hidden" name="id" value={cd.id} />
        <div><label className="nhan">Tên chiến dịch</label><input name="ten" defaultValue={cd.ten} className="o-nhap" /></div>
        <div><label className="nhan">Mô tả</label><textarea name="mo_ta" rows={2} defaultValue={cd.mo_ta} className="o-nhap" /></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div><label className="nhan">Điểm đăng ký</label><input name="diem_dang_ky" type="number" defaultValue={cd.diem_dang_ky} className="o-nhap" /></div>
          <div><label className="nhan">Điểm mời 1 bạn ✓</label><input name="diem_moi_ban" type="number" defaultValue={cd.diem_moi_ban} className="o-nhap" /></div>
          <div><label className="nhan">Điểm bấm share</label><input name="diem_share" type="number" defaultValue={cd.diem_share} className="o-nhap" /></div>
          <div><label className="nhan">Điểm/click thật</label><input name="diem_click" type="number" defaultValue={cd.diem_click} className="o-nhap" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div><label className="nhan">Trần click/ngày</label><input name="cap_click_ngay" type="number" defaultValue={cd.cap_click_ngay} className="o-nhap" /></div>
          <div><label className="nhan">Cookie (ngày)</label><input name="cookie_ngay" type="number" defaultValue={cd.cookie_ngay} className="o-nhap" /></div>
          <div className="col-span-2"><label className="nhan">Kênh share (phẩy)</label><input name="kenh_share" defaultValue={cd.kenh_share} className="o-nhap font-mono text-sm" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="nhan">Kết thúc lúc (bốc thăm; trống = evergreen)</label>
            <input name="ket_thuc_luc" type="datetime-local" defaultValue={ketThuc} className="o-nhap" /></div>
          <div><label className="nhan">Redirect khi đóng (tuỳ chọn)</label>
            <input name="redirect_khi_dong" defaultValue={cd.redirect_khi_dong} className="o-nhap" placeholder="https://..." /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="nhan">Giải bốc thăm</label><input name="giai_boc_tham" defaultValue={cd.giai_boc_tham} className="o-nhap" /></div>
          <div><label className="nhan">Số giải</label><input name="so_giai" type="number" defaultValue={cd.so_giai} className="o-nhap" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="nhan">Quà chào mừng (hai chiều)</label><input name="qua_chao_mung" defaultValue={cd.qua_chao_mung} className="o-nhap" /></div>
          <div><label className="nhan">Giá trị (mã/link)</label><input name="qua_chao_mung_gia_tri" defaultValue={cd.qua_chao_mung_gia_tri} className="o-nhap font-mono" /></div>
        </div>
        <div className="flex flex-wrap gap-5 text-sm font-medium text-slate-600">
          <label className="flex items-center gap-2"><input type="checkbox" name="hai_chieu" defaultChecked={cd.hai_chieu} /> Thưởng hai chiều</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="che_do_demo" defaultChecked={cd.che_do_demo} /> Chế độ demo (hiện link xác minh, không cần email thật)</label>
        </div>
        <button className="nut-chinh"><Save className="h-4 w-4" /> Lưu cấu hình</button>
      </form>

      {/* Mốc quà */}
      <div className="the p-6">
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><Gift className="h-5 w-5 text-blue-600" /> Mốc quà (theo số bạn xác minh)</h2>
        <div className="mt-4 space-y-3">
          {cacMoc.map((m) => (
            <div key={m.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="hieu bg-blue-600 text-white">{m.nguong} bạn</span>
                  <span className="ml-2 font-semibold text-slate-800">{m.ten_qua}</span>
                  <span className="ml-2 text-xs text-slate-400">[{m.loai_qua}]</span>
                  {m.loai_qua === "coupon" && !m.coupon_dung_chung && (
                    <span className={`ml-2 hieu ${Number(m.con_ma) <= 3 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                      <Ticket className="h-3 w-3" /> {m.con_ma}/{m.tong_ma} mã
                    </span>
                  )}
                  {m.coupon_dung_chung && <code className="ml-2 text-xs font-bold text-blue-700">{m.coupon_dung_chung} (dùng chung)</code>}
                </div>
                <form action={actXoaMoc}>
                  <input type="hidden" name="id" value={m.id} /><input type="hidden" name="chien_dich_id" value={cd.id} />
                  <button className="text-slate-400 hover:text-red-600 cursor-pointer" title="Xoá mốc"><Trash2 className="h-4 w-4" /></button>
                </form>
              </div>
              {m.loai_qua === "coupon" && !m.coupon_dung_chung && (
                <form action={actNapCoupon} className="mt-3 flex gap-2">
                  <input type="hidden" name="moc_id" value={m.id} /><input type="hidden" name="chien_dich_id" value={cd.id} />
                  <input name="danh_sach" className="o-nhap !py-1.5 font-mono text-sm" placeholder="Nạp mã: MA1 MA2 MA3 (cách nhau khoảng trắng)" />
                  <button className="nut-phu !py-1.5 text-sm shrink-0">Nạp mã</button>
                </form>
              )}
            </div>
          ))}
        </div>
        <form action={actThemMoc} className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-6">
          <input type="hidden" name="chien_dich_id" value={cd.id} />
          <div><label className="nhan">Số bạn</label><input name="nguong" type="number" min={1} required className="o-nhap !py-1.5" /></div>
          <div className="col-span-2"><label className="nhan">Tên quà</label><input name="ten_qua" required className="o-nhap !py-1.5" /></div>
          <div><label className="nhan">Loại</label>
            <select name="loai_qua" className="o-nhap !py-1.5">
              <option value="coupon">Coupon</option><option value="file">File</option><option value="link">Link bí mật</option><option value="khac">Khác</option>
            </select></div>
          <div><label className="nhan">Link/giá trị</label><input name="gia_tri" className="o-nhap !py-1.5" placeholder="https://…" /></div>
          <div><label className="nhan">Mã dùng chung</label><input name="coupon_dung_chung" className="o-nhap !py-1.5 font-mono" placeholder="(trống = kho mã)" /></div>
          <button className="nut-chinh col-span-2 !py-1.5 text-sm sm:col-span-6">Thêm / cập nhật mốc</button>
        </form>
      </div>

      {/* Nhiệm vụ tuỳ chỉnh */}
      <div className="the p-6">
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><Zap className="h-5 w-5 text-amber-500" /> Nhiệm vụ cộng điểm</h2>
        <div className="mt-4 space-y-2">
          {hanhDong.map((h) => (
            <div key={h.id} className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${h.bat ? "border-slate-200" : "border-slate-100 bg-slate-50 opacity-60"}`}>
              <div className="min-w-0">
                <div className="font-semibold text-slate-800">{h.ten} <span className="hieu bg-blue-100 text-blue-700">+{h.diem}đ</span></div>
                <div className="truncate text-xs text-slate-400">Hỏi: {h.cau_hoi} → Đáp: {h.dap_an}</div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <form action={actBatTatHanhDong}><input type="hidden" name="id" value={h.id} /><input type="hidden" name="chien_dich_id" value={cd.id} />
                  <button className="nut-phu !px-2.5 !py-1 text-xs">{h.bat ? "Tắt" : "Bật"}</button></form>
                <form action={actXoaHanhDong}><input type="hidden" name="id" value={h.id} /><input type="hidden" name="chien_dich_id" value={cd.id} />
                  <button className="text-slate-400 hover:text-red-600 cursor-pointer"><Trash2 className="h-4 w-4" /></button></form>
              </div>
            </div>
          ))}
        </div>
        <form action={actThemHanhDong} className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4">
          <input type="hidden" name="chien_dich_id" value={cd.id} />
          <div><label className="nhan">Tên nhiệm vụ</label><input name="ten" required className="o-nhap !py-1.5" placeholder="Xem video giới thiệu" /></div>
          <div><label className="nhan">Điểm</label><input name="diem" type="number" defaultValue={10} className="o-nhap !py-1.5" /></div>
          <div><label className="nhan">Mô tả</label><input name="mo_ta" className="o-nhap !py-1.5" /></div>
          <div><label className="nhan">URL đích</label><input name="url" className="o-nhap !py-1.5" placeholder="https://…" /></div>
          <div><label className="nhan">Câu hỏi xác minh</label><input name="cau_hoi" required className="o-nhap !py-1.5" /></div>
          <div><label className="nhan">Đáp án đúng</label><input name="dap_an" required className="o-nhap !py-1.5" /></div>
          <button className="nut-chinh col-span-2 !py-1.5 text-sm">Thêm nhiệm vụ</button>
        </form>
      </div>

      {/* Mẫu email */}
      <div className="the p-6">
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><Mail className="h-5 w-5 text-blue-600" /> Mẫu email (sửa được từng loại)</h2>
        <p className="mt-1 text-xs text-slate-400">Biến: {"{{ten}} {{ten_chien_dich}} {{link_rieng}} {{link_xac_minh}} {{so_ban}} {{tien_do}} {{ten_qua}} {{gia_tri_qua}} {{qua_ke_tiep}} {{giai}}"}</p>
        <div className="mt-4 space-y-4">
          {Object.entries(MAU_MAC_DINH).map(([loai, macDinh]) => {
            const ghiDe = mauGhiDe.find((m) => m.loai === loai);
            return (
              <form key={loai} action={actLuuMauEmail} className="rounded-xl border border-slate-200 p-4">
                <input type="hidden" name="chien_dich_id" value={cd.id} /><input type="hidden" name="loai" value={loai} />
                <div className="text-sm font-bold text-slate-700">{macDinh.ten} {ghiDe && <span className="hieu bg-blue-100 text-blue-700">đã tuỳ chỉnh</span>}</div>
                <input name="tieu_de" defaultValue={ghiDe?.tieu_de || macDinh.tieu_de} className="o-nhap mt-2 !py-1.5 text-sm" />
                <textarea name="noi_dung" rows={3} defaultValue={ghiDe?.noi_dung || macDinh.noi_dung} className="o-nhap mt-2 !py-1.5 text-sm" />
                <button className="nut-phu mt-2 !py-1.5 text-xs"><Save className="h-3.5 w-3.5" /> Lưu mẫu</button>
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
}
