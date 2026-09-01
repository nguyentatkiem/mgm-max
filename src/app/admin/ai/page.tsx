import { Sparkles, Wand2 } from "lucide-react";
import { yeuCauAdmin } from "../bao-ve";
import { actTaoBangAI } from "../actions";

export const dynamic = "force-dynamic";

// F51 — Referral AI: tính năng đinh của UpViral 2.0, bản MGM MAX chạy bằng Claude
export default async function TrangAI(props: { searchParams: Promise<{ loi?: string }> }) {
  await yeuCauAdmin();
  const { loi } = await props.searchParams;
  const coKey = !!process.env.ANTHROPIC_API_KEY;

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white"><Sparkles className="h-5 w-5" /></span>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Tạo chiến dịch bằng AI</h1>
          <p className="text-sm text-slate-500">Khai vài dòng về sản phẩm — Claude thiết kế trọn chiến dịch: mốc quà, giải bốc thăm, nhiệm vụ, lời mời từng kênh.</p>
        </div>
      </div>

      {!coKey && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Chưa thấy <code className="font-mono">ANTHROPIC_API_KEY</code> trong môi trường — thêm vào <code className="font-mono">.env</code> rồi khởi động lại (hoặc đăng nhập <code className="font-mono">ant auth login</code> trên máy chạy server).
        </div>
      )}
      {loi && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{loi}</div>}

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
        <button className="nut-chinh w-full" disabled={!coKey}>
          <Wand2 className="h-4 w-4" /> Sinh chiến dịch (Claude Opus 5, ~30 giây)
        </button>
        <p className="text-center text-xs text-slate-400">Chiến dịch sinh ra ở trạng thái NHÁP — anh xem lại, chỉnh sửa rồi mới bấm Chạy.</p>
      </form>
    </div>
  );
}
