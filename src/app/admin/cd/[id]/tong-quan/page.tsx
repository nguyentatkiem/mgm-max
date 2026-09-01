import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowRight, Download, MousePointerClick, ShieldAlert, TrendingUp, UserCheck, UserPlus, Users } from "lucide-react";
import { mot } from "@/db";
import { theoNgay, tongQuan } from "@/services/thong-ke";
import BieuDoNgay from "@/ui/BieuDoNgay";
import { yeuCauAdmin } from "../../../bao-ve";

export const dynamic = "force-dynamic";

export default async function TongQuanChienDich(props: { params: Promise<{ id: string }> }) {
  await yeuCauAdmin();
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  if (!cd) redirect("/admin");
  const s = await tongQuan(cd.id);
  const duLieuNgay = await theoNgay(cd.id, 14);

  const buoc = [
    { ten: "Click link mời", so: s.clicks, icon: MousePointerClick },
    { ten: "Đăng ký", so: s.dangKy, icon: UserPlus },
    { ten: "Xác minh email", so: s.xacMinh, icon: UserCheck },
    { ten: "Có share", so: s.coShare, icon: Users },
    { ten: "Mời ≥1 bạn", so: s.coMoiThanhCong, icon: TrendingUp },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {(s.choDuyet > 0 || s.khoQuaSapHet.length > 0) && (
        <div className="mb-4 space-y-2">
          {s.choDuyet > 0 && (
            <Link href={`/admin/cd/${cd.id}/nguoi-tham-gia?tab=gian-lan`} className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800">
              <ShieldAlert className="h-4 w-4" /> {s.choDuyet} referral đang chờ duyệt trong khu cách ly <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          {s.khoQuaSapHet.map((k) => (
            <div key={k.ten_qua} className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
              <AlertTriangle className="h-4 w-4" /> Kho mã «{k.ten_qua}» chỉ còn {k.con} mã — nạp thêm ngay!
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Tổng quan chiến dịch</h1>
          <p className="text-sm text-slate-500">Theo dõi mọi chỉ số quan trọng theo thời gian thực.</p>
        </div>
        <a href={`/api/admin/csv?cd=${cd.id}`} className="nut-phu !py-2 text-sm"><Download className="h-4 w-4" /> Xuất CSV</a>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { ten: "Hệ số viral K", so: s.k === Infinity ? "∞" : s.k, mota: "K > 1 = tự tăng trưởng", noiBat: true },
          { ten: "Tỉ lệ xác minh", so: `${s.ptXacMinh}%`, mota: "xác minh / đăng ký" },
          { ten: "Lead từ giới thiệu", so: `${s.ptTuGioiThieu}%`, mota: `${s.tuGioiThieu}/${s.xacMinh} người` },
          { ten: "Tổng xác minh", so: s.xacMinh, mota: `${s.dangKy} đăng ký` },
        ].map((o) => (
          <div key={o.ten} className={`the p-5 ${o.noiBat ? "!border-blue-300 !bg-blue-50/50" : ""}`}>
            <div className="text-sm font-semibold text-slate-500">{o.ten}</div>
            <div className={`mt-1 text-3xl font-black ${o.noiBat ? "text-blue-700" : "text-slate-900"}`}>{o.so}</div>
            <div className="mt-0.5 text-xs text-slate-400">{o.mota}</div>
          </div>
        ))}
      </div>

      <div className="the mt-6 p-6"><BieuDoNgay duLieu={duLieuNgay} /></div>

      <div className="the mt-6 p-6">
        <h2 className="font-bold text-slate-900">Phễu chuyển đổi</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {buoc.map((b, i) => (
            <div key={b.ten} className="rounded-xl bg-slate-50 p-4 text-center">
              <b.icon className="mx-auto h-5 w-5 text-blue-600" />
              <div className="mt-1 text-2xl font-black text-slate-900">{b.so}</div>
              <div className="text-xs font-medium text-slate-500">{b.ten}</div>
              {i > 0 && buoc[i - 1].so > 0 && (
                <div className="mt-1 text-xs font-bold text-blue-600">{Math.round((b.so / buoc[i - 1].so) * 100)}%</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="the p-6">
          <h2 className="font-bold text-slate-900">Hiệu quả kênh share</h2>
          {s.kenh.length === 0 && <p className="mt-3 text-sm text-slate-400">Chưa có click nào qua link mời.</p>}
          <ul className="mt-3 space-y-2">
            {s.kenh.map((k) => (
              <li key={k.kenh} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-sm">
                <span className="font-semibold capitalize text-slate-700">{k.kenh}</span>
                <span className="text-slate-500">{k.clicks} click · <b className="text-blue-700">{k.dangKy} đăng ký</b></span>
              </li>
            ))}
          </ul>
        </div>
        <div className="the p-6">
          <h2 className="font-bold text-slate-900">Top người ảnh hưởng</h2>
          {s.topNguoiMoi.filter((t) => t.soBan > 0).length === 0 && <p className="mt-3 text-sm text-slate-400">Chưa có ai mời thành công.</p>}
          <ul className="mt-3 space-y-2">
            {s.topNguoiMoi.filter((t) => t.soBan > 0).map((t, i) => (
              <li key={t.id}>
                <Link href={`/admin/lead/${t.id}`} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-sm hover:bg-blue-50">
                  <span className="font-semibold text-slate-700">#{i + 1} {t.ten} <span className="font-normal text-slate-400">({t.email})</span></span>
                  <span className="text-slate-500"><b className="text-blue-700">{t.soBan} bạn</b> · {t.diem}đ</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
