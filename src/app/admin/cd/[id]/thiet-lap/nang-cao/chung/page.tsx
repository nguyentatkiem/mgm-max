import { Save, Trash2 } from "lucide-react";
import { mot } from "@/db";
import { actSuaChung, actXoaChienDich } from "../../../../../actions";

export const dynamic = "force-dynamic";

export default async function TuyChonChung(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const ketThuc = cd.ket_thuc_luc ? new Date(cd.ket_thuc_luc).toISOString().slice(0, 16) : "";

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Tuỳ chọn chung</h1>
      <p className="text-sm text-slate-500">Các cấu hình vận hành còn lại của chiến dịch.</p>

      <form action={actSuaChung} className="the mt-5 space-y-4 p-5">
        <input type="hidden" name="id" value={cd.id} />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="nhan">Cookie giới thiệu (ngày) — chuẩn ngành 7/30/90</label>
            <input name="cookie_ngay" type="number" min={1} defaultValue={cd.cookie_ngay} className="o-nhap" /></div>
          <div><label className="nhan">Hạn chót chiến dịch (trống = evergreen)</label>
            <input name="ket_thuc_luc" type="datetime-local" defaultValue={ketThuc} className="o-nhap" /></div>
        </div>
        <div><label className="nhan">Kênh share bật (phẩy: zalo,facebook,messenger,telegram,copy)</label>
          <input name="kenh_share" defaultValue={cd.kenh_share} className="o-nhap font-mono text-sm" /></div>
        <div><label className="nhan">Webhook URL</label>
          <input name="webhook_url" defaultValue={cd.webhook_url} className="o-nhap font-mono text-sm" placeholder="https://…" /></div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" name="che_do_demo" defaultChecked={cd.che_do_demo} />
          Chế độ demo — hiện nút «Xác minh ngay» trên trang cảm ơn (chạy thử không cần hộp thư thật; TẮT khi chạy thật)
        </label>
        <button className="nut-chinh"><Save className="h-4 w-4" /> Lưu</button>
      </form>

      <div className="the mt-5 flex items-center justify-between border-red-200 p-5">
        <div>
          <div className="font-bold text-red-700">Xoá chiến dịch</div>
          <div className="text-xs text-slate-400">Xoá vĩnh viễn toàn bộ lead, điểm, quà, email của chiến dịch này. Không hoàn tác được.</div>
        </div>
        <form action={actXoaChienDich}>
          <input type="hidden" name="id" value={cd.id} />
          <button className="nut-phu !py-2 text-sm text-red-600"><Trash2 className="h-4 w-4" /> Xoá vĩnh viễn</button>
        </form>
      </div>
    </div>
  );
}
