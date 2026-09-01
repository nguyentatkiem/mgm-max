import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Ban, ExternalLink, Network, ScrollText } from "lucide-react";
import { mot, q } from "@/db";
import { yeuCauAdmin } from "../../bao-ve";
import { actChanNguoi, actSuaDiemTay } from "../../actions";

export const dynamic = "force-dynamic";

export default async function HoSoLead(props: { params: Promise<{ id: string }> }) {
  await yeuCauAdmin();
  const { id } = await props.params;
  const ng = await mot(`select n.*, c.ten as ten_cd, c.slug from nguoi_tham_gia n join chien_dich c on c.id=n.chien_dich_id where n.id=$1`, [Number(id)]);
  if (!ng) redirect("/admin/lead");

  const nguoiMoi = ng.nguoi_moi_id ? await mot(`select id, ten, email from nguoi_tham_gia where id=$1`, [ng.nguoi_moi_id]) : null;
  const daMoi = await q(
    `select g.trang_thai, g.diem_rui_ro, n.id, n.ten, n.email, n.ip, n.tao_luc
     from gioi_thieu g join nguoi_tham_gia n on n.id=g.nguoi_duoc_moi_id where g.nguoi_moi_id=$1 order by g.id desc`, [ng.id]);
  const soDiem = await q(`select * from so_diem where nguoi_id=$1 order by id desc limit 100`, [ng.id]);
  const tong = soDiem.reduce((s, r) => s + r.diem, 0);
  const qua = await q(`select * from qua_da_trao where nguoi_id=$1 order by id desc`, [ng.id]);

  const TT: Record<string, string> = { cho: "Chờ xác minh", xac_minh: "✓ Xác minh", cach_ly: "⚠ Cách ly", huy: "✗ Huỷ" };

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/lead" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"><ArrowLeft className="h-4 w-4" /> Danh sách</Link>
      <div className="the mt-3 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900">{ng.ten} {ng.chan && <span className="hieu bg-red-100 text-red-700">Đã chặn</span>}</h1>
            <div className="mt-1 text-sm text-slate-500">{ng.email} · mã <code className="font-mono font-bold">{ng.ma}</code> · {ng.ten_cd}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="hieu bg-slate-100 text-slate-600">IP: {ng.ip || "?"}</span>
              <span className="hieu bg-slate-100 text-slate-600">Kênh vào: {ng.kenh_vao || "trực tiếp"}</span>
              <span className={`hieu ${ng.xac_minh ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{ng.xac_minh ? "Đã xác minh" : "Chưa xác minh"}</span>
              {ng.diem_rui_ro > 0 && <span className="hieu bg-amber-100 text-amber-700">Rủi ro: {ng.diem_rui_ro}</span>}
            </div>
            {nguoiMoi && (
              <div className="mt-2 text-sm text-slate-500">
                Được mời bởi: <Link href={`/admin/lead/${nguoiMoi.id}`} className="font-semibold text-blue-700 hover:underline">{nguoiMoi.ten}</Link> ({nguoiMoi.email})
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-2xl bg-blue-600 px-5 py-3 text-center text-white">
              <div className="text-2xl font-black">{tong}</div><div className="text-xs">điểm</div>
            </div>
            <a href={`/toi/${ng.ma}`} target="_blank" className="nut-phu !py-2 text-sm"><ExternalLink className="h-4 w-4" /> Trang của họ</a>
            <form action={actChanNguoi}><input type="hidden" name="nguoi_id" value={ng.id} />
              <button className={`nut-phu !py-2 text-sm ${ng.chan ? "" : "text-red-600"}`}><Ban className="h-4 w-4" /> {ng.chan ? "Bỏ chặn" : "Chặn"}</button></form>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Cây referral */}
        <div className="the p-6">
          <h2 className="flex items-center gap-2 font-bold text-slate-900"><Network className="h-5 w-5 text-blue-600" /> Đã mời ({daMoi.length})</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {daMoi.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5">
                <div>
                  <Link href={`/admin/lead/${r.id}`} className="font-semibold text-slate-700 hover:text-blue-700">{r.ten}</Link>
                  <div className="text-xs text-slate-400">{r.email} · IP {r.ip || "?"}</div>
                </div>
                <span className={`hieu ${r.trang_thai === "xac_minh" ? "bg-emerald-100 text-emerald-700" : r.trang_thai === "cach_ly" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>{TT[r.trang_thai]}</span>
              </li>
            ))}
            {daMoi.length === 0 && <li className="text-slate-400">Chưa mời được ai.</li>}
          </ul>
          {qua.length > 0 && (<>
            <h3 className="mt-5 text-sm font-bold text-slate-700">🎁 Quà đã nhận</h3>
            <ul className="mt-2 space-y-1.5 text-sm">
              {qua.map((r) => (
                <li key={r.id} className="flex justify-between rounded-lg bg-blue-50/60 px-3 py-2">
                  <span>{r.ten_qua}</span>{r.gia_tri && <code className="font-mono text-xs font-bold text-blue-700">{r.gia_tri}</code>}
                </li>
              ))}
            </ul>
          </>)}
        </div>

        {/* Sổ cái điểm + sửa tay */}
        <div className="the p-6">
          <h2 className="flex items-center gap-2 font-bold text-slate-900"><ScrollText className="h-5 w-5 text-blue-600" /> Sổ cái điểm</h2>
          <form action={actSuaDiemTay} className="mt-3 flex gap-2">
            <input type="hidden" name="nguoi_id" value={ng.id} />
            <input name="delta" type="number" required className="o-nhap !w-24 !py-1.5 text-sm" placeholder="±điểm" />
            <input name="ly_do" required className="o-nhap !py-1.5 text-sm" placeholder="Lý do (bắt buộc, có log)" />
            <button className="nut-chinh !py-1.5 text-sm shrink-0">Ghi</button>
          </form>
          <ul className="mt-3 max-h-96 space-y-1.5 overflow-y-auto text-sm">
            {soDiem.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <div>
                  <span className="font-medium text-slate-700">{r.hanh_dong}</span>
                  <span className="ml-1 text-xs text-slate-400">{r.doi_tuong}{r.ghi_chu ? ` — ${r.ghi_chu}` : ""}</span>
                </div>
                <span className={`font-bold ${r.diem >= 0 ? "text-blue-700" : "text-red-600"}`}>{r.diem > 0 ? "+" : ""}{r.diem}</span>
              </li>
            ))}
            {soDiem.length === 0 && <li className="text-slate-400">Chưa có điểm nào.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
