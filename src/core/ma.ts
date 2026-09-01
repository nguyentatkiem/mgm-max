import { randomBytes } from "node:crypto";

// Base32 Crockford: bỏ I, L, O, U để không nhầm khi đọc/gõ tay
const BANG_CHU = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Sinh mã giới thiệu 8 ký tự, ngẫu nhiên — không đoán được từ id. */
export function sinhMa(doDai = 8): string {
  const buf = randomBytes(doDai);
  let ma = "";
  for (let i = 0; i < doDai; i++) ma += BANG_CHU[buf[i] % 32];
  return ma;
}

/** Chuẩn hoá mã người dùng gõ tay: hoa, đổi ký tự dễ nhầm về đúng bảng chữ. */
export function chuanHoaMa(tho: string): string {
  return tho.trim().toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1").replace(/U/g, "V");
}

export function maHopLe(ma: string): boolean {
  return ma.length >= 6 && ma.length <= 12 && [...ma].every((c) => BANG_CHU.includes(c));
}

/** Token xác minh email (dài, một lần). */
export function sinhToken(): string {
  return randomBytes(24).toString("base64url");
}
