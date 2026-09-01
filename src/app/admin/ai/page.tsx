import { Sparkles, TerminalSquare, Wand2 } from "lucide-react";
import { yeuCauAdmin } from "../bao-ve";
import { cheDoAI } from "@/services/ai";
import { actTaoBangAI } from "../actions";

export const dynamic = "force-dynamic";

// F51 — Referral AI: tính năng đinh của UpViral 2.0, bản MGM MAX chạy bằng Claude (CLI gói sub hoặc API)
export default async function TrangAI(props: { searchParams: Promise<{ loi?: string }> }) {
  await yeuCauAdmin();
  const { loi } = await props.searchParams;
  const che = cheDoAI();

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <div className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white"><Sparkles className="h-5 w-5" /></span>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Tạo chiến dịch bằng AI</h1>
          <p className="text-sm text-slate-500">Khai vài dòng về sản phẩm — Claude thiết kế trọn chiến dịch: mốc quà, giải bốc thăm, nhiệm vụ, lời mời từng kênh.</p>
        </div>
      </div>

      <div className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${che === "cli" ? "bg-emerald-50 text-emerald-700" : che === "api" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-800"}`}>
        <TerminalSquare className="h-4 w-4" />
        {che === "cli" && "Đang dùng Claude CLI — gói subscription (không tốn phí API)"}
        {che === "api" && "Đang dùng Claude API (ANTHROPIC_API_KEY)"}
      </div>

      {loi && <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{loi}</div>}

      <form action={actTaoBangAI} className="the mt-5 space-y-4 p-6">
        <div><label className="nhan">Thương hiệu / tên của anh</label>
          <input name="thuong_hieu" required className="o-nhap" placeholder="VD: Học viện AI Kiêm" /></div>
        <div><label className="nhan">Website (tuỳ chọn)</label>
          <input name="website" className="o-nhap" placeholder="https://…" /></div>
        <div><label className="nhan">Sản phẩm số / khoá học cần viral</label>
          <textarea name="san_pham" required rows={2} className="o-nhap" placeholder="VD: Khoá học «AI thực chiến cho dân văn phòng» 8 tuần, giá 2,9 triệu" /></div>
        <div><label className="nhan">Khách hàng mục tiêu</label>
          <input name="doi_tuong" required className="o-nhap" placeholder="VD: dân văn phòng 25–40 tuổi muốn tăng năng suất" /></div>
        <div><label className="nhan">Ý tưởng quà / ngân sách (tuỳ chọn)</label>
          <input name="goi_y_qua" className="o-nhap" placeholder="VD: ebook, mã giảm giá tối đa 50%, 1 suất học miễn phí" /></div>
        <button className="nut-chinh w-full">
          <Wand2 className="h-4 w-4" /> Sinh chiến dịch (Claude {MODEL_LABEL}, ~30–60 giây)
        </button>
        <p className="text-center text-xs text-slate-400">Chiến dịch sinh ra ở trạng thái NHÁP — anh xem lại, chỉnh sửa rồi mới bấm Chạy.</p>
      </form>

      <div className="the mt-4 p-5 text-sm text-slate-600">
        <b className="text-slate-800">Cách bật gói subscription:</b> trên máy chạy server, cài Claude CLI rồi chạy lệnh <code className="font-mono">claude</code> và <code className="font-mono">/login</code> bằng tài khoản Claude Pro/Max của anh — xong là dùng được, không cần API key. Muốn dùng API trả phí thay thế thì điền <code className="font-mono">ANTHROPIC_API_KEY</code> vào <code className="font-mono">.env</code>.
      </div>
    </div>
  );
}

const MODEL_LABEL = (process.env.CLAUDE_MODEL || "Opus 5").replace("claude-", "");
