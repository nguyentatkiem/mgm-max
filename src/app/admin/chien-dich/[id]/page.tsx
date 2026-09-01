import { redirect } from "next/navigation";
import { Code2, Gift, Mail, Palette, Save, Ticket, Trash2, Upload, Zap } from "lucide-react";
import { mot, q } from "@/db";
import { MAU_MAC_DINH } from "@/services/email";
import { layBaseUrl } from "@/services/http";
import { yeuCauAdmin } from "../../bao-ve";
import {
  actBatTatHanhDong, actImportCsv, actLuuMauEmail, actNapCoupon, actSuaChienDich, actSuaGiaoDien,
  actThemHanhDong, actThemMoc, actXoaHanhDong, actXoaMoc,
} from "../../actions";

export const dynamic = "force-dynamic";

export default async function SuaChienDich(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ import?: string }>;
}) {
  await yeuCauAdmin();
  const { id } = await props.params;
  const { import: ketQuaImport } = await props.searchParams;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  if (!cd) redirect("/admin/chien-dich");
  const baseUrl = await layBaseUrl();
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

      {/* F1 + F5 + F7 + F44 — Giao diện & chia sẻ */}
      <form action={actSuaGiaoDien} className="the space-y-4 p-6">
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><Palette className="h-5 w-5 text-blue-600" /> Giao diện trang &amp; lời mời từng kênh</h2>
        <input type="hidden" name="id" value={cd.id} />
        <input type="hidden" name="kenh_share_hien_tai" value={cd.kenh_share} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div><label className="nhan">Màu chủ đạo</label><input name="mau_chinh" type="color" defaultValue={cd.mau_chinh || "#2563eb"} className="o-nhap !h-11 !p-1" /></div>
          <div className="col-span-3"><label className="nhan">Logo (URL ảnh)</label><input name="logo_url" defaultValue={cd.logo_url} className="o-nhap" placeholder="https://…/logo.png" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="nhan">Ảnh cover trang đăng ký (URL)</label><input name="anh_cover" defaultValue={cd.anh_cover} className="o-nhap" placeholder="https://…/cover.jpg" /></div>
          <div><label className="nhan">Video giới thiệu (link YouTube)</label><input name="video_url" defaultValue={cd.video_url} className="o-nhap" placeholder="https://youtube.com/watch?v=…" /></div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm font-bold text-slate-700">Preview khi share (OG) — hiện trên Zalo/Facebook khi link được gửi đi</div>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            <input name="og_tieu_de" defaultValue={cd.og_tieu_de} className="o-nhap !py-2 text-sm" placeholder="Tiêu đề OG (trống = tên chiến dịch)" />
            <input name="og_mo_ta" defaultValue={cd.og_mo_ta} className="o-nhap !py-2 text-sm" placeholder="Mô tả OG" />
            <input name="og_anh" defaultValue={cd.og_anh} className="o-nhap !py-2 text-sm" placeholder="Ảnh OG (URL)" />
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm font-bold text-slate-700">Lời mời soạn sẵn theo từng kênh (trống = dùng lời mời chung)</div>
          <div className="mt-2 space-y-2">
            {cd.kenh_share.split(",").filter(Boolean).map((k: string) => (
              <div key={k} className="flex items-center gap-2">
                <span className="hieu w-24 justify-center bg-slate-200 capitalize text-slate-600">{k}</span>
                <input name={`loi_moi_${k}`} defaultValue={(cd.loi_moi || {})[k] || ""} className="o-nhap !py-1.5 text-sm" placeholder={`Lời mời khi share qua ${k}…`} />
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="nhan">Trường form thêm (mỗi dòng 1 trường, * đầu dòng = bắt buộc)</label>
            <textarea name="truong_them" rows={3} className="o-nhap font-mono text-sm"
              defaultValue={(cd.truong_them || []).map((t: { ten: string; bat_buoc: boolean }) => (t.bat_buoc ? "*" : "") + t.ten).join("\n")}
              placeholder={"*Số điện thoại\nNghề nghiệp"} />
          </div>
          <div>
            <label className="nhan">Webhook URL (bắn sự kiện: lead.xac_minh, gioi_thieu.xac_minh, moc.mo_khoa, boc_tham.trung_giai)</label>
            <input name="webhook_url" defaultValue={cd.webhook_url} className="o-nhap font-mono text-sm" placeholder="https://he-thong-cua-anh.vn/webhook" />
          </div>
        </div>
        <button className="nut-chinh"><Save className="h-4 w-4" /> Lưu giao diện &amp; chia sẻ</button>
      </form>

      {/* F3 + F14 + F15 — Nhúng, kích hoạt list cũ, import */}
      <div className="the space-y-5 p-6">
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><Code2 className="h-5 w-5 text-blue-600" /> Nhúng vào website &amp; kích hoạt list có sẵn</h2>
        <div>
          <div className="text-sm font-bold text-slate-700">Nhúng form (iframe)</div>
          <pre className="mt-1 overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-emerald-300">{`<iframe src="${baseUrl}/nhung/${cd.slug}" width="100%" height="520" style="border:0;border-radius:12px"></iframe>`}</pre>
          <div className="mt-3 text-sm font-bold text-slate-700">Popup nút nổi (1 dòng script)</div>
          <pre className="mt-1 overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-emerald-300">{`<script src="${baseUrl}/nhung/${cd.slug}/popup.js" defer></script>`}</pre>
        </div>
        <div>
          <div className="text-sm font-bold text-slate-700">Link one-click cho list email CÓ SẴN (F14)</div>
          <p className="mt-0.5 text-xs text-slate-500">Gửi qua hệ thống email của anh — người nhận bấm là vào thẳng trang mời bạn, khỏi điền form, khỏi xác minh. Thay {"{{EMAIL}}/{{TEN}}"} bằng merge tag của ESP.</p>
          <pre className="mt-1 overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-emerald-300">{`${baseUrl}/nhanh/${cd.slug}?email={{EMAIL}}&ten={{TEN}}`}</pre>
        </div>
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700"><Upload className="h-4 w-4" /> Import lead từ CSV (UpViral không làm được)</div>
          {ketQuaImport && (
            <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              ✓ Import xong: {ketQuaImport.split("-")[0]} người mới, {ketQuaImport.split("-")[1]} bỏ qua (trùng/lỗi).
            </div>
          )}
          <form action={actImportCsv} className="mt-2">
            <input type="hidden" name="chien_dich_id" value={cd.id} />
            <textarea name="du_lieu" rows={4} required className="o-nhap font-mono text-sm"
              placeholder={"Mỗi dòng: ten,email[,ma_nguoi_moi]\nNguyễn Văn A,a@gmail.com\nTrần B,b@gmail.com,ABC12345"} />
            <button className="nut-chinh mt-2 !py-2 text-sm"><Upload className="h-4 w-4" /> Import (đã xác minh sẵn, không gửi email)</button>
          </form>
        </div>
      </div>

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
