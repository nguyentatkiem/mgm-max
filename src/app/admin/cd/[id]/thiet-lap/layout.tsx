import { Link2, Rocket } from "lucide-react";
import { mot } from "@/db";
import { layBaseUrl } from "@/services/http";
import SidebarMuc from "@/ui/admin/SidebarMuc";
import { actChayChienDich } from "../../../actions";

export default async function KhungThietLap(props: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const baseUrl = await layBaseUrl();
  const g = (duoi: string) => `/admin/cd/${id}/thiet-lap/${duoi}`;
  const coDuDieuKien = !!cd?.giai_boc_tham || !!(await mot(`select 1 from moc_qua where chien_dich_id=$1 limit 1`, [Number(id)]));

  return (
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[250px_1fr]">
      <aside className="space-y-3">
        <div className="the p-3 text-center">
          {cd?.trang_thai === "chay" ? (
            <div className="rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-black text-emerald-700">✓ ĐANG CHẠY</div>
          ) : (
            <form action={actChayChienDich}>
              <input type="hidden" name="id" value={id} />
              <button disabled={!coDuDieuKien} title={coDuDieuKien ? "" : "Cần có ít nhất 1 mốc quà hoặc giải đặc biệt"}
                className={`w-full rounded-xl px-3 py-2.5 text-sm font-black text-white ${coDuDieuKien ? "bg-blue-600 hover:bg-blue-700 cursor-pointer" : "bg-slate-300 cursor-not-allowed"}`}>
                <Rocket className="mr-1 inline h-4 w-4" /> CHẠY CHIẾN DỊCH
              </button>
            </form>
          )}
          <div className="mt-2 flex items-center justify-center gap-1 truncate text-xs text-slate-400">
            <Link2 className="h-3 w-3 shrink-0" /> {baseUrl.replace(/^https?:\/\//, "")}/c/{cd?.slug}
          </div>
        </div>
        <SidebarMuc cacMuc={[
          { href: g("trang-dang-ky"), ten: "Trang đăng ký" },
          { href: g("trang-chia-se"), ten: "Trang chia sẻ" },
          { href: g("trang-dong"), ten: "Trang khi đóng" },
          { href: g("nhung"), ten: "Nhúng website" },
          { href: g("giai-dac-biet"), ten: "Giải đặc biệt", nhom: "Phần thưởng" },
          { href: g("moc-qua"), ten: "Mốc quà", nhom: "Phần thưởng" },
          { href: g("gioi-thieu"), ten: "Thưởng giới thiệu", nhom: "Phần thưởng" },
          { href: g("cai-dat/email"), ten: "Email tự động", nhom: "Cài đặt" },
          { href: g("cai-dat/loi-moi"), ten: "Lời mời chia sẻ", nhom: "Cài đặt" },
          { href: g("cai-dat/nhiem-vu"), ten: "Nhiệm vụ cộng điểm", nhom: "Cài đặt" },
          { href: g("cai-dat/chat-luong"), ten: "Chất lượng lead", nhom: "Cài đặt" },
          { href: g("cai-dat/dieu-khoan"), ten: "Điều khoản", nhom: "Cài đặt" },
          { href: g("nang-cao/diem"), ten: "Cấu hình điểm", nhom: "Nâng cao" },
          { href: g("nang-cao/ket-noi"), ten: "Kết nối & Webhook", nhom: "Nâng cao" },
          { href: g("nang-cao/khu-vuc"), ten: "Giới hạn khu vực", nhom: "Nâng cao" },
          { href: g("nang-cao/utm"), ten: "Nguồn & mã tracking", nhom: "Nâng cao" },
          { href: g("nang-cao/chung"), ten: "Tuỳ chọn chung", nhom: "Nâng cao" },
        ]} />
      </aside>
      <div className="min-w-0">{props.children}</div>
    </div>
  );
}
