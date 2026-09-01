import { PenSquare } from "lucide-react";
import { mot } from "@/db";

export const dynamic = "force-dynamic";

export default async function TrangDangKy(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Thiết kế trang đăng ký</h1>
      <p className="text-sm text-slate-500">Đây là nơi khách ghé điền thông tin để tham gia chiến dịch của anh.</p>

      <div className="the mt-5 overflow-hidden">
        <iframe src={`/c/${cd.slug}`} className="h-[420px] w-full origin-top" title="Xem trước trang đăng ký" />
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
          <div className="text-sm text-slate-500">Xem trước trực tiếp — mọi thay đổi trong trình chỉnh trang sẽ hiện ngay tại đây.</div>
          <a href={`/admin/editor/${cd.id}`} className="nut-chinh !py-2 text-sm"><PenSquare className="h-4 w-4" /> Mở trình chỉnh trang</a>
        </div>
      </div>

      <div className="the mt-5 grid gap-4 p-6 sm:grid-cols-3">
        {[
          { ten: "Tiêu đề", gia: cd.tieu_de_trang || cd.ten },
          { ten: "Nút kêu gọi", gia: cd.nut_cta || "Đăng ký nhận quà ngay" },
          { ten: "Màu chủ đạo", gia: cd.mau_chinh },
        ].map((o) => (
          <div key={o.ten} className="rounded-xl bg-slate-50 p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-400">{o.ten}</div>
            <div className="mt-1 truncate text-sm font-semibold text-slate-800">{o.gia}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
