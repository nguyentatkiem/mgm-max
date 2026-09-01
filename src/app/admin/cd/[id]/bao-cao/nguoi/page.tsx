import { mot } from "@/db";
import { theoNgay, tongQuan } from "@/services/thong-ke";
import BieuDoNgay from "@/ui/BieuDoNgay";

export const dynamic = "force-dynamic";

export default async function BaoCaoNguoi(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const s = await tongQuan(cd.id);
  const duLieu = await theoNgay(cd.id, 14);

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Leads</h1>
      <p className="text-sm text-slate-500">So sánh lead đến trực tiếp và lead đến qua giới thiệu.</p>

      <div className="the mt-5 p-6"><BieuDoNgay duLieu={duLieu} /></div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { ten: "Hệ số viral K", so: s.k === Infinity ? "∞" : s.k, mota: "lead giới thiệu / lead trực tiếp" },
          { ten: "Tỉ lệ xác minh", so: `${s.ptXacMinh}%`, mota: "xác minh / đăng ký" },
          { ten: "% từ giới thiệu", so: `${s.ptTuGioiThieu}%`, mota: `${s.tuGioiThieu} người` },
          { ten: "Người có mời ≥1 bạn", so: s.coMoiThanhCong, mota: "máy phát tán thật" },
        ].map((o) => (
          <div key={o.ten} className="the p-4 text-center">
            <div className="text-2xl font-black text-blue-700">{o.so}</div>
            <div className="mt-0.5 text-xs font-semibold text-slate-500">{o.ten}</div>
            <div className="text-[10px] text-slate-400">{o.mota}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
