import { NextRequest, NextResponse } from "next/server";
import { xacMinh } from "@/services/nguoi-tham-gia";

export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3005";
  const ma = await xacMinh(token, `${proto}://${host}`);
  if (!ma) return NextResponse.redirect(new URL("/", req.url));
  return NextResponse.redirect(new URL(`/toi/${ma}?moi=1`, req.url));
}
