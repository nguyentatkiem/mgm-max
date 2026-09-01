import { NextRequest, NextResponse } from "next/server";
import { mot, q } from "@/db";
import { chuanHoaMa } from "@/core/ma";
import { ghiDiem, ngayHomNay, soClickHomNay } from "@/services/diem";

// Link giới thiệu: /r/{ma}?ch=zalo → log click + cộng điểm click (có trần/ngày) + cookie ref → về trang opt-in
export async function GET(req: NextRequest, ctx: { params: Promise<{ ma: string }> }) {
  const { ma: tho } = await ctx.params;
  const ma = chuanHoaMa(tho);
  const kenh = (req.nextUrl.searchParams.get("ch") || "").slice(0, 20);
  const chu = await mot(`select n.*, c.slug, c.trang_thai, c.cookie_ngay, c.cap_click_ngay, c.diem_click from nguoi_tham_gia n join chien_dich c on c.id=n.chien_dich_id where n.ma=$1`, [ma]);
  if (!chu) return NextResponse.redirect(new URL("/", req.url));

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  const click = await mot(
    `insert into click_link (ma, kenh, ip, ua) values ($1,$2,$3,$4) returning id`,
    [ma, kenh, ip, (req.headers.get("user-agent") || "").slice(0, 300)]
  );
  // Điểm click thật quay lại từ kênh share — chỉ cộng khi (C6) campaign đang chạy,
  // chủ link đã xác minh + không bị chặn, IP khác chủ, còn dưới trần/ngày
  if (kenh && ip !== chu.ip && chu.xac_minh && !chu.chan && chu.trang_thai === "chay") {
    const homNay = await soClickHomNay(chu.id);
    if (homNay < chu.cap_click_ngay) {
      await ghiDiem(chu.chien_dich_id, chu.id, "click", `click:${ngayHomNay()}:${click!.id}`, chu.diem_click);
    }
  }

  const res = NextResponse.redirect(new URL(`/c/${chu.slug}?ref=${ma}`, req.url));
  res.cookies.set(`mgm_ref_${chu.chien_dich_id}`, ma, {
    maxAge: chu.cookie_ngay * 24 * 3600, path: "/", sameSite: "lax",
  });
  return res;
}
