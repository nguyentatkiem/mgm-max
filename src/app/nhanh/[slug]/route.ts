import { NextRequest } from "next/server";
import { mot } from "@/db";
import { dangKyNhanh, soDangKyIpHomNay } from "@/services/nguoi-tham-gia";
import { tokenNhanh } from "@/services/ky";
import { baseUrlTinCay, chuyenHuong } from "@/services/http";
import { layCaiDat } from "@/services/cai-dat";

// F14 — one-click link cho list email CÓ SẴN (do ADMIN phát, có token campaign):
// /nhanh/{slug}?email=...&ten=...&k=<token>[&ref=MA] → vào thẳng trang riêng, khỏi form + khỏi xác minh.
// Bảo mật (C1): bắt buộc token đúng (chống ai cũng gọi được để bơm điểm) + giới hạn IP/ngày.
export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const email = req.nextUrl.searchParams.get("email") || "";
  const ten = req.nextUrl.searchParams.get("ten") || "";
  const ref = req.nextUrl.searchParams.get("ref") || "";
  const k = req.nextUrl.searchParams.get("k") || "";
  const baseUrl = await baseUrlTinCay(layCaiDat); // link email tin cậy (C4)

  const cd = await mot(`select id, slug from chien_dich where slug=$1`, [slug]);
  if (!cd) return chuyenHuong("/");

  // Token campaign phải khớp — nếu sai/thiếu, đưa về trang đăng ký thường (qua double opt-in + chống gian lận)
  if (k !== tokenNhanh(cd.id)) {
    return chuyenHuong(`/c/${cd.slug}${ref ? `?ref=${encodeURIComponent(ref)}` : ""}`);
  }

  // Giới hạn IP/ngày (chống spam ngay cả khi link lộ)
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  if (ip && (await soDangKyIpHomNay(cd.id, ip)) >= 20) {
    return chuyenHuong(`/c/${cd.slug}?loi=${encodeURIComponent("Quá nhiều lượt từ mạng của bạn hôm nay.")}`);
  }

  const kq = await dangKyNhanh({ slug, ten, email, maNguoiMoi: ref, kenh: "one-click", baseUrl });
  if (!kq.ok) return chuyenHuong(`/c/${slug}?loi=${encodeURIComponent(kq.loi)}`);

  const res = chuyenHuong(`/toi/${kq.ma}${kq.moiTao ? "?moi=1" : ""}`);
  res.cookies.set(`mgm_toi_${kq.cdId}`, kq.ma, { maxAge: 180 * 24 * 3600, path: "/", sameSite: "lax" });
  return res;
}
