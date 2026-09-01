import { NextRequest, NextResponse } from "next/server";
import { xacMinh } from "@/services/nguoi-tham-gia";
import { baseUrlTinCay } from "@/services/http";
import { layCaiDat } from "@/services/cai-dat";

export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  // Link trong email (welcome/mời) dùng base_url tin cậy, không lấy từ header (C4)
  const kq = await xacMinh(token, await baseUrlTinCay(layCaiDat));
  if (!kq) return NextResponse.redirect(new URL("/", req.url));
  const res = NextResponse.redirect(new URL(`/toi/${kq.ma}?moi=1`, req.url));
  // F11 — nhớ người này để lần sau vào thẳng trang riêng
  res.cookies.set(`mgm_toi_${kq.cdId}`, kq.ma, { maxAge: 180 * 24 * 3600, path: "/", sameSite: "lax" });
  return res;
}
