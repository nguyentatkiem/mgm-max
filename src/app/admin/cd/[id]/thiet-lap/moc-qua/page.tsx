import { Gift, Ticket, Trash2 } from "lucide-react";
import { mot, q } from "@/db";
import { actNapCoupon, actThemMoc, actXoaMoc } from "../../../../actions";

export const dynamic = "force-dynamic";

export default async function MocQua(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const cacMoc = await q(
    `select m.*, (select count(*) from kho_coupon k where k.moc_id=m.id and not k.da_phat) as con_ma,
            (select count(*) from kho_coupon k where k.moc_id=m.id) as tong_ma
     from moc_qua m where m.chien_dich_id=$1 order by m.nguong`, [cd.id]);

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Mốc quà</h1>
      <p className="text-sm text-slate-500">Mời đủ số bạn <b>đã xác minh</b> là quà tự mở khoá và gửi đi — không cần chờ quay số, không cần thao tác tay.</p>

      {cacMoc.length === 0 && (
        <div className="the mt-5 p-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50"><Gift className="h-7 w-7 text-blue-600" /></span>
          <h2 className="mt-4 text-lg font-black text-slate-900">Tạo mốc quà đầu tiên</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
            Người tham gia kiếm điểm bằng đăng ký, mời bạn, làm nhiệm vụ. Đạt mốc số bạn xác minh là hệ thống tự trao quà:
            mã giảm giá, file tải về, link bí mật — anh quyết định bao nhiêu mốc và mỗi mốc tặng gì.
          </p>
        </div>
      )}

      <div className="mt-5 space-y-3">
        {cacMoc.map((m) => (
          <div key={m.id} className="the p-4">
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

      <form action={actThemMoc} className="the mt-5 grid grid-cols-2 gap-3 p-5 sm:grid-cols-6">
        <input type="hidden" name="chien_dich_id" value={cd.id} />
        <div><label className="nhan">Số bạn</label><input name="nguong" type="number" min={1} required className="o-nhap !py-1.5" /></div>
        <div className="col-span-2"><label className="nhan">Tên quà</label><input name="ten_qua" required className="o-nhap !py-1.5" /></div>
        <div><label className="nhan">Loại</label>
          <select name="loai_qua" className="o-nhap !py-1.5">
            <option value="coupon">Coupon</option><option value="file">File</option><option value="link">Link bí mật</option><option value="khac">Khác</option>
          </select></div>
        <div><label className="nhan">Link/giá trị</label><input name="gia_tri" className="o-nhap !py-1.5" placeholder="https://…" /></div>
        <div><label className="nhan">Mã dùng chung</label><input name="coupon_dung_chung" className="o-nhap !py-1.5 font-mono" placeholder="(trống = kho mã)" /></div>
        <button className="nut-chinh col-span-2 !py-2 text-sm sm:col-span-6"><Gift className="h-4 w-4" /> Thêm / cập nhật mốc</button>
      </form>
    </div>
  );
}
