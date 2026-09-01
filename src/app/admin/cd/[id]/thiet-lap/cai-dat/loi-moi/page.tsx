import { Save, Share2 } from "lucide-react";
import { mot } from "@/db";
import { actSuaGiaoDien } from "../../../../../actions";

export const dynamic = "force-dynamic";

export default async function LoiMoiChiaSe(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Lời mời chia sẻ</h1>
      <p className="text-sm text-slate-500">Soạn sẵn nội dung mời cho từng kênh + preview khi link được gửi qua Zalo/Facebook.</p>

      <form action={actSuaGiaoDien} className="mt-5 space-y-4">
        <input type="hidden" name="id" value={cd.id} />
        <input type="hidden" name="kenh_share_hien_tai" value={cd.kenh_share} />
        {/* giữ nguyên các trường giao diện khác khi lưu */}
        <input type="hidden" name="anh_cover" value={cd.anh_cover} />
        <input type="hidden" name="logo_url" value={cd.logo_url} />
        <input type="hidden" name="mau_chinh" value={cd.mau_chinh} />
        <input type="hidden" name="video_url" value={cd.video_url} />
        <input type="hidden" name="truong_them" value={(cd.truong_them || []).map((t: { ten: string; bat_buoc: boolean }) => (t.bat_buoc ? "*" : "") + t.ten).join("\n")} />
        <input type="hidden" name="webhook_url" value={cd.webhook_url} />

        <div className="the p-5">
          <h2 className="flex items-center gap-2 font-bold text-slate-900"><Share2 className="h-5 w-5 text-blue-600" /> Preview khi share link (OG)</h2>
          <p className="mt-0.5 text-xs text-slate-400">Tiêu đề, mô tả và ảnh hiện ra khi link mời được dán vào Zalo/Facebook/Messenger.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <input name="og_tieu_de" defaultValue={cd.og_tieu_de} className="o-nhap !py-2 text-sm" placeholder="Tiêu đề OG (trống = tên chiến dịch)" />
            <input name="og_mo_ta" defaultValue={cd.og_mo_ta} className="o-nhap !py-2 text-sm" placeholder="Mô tả OG" />
            <input name="og_anh" defaultValue={cd.og_anh} className="o-nhap !py-2 text-sm" placeholder="Ảnh OG (URL)" />
          </div>
          {/* preview thẻ chia sẻ */}
          <div className="mt-4 flex max-w-md gap-3 rounded-xl border border-slate-200 p-3">
            <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-2xl">{cd.og_anh ? "🖼️" : "📷"}</div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-slate-800">{cd.og_tieu_de || cd.ten}</div>
              <div className="line-clamp-2 text-xs text-slate-500">{cd.og_mo_ta || cd.mo_ta}</div>
            </div>
          </div>
        </div>

        <div className="the p-5">
          <h2 className="font-bold text-slate-900">Lời mời soạn sẵn theo kênh</h2>
          <p className="mt-0.5 text-xs text-slate-400">Trống = dùng lời mời chung. Giọng mỗi kênh nên khác nhau: Zalo thân mật, Facebook công khai…</p>
          <div className="mt-3 space-y-2">
            {cd.kenh_share.split(",").filter(Boolean).map((k: string) => (
              <div key={k} className="flex items-center gap-2">
                <span className="hieu w-24 justify-center bg-slate-200 capitalize text-slate-600">{k}</span>
                <input name={`loi_moi_${k}`} defaultValue={(cd.loi_moi || {})[k] || ""} className="o-nhap !py-1.5 text-sm" placeholder={`Lời mời khi share qua ${k}…`} />
              </div>
            ))}
          </div>
        </div>
        <button className="nut-chinh"><Save className="h-4 w-4" /> Lưu lời mời</button>
      </form>
    </div>
  );
}
