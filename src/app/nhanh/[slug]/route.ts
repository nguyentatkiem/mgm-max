import { NextRequest, NextResponse } from "next/server";
import { dangKyNhanh } from "@/services/nguoi-tham-gia";

// F14 — one-click link cho list email CÓ SẴN:
// /nhanh/{slug}?email={{EMAIL}}&ten={{TEN}}[&ref=MA] → vào thẳng trang riêng, khỏi điền form + khỏi xác minh
export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const email = req.nextUrl.searchParams.get("email") || "";
  const ten = req.nextUrl.searchParams.get("ten") || "";
  const ref = req.nextUrl.searchParams.get("ref") || "";
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3005";
  const baseUrl = `${proto}://${host}`;

  const kq = await dangKyNhanh({ slug, ten, email, maNguoiMoi: ref, kenh: "one-click", baseUrl });
  if (!kq.ok) return NextResponse.redirect(new URL(`/c/${slug}?loi=${encodeURIComponent(kq.loi)}`, baseUrl));

  const res = NextResponse.redirect(new URL(`/toi/${kq.ma}${kq.moiTao ? "?moi=1" : ""}`, baseUrl));
  res.cookies.set(`mgm_toi_${kq.cdId}`, kq.ma, { maxAge: 180 * 24 * 3600, path: "/", sameSite: "lax" });
  return res;
}
