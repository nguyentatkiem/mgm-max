import { NextRequest, NextResponse } from "next/server";
import { mot, q } from "@/db";

// Link theo dõi NGUỒN của chiến dịch (ads, poster, đối tác…): /t/{cdId}/{keyword}
// Ghi lượt ghé theo nguồn rồi đưa về trang đăng ký kèm ?src= để gắn kenh_vao khi đăng ký.
export async function GET(req: NextRequest, ctx: { params: Promise<{ cd: string; keyword: string }> }) {
  const { cd: cdId, keyword } = await ctx.params;
  const cd = await mot(`select id, slug from chien_dich where id=$1`, [Number(cdId) || 0]);
  if (!cd) return NextResponse.redirect(new URL("/", req.url));
  const kw = keyword.slice(0, 30);
  await q(`insert into click_link (ma, kenh, ip, ua) values ($1,$2,$3,$4)`, [
    `src:${cd.id}`, kw,
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim(),
    (req.headers.get("user-agent") || "").slice(0, 300),
  ]);
  return NextResponse.redirect(new URL(`/c/${cd.slug}?src=${encodeURIComponent(kw)}`, req.url));
}
