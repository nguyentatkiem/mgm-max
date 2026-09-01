import { Dice5, ShieldCheck, UserCheck, X } from "lucide-react";
import { q } from "@/db";
import { yeuCauAdmin } from "../bao-ve";
import { actChayBocTham, actChiDinhWinner, actDuyetBocTham, actHuyBocTham } from "../actions";

export const dynamic = "force-dynamic";

export default async function TrangBocTham() {
  await yeuCauAdmin();
  const cacCd = await q(`select id, ten, giai_boc_tham, so_giai from chien_dich where giai_boc_tham <> '' order by id desc`);
  const cacLan = await q(
    `select b.*, c.ten as ten_cd, c.giai_boc_tham from boc_tham b join chien_dich c on c.id=b.chien_dich_id order by b.id desc limit 20`);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-black text-slate-900">Bốc thăm trọng số điểm</h1>
      <p className="mt-1 text-sm text-slate-500">Mỗi điểm = 1 vé. Seed được ghi log để tái lập kết quả khi cần đối chất. Kết quả phải được duyệt tay mới trao giải + gửi email.</p>

      <div className="the mt-5 p-6">
        <h2 className="font-bold text-slate-900">Chạy bốc thăm mới</h2>
        {cacCd.length === 0 && <p className="mt-2 text-sm text-slate-400">Chưa có chiến dịch nào cấu hình giải bốc thăm.</p>}
        <div className="mt-3 space-y-3">
          {cacCd.map((cd) => (
            <div key={cd.id} className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-sm"><b>{cd.ten}</b> — {cd.giai_boc_tham} ({cd.so_giai} giải)</div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <form action={actChayBocTham} className="flex items-center gap-2">
                  <input type="hidden" name="chien_dich_id" value={cd.id} />
                  <select name="cach" className="o-nhap !w-auto !py-1.5 text-sm">
                    <option value="trong_so">🎲 Bốc thăm trọng số điểm</option>
                    <option value="diem_cao">🏆 Theo hạng leaderboard (top 1/2/3…)</option>
                  </select>
                  <button className="nut-chinh !py-1.5 text-sm"><Dice5 className="h-4 w-4" /> Chạy</button>
                </form>
                <form action={actChiDinhWinner} className="flex items-center gap-2">
                  <input type="hidden" name="chien_dich_id" value={cd.id} />
                  <input name="email" type="email" required className="o-nhap !w-52 !py-1.5 text-sm" placeholder="Chỉ định tay: email…" />
                  <input name="giai" type="number" defaultValue={1} min={1} className="o-nhap !w-16 !py-1.5 text-sm" title="Giải số" />
                  <button className="nut-phu !py-1.5 text-sm"><UserCheck className="h-4 w-4" /> Chỉ định</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {cacLan.map((b) => (
          <div key={b.id} className={`the p-6 ${b.trang_thai === "cho_duyet" ? "!border-amber-300" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900">#{b.id} · {b.ten_cd}</span>
                <span className={`ml-2 hieu ${b.trang_thai === "da_duyet" ? "bg-emerald-100 text-emerald-700" : b.trang_thai === "huy" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                  {b.trang_thai === "da_duyet" ? "Đã duyệt & trao giải" : b.trang_thai === "huy" ? "Đã huỷ" : "Chờ duyệt"}
                </span>
                <div className="mt-0.5 text-xs text-slate-400">
                  Cách: <b>{b.cach === "diem_cao" ? "theo hạng" : b.cach === "tay" ? "chỉ định tay" : "trọng số điểm"}</b> · Seed: <code className="font-mono">{b.seed}</code> · {new Date(b.tao_luc).toLocaleString("vi-VN")}
                </div>
              </div>
              {b.trang_thai === "cho_duyet" && (
                <div className="flex gap-2">
                  <form action={actDuyetBocTham}><input type="hidden" name="id" value={b.id} />
                    <button className="nut-chinh !py-1.5 text-sm !bg-emerald-600 hover:!bg-emerald-700"><ShieldCheck className="h-4 w-4" /> Duyệt & trao giải</button></form>
                  <form action={actHuyBocTham}><input type="hidden" name="id" value={b.id} />
                    <button className="nut-phu !py-1.5 text-sm text-red-600"><X className="h-4 w-4" /> Huỷ</button></form>
                </div>
              )}
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {(b.ket_qua as { giai: number; ten: string; email: string; diem: number; id: number }[]).map((w) => (
                <li key={w.giai} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2">
                  <span>{w.giai <= 3 ? ["🥇", "🥈", "🥉"][w.giai - 1] : "🏅"} <b>Giải {w.giai}</b>: {w.ten} <span className="text-slate-400">({w.email})</span></span>
                  <a href={`/admin/lead/${w.id}`} className="text-xs font-semibold text-blue-700 hover:underline">{w.diem} vé · xem hồ sơ →</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
