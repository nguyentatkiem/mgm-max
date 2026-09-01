import { redirect } from "next/navigation";
import { Eye } from "lucide-react";
import { mot } from "@/db";
import { laAdmin } from "@/services/auth";
import TabChienDich from "@/ui/admin/TabChienDich";
import DoiTen from "@/ui/admin/DoiTen";
import { actDoiTenChienDich } from "../../actions";

const TEN_TT: Record<string, string> = { nhap: "Nháp", chay: "Đang chạy", tam_dung: "Tạm dừng", dong: "Đã đóng" };
const MAU_TT: Record<string, string> = {
  nhap: "bg-slate-100 text-slate-600", chay: "bg-emerald-100 text-emerald-700",
  tam_dung: "bg-amber-100 text-amber-700", dong: "bg-red-100 text-red-700",
};

export default async function KhungChienDich(props: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  if (!(await laAdmin())) redirect("/admin/dang-nhap");
  const { id } = await props.params;
  const cd = await mot(`select id, ten, slug, trang_thai from chien_dich where id=$1`, [Number(id) || 0]);
  if (!cd) redirect("/admin");

  return (
    <div>
      {/* Thanh ngữ cảnh chiến dịch */}
      <div className="sticky top-14 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex h-14 flex-wrap items-center gap-3 px-4">
          <div className="flex items-center gap-2">
            <DoiTen id={cd.id} ten={cd.ten} action={actDoiTenChienDich} />
            <span className={`hieu ${MAU_TT[cd.trang_thai]}`}>{TEN_TT[cd.trang_thai]}</span>
          </div>
          <div className="mx-auto"><TabChienDich cdId={cd.id} /></div>
          <a href={`/c/${cd.slug}`} target="_blank" className="nut-phu !rounded-full !py-1.5 text-sm">
            Xem trước <Eye className="h-4 w-4" />
          </a>
        </div>
      </div>
      <main className="px-4 py-6">{props.children}</main>
    </div>
  );
}
