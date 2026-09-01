import Link from "next/link";
import { ChevronDown, Info } from "lucide-react";
import { yeuCauAdmin } from "../bao-ve";
import { CAC_LOAI } from "@/ui/mau-chien-dich";

// Wizard bước 1 — chọn LOẠI chiến dịch
export default async function ChonLoai() {
  await yeuCauAdmin();
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200"><div className="h-full w-1/3 bg-blue-600" /></div>
      <h1 className="mt-10 text-center text-3xl font-black text-slate-900">Anh muốn chạy chiến dịch kiểu gì?</h1>
      <p className="mt-2 text-center text-slate-500">Chọn mục tiêu phù hợp với kế hoạch marketing của anh.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAC_LOAI.map((l, i) => (
          <Link key={l.ma} href={`/admin/moi/mau?loai=${l.ma}`}
            className={`the p-6 text-center transition-all hover:-translate-y-0.5 hover:!border-blue-400 hover:shadow-md ${i === 0 ? "!bg-blue-50/60 !border-blue-200" : ""}`}>
            <div className="text-3xl">{l.emoji}</div>
            <div className="mt-3 text-lg font-black text-slate-800">{l.ten}</div>
            <div className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{l.chip}</div>
            <div className="mt-3 flex items-center justify-center gap-1 text-sm text-slate-400"><Info className="h-3.5 w-3.5" /> {l.moTa}</div>
          </Link>
        ))}
      </div>

      <details className="the mt-8 p-5">
        <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-800">
          <span className="flex items-center gap-2"><Info className="h-5 w-5 text-blue-600" /> Cách gắn MGM MAX vào việc kinh doanh của anh</span>
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </summary>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <p>• <b>Bán khoá học:</b> dùng «Mốc quà & Giới thiệu bạn» — quà là chương học thử, mã giảm giá, suất học miễn phí.</p>
          <p>• <b>Ra mắt sản phẩm số:</b> dùng «Danh sách chờ» gom hàng chờ rồi mở bán early-bird.</p>
          <p>• <b>Cần bùng nổ nhanh:</b> «Bốc thăm & Minigame» với giải đủ hấp dẫn + hạn chót tạo cấp bách.</p>
          <p>• <b>Đã có tệp học viên:</b> chạy «Chương trình giới thiệu» hai chiều + kích hoạt list cũ bằng link one-click ở tab Quảng bá.</p>
        </div>
      </details>
    </main>
  );
}
