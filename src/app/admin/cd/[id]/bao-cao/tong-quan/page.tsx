import { mot } from "@/db";
import { theoNgay, tongQuan } from "@/services/thong-ke";
import BieuDoNgay from "@/ui/BieuDoNgay";

export const dynamic = "force-dynamic";

function Donut({ phanTram, mau }: { phanTram: number; mau: string }) {
  const r = 30, chu = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="9" />
      <circle cx="40" cy="40" r={r} fill="none" stroke={mau} strokeWidth="9" strokeLinecap="round"
        strokeDasharray={`${(Math.min(100, phanTram) / 100) * chu} ${chu}`} transform="rotate(-90 40 40)" />
      <text x="40" y="45" textAnchor="middle" fontSize="15" fontWeight="800" fill="#0f172a">{Math.round(phanTram)}%</text>
    </svg>
  );
}

export default async function BaoCaoTongQuan(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const s = await tongQuan(cd.id);
  const duLieu = await theoNgay(cd.id, 14);
  const trucTiep = s.xacMinh - s.tuGioiThieu;

  const cum = [
    { ten: "Lead trực tiếp / lượt ghé", lead: trucTiep, ghe: Math.max(s.clicks === 0 ? s.dangKy : s.clicks, 1), mau: "#2563eb" },
    { ten: "Lead giới thiệu / lượt ghé link mời", lead: s.tuGioiThieu, ghe: Math.max(s.clicks, 1), mau: "#0d9488" },
    { ten: "Tổng lead / tổng lượt ghé", lead: s.xacMinh, ghe: Math.max(s.clicks + s.dangKy, 1), mau: "#0f172a" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
      <p className="text-sm text-slate-500">Theo dõi mọi chỉ số quan trọng của chiến dịch theo thời gian thực.</p>

      <div className="the mt-5 grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {cum.map((c) => (
          <div key={c.ten} className="flex items-center gap-4 p-5">
            <Donut phanTram={(c.lead / c.ghe) * 100} mau={c.mau} />
            <div>
              <div className="text-xs font-semibold text-slate-400">{c.ten}</div>
              <div className="mt-1 text-xl font-black text-slate-900">{c.lead} <span className="text-sm font-semibold text-slate-400">lead</span></div>
              <div className="text-xs text-slate-400">{c.ghe} lượt ghé</div>
            </div>
          </div>
        ))}
      </div>

      <div className="the mt-5 p-6"><BieuDoNgay duLieu={duLieu} /></div>

      <div className="the mt-5 p-6">
        <h2 className="font-bold text-slate-900">Nguồn traffic hàng đầu</h2>
        {s.kenh.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">Chưa có dữ liệu.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {s.kenh.map((k) => {
              const max = Math.max(...s.kenh.map((x) => x.clicks), 1);
              return (
                <li key={k.kenh} className="flex items-center gap-3 text-sm">
                  <span className="w-24 shrink-0 font-semibold capitalize text-slate-600">{k.kenh}</span>
                  <div className="h-3 flex-1 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${(k.clicks / max) * 100}%` }} />
                  </div>
                  <span className="w-36 shrink-0 text-right text-slate-500">{k.clicks} click · <b className="text-blue-700">{k.dangKy} đăng ký</b></span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
