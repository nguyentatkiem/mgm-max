import { NextRequest, NextResponse } from "next/server";
import { dangKy } from "@/services/nguoi-tham-gia";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const slug = String(form.get("slug") || "");
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3005";
  const baseUrl = `${proto}://${host}`;

  // Nguồn mã người mời: ô nhập tay > cookie > query ref
  const maForm = String(form.get("ma_gioi_thieu") || "");
  const maQuery = String(form.get("ref") || "");
  let maCookie = "";
  const cdId = String(form.get("cd_id") || "");
  if (cdId) maCookie = req.cookies.get(`mgm_ref_${cdId}`)?.value || "";

  const kq = await dangKy({
    slug,
    ten: String(form.get("ten") || ""),
    email: String(form.get("email") || ""),
    maNguoiMoi: maForm || maCookie || maQuery,
    kenh: String(form.get("kenh") || ""),
    ip: (req.headers.get("x-forwarded-for") || "").split(",")[0].trim(),
    ua: req.headers.get("user-agent") || "",
    baseUrl,
  });

  if (!kq.ok) return NextResponse.redirect(new URL(`/c/${slug}?loi=${encodeURIComponent(kq.loi)}`, baseUrl), 303);
  if (kq.daXacMinh) return NextResponse.redirect(new URL(`/toi/${kq.ma}`, baseUrl), 303);
  const demoQ = kq.demo ? `&t=${kq.token}` : "";
  return NextResponse.redirect(new URL(`/c/${slug}/cam-on?ma=${kq.ma}${demoQ}`, baseUrl), 303);
}
