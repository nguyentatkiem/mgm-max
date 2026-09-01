import Link from "next/link";
import { AlertTriangle, CalendarClock, Copy, Eye, Gift, MousePointerClick, Plus, Trophy, UserPlus, Users } from "lucide-react";
import { mot, q } from "@/db";
import { yeuCauAdmin } from "./bao-ve";
import { actCloneChienDich, actDoiTrangThai } from "./actions";

export const dynamic = "force-dynamic";

const MAU_TT: Record<string, string> = {
  nhap: "bg-slate-100 text-slate-600", chay: "bg-emerald-100 text-emerald-700",
  tam_dung: "bg-amber-100 text-amber-700", dong: "bg-red-100 text-red-700",
};
const TEN_TT: Record<string, string> = { nhap: "Nháp", chay: "Đang chạy", tam_dung: "Tạm dừng", dong: "Đã đóng" };

export default async function TongQuanTaiKhoan() {
  await yeuCauAdmin();
  const tong = await mot(
    `select (select count(*) from click_link) as ghe,
            (select count(*) from nguoi_tham_gia where xac_minh) as lead,
            (select count(*) from nguoi_tham_gia where xac_minh and nguoi_moi_id is not null) as gioithieu`);
  const cacCd = await q(
    `select c.*,
       (select count(*) from nguoi_tham_gia n where n.chien_dich_id=c.id and n.xac_minh) as so_lead,
       (select count(*) from click_link k join nguoi_tham_gia n2 on n2.ma=k.ma where n2.chien_dich_id=c.id) as so_ghe,
       (select count(*) from moc_qua m where m.chien_dich_id=c.id) as so_moc
     from chien_dich c order by c.id desc`);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {/* 3 chỉ số tài khoản */}
      <div className="the grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {[
          { ten: "Tổng lượt ghé", so: Number(tong?.ghe || 0), icon: MousePointerClick },
          { ten: "Tổng người xác minh", so: Number(tong?.lead || 0), icon: Users },
          { ten: "Lead từ giới thiệu", so: Number(tong?.gioithieu || 0), icon: UserPlus },
        ].map((o) => (
          <div key={o.ten} className="flex items-center gap-4 p-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><o.icon className="h-6 w-6" /></span>
            <div>
              <div className="text-2xl font-black text-slate-900">{o.so}</div>
              <div className="text-sm text-slate-500">{o.ten}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Danh sách chiến dịch */}
      <div className="mt-8 flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900">{cacCd.length} Chương trình &amp; Chiến dịch</h1>
        <Link href="/admin/moi" className="nut-chinh"><Plus className="h-4 w-4" /> Chiến dịch mới</Link>
      </div>

      <div className="mt-4 space-y-4">
        {cacCd.length === 0 && (
          <div className="the p-10 text-center text-slate-500">
            Chưa có chiến dịch nào. <Link className="font-bold text-blue-700" href="/admin/moi">Tạo chiến dịch đầu tiên →</Link>
          </div>
        )}
        {cacCd.map((cd) => {
          const thieuCauHinh = Number(cd.so_moc) === 0 && !cd.giai_boc_tham;
          return (
            <div key={cd.id} className="the flex flex-wrap items-center gap-4 p-4">
              {/* thumbnail mini của trang đăng ký */}
              <Link href={`/admin/cd/${cd.id}/tong-quan`}
                className="flex h-24 w-40 shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl px-2 text-center"
                style={{ background: `linear-gradient(160deg, ${cd.mau_chinh || "#2563eb"}, ${cd.mau_chinh || "#2563eb"}99)` }}>
                <span className="line-clamp-2 text-[10px] font-bold leading-tight text-white">{cd.tieu_de_trang || cd.ten}</span>
                <span className="rounded-full bg-white/90 px-2 py-0.5 text-[8px] font-bold" style={{ color: cd.mau_chinh || "#2563eb" }}>{cd.nut_cta || "Đăng ký nhận quà"}</span>
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/cd/${cd.id}/tong-quan`} className="truncate text-lg font-black text-slate-900 hover:text-blue-700">{cd.ten}</Link>
                  <span className={`hieu ${MAU_TT[cd.trang_thai]}`}>{TEN_TT[cd.trang_thai]}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {cd.giai_boc_tham && <span className="hieu bg-slate-100 text-slate-600"><Trophy className="h-3 w-3" /> Giải đặc biệt</span>}
                  {Number(cd.so_moc) > 0 && <span className="hieu bg-slate-100 text-slate-600"><Gift className="h-3 w-3" /> {cd.so_moc} mốc quà</span>}
                  {cd.hai_chieu && <span className="hieu bg-slate-100 text-slate-600"><UserPlus className="h-3 w-3" /> Thưởng 2 chiều</span>}
                  <span className="hieu bg-slate-100 text-slate-600"><CalendarClock className="h-3 w-3" /> {new Date(cd.tao_luc).toLocaleDateString("vi-VN")}</span>
                </div>
                {thieuCauHinh && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                    <AlertTriangle className="h-3.5 w-3.5" /> Chiến dịch chưa có mốc quà hoặc giải — <Link className="underline" href={`/admin/cd/${cd.id}/thiet-lap/moc-qua`}>bổ sung ngay</Link>
                  </div>
                )}
                <div className="mt-1.5 text-xs text-slate-400">/c/{cd.slug}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-xl border border-slate-200 px-4 py-2"><div className="text-lg font-black text-slate-900">{Number(cd.so_ghe)}</div><div className="text-[10px] text-slate-400">Lượt ghé</div></div>
                  <div className="rounded-xl border border-slate-200 px-4 py-2"><div className="text-lg font-black text-blue-700">{Number(cd.so_lead)}</div><div className="text-[10px] text-slate-400">Lead</div></div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <a href={`/c/${cd.slug}`} target="_blank" className="nut-phu !px-2.5 !py-1.5 text-xs" title="Xem trang"><Eye className="h-3.5 w-3.5" /></a>
                  <form action={actCloneChienDich}><input type="hidden" name="id" value={cd.id} />
                    <button className="nut-phu !px-2.5 !py-1.5 text-xs" title="Nhân bản"><Copy className="h-3.5 w-3.5" /></button></form>
                  {cd.trang_thai === "chay" && (
                    <form action={actDoiTrangThai}><input type="hidden" name="id" value={cd.id} /><input type="hidden" name="trang_thai" value="tam_dung" />
                      <button className="nut-phu !px-2.5 !py-1.5 text-[10px]">Dừng</button></form>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
