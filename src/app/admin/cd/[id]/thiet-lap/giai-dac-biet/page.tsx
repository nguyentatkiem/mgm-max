import Link from "next/link";
import { Dice5, Save, ShieldCheck, Trophy, UserCheck, X } from "lucide-react";
import { mot, q } from "@/db";
import { actChayBocTham, actChiDinhWinner, actDuyetBocTham, actHuyBocTham, actSuaGiaiDacBiet } from "../../../../actions";

export const dynamic = "force-dynamic";

export default async function GiaiDacBiet(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const cacLan = await q(`select * from boc_tham where chien_dich_id=$1 order by id desc limit 10`, [cd.id]);
  const ketThuc = cd.ket_thuc_luc ? new Date(cd.ket_thuc_luc).toISOString().slice(0, 16) : "";

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Giải đặc biệt</h1>
      <p className="text-sm text-slate-500">Một giải lớn chung cuộc để ai cũng có lý do kiếm thêm điểm — mỗi điểm là một vé.</p>

      <form action={actSuaGiaiDacBiet} className="the mt-5 space-y-4 p-6">
        <input type="hidden" name="id" value={cd.id} />
        <div>
          <label className="nhan">Tên giải (để trống = không chạy bốc thăm)</label>
          <input name="giai_boc_tham" defaultValue={cd.giai_boc_tham} className="o-nhap" placeholder="VD: 1 suất học miễn phí trọn đời" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="nhan">Số giải (nhất/nhì/ba…)</label>
            <input name="so_giai" type="number" min={1} max={20} defaultValue={cd.so_giai} className="o-nhap" /></div>
          <div><label className="nhan">Hạn chót (cron sẽ tự chốt; trống = evergreen)</label>
            <input name="ket_thuc_luc" type="datetime-local" defaultValue={ketThuc} className="o-nhap" /></div>
        </div>
        <button className="nut-chinh"><Save className="h-4 w-4" /> Lưu giải</button>
      </form>

      {cd.giai_boc_tham && (
        <div className="the mt-5 p-6">
          <h2 className="flex items-center gap-2 font-bold text-slate-900"><Trophy className="h-5 w-5 text-amber-500" /> Chốt người thắng</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <form action={actChayBocTham} className="flex items-center gap-2">
              <input type="hidden" name="chien_dich_id" value={cd.id} />
              <select name="cach" className="o-nhap !w-auto !py-1.5 text-sm">
                <option value="trong_so">🎲 Bốc thăm trọng số điểm</option>
                <option value="diem_cao">🏆 Theo hạng leaderboard</option>
              </select>
              <button className="nut-chinh !py-1.5 text-sm"><Dice5 className="h-4 w-4" /> Chạy</button>
            </form>
            <form action={actChiDinhWinner} className="flex items-center gap-2">
              <input type="hidden" name="chien_dich_id" value={cd.id} />
              <input name="email" type="email" required className="o-nhap !w-52 !py-1.5 text-sm" placeholder="Chỉ định tay: email…" />
              <input name="giai" type="number" defaultValue={1} min={1} className="o-nhap !w-16 !py-1.5 text-sm" />
              <button className="nut-phu !py-1.5 text-sm"><UserCheck className="h-4 w-4" /> Chỉ định</button>
            </form>
          </div>

          <div className="mt-4 space-y-3">
            {cacLan.map((b) => (
              <div key={b.id} className={`rounded-xl border p-4 ${b.trang_thai === "cho_duyet" ? "border-amber-300 bg-amber-50/40" : "border-slate-200"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm">
                    <b>Lần #{b.id}</b>
                    <span className={`ml-2 hieu ${b.trang_thai === "da_duyet" ? "bg-emerald-100 text-emerald-700" : b.trang_thai === "huy" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {b.trang_thai === "da_duyet" ? "Đã trao giải" : b.trang_thai === "huy" ? "Đã huỷ" : "Chờ duyệt"}
                    </span>
                    <div className="mt-0.5 text-xs text-slate-400">Cách: {b.cach === "diem_cao" ? "theo hạng" : b.cach === "tay" ? "chỉ định" : "trọng số"} · Seed: <code className="font-mono">{b.seed}</code></div>
                  </div>
                  {b.trang_thai === "cho_duyet" && (
                    <div className="flex gap-2">
                      <form action={actDuyetBocTham}><input type="hidden" name="id" value={b.id} />
                        <button className="nut-chinh !py-1.5 text-xs !bg-emerald-600 hover:!bg-emerald-700"><ShieldCheck className="h-3.5 w-3.5" /> Duyệt &amp; trao</button></form>
                      <form action={actHuyBocTham}><input type="hidden" name="id" value={b.id} />
                        <button className="nut-phu !py-1.5 text-xs text-red-600"><X className="h-3.5 w-3.5" /> Huỷ</button></form>
                    </div>
                  )}
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  {(b.ket_qua as { giai: number; ten: string; email: string; diem: number; id: number }[]).map((w) => (
                    <li key={w.giai} className="flex justify-between rounded-lg bg-white px-3 py-1.5">
                      <span>{w.giai <= 3 ? ["🥇", "🥈", "🥉"][w.giai - 1] : "🏅"} {w.ten} <span className="text-slate-400">({w.email})</span></span>
                      <Link href={`/admin/lead/${w.id}`} className="text-xs font-semibold text-blue-700 hover:underline">{w.diem} vé · hồ sơ →</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {cacLan.length === 0 && <p className="text-sm text-slate-400">Chưa chạy lần nào. Cron sẽ tự bốc thăm khi tới hạn chót (kết quả vẫn chờ anh duyệt).</p>}
          </div>
        </div>
      )}
    </div>
  );
}
