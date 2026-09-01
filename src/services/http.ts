import { headers } from "next/headers";

/** URL gốc: ưu tiên biến môi trường tin cậy APP_BASE_URL; nếu không có mới dựng từ header
 *  (chỉ dùng cho hiển thị/link trong chính request đó — KHÔNG lưu toàn cục, tránh header poisoning). */
export async function layBaseUrl(): Promise<string> {
  const env = (process.env.APP_BASE_URL || "").trim().replace(/\/$/, "");
  if (env) return env;
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3005";
  return `${proto}://${host}`;
}

/** Base URL TIN CẬY để nhúng vào email (không bao giờ tin header của người dùng):
 *  APP_BASE_URL (env) → base_url do ADMIN đặt trong Cài đặt → localhost. */
export async function baseUrlTinCay(layCaiDatFn: (k: string) => Promise<string>): Promise<string> {
  const env = (process.env.APP_BASE_URL || "").trim().replace(/\/$/, "");
  if (env) return env;
  const admin = (await layCaiDatFn("base_url")).trim().replace(/\/$/, "");
  return admin || "http://localhost:3005";
}

export async function layIp(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "";
}

export async function layUa(): Promise<string> {
  const h = await headers();
  return h.get("user-agent") || "";
}

/** Mã quốc gia từ Cloudflare (giới hạn khu vực). */
export async function layQuocGia(): Promise<string> {
  const h = await headers();
  return h.get("cf-ipcountry") || "";
}
