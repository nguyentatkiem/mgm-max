// F43 — biểu đồ cột chồng 14 ngày: người xác minh TRỰC TIẾP vs TỪ GIỚI THIỆU.
// Palette đã validate (dataviz 6 checks): #2563eb + #0d9488, ΔE CVD 20.7, nền trắng.
import type { DiemNgay } from "@/services/thong-ke";

const MAU_TRUC_TIEP = "#2563eb";
const MAU_GIOI_THIEU = "#0d9488";

export default function BieuDoNgay({ duLieu }: { duLieu: DiemNgay[] }) {
  const W = 560, H = 190, TOP = 26, BOT = 22, LEFT = 26;
  const maxVal = Math.max(1, ...duLieu.map((d) => d.trucTiep + d.gioiThieu));
  const vungH = H - TOP - BOT;
  const buoc = (W - LEFT - 4) / duLieu.length;
  const rongCot = Math.min(24, buoc * 0.62);
  const coDuLieu = duLieu.some((d) => d.trucTiep + d.gioiThieu > 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-slate-700">Người xác minh theo ngày (14 ngày)</div>
        <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: MAU_TRUC_TIEP }} /> Trực tiếp</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: MAU_GIOI_THIEU }} /> Từ giới thiệu</span>
        </div>
      </div>
      {!coDuLieu ? (
        <div className="mt-4 rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-400">Chưa có dữ liệu trong 14 ngày qua.</div>
      ) : (
        <div className="mt-2 overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Biểu đồ người xác minh theo ngày, tách trực tiếp và từ giới thiệu">
            {/* lưới ngang nhạt */}
            {[0.5, 1].map((t) => (
              <g key={t}>
                <line x1={LEFT} x2={W - 4} y1={TOP + vungH * (1 - t)} y2={TOP + vungH * (1 - t)} stroke="#e2e8f0" strokeWidth="1" />
                <text x={LEFT - 5} y={TOP + vungH * (1 - t) + 3.5} textAnchor="end" fontSize="9" fill="#94a3b8">{Math.round(maxVal * t)}</text>
              </g>
            ))}
            <line x1={LEFT} x2={W - 4} y1={TOP + vungH} y2={TOP + vungH} stroke="#cbd5e1" strokeWidth="1" />
            {duLieu.map((d, i) => {
              const x = LEFT + i * buoc + (buoc - rongCot) / 2;
              const hTT = (d.trucTiep / maxVal) * vungH;
              const hGT = (d.gioiThieu / maxVal) * vungH;
              const tong = d.trucTiep + d.gioiThieu;
              const yTT = TOP + vungH - hTT;
              const yGT = yTT - (hGT > 0 ? 2 : 0) - hGT; // spacer 2px giữa 2 lớp
              const rTren = 4; // bo tròn đầu dữ liệu (segment trên cùng)
              return (
                <g key={i}>
                  <title>{`${d.ngay}: ${tong} xác minh (${d.trucTiep} trực tiếp, ${d.gioiThieu} từ giới thiệu)`}</title>
                  {hTT > 0 && (hGT > 0
                    ? <rect x={x} y={yTT} width={rongCot} height={hTT} fill={MAU_TRUC_TIEP} />
                    : <path d={`M${x},${yTT + rTren} q0,-${rTren} ${rTren},-${rTren} h${rongCot - 2 * rTren} q${rTren},0 ${rTren},${rTren} v${Math.max(0, hTT - rTren)} h${-rongCot} z`} fill={MAU_TRUC_TIEP} />)}
                  {hGT > 0 && (
                    <path d={`M${x},${yGT + rTren} q0,-${rTren} ${rTren},-${rTren} h${rongCot - 2 * rTren} q${rTren},0 ${rTren},${rTren} v${Math.max(0, hGT - rTren)} h${-rongCot} z`} fill={MAU_GIOI_THIEU} />
                  )}
                  {/* nhãn trực tiếp chỉ ở cột cao nhất — nhãn chọn lọc, không rải mọi cột */}
                  {tong === maxVal && tong > 0 && (
                    <text x={x + rongCot / 2} y={Math.min(yTT, yGT) - 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155">{tong}</text>
                  )}
                  {(i % 2 === 0 || duLieu.length <= 7) && (
                    <text x={x + rongCot / 2} y={H - 7} textAnchor="middle" fontSize="8.5" fill="#94a3b8">{d.ngay}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}
