import { Plug, Save, Webhook } from "lucide-react";
import { mot } from "@/db";
import { layCheDoAI } from "@/services/ai";
import { layCaiDat } from "@/services/cai-dat";
import { actSuaGiaoDien } from "../../../../../actions";

export const dynamic = "force-dynamic";

export default async function KetNoi(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const coResend = !!process.env.RESEND_API_KEY || !!(await layCaiDat("resend_api_key"));
  const che = await layCheDoAI();

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Kết nối &amp; Webhook</h1>
      <p className="text-sm text-slate-500">Đẩy dữ liệu chiến dịch sang hệ thống khác của anh theo thời gian thực.</p>

      <div className="mt-5 space-y-3">
        <div className="hang-cai">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Plug className="h-5 w-5" /></span>
            <div>
              <div className="font-bold text-slate-800">Gửi email — Resend</div>
              <div className="text-xs text-slate-400">Biến môi trường RESEND_API_KEY (+ EMAIL_FROM domain riêng)</div>
            </div>
          </div>
          <span className={`hieu ${coResend ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{coResend ? "Đang gửi thật" : "Giả lập"}</span>
        </div>
        <div className="hang-cai">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Plug className="h-5 w-5" /></span>
            <div>
              <div className="font-bold text-slate-800">Referral AI — Claude</div>
              <div className="text-xs text-slate-400">{che === "cli" ? "Claude CLI — gói subscription (đăng nhập trên máy chủ)" : "Claude API — ANTHROPIC_API_KEY"}</div>
            </div>
          </div>
          <span className={`hieu ${che === "cli" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{che === "cli" ? "Gói sub (CLI)" : "API key"}</span>
        </div>
      </div>

      <form action={actSuaGiaoDien} className="the mt-4 p-5">
        <input type="hidden" name="id" value={cd.id} />
        <input type="hidden" name="kenh_share_hien_tai" value={cd.kenh_share} />
        <input type="hidden" name="anh_cover" value={cd.anh_cover} />
        <input type="hidden" name="logo_url" value={cd.logo_url} />
        <input type="hidden" name="mau_chinh" value={cd.mau_chinh} />
        <input type="hidden" name="video_url" value={cd.video_url} />
        <input type="hidden" name="og_tieu_de" value={cd.og_tieu_de} />
        <input type="hidden" name="og_mo_ta" value={cd.og_mo_ta} />
        <input type="hidden" name="og_anh" value={cd.og_anh} />
        {Object.entries((cd.loi_moi || {}) as Record<string, string>).map(([k, v]) => (
          <input key={k} type="hidden" name={`loi_moi_${k}`} value={v} />
        ))}
        <input type="hidden" name="truong_them" value={(cd.truong_them || []).map((t: { ten: string; bat_buoc: boolean }) => (t.bat_buoc ? "*" : "") + t.ten).join("\n")} />

        <h2 className="flex items-center gap-2 font-bold text-slate-900"><Webhook className="h-5 w-5 text-blue-600" /> Webhook sự kiện</h2>
        <p className="mt-0.5 text-xs text-slate-400">
          Bắn POST JSON tới URL của anh khi: <code className="font-mono">lead.xac_minh · gioi_thieu.xac_minh · moc.mo_khoa · boc_tham.trung_giai</code> — nối LMS/CRM/Google Sheets (qua middleware) đều được.
        </p>
        <div className="mt-3 flex gap-2">
          <input name="webhook_url" defaultValue={cd.webhook_url} className="o-nhap font-mono text-sm" placeholder="https://he-thong-cua-anh.vn/webhook" />
          <button className="nut-chinh !py-2 text-sm shrink-0"><Save className="h-4 w-4" /> Lưu</button>
        </div>
      </form>
    </div>
  );
}
