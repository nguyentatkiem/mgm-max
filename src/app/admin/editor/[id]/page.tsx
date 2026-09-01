import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Monitor, Save, Smartphone } from "lucide-react";
import { mot } from "@/db";
import { yeuCauAdmin } from "../../bao-ve";
import { actSuaEditor } from "../../actions";

export const dynamic = "force-dynamic";

// Editor mức 1: panel thuộc tính bên phải + preview sống bên trái (desktop/mobile)
export default async function EditorTrang(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mh?: string }>;
}) {
  await yeuCauAdmin();
  const { id } = await props.params;
  const { mh = "desktop" } = await props.searchParams;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  if (!cd) redirect("/admin");

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Canvas preview */}
        <div className="the overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
            <Link href={`/admin/cd/${cd.id}/thiet-lap/trang-dang-ky`} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Thoát trình chỉnh
            </Link>
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 p-1">
              <Link href={`?mh=desktop`} className={`rounded-lg p-1.5 ${mh !== "mobile" ? "bg-blue-50 text-blue-700" : "text-slate-400"}`}><Monitor className="h-4 w-4" /></Link>
              <Link href={`?mh=mobile`} className={`rounded-lg p-1.5 ${mh === "mobile" ? "bg-blue-50 text-blue-700" : "text-slate-400"}`}><Smartphone className="h-4 w-4" /></Link>
            </div>
            <a href={`/c/${cd.slug}`} target="_blank" className="text-sm font-semibold text-slate-500 hover:text-blue-700">Mở tab mới ↗</a>
          </div>
          <div className="flex justify-center bg-slate-100 p-4">
            <iframe src={`/c/${cd.slug}`} title="Xem trước"
              className={`rounded-xl border border-slate-300 bg-white shadow ${mh === "mobile" ? "h-[640px] w-[375px]" : "h-[640px] w-full"}`} />
          </div>
        </div>

        {/* Panel thuộc tính */}
        <form action={actSuaEditor} className="the h-fit space-y-4 p-5">
          <input type="hidden" name="id" value={cd.id} />
          <h2 className="font-black text-slate-900">Cài đặt trang</h2>
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
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 font-bold text-white hover:bg-orange-600 cursor-pointer">
            <Save className="h-4 w-4" /> Lưu &amp; cập nhật preview
          </button>
          <p className="text-center text-[11px] text-slate-400">Trang chia sẻ dùng chung bộ màu này. Trình kéo-thả block nằm ở đợt nâng cấp sau.</p>
        </form>
      </div>
    </div>
  );
}
