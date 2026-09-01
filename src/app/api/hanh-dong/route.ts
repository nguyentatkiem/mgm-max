import { NextRequest, NextResponse } from "next/server";
import { mot } from "@/db";
import { ghiDiem } from "@/services/diem";

// Nhiệm vụ tuỳ chỉnh: xác minh bằng câu hỏi (chuẩn ngành — không API nào verify được hành vi bên thứ ba)
export async function POST(req: NextRequest) {
  const { ma, hanhDongId, traLoi } = await req.json();
  const ng = await mot(`select id, xac_minh, chien_dich_id from nguoi_tham_gia where ma=$1`, [ma]);
  if (!ng || !ng.xac_minh) return NextResponse.json({ dung: false });
  const hd = await mot(`select * from hanh_dong_tuy_chinh where id=$1 and chien_dich_id=$2 and bat`, [hanhDongId, ng.chien_dich_id]);
  if (!hd) return NextResponse.json({ dung: false });
  const dung = String(traLoi || "").trim().toLowerCase() === hd.dap_an.trim().toLowerCase();
  if (dung) await ghiDiem(ng.chien_dich_id, ng.id, "hanh_dong", `hd:${hd.id}`, hd.diem);
  return NextResponse.json({ dung });
}
