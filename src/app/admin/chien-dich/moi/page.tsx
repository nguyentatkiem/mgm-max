import { Plus } from "lucide-react";
import { yeuCauAdmin } from "../../bao-ve";
import { actTaoChienDich } from "../../actions";

export default async function TaoChienDich() {
  await yeuCauAdmin();
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-black text-slate-900">Tạo chiến dịch mới</h1>
      <p className="mt-1 text-sm text-slate-500">Tạo xong sẽ vào trang cấu hình chi tiết (điểm, mốc quà, nhiệm vụ, email).</p>
      <form action={actTaoChienDich} className="the mt-6 space-y-4 p-6">
        <div><label className="nhan">Tên chiến dịch</label>
          <input name="ten" required className="o-nhap" placeholder="VD: Khoá học X — Mời bạn nhận quà" /></div>
        <div><label className="nhan">Đường dẫn (slug)</label>
          <input name="slug" required pattern="[a-z0-9-]+" className="o-nhap font-mono" placeholder="khoa-hoc-x" />
          <p className="mt-1 text-xs text-slate-400">Trang công khai sẽ là /c/&lt;slug&gt;</p></div>
        <div><label className="nhan">Mô tả ngắn</label>
          <textarea name="mo_ta" rows={2} className="o-nhap" placeholder="Mời bạn bè — nhận quà độc quyền" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="nhan">Giải bốc thăm (bỏ trống nếu không có)</label>
            <input name="giai_boc_tham" className="o-nhap" placeholder="1 suất học miễn phí" /></div>
          <div><label className="nhan">Số giải</label>
            <input name="so_giai" type="number" defaultValue={3} min={1} max={20} className="o-nhap" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="nhan">Quà chào mừng (người được mời)</label>
            <input name="qua_chao_mung" className="o-nhap" placeholder="Mã giảm 10%" /></div>
          <div><label className="nhan">Giá trị quà (mã/link)</label>
            <input name="qua_chao_mung_gia_tri" className="o-nhap font-mono" placeholder="WELCOME10" /></div>
        </div>
        <button className="nut-chinh w-full"><Plus className="h-4 w-4" /> Tạo chiến dịch</button>
      </form>
    </div>
  );
}
