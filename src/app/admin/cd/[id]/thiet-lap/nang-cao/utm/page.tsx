import { Link2, Plus, Save, Trash2 } from "lucide-react";
import { mot, q } from "@/db";
import { layBaseUrl } from "@/services/http";
import { actSuaHeaderCodes, actThemNguon, actXoaNguon } from "../../../../../actions";

export const dynamic = "force-dynamic";

export default async function NguonTracking(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const cacNguon = await q(
    `select n.*, (select count(*) from click_link c where c.ma='src:'||n.chien_dich_id and c.kenh=n.keyword) as so_ghe,
            (select count(*) from nguoi_tham_gia t where t.chien_dich_id=n.chien_dich_id and t.kenh_vao=n.keyword) as so_dk
     from theo_doi_nguon n where n.chien_dich_id=$1 order by n.id desc`, [cd.id]);
  const baseUrl = await layBaseUrl();

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Nguồn traffic &amp; mã tracking</h1>
      <p className="text-sm text-slate-500">Tạo link riêng cho từng nguồn (ads, poster, đối tác, KOC) để biết chính xác lead đến từ đâu.</p>

      <form action={actThemNguon} className="the mt-5 flex flex-wrap items-end gap-3 p-5">
        <input type="hidden" name="chien_dich_id" value={cd.id} />
        <div className="min-w-40 flex-1"><label className="nhan">Tên nguồn</label>
          <input name="ten" required className="o-nhap !py-2 text-sm" placeholder="VD: Facebook Ads đợt 1" /></div>
        <div className="min-w-32"><label className="nhan">Từ khoá (trong link)</label>
          <input name="keyword" required className="o-nhap !py-2 font-mono text-sm" placeholder="fb-ads-1" /></div>
        <button className="nut-chinh !py-2 text-sm"><Plus className="h-4 w-4" /> Tạo link nguồn</button>
      </form>

      <div className="mt-4 space-y-2">
        {cacNguon.map((n) => (
          <div key={n.id} className="hang-cai">
            <div className="min-w-0">
              <div className="font-bold text-slate-800">{n.ten}</div>
              <code className="block truncate font-mono text-xs text-blue-700">{baseUrl}/t/{cd.id}/{n.keyword}</code>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm text-slate-500">
              <span>{Number(n.so_ghe)} ghé · <b className="text-blue-700">{Number(n.so_dk)} đăng ký</b></span>
              <form action={actXoaNguon}>
                <input type="hidden" name="id" value={n.id} /><input type="hidden" name="chien_dich_id" value={cd.id} />
                <button className="text-slate-400 hover:text-red-600 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
              </form>
            </div>
          </div>
        ))}
        {cacNguon.length === 0 && (
          <div className="the flex items-center gap-3 p-5 text-sm text-slate-400">
            <Link2 className="h-5 w-5" /> Chưa có link nguồn nào — mỗi kênh quảng bá nên có một link riêng để đo được hiệu quả.
          </div>
        )}
      </div>

      <form action={actSuaHeaderCodes} className="the mt-5 space-y-3 p-5">
        <input type="hidden" name="id" value={cd.id} />
        <h2 className="font-bold text-slate-900">Mã tracking chèn vào trang (GA4, Facebook Pixel…)</h2>
        <div><label className="nhan">Chèn vào TRANG ĐĂNG KÝ</label>
          <textarea name="ma_dang_ky" rows={3} defaultValue={cd.ma_header_dang_ky} className="o-nhap font-mono text-xs" placeholder="<script>…</script>" /></div>
        <div><label className="nhan">Chèn vào TRANG CHIA SẺ</label>
          <textarea name="ma_chia_se" rows={3} defaultValue={cd.ma_header_chia_se} className="o-nhap font-mono text-xs" placeholder="<script>…</script>" /></div>
        <button className="nut-chinh !py-2 text-sm"><Save className="h-4 w-4" /> Lưu mã</button>
      </form>
    </div>
  );
}
