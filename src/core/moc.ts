// Mốc quà: unlock theo SỐ BẠN XÁC MINH (không theo điểm tổng — chống lạm phát điểm share).

export type Moc = { id: number; nguong: number; ten_qua: string };

/** Trả về các mốc đủ điều kiện mở mà chưa trao, theo thứ tự ngưỡng tăng dần. */
export function mocMoKhoa(soBanXacMinh: number, cacMoc: Moc[], mocDaTrao: number[]): Moc[] {
  return cacMoc
    .filter((m) => soBanXacMinh >= m.nguong && !mocDaTrao.includes(m.id))
    .sort((a, b) => a.nguong - b.nguong);
}

/** Mốc kế tiếp chưa đạt (cho thanh tiến độ + email "sắp chạm mốc"). */
export function mocKeTiep(soBanXacMinh: number, cacMoc: Moc[]): Moc | null {
  const chuaDat = cacMoc.filter((m) => m.nguong > soBanXacMinh).sort((a, b) => a.nguong - b.nguong);
  return chuaDat[0] || null;
}

/** true nếu chỉ còn thiếu đúng 1 bạn tới mốc kế tiếp. */
export function sapChamMoc(soBanXacMinh: number, cacMoc: Moc[]): boolean {
  const ke = mocKeTiep(soBanXacMinh, cacMoc);
  return !!ke && ke.nguong - soBanXacMinh === 1;
}
