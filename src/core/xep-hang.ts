// Xếp hạng leaderboard: điểm ↓ → số bạn xác minh ↓ → đạt điểm sớm hơn ↑.

export type DongHang = {
  id: number;
  ten: string;
  diem: number;
  soBan: number;
  datDiemLuc: number; // epoch ms của lần ghi điểm gần nhất
};

export function soSanhHang(a: DongHang, b: DongHang): number {
  if (b.diem !== a.diem) return b.diem - a.diem;
  if (b.soBan !== a.soBan) return b.soBan - a.soBan;
  return a.datDiemLuc - b.datDiemLuc;
}

/** Ẩn danh một phần: "Nguyễn Tất Kiêm" -> "Nguyễn T. K." */
export function anDanh(ten: string): string {
  const phan = ten.trim().split(/\s+/);
  if (phan.length === 1) return phan[0].slice(0, 2) + "***";
  return phan[0] + " " + phan.slice(1).map((p) => p[0].toUpperCase() + ".").join(" ");
}
