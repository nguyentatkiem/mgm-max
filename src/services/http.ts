import { headers } from "next/headers";

/** URL gốc dựng từ header — tự đúng khi chạy sau tunnel trycloudflare. */
export async function layBaseUrl(): Promise<string> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3005";
  return `${proto}://${host}`;
}

export async function layIp(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "";
}

export async function layUa(): Promise<string> {
  const h = await headers();
  return h.get("user-agent") || "";
}
