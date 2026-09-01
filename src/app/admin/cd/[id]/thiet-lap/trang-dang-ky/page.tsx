import { LayoutTemplate, MousePointerClick, RotateCcw, Save } from "lucide-react";
import { mot } from "@/db";
import { coLayout } from "@/ui/puck/config";
import { actSuaEditor, actXoaLayout } from "../../../../actions";

export const dynamic = "force-dynamic";

export default async function TrangDangKy(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const dungKeoTha = coLayout(cd.layout_json);

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Thiết kế trang đăng ký</h1>
      <p className="text-sm text-slate-500">Đây là nơi khách ghé điền thông tin để tham gia chiến dịch của anh.</p>

      {/* Trạng thái + trình kéo-thả */}
      <div className="the mt-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          {dungKeoTha ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              <LayoutTemplate className="h-4 w-4" /> Đang dùng thiết kế kéo-thả
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
              <LayoutTemplate className="h-4 w-4" /> Đang dùng giao diện mặc định
            </span>
          )}
          <a href={`/admin/editor/${cd.id}`} className="nut-chinh !py-2 text-sm">
            <MousePointerClick className="h-4 w-4" /> Mở trình kéo-thả
          </a>
        </div>
        <iframe src={`/c/${cd.slug}`} className="h-[440px] w-full" title="Xem trước trang đăng ký" />
        <div className="border-t border-slate-200 px-5 py-3 text-sm text-slate-500">
          Xem trước trực tiếp — kéo-thả block, sửa nội dung rồi bấm <b>Publish</b> trong trình chỉnh, thay đổi hiện ngay tại đây.
        </div>
      </div>

      {dungKeoTha && (
        <form action={actXoaLayout} className="the mt-5 flex flex-wrap items-center justify-between gap-3 p-5">
          <input type="hidden" name="id" value={cd.id} />
          <div className="text-sm text-slate-600">
            <b>Về giao diện mặc định?</b> Xoá thiết kế kéo-thả để trang dùng lại bộ màu/tiêu đề bên dưới. (Không xoá dữ liệu người tham gia.)
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer">
            <RotateCcw className="h-4 w-4" /> Về giao diện mặc định
          </button>
        </form>
      )}

      {/* Kiểu giao diện mặc định (dùng khi chưa bật kéo-thả) */}
      <form action={actSuaEditor} className="the mt-5 space-y-4 p-6">
        <input type="hidden" name="id" value={cd.id} />
        <div>
          <h2 className="font-black text-slate-900">Kiểu giao diện mặc định</h2>
          <p className="text-xs text-slate-500">Dùng khi chưa bật kéo-thả{dungKeoTha ? " — hiện đang tắt vì anh đã có thiết kế kéo-thả" : ""}. Các block kéo-thả cũng lấy màu chủ đạo ở đây làm mặc định.</p>
        </div>
        <div><label className="nhan">Tiêu đề lớn (trống = dùng tên chiến dịch)</label>
          <input name="tieu_de_trang" defaultValue={cd.tieu_de_trang} className="o-nhap !py-2 text-sm" placeholder={cd.ten} /></div>
        <div><label className="nhan">Mô tả dưới tiêu đề</label>
          <textarea name="mo_ta" rows={3} defaultValue={cd.mo_ta} className="o-nhap !py-2 text-sm" /></div>
        <div><label className="nhan">Chữ trên nút đăng ký</label>
          <input name="nut_cta" defaultValue={cd.nut_cta} className="o-nhap !py-2 text-sm" placeholder="Đăng ký nhận quà ngay" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="nhan">Màu chủ đạo</label>
            <input name="mau_chinh" type="color" defaultValue={cd.mau_chinh || "#2563eb"} className="o-nhap !h-10 !p-1" /></div>
          <div><label className="nhan">Màu nền dưới (hex, trống = xám nhạt)</label>
            <input name="mau_nen" defaultValue={cd.mau_nen} className="o-nhap !py-2 font-mono text-sm" placeholder="#f8fafc" /></div>
        </div>
        <div><label className="nhan">Logo (URL ảnh)</label>
          <input name="logo_url" defaultValue={cd.logo_url} className="o-nhap !py-2 text-sm" placeholder="https://…/logo.png" /></div>
        <div><label className="nhan">Ảnh cover (URL)</label>
          <input name="anh_cover" defaultValue={cd.anh_cover} className="o-nhap !py-2 text-sm" placeholder="https://…/cover.jpg" /></div>
        <div><label className="nhan">Video YouTube (URL)</label>
          <input name="video_url" defaultValue={cd.video_url} className="o-nhap !py-2 text-sm" placeholder="https://youtube.com/watch?v=…" /></div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 font-bold text-white hover:bg-orange-600 cursor-pointer">
          <Save className="h-4 w-4" /> Lưu kiểu mặc định
        </button>
      </form>
    </div>
  );
}
