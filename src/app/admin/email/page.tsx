import { Inbox, Megaphone, RefreshCw } from "lucide-react";
import { q, mot } from "@/db";
import { yeuCauAdmin } from "../bao-ve";
import { actBroadcast, actXuLyEmail } from "../actions";

export const dynamic = "force-dynamic";

const MAU: Record<string, string> = {
  cho: "bg-amber-100 text-amber-700", da_gui: "bg-emerald-100 text-emerald-700",
  gia_lap: "bg-blue-100 text-blue-700", loi: "bg-red-100 text-red-700",
};
const TEN: Record<string, string> = { cho: "Chờ gửi", da_gui: "Đã gửi", gia_lap: "Giả lập", loi: "Lỗi" };

export default async function TrangEmail(props: { searchParams: Promise<{ broadcast?: string }> }) {
  await yeuCauAdmin();
  const { broadcast } = await props.searchParams;
  const coKey = !!process.env.RESEND_API_KEY;
  const emails = await q(`select * from hang_doi_email order by id desc limit 100`);
  const dem = await mot(`select count(*) filter (where trang_thai='cho') as cho, count(*) as tong from hang_doi_email`);
  const cacCd = await q(`select id, ten from chien_dich order by id desc`);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Email tự động</h1>
          <p className="text-sm text-slate-500">
            {coKey ? "Đang gửi THẬT qua Resend." : <>Chế độ <b className="text-blue-700">giả lập</b> — nội dung hiển thị tại đây thay vì gửi thật (điền RESEND_API_KEY vào .env để gửi thật).</>}
            {" "}Hàng đợi: {Number(dem?.cho || 0)} chờ / {Number(dem?.tong || 0)} tổng.
          </p>
        </div>
        <form action={actXuLyEmail}><button className="nut-chinh !py-2 text-sm"><RefreshCw className="h-4 w-4" /> Xử lý hàng đợi</button></form>
      </div>

      {/* F18 — broadcast email cho toàn bộ participant (UpViral không có) */}
      <div className="the mt-5 p-6">
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><Megaphone className="h-5 w-5 text-blue-600" /> Gửi broadcast</h2>
        <p className="mt-0.5 text-xs text-slate-400">Biến: {"{{ten}} {{diem}} {{link_rieng}}"} — chỉ gửi cho người ĐÃ XÁC MINH.</p>
        {broadcast && <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">✓ Đã xếp {broadcast} email vào hàng đợi.</div>}
        <form action={actBroadcast} className="mt-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            <select name="chien_dich_id" required className="o-nhap !w-auto !py-2 text-sm">
              {cacCd.map((c) => <option key={c.id} value={c.id}>{c.ten}</option>)}
            </select>
            <select name="doi_tuong" className="o-nhap !w-auto !py-2 text-sm">
              <option value="tat_ca">Tất cả người xác minh</option>
              <option value="co_moi">Đã mời được ≥1 bạn</option>
              <option value="chua_moi">Chưa mời được ai</option>
            </select>
          </div>
          <input name="tieu_de" required className="o-nhap !py-2 text-sm" placeholder="Tiêu đề — VD: {{ten}} ơi, còn 3 ngày cuối để nhận quà!" />
          <textarea name="noi_dung" rows={4} required className="o-nhap text-sm" placeholder={"Chào {{ten}},\n\nBạn đang có {{diem}} điểm…\nVào trang của bạn: {{link_rieng}}"} />
          <button className="nut-chinh !py-2 text-sm"><Megaphone className="h-4 w-4" /> Gửi broadcast</button>
        </form>
      </div>

      <div className="mt-5 space-y-3">
        {emails.length === 0 && <div className="the p-8 text-center text-slate-400"><Inbox className="mx-auto h-8 w-8" /><div className="mt-2">Chưa có email nào.</div></div>}
        {emails.map((e) => (
          <details key={e.id} className="the p-4">
            <summary className="flex cursor-pointer flex-wrap items-center gap-2 text-sm">
              <span className={`hieu ${MAU[e.trang_thai]}`}>{TEN[e.trang_thai]}</span>
              <span className="hieu bg-slate-100 text-slate-600">{e.loai}</span>
              <b className="text-slate-800">{e.tieu_de}</b>
              <span className="ml-auto text-xs text-slate-400">→ {e.den_email} · {new Date(e.tao_luc).toLocaleString("vi-VN")}</span>
            </summary>
            <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 font-sans text-sm text-slate-700">{e.noi_dung}</pre>
            {e.loi && <div className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{e.loi}</div>}
          </details>
        ))}
      </div>
    </div>
  );
}
