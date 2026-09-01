import Link from "next/link";
import { Gift, Rocket, ShieldCheck, TrendingUp } from "lucide-react";
import { q } from "@/db";

export const dynamic = "force-dynamic";

export default async function TrangChu() {
  const chienDich = await q(`select slug, ten, mo_ta from chien_dich where trang_thai='chay' order by id desc`);
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
          <Rocket className="h-4 w-4" /> MGM MAX
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
          Mời bạn bè — <span className="text-blue-600">mở khoá quà</span>
        </h1>
        <p className="mt-3 text-slate-500">
          Nền tảng chiến dịch viral member-get-member cho sản phẩm số &amp; khoá học.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Gift, ten: "Mốc quà tự động", mota: "Mời đủ 1/3/5/10 bạn — quà tự mở khoá, hai chiều cả người được mời" },
          { icon: ShieldCheck, ten: "Chống gian lận 4 lớp", mota: "Double opt-in, chấm điểm rủi ro, cách ly chờ duyệt" },
          { icon: TrendingUp, ten: "Đo K-factor", mota: "Phễu chuyển đổi, hiệu quả từng kênh share, top người mời" },
        ].map((t) => (
          <div key={t.ten} className="the p-5">
            <t.icon className="h-6 w-6 text-blue-600" />
            <div className="mt-2 font-bold text-slate-900">{t.ten}</div>
            <div className="mt-1 text-sm text-slate-500">{t.mota}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Chiến dịch đang chạy</h2>
        <div className="mt-3 space-y-3">
          {chienDich.length === 0 && <div className="the p-5 text-slate-500">Chưa có chiến dịch nào đang chạy.</div>}
          {chienDich.map((cd) => (
            <Link key={cd.slug} href={`/c/${cd.slug}`} className="the block p-5 hover:border-blue-400 transition-colors">
              <div className="font-bold text-slate-900">{cd.ten}</div>
              <div className="mt-1 text-sm text-slate-500 line-clamp-2">{cd.mo_ta}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-slate-400">
        <Link className="text-blue-600 font-semibold hover:underline" href="/admin">→ Vào trang quản trị</Link>
      </div>
    </main>
  );
}
