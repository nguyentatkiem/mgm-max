import Link from "next/link";
import { ArrowLeft, ArrowRight, Gift, Sparkles } from "lucide-react";
import { yeuCauAdmin } from "../../bao-ve";
import { CAC_LOAI, MAU_THEO_LOAI } from "@/ui/mau-chien-dich";
import { actTaoTuMau } from "../../actions";

// Wizard bước 2 — chọn TEMPLATE + preview sống bên phải
export default async function ChonMau(props: { searchParams: Promise<{ loai?: string; mau?: string }> }) {
  await yeuCauAdmin();
  const { loai = "boc_tham", mau } = await props.searchParams;
  const loaiInfo = CAC_LOAI.find((l) => l.ma === loai) || CAC_LOAI[0];
  const dsMau = MAU_THEO_LOAI[loaiInfo.ma] || MAU_THEO_LOAI.tu_do;
  const chon = dsMau.find((m) => m.ma === mau) || dsMau[0];
  const preset = { ...chon, ten_cd: `${loaiInfo.ten} — ${chon.ten}` };

  return (
    <main className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900">Chọn template để khởi động</h1>
          <p className="mt-1 text-sm text-slate-500">Chọn bố cục hợp với «{loaiInfo.ten}» — mọi thứ chỉnh lại được sau khi tạo.</p>
          <div className="mt-3 inline-flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 font-bold text-blue-700"><span className="flex h-5 w-5 items-center justify-center rounded bg-blue-700 text-[11px] text-white">1</span> Trang đăng ký</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-500"><span className="flex h-5 w-5 items-center justify-center rounded bg-slate-400 text-[11px] text-white">2</span> Trang chia sẻ (tự sinh cùng bộ màu)</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Cột trái: AI + danh sách template */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <div className="font-black text-slate-900">Dùng AI sinh chiến dịch</div>
              <p className="mt-1 text-xs text-slate-500">Khai vài dòng về sản phẩm — AI tự soạn quà, mốc thưởng, nhiệm vụ và lời mời cho anh.</p>
              <Link href="/admin/ai" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-700">
                <Sparkles className="h-4 w-4" /> Sinh bằng AI
              </Link>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Template ({loaiInfo.ten})</div>
            {dsMau.map((m) => (
              <Link key={m.ma} href={`/admin/moi/mau?loai=${loaiInfo.ma}&mau=${m.ma}`}
                className={`the flex items-center gap-3 p-3 transition-colors ${chon.ma === m.ma ? "!border-blue-400 !bg-blue-50/50" : "hover:!border-slate-300"}`}>
                <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg text-2xl" style={{ background: m.mauNen || "#f1f5f9" }}>{m.emoji}</span>
                <div>
                  <div className="text-sm font-black text-slate-800">{m.ten}</div>
                  <span className="hieu mt-1 bg-slate-100 text-slate-600"><Gift className="h-3 w-3" /> {m.chipThuong}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Cột phải: preview sống */}
          <div className="the overflow-hidden">
            <div className="flex min-h-[460px] flex-col items-center justify-center p-10 text-center" style={{ background: chon.mauNen || "#f8fafc" }}>
              <div className="text-sm font-bold text-slate-400">{"{{tên_thương_hiệu}}"}</div>
              <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight" style={{ color: chon.mauChinh }}>{chon.tieuDe || "Tiêu đề chiến dịch của anh"}</h2>
              <p className="mt-3 max-w-lg text-slate-600">{chon.moTa || "Mô tả ngắn hiện ở đây."}</p>
              <div className="mt-6 w-full max-w-sm space-y-2.5">
                <div className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-left text-sm text-slate-400">Tên của bạn</div>
                <div className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-left text-sm text-slate-400">Email</div>
                <div className="rounded-xl px-4 py-3 text-sm font-bold text-white" style={{ background: chon.mauChinh }}>{chon.nutCta || "Đăng ký nhận quà"}</div>
              </div>
              {loaiInfo.ma === "boc_tham" && <div className="mt-4 text-xs text-slate-400">Nhanh tay! Hạn đăng ký: {"{{ngày_kết_thúc}}"}</div>}
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-3">
              <Link href="/admin/moi" className="nut-phu !py-2 text-sm"><ArrowLeft className="h-4 w-4" /> Quay lại</Link>
              <form action={actTaoTuMau}>
                <input type="hidden" name="loai" value={loaiInfo.ma} />
                <input type="hidden" name="preset" value={JSON.stringify(preset)} />
                <button className="nut-chinh !py-2 text-sm">Tạo chiến dịch <ArrowRight className="h-4 w-4" /></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
