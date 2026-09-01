import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Gift, ListChecks, Sparkles, Ticket } from "lucide-react";
import { Render } from "@puckeditor/core/rsc";
import { yeuCauAdmin } from "../../bao-ve";
import { CAC_LOAI } from "@/ui/mau-chien-dich";
import { MAU_TOAN_DIEN } from "@/ui/mau-toan-dien";
import { config, type MetaTrang } from "@/ui/puck/config";
import { actTaoTuMauToanDien } from "../../actions";

export const dynamic = "force-dynamic";

// Wizard bước 2 — GALLERY mẫu chiến dịch TOÀN DIỆN + preview bằng trang kéo-thả thật.
export default async function ChonMau(props: { searchParams: Promise<{ loai?: string; mau?: string }> }) {
  await yeuCauAdmin();
  const { loai = "boc_tham", mau } = await props.searchParams;
  const loaiInfo = CAC_LOAI.find((l) => l.ma === loai) || CAC_LOAI[0];

  // Mẫu hợp loại đứng trước, còn lại xếp sau
  const goiY = MAU_TOAN_DIEN.filter((m) => m.loai === loaiInfo.ma);
  const khac = MAU_TOAN_DIEN.filter((m) => m.loai !== loaiInfo.ma);
  const chon = MAU_TOAN_DIEN.find((m) => m.ma === mau) || goiY[0] || MAU_TOAN_DIEN[0];

  const soBlock = Array.isArray(chon.layout.content) ? chon.layout.content.length : 0;
  const meta: MetaTrang = {
    slug: "", cdId: 0, mau: chon.cd.mauChinh, nenDuoi: chon.cd.mauNen,
    nutCta: chon.cd.nutCta, ref: "", kenh: "", loi: "", truongThem: [], captcha: null,
    soThamGia: 128, cacMoc: chon.mocQua.map((m) => ({ nguong: m.nguong, tenQua: m.tenQua })),
    giaiBocTham: chon.cd.giaiBocTham, dieuKhoan: "Thể lệ & điều khoản chương trình (mẫu).", dieuKhoanTieuDe: "",
    ketThuc: new Date(Date.now() + 7 * 864e5).toISOString(),
  };

  function DanhSach({ ds, nhan }: { ds: typeof MAU_TOAN_DIEN; nhan: string }) {
    if (!ds.length) return null;
    return (
      <>
        <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{nhan}</div>
        {ds.map((m) => (
          <Link key={m.ma} href={`/admin/moi/mau?loai=${loaiInfo.ma}&mau=${m.ma}`}
            className={`the flex items-center gap-3 p-3 transition-colors ${chon.ma === m.ma ? "!border-blue-400 !bg-blue-50/50" : "hover:!border-slate-300"}`}>
            <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg text-2xl" style={{ background: m.cd.mauNen || "#f1f5f9" }}>{m.emoji}</span>
            <div className="min-w-0">
              <div className="truncate text-sm font-black text-slate-800">{m.ten}</div>
              <span className="hieu mt-1 bg-slate-100 text-slate-600"><Gift className="h-3 w-3" /> {m.chip}</span>
            </div>
          </Link>
        ))}
      </>
    );
  }

  return (
    <main className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900">Chọn mẫu chiến dịch hoàn chỉnh</h1>
          <p className="mt-1 text-sm text-slate-500">Mỗi mẫu có sẵn <b>trang kéo-thả đã thiết kế</b> + mốc quà + nhiệm vụ + lời mời — tạo xong chỉnh vài chữ là chạy.</p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Cột trái: AI + danh sách mẫu */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <div className="font-black text-slate-900">Dùng AI sinh chiến dịch</div>
              <p className="mt-1 text-xs text-slate-500">Khai vài dòng về sản phẩm — AI tự soạn quà, mốc thưởng, nhiệm vụ và lời mời cho anh.</p>
              <Link href="/admin/ai" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-700">
                <Sparkles className="h-4 w-4" /> Sinh bằng AI
              </Link>
            </div>
            <DanhSach ds={goiY} nhan={`Gợi ý cho «${loaiInfo.ten}»`} />
            <DanhSach ds={khac} nhan="Tất cả mẫu" />
          </div>

          {/* Cột phải: preview thật + tóm tắt */}
          <div className="space-y-4">
            <div className="the overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-2.5">
                <div className="text-sm font-black text-slate-800">{chon.emoji} {chon.ten}</div>
                <div className="text-xs text-slate-400">Xem trước trang (thật)</div>
              </div>
              <div className="max-h-[560px] overflow-y-auto bg-slate-100" style={{ pointerEvents: "none" }}>
                <Render config={config} data={chon.layout as never} metadata={meta as unknown as Record<string, unknown>} />
              </div>
            </div>

            {/* Tóm tắt những gì mẫu tạo sẵn */}
            <div className="the grid gap-4 p-5 sm:grid-cols-2">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-black text-slate-800"><Gift className="h-4 w-4 text-blue-600" /> Mốc quà ({chon.mocQua.length})</div>
                <ul className="mt-2 space-y-1.5">
                  {chon.mocQua.map((m) => (
                    <li key={m.nguong} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="hieu bg-blue-50 text-blue-700">{m.nguong} bạn</span> {m.tenQua}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-black text-slate-800"><ListChecks className="h-4 w-4 text-teal-600" /> Nhiệm vụ ({chon.nhiemVu.length})</div>
                  <ul className="mt-1.5 space-y-1 text-sm text-slate-600">
                    {chon.nhiemVu.map((nv, i) => <li key={i}>• {nv.ten} <span className="text-slate-400">(+{nv.diem}đ)</span></li>)}
                  </ul>
                </div>
                {chon.cd.quaChaoMung && <div className="flex items-start gap-1.5 text-sm text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> Quà chào mừng: {chon.cd.quaChaoMung}</div>}
                {chon.cd.giaiBocTham && <div className="flex items-start gap-1.5 text-sm text-slate-600"><Ticket className="mt-0.5 h-4 w-4 text-amber-600" /> Giải bốc thăm: {chon.cd.giaiBocTham}</div>}
                <div className="text-xs text-slate-400">+ Trang kéo-thả {soBlock} block, lời mời soạn sẵn cho Zalo/Facebook/Messenger/Telegram.</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href="/admin/moi" className="nut-phu !py-2 text-sm"><ArrowLeft className="h-4 w-4" /> Quay lại</Link>
              <form action={actTaoTuMauToanDien}>
                <input type="hidden" name="ma" value={chon.ma} />
                <button className="nut-chinh !py-2.5">Tạo chiến dịch từ mẫu này <ArrowRight className="h-4 w-4" /></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
