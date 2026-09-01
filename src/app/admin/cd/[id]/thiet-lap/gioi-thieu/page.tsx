import { ArrowRight, Save, UserPlus, Crown } from "lucide-react";
import { mot } from "@/db";
import { actSuaGioiThieu } from "../../../../actions";

export const dynamic = "force-dynamic";

export default async function ThuongGioiThieu(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Thưởng giới thiệu (hai chiều)</h1>
      <p className="text-sm text-slate-500">Thưởng cả người mời lẫn người được mời — lời mời dễ được nhận hơn hẳn khi cả hai cùng có quà.</p>

      <form action={actSuaGioiThieu}>
        <input type="hidden" name="id" value={cd.id} />
        <div className="mt-5 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
          {/* Người mời */}
          <div className="the p-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50"><Crown className="h-6 w-6 text-blue-600" /></span>
            <h2 className="mt-3 font-black text-slate-900">Người mời</h2>
            <p className="mt-1 text-sm text-slate-500">Nhận điểm mỗi khi bạn bè xác minh — điểm mở mốc quà &amp; làm vé bốc thăm.</p>
            <div className="mx-auto mt-4 max-w-[220px]">
              <label className="nhan">Điểm mỗi bạn xác minh</label>
              <input name="diem_moi_ban" type="number" min={1} defaultValue={cd.diem_moi_ban} className="o-nhap text-center text-lg font-black" />
            </div>
          </div>
          <div className="hidden items-center lg:flex"><ArrowRight className="h-8 w-8 text-slate-300" /></div>
          {/* Người được mời */}
          <div className="the p-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50"><UserPlus className="h-6 w-6 text-violet-600" /></span>
            <h2 className="mt-3 font-black text-slate-900">Người được mời</h2>
            <p className="mt-1 text-sm text-slate-500">Nhận quà chào mừng ngay khi xác minh email qua link của bạn mình.</p>
            <label className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" name="hai_chieu" defaultChecked={cd.hai_chieu} /> Bật quà chào mừng
            </label>
            <div className="mt-3 grid gap-2">
              <input name="qua_chao_mung" defaultValue={cd.qua_chao_mung} className="o-nhap !py-2 text-sm" placeholder="Tên quà — VD: Mã giảm 10%" />
              <input name="qua_chao_mung_gia_tri" defaultValue={cd.qua_chao_mung_gia_tri} className="o-nhap !py-2 font-mono text-sm" placeholder="Mã/link — VD: WELCOME10" />
            </div>
          </div>
        </div>
        <button className="nut-chinh mt-4"><Save className="h-4 w-4" /> Lưu cấu hình</button>
      </form>

      <div className="the mt-6 p-6">
        <h2 className="text-center font-black text-slate-900">Cơ chế hoạt động</h2>
        <div className="mt-4 grid gap-3 text-center text-sm text-slate-600 sm:grid-cols-4">
          {["A đăng ký, nhận link riêng", "A gửi link cho B", "B xác minh email → B nhận quà chào mừng", "A +điểm, đủ mốc là quà tự mở"].map((b, i) => (
            <div key={i} className="rounded-xl bg-slate-50 p-4">
              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">{i + 1}</div>
              <div className="mt-2">{b}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
