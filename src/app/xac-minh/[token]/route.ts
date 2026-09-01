import { NextRequest, NextResponse } from "next/server";
import { xacMinh } from "@/services/nguoi-tham-gia";

export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3005";
  const kq = await xacMinh(token, `${proto}://${host}`);
  if (!kq) return NextResponse.redirect(new URL("/", req.url));
  const res = NextResponse.redirect(new URL(`/toi/${kq.ma}?moi=1`, req.url));
  // F11 — nhớ người này để lần sau vào thẳng trang riêng
  res.cookies.set(`mgm_toi_${kq.cdId}`, kq.ma, { maxAge: 180 * 24 * 3600, path: "/", sameSite: "lax" });
  return res;
}
