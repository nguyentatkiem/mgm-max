import { Gift, Lock, Sparkles, Users } from "lucide-react";
import { mot, q } from "@/db";
import { redirect } from "next/navigation";
import DemNguoc from "@/ui/DemNguoc";

export const dynamic = "force-dynamic";

export default async function TrangDangKy(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string; loi?: string }>;
}) {
  const { slug } = await props.params;
  const { ref = "", loi = "" } = await props.searchParams;
  const cd = await mot(`select * from chien_dich where slug=$1`, [slug]);
  if (!cd) redirect("/");

  // Trang "campaign đã đóng" — vẫn hứng người đến muộn
  if (cd.trang_thai !== "chay") {
    if (cd.redirect_khi_dong) redirect(cd.redirect_khi_dong);
    return (
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="the p-8">
          <Lock className="mx-auto h-10 w-10 text-slate-300" />
          <h1 className="mt-4 text-2xl font-black text-slate-900">{cd.ten}</h1>
          <p className="mt-2 text-slate-500">Chương trình đã kết thúc. Hẹn gặp bạn ở đợt sau!</p>
        </div>
      </main>
    );
  }

  const cacMoc = await q(`select nguong, ten_qua from moc_qua where chien_dich_id=$1 order by nguong`, [cd.id]);
  const soThamGia = await mot<{ so: string }>(`select count(*) as so from nguoi_tham_gia where chien_dich_id=$1 and xac_minh`, [cd.id]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-500 to-slate-50">
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur">
            <Sparkles className="h-4 w-4" /> Mời bạn — nhận quà
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">{cd.ten}</h1>
          <p className="mt-3 text-blue-50">{cd.mo_ta}</p>
          {cd.ket_thuc_luc && <div className="mt-4"><DemNguoc den={new Date(cd.ket_thuc_luc).toISOString()} /></div>}
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-100">
            <Users className="h-4 w-4" /> {Number(soThamGia?.so || 0)} người đã tham gia
          </div>
        </div>

        <div className="the mt-8 p-6 sm:p-8">
          {loi && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{loi}</div>}
          <form method="post" action="/api/dang-ky" className="space-y-4">
            <input type="hidden" name="slug" value={cd.slug} />
            <input type="hidden" name="cd_id" value={cd.id} />
            <input type="hidden" name="ref" value={ref} />
            <div>
              <label className="nhan">Tên của bạn</label>
              <input name="ten" required maxLength={100} className="o-nhap" placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className="nhan">Email</label>
              <input name="email" type="email" required maxLength={200} className="o-nhap" placeholder="ban@email.com" />
            </div>
            <div>
              <label className="nhan">Mã giới thiệu (nếu có)</label>
              <input name="ma_gioi_thieu" defaultValue={ref} maxLength={12} className="o-nhap font-mono uppercase" placeholder="VD: ABC12345" />
            </div>
            <label className="flex items-start gap-2 text-xs text-slate-500">
              <input type="checkbox" required className="mt-0.5" />
              Tôi đồng ý nhận email của chương trình và điều khoản sử dụng. Có thể huỷ đăng ký bất cứ lúc nào.
            </label>
            <button className="nut-chinh w-full text-base">
              <Gift className="h-5 w-5" /> Đăng ký nhận quà ngay
            </button>
          </form>
        </div>

        {cacMoc.length > 0 && (
          <div className="the mt-6 p-6">
            <h2 className="font-bold text-slate-900">🎁 Mời càng nhiều — quà càng lớn</h2>
            <ul className="mt-3 space-y-2">
              {cacMoc.map((m) => (
                <li key={m.nguong} className="flex items-center gap-3 rounded-xl bg-blue-50/60 px-4 py-2.5">
                  <span className="hieu bg-blue-600 text-white">{m.nguong} bạn</span>
                  <span className="font-medium text-slate-700">{m.ten_qua}</span>
                </li>
              ))}
            </ul>
            {cd.giai_boc_tham && (
              <div className="mt-3 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm">
                🏆 <b>Giải đặc biệt (bốc thăm):</b> {cd.giai_boc_tham} — mỗi điểm là 1 vé, càng mời nhiều càng dễ trúng!
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
