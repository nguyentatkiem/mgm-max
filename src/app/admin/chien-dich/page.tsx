import Link from "next/link";
import { Copy, ExternalLink, Pause, Play, Plus, Square } from "lucide-react";
import { q } from "@/db";
import { yeuCauAdmin } from "../bao-ve";
import { actCloneChienDich, actDoiTrangThai } from "../actions";

export const dynamic = "force-dynamic";

const MAU_TT: Record<string, string> = {
  nhap: "bg-slate-100 text-slate-600", chay: "bg-emerald-100 text-emerald-700",
  tam_dung: "bg-amber-100 text-amber-700", dong: "bg-red-100 text-red-700",
};
const TEN_TT: Record<string, string> = { nhap: "Nháp", chay: "Đang chạy", tam_dung: "Tạm dừng", dong: "Đã đóng" };

export default async function DanhSachChienDich() {
  await yeuCauAdmin();
  const cacCd = await q(
    `select c.*, (select count(*) from nguoi_tham_gia n where n.chien_dich_id=c.id and n.xac_minh) as so_lead
     from chien_dich c order by c.id desc`);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">Chiến dịch</h1>
        <Link href="/admin/chien-dich/moi" className="nut-chinh"><Plus className="h-4 w-4" /> Tạo chiến dịch</Link>
      </div>
      <div className="mt-6 space-y-3">
        {cacCd.map((cd) => (
          <div key={cd.id} className="the p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link href={`/admin/chien-dich/${cd.id}`} className="truncate font-bold text-slate-900 hover:text-blue-700">{cd.ten}</Link>
                  <span className={`hieu ${MAU_TT[cd.trang_thai]}`}>{TEN_TT[cd.trang_thai]}</span>
                </div>
                <div className="mt-0.5 text-sm text-slate-500">/c/{cd.slug} · {Number(cd.so_lead)} người xác minh</div>
              </div>
              <div className="flex items-center gap-1.5">
                <a href={`/c/${cd.slug}`} target="_blank" className="nut-phu !px-2.5 !py-1.5 text-xs" title="Mở trang công khai"><ExternalLink className="h-3.5 w-3.5" /></a>
                <form action={actCloneChienDich}><input type="hidden" name="id" value={cd.id} />
                  <button className="nut-phu !px-2.5 !py-1.5 text-xs" title="Nhân bản"><Copy className="h-3.5 w-3.5" /></button></form>
                {cd.trang_thai !== "chay" && cd.trang_thai !== "dong" && (
                  <form action={actDoiTrangThai}><input type="hidden" name="id" value={cd.id} /><input type="hidden" name="trang_thai" value="chay" />
                    <button className="nut-chinh !px-2.5 !py-1.5 text-xs"><Play className="h-3.5 w-3.5" /> Chạy</button></form>
                )}
                {cd.trang_thai === "chay" && (<>
                  <form action={actDoiTrangThai}><input type="hidden" name="id" value={cd.id} /><input type="hidden" name="trang_thai" value="tam_dung" />
                    <button className="nut-phu !px-2.5 !py-1.5 text-xs"><Pause className="h-3.5 w-3.5" /> Dừng</button></form>
                  <form action={actDoiTrangThai}><input type="hidden" name="id" value={cd.id} /><input type="hidden" name="trang_thai" value="dong" />
                    <button className="nut-phu !px-2.5 !py-1.5 text-xs text-red-600"><Square className="h-3.5 w-3.5" /> Đóng</button></form>
                </>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
