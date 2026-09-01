import Link from "next/link";
import { Search, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { q } from "@/db";
import { yeuCauAdmin } from "../bao-ve";
import { actDuyetCachLy } from "../actions";

export const dynamic = "force-dynamic";

export default async function DanhSachLead(props: { searchParams: Promise<{ tab?: string; tim?: string; cd?: string }> }) {
  await yeuCauAdmin();
  const { tab = "tat-ca", tim = "", cd = "" } = await props.searchParams;
  const cacCd = await q(`select id, ten from chien_dich order by id desc`);

  const cachLy = await q(
    `select g.id as gt_id, g.diem_rui_ro, g.ly_do_cach_ly, g.tao_luc,
            duoc.id as duoc_id, duoc.ten as duoc_ten, duoc.email as duoc_email, duoc.ip as duoc_ip,
            moi.id as moi_id, moi.ten as moi_ten, moi.email as moi_email, moi.ip as moi_ip
     from gioi_thieu g
     join nguoi_tham_gia duoc on duoc.id=g.nguoi_duoc_moi_id
     join nguoi_tham_gia moi on moi.id=g.nguoi_moi_id
     where g.trang_thai='cach_ly' order by g.id desc`);

  let dieuKien = `where 1=1`;
  const thamSo: unknown[] = [];
  if (cd) { thamSo.push(Number(cd)); dieuKien += ` and n.chien_dich_id=$${thamSo.length}`; }
  if (tim) { thamSo.push(`%${tim.toLowerCase()}%`); dieuKien += ` and (lower(n.email) like $${thamSo.length} or lower(n.ten) like $${thamSo.length} or lower(n.ma) like $${thamSo.length})`; }
  const leads = await q(
    `select n.id, n.ten, n.email, n.ma, n.xac_minh, n.chan, n.diem_rui_ro, n.kenh_vao, n.tao_luc,
            coalesce((select sum(diem) from so_diem s where s.nguoi_id=n.id),0) as diem,
            (select count(*) from gioi_thieu g where g.nguoi_moi_id=n.id and g.trang_thai='xac_minh') as so_ban,
            c.ten as ten_cd
     from nguoi_tham_gia n join chien_dich c on c.id=n.chien_dich_id
     ${dieuKien} order by n.id desc limit 200`, thamSo);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-black text-slate-900">Người tham gia</h1>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link href="/admin/lead" className={`nut-phu !py-1.5 text-sm ${tab !== "cach-ly" ? "!border-blue-500 !text-blue-700 !bg-blue-50" : ""}`}>Tất cả</Link>
        <Link href="/admin/lead?tab=cach-ly" className={`nut-phu !py-1.5 text-sm ${tab === "cach-ly" ? "!border-amber-500 !text-amber-700 !bg-amber-50" : ""}`}>
          <ShieldAlert className="h-4 w-4" /> Khu cách ly ({cachLy.length})
        </Link>
        <form method="get" className="ml-auto flex items-center gap-2">
          <select name="cd" defaultValue={cd} className="o-nhap !w-auto !py-1.5 text-sm">
            <option value="">Mọi chiến dịch</option>
            {cacCd.map((c) => <option key={c.id} value={c.id}>{c.ten}</option>)}
          </select>
          <input name="tim" defaultValue={tim} className="o-nhap !w-48 !py-1.5 text-sm" placeholder="Tìm tên/email/mã…" />
          <button className="nut-chinh !py-1.5 text-sm"><Search className="h-4 w-4" /></button>
        </form>
      </div>

      {tab === "cach-ly" ? (
        <div className="mt-5 space-y-3">
          {cachLy.length === 0 && <div className="the p-6 text-slate-400">Khu cách ly trống — sạch sẽ! ✨</div>}
          {cachLy.map((r) => (
            <div key={r.gt_id} className="the border-amber-200 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="text-sm">
                  <div className="font-bold text-slate-900">{r.duoc_ten} <span className="font-normal text-slate-500">({r.duoc_email})</span></div>
                  <div className="mt-0.5 text-slate-500">được mời bởi <Link className="font-semibold text-blue-700 hover:underline" href={`/admin/lead/${r.moi_id}`}>{r.moi_ten}</Link> ({r.moi_email})</div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs">
                    <span className="hieu bg-amber-100 text-amber-700">Rủi ro: {r.diem_rui_ro}</span>
                    <span className="hieu bg-slate-100 text-slate-600">IP người được mời: {r.duoc_ip || "?"}</span>
                    <span className="hieu bg-slate-100 text-slate-600">IP người mời: {r.moi_ip || "?"}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">{r.ly_do_cach_ly}</div>
                </div>
                <div className="flex gap-2">
                  <form action={actDuyetCachLy}>
                    <input type="hidden" name="gioi_thieu_id" value={r.gt_id} /><input type="hidden" name="quyet_dinh" value="duyet" />
                    <button className="nut-chinh !py-1.5 text-sm !bg-emerald-600 hover:!bg-emerald-700"><ShieldCheck className="h-4 w-4" /> Duyệt (cộng điểm)</button>
                  </form>
                  <form action={actDuyetCachLy}>
                    <input type="hidden" name="gioi_thieu_id" value={r.gt_id} /><input type="hidden" name="quyet_dinh" value="huy" />
                    <button className="nut-phu !py-1.5 text-sm text-red-600"><ShieldX className="h-4 w-4" /> Từ chối</button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="the mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Người tham gia</th><th className="px-4 py-3">Mã</th><th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Điểm</th><th className="px-4 py-3 text-right">Bạn mời</th><th className="px-4 py-3">Kênh vào</th><th className="px-4 py-3">Rủi ro</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 hover:bg-blue-50/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/lead/${l.id}`} className="font-semibold text-slate-800 hover:text-blue-700">{l.ten}</Link>
                    <div className="text-xs text-slate-400">{l.email} · {l.ten_cd}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{l.ma}</td>
                  <td className="px-4 py-3">
                    {l.chan ? <span className="hieu bg-red-100 text-red-700">Đã chặn</span>
                      : l.xac_minh ? <span className="hieu bg-emerald-100 text-emerald-700">Xác minh</span>
                      : <span className="hieu bg-slate-100 text-slate-500">Chờ email</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-blue-700">{Number(l.diem)}</td>
                  <td className="px-4 py-3 text-right">{Number(l.so_ban)}</td>
                  <td className="px-4 py-3 text-xs capitalize text-slate-500">{l.kenh_vao || "trực tiếp"}</td>
                  <td className="px-4 py-3">{l.diem_rui_ro > 0 && <span className={`hieu ${l.diem_rui_ro >= 50 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{l.diem_rui_ro}</span>}</td>
                </tr>
              ))}
              {leads.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">Chưa có người tham gia nào.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
