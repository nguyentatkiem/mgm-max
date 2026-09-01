import Link from "next/link";
import { Facebook, Instagram, MessageCircle, MessageSquare, Music2, PlayCircle, Sparkles, Trash2, Users, Youtube, Zap } from "lucide-react";
import { mot, q } from "@/db";
import { MAU_NHIEM_VU } from "@/ui/mau-chien-dich";
import { actBatTatHanhDong, actThemHanhDong, actXoaHanhDong } from "../../../../../actions";

export const dynamic = "force-dynamic";

const ICON: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Sparkles, MessageCircle, Music2, Instagram, Facebook, Users, Youtube, MessageSquare, PlayCircle,
};

export default async function NhiemVu(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mau?: string }>;
}) {
  const { id } = await props.params;
  const { mau } = await props.searchParams;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const hanhDong = await q(`select * from hanh_dong_tuy_chinh where chien_dich_id=$1 order by id`, [cd.id]);
  const mauChon = MAU_NHIEM_VU.find((m) => m.ma === mau);

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Nhiệm vụ cộng điểm</h1>
      <p className="text-sm text-slate-500">Thêm cách kiếm điểm ngoài mời bạn: xem video, vào nhóm, theo dõi kênh… Xác minh bằng câu hỏi.</p>

      {/* Bộ mẫu nhiệm vụ */}
      <div className="the mt-5 p-5">
        <h2 className="font-bold text-slate-900">Chọn mẫu nhiệm vụ</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {MAU_NHIEM_VU.map((m) => {
            const Ic = ICON[m.icon] || Zap;
            const bat = mauChon?.ma === m.ma;
            return (
              <Link key={m.ma} href={`?mau=${m.ma}`} scroll={false}
                className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${bat ? "border-blue-400 bg-blue-50/60" : "border-slate-200 hover:border-slate-300"}`}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: m.mau }}><Ic className="h-4.5 w-4.5" /></span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-slate-800">{m.ten}</div>
                  <div className="line-clamp-2 text-xs text-slate-400">{m.moTa}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Form thêm (prefill theo mẫu) */}
      <form action={actThemHanhDong} className="the mt-4 grid grid-cols-2 gap-3 p-5" key={mauChon?.ma || "trong"}>
        <input type="hidden" name="chien_dich_id" value={cd.id} />
        <div><label className="nhan">Tên nhiệm vụ</label><input name="ten" required defaultValue={mauChon?.ten || ""} className="o-nhap !py-1.5" /></div>
        <div><label className="nhan">Điểm</label><input name="diem" type="number" defaultValue={mauChon?.diem || 10} className="o-nhap !py-1.5" /></div>
        <div><label className="nhan">Mô tả</label><input name="mo_ta" defaultValue={mauChon?.moTa || ""} className="o-nhap !py-1.5" /></div>
        <div><label className="nhan">URL đích</label><input name="url" defaultValue={mauChon?.urlGoiY || ""} className="o-nhap !py-1.5" placeholder="https://…" /></div>
        <div><label className="nhan">Câu hỏi xác minh</label><input name="cau_hoi" required defaultValue={mauChon?.cauHoi || ""} className="o-nhap !py-1.5" /></div>
        <div><label className="nhan">Đáp án đúng</label><input name="dap_an" required className="o-nhap !py-1.5" placeholder="Anh tự điền đáp án" /></div>
        <button className="nut-chinh col-span-2 !py-2 text-sm"><Zap className="h-4 w-4" /> Thêm nhiệm vụ</button>
      </form>

      {/* Danh sách đã tạo */}
      <div className="mt-4 space-y-2">
        {hanhDong.map((h) => (
          <div key={h.id} className={`hang-cai ${h.bat ? "" : "opacity-60"}`}>
            <div className="min-w-0">
              <div className="font-semibold text-slate-800">{h.ten} <span className="hieu bg-blue-100 text-blue-700">+{h.diem}đ</span></div>
              <div className="truncate text-xs text-slate-400">Hỏi: {h.cau_hoi} → Đáp: {h.dap_an}</div>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <form action={actBatTatHanhDong}><input type="hidden" name="id" value={h.id} /><input type="hidden" name="chien_dich_id" value={cd.id} />
                <button className={`cong-tac ${h.bat ? "bat" : "tat"}`}><span className="num" /></button></form>
              <form action={actXoaHanhDong}><input type="hidden" name="id" value={h.id} /><input type="hidden" name="chien_dich_id" value={cd.id} />
                <button className="text-slate-400 hover:text-red-600 cursor-pointer"><Trash2 className="h-4 w-4" /></button></form>
            </div>
          </div>
        ))}
        {hanhDong.length === 0 && <div className="the p-6 text-center text-sm text-slate-400">Chưa có nhiệm vụ nào — chọn mẫu ở trên rồi bấm «Thêm nhiệm vụ».</div>}
      </div>
    </div>
  );
}
