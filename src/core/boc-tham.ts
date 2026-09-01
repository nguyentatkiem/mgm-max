// Bốc thăm trọng số: mỗi điểm = 1 vé. Seed ghi log để tái lập/đối chất kết quả.

export type UngVien = { id: number; ten: string; email: string; diem: number };
export type KetQuaGiai = { giai: number; id: number; ten: string; email: string; diem: number };

/** PRNG tất định mulberry32 — cùng seed cho cùng chuỗi số. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedTuChuoi(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/**
 * Bốc soGiai giải theo trọng số điểm, không trùng người.
 * Ứng viên điểm <= 0 bị loại. Trả về theo thứ tự giải 1, 2, 3…
 */
export function bocTham(ungVien: UngVien[], soGiai: number, seed: string): KetQuaGiai[] {
  const rng = mulberry32(seedTuChuoi(seed));
  const conLai = ungVien.filter((u) => u.diem > 0);
  const ketQua: KetQuaGiai[] = [];
  for (let giai = 1; giai <= soGiai && conLai.length > 0; giai++) {
    const tongVe = conLai.reduce((s, u) => s + u.diem, 0);
    const r = rng() * tongVe;
    let tichLuy = 0;
    let chon = conLai.length - 1;
    for (let i = 0; i < conLai.length; i++) {
      tichLuy += conLai[i].diem;
      if (r < tichLuy) { chon = i; break; }
    }
    const nguoi = conLai.splice(chon, 1)[0];
    ketQua.push({ giai, id: nguoi.id, ten: nguoi.ten, email: nguoi.email, diem: nguoi.diem });
  }
  return ketQua;
}
