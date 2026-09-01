// F33 — Captcha toán học tự nhúng (không cần dịch vụ ngoài).
// Tự bật khi 1 IP đã đăng ký >= NGUONG_CAPTCHA lượt trong ngày.
import { createHmac, randomInt } from "node:crypto";

export const NGUONG_CAPTCHA = 2;

const biMat = () => (process.env.ADMIN_MAT_KHAU || "mgmmax123") + ":captcha";

export function taoCaptcha(): { cauHoi: string; token: string } {
  const a = randomInt(1, 10);
  const b = randomInt(1, 10);
  const chuKy = createHmac("sha256", biMat()).update(`${a}|${b}`).digest("hex").slice(0, 16);
  return {
    cauHoi: `${a} + ${b} = ?`,
    token: Buffer.from(`${a}|${b}|${chuKy}`).toString("base64url"),
  };
}

export function kiemTraCaptcha(token: string, traLoi: string): boolean {
  try {
    const [a, b, chuKy] = Buffer.from(token, "base64url").toString().split("|");
    const dung = createHmac("sha256", biMat()).update(`${a}|${b}`).digest("hex").slice(0, 16);
    return chuKy === dung && Number(traLoi) === Number(a) + Number(b);
  } catch {
    return false;
  }
}
