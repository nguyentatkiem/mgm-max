import { ExternalLink, FileX2, Save, SquarePen } from "lucide-react";
import { mot } from "@/db";
import { actSuaTrangDong } from "../../../../actions";

export const dynamic = "force-dynamic";

export default async function TrangDong(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const cheDo = cd.redirect_khi_dong ? "redirect" : cd.noi_dung_dong ? "tuy_chinh" : "mac_dinh";

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Trang khi đóng chiến dịch</h1>
      <p className="text-sm text-slate-500">Người đến muộn sau khi chiến dịch kết thúc sẽ thấy gì.</p>

      <form action={actSuaTrangDong} className="mt-5 space-y-5">
        <input type="hidden" name="id" value={cd.id} />
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { ma: "mac_dinh", ten: "Trang mặc định", icon: FileX2, mota: "Thông báo lịch sự + form nhận tin đợt sau" },
            { ma: "tuy_chinh", ten: "Nội dung tự soạn", icon: SquarePen, mota: "Tự viết lời nhắn hiển thị" },
            { ma: "redirect", ten: "Chuyển hướng URL", icon: ExternalLink, mota: "Đưa thẳng sang trang khác" },
          ].map((o) => (
            <label key={o.ma} className={`the cursor-pointer p-4 text-center transition-colors ${cheDo === o.ma ? "!border-blue-400 !bg-blue-50/50" : "hover:!border-slate-300"}`}>
              <o.icon className={`mx-auto h-7 w-7 ${cheDo === o.ma ? "text-blue-600" : "text-slate-400"}`} />
              <div className="mt-2 text-sm font-black text-slate-800">{o.ten}</div>
              <div className="mt-1 text-xs text-slate-400">{o.mota}</div>
            </label>
          ))}
        </div>
        <div className="the space-y-4 p-5">
          <div>
            <label className="nhan">Nội dung tự soạn (để trống = dùng trang mặc định)</label>
            <textarea name="noi_dung_dong" rows={3} defaultValue={cd.noi_dung_dong} className="o-nhap"
              placeholder="VD: Chương trình đợt 1 đã khép lại với 2.000 người tham gia. Hẹn gặp lại anh em ở đợt 2 tháng sau!" />
          </div>
          <div>
            <label className="nhan">Hoặc chuyển hướng tới URL (ưu tiên cao nhất)</label>
            <input name="redirect_khi_dong" defaultValue={cd.redirect_khi_dong} className="o-nhap" placeholder="https://…" />
          </div>
          <button className="nut-chinh"><Save className="h-4 w-4" /> Lưu</button>
        </div>
      </form>

      <div className="the mt-5 p-8 text-center">
        <div className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-slate-200 p-8">
          <div className="text-lg font-black text-slate-700">{cd.noi_dung_dong || "Chương trình đã kết thúc. Hẹn gặp bạn ở đợt sau!"}</div>
          <div className="mt-2 text-sm text-slate-400">— xem trước trang khi đóng —</div>
        </div>
      </div>
    </div>
  );
}
