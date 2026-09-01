// Ký / kiểm token HMAC dùng chung (link one-click, cron…). Khoá lấy từ ADMIN_MAT_KHAU.
import { createHmac, timingSafeEqual } from "node:crypto";

const khoa = () => process.env.ADMIN_MAT_KHAU || "mgmmax123";

export function kyToken(payload: string, doDai = 24): string {
  return createHmac("sha256", khoa()).update(payload).digest("base64url").slice(0, doDai);
}

export function kiemToken(payload: string, token: string): boolean {
  const dung = kyToken(payload);
  const a = Buffer.from(token || "");
  const b = Buffer.from(dung);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Token cho link one-click của 1 chiến dịch. */
export const tokenNhanh = (cdId: number) => kyToken(`nhanh:${cdId}`);
