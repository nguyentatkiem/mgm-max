import QRCode from "qrcode";
import { Plus, QrCode } from "lucide-react";
import { mot, q } from "@/db";
import { layBaseUrl } from "@/services/http";
import { actThemNguon } from "../../../../actions";

export const dynamic = "force-dynamic";

export default async function MaQR(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ nguon?: string }>;
}) {
  const { id } = await props.params;
  const { nguon } = await props.searchParams;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const cacNguon = await q(`select * from theo_doi_nguon where chien_dich_id=$1 order by id`, [cd.id]);
  const baseUrl = await layBaseUrl();

  const chon = cacNguon.find((n) => n.keyword === nguon);
  const link = chon ? `${baseUrl}/t/${cd.id}/${chon.keyword}` : `${baseUrl}/c/${cd.slug}`;
  const qrSvg = await QRCode.toString(link, { type: "svg", margin: 1, width: 220, color: { dark: "#1e3a8a", light: "#ffffff" } });

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Mã QR chiến dịch</h1>
      <p className="text-sm text-slate-500">Biến tương tác offline thành lead đo được — poster, lớp học, sự kiện, bao bì.</p>

      <div className="mt-4 flex items-start gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 text-sm text-slate-600">
        <QrCode className="mt-0.5 h-8 w-8 shrink-0 text-indigo-500" />
        <div>Mỗi mã QR gắn với một <b>link nguồn</b> riêng, nên anh biết chính xác bao nhiêu lead đến từ poster nào, sự kiện nào. Tạo nguồn mới ngay dưới đây hoặc ở mục «Nguồn &amp; mã tracking».</div>
      </div>

      <div className="the mt-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <a href={`/admin/cd/${cd.id}/quang-ba/qr`} className={`pill ${!chon ? "pill-bat" : "pill-tat"}`}>Link gốc</a>
          {cacNguon.map((n) => (
            <a key={n.id} href={`?nguon=${n.keyword}`} className={`pill ${chon?.id === n.id ? "pill-bat" : "pill-tat"}`}>{n.ten}</a>
          ))}
          <form action={actThemNguon} className="ml-auto flex items-center gap-2">
            <input type="hidden" name="chien_dich_id" value={cd.id} />
            <input name="ten" required className="o-nhap !w-36 !py-1.5 text-sm" placeholder="Tên nguồn mới" />
            <input name="keyword" required className="o-nhap !w-28 !py-1.5 font-mono text-sm" placeholder="tu-khoa" />
            <button className="nut-chinh !py-1.5 text-sm"><Plus className="h-4 w-4" /> Tạo QR</button>
          </form>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <div className="rounded-2xl border-2 border-slate-200 p-3" dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <code className="mt-3 text-sm font-semibold text-blue-700">{link}</code>
          <p className="mt-1 text-xs text-slate-400">Chuột phải vào mã QR → Lưu ảnh để in poster.</p>
        </div>
      </div>
    </div>
  );
}
