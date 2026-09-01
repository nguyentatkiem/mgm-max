import { NextRequest, NextResponse } from "next/server";
import { mot } from "@/db";
import { ghiDiem } from "@/services/diem";

// Nhiệm vụ tuỳ chỉnh: xác minh bằng câu hỏi (chuẩn ngành — không API nào verify được hành vi bên thứ ba)
export async function POST(req: NextRequest) {
  let body: { ma?: string; hanhDongId?: unknown; traLoi?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ dung: false }); }
  const ma = String(body.ma || "");
  const hanhDongId = Number(body.hanhDongId);
  const traLoi = String(body.traLoi ?? "");
  if (!ma || !Number.isInteger(hanhDongId)) return NextResponse.json({ dung: false });
  const ng = await mot(
    `select n.id, n.xac_minh, n.chan, n.chien_dich_id, c.trang_thai from nguoi_tham_gia n join chien_dich c on c.id=n.chien_dich_id where n.ma=$1`,
    [ma]
  );
  // Chặn (C6): chỉ cộng khi campaign đang chạy + đã xác minh + không bị chặn
  if (!ng || !ng.xac_minh || ng.chan || ng.trang_thai !== "chay") return NextResponse.json({ dung: false });
  const hd = await mot(`select * from hanh_dong_tuy_chinh where id=$1 and chien_dich_id=$2 and bat`, [hanhDongId, ng.chien_dich_id]);
  if (!hd) return NextResponse.json({ dung: false });
  // Chặn (C7): nhiệm vụ đáp án rỗng không bao giờ được tính đúng (chống +điểm miễn phí)
  const dapAn = hd.dap_an.trim();
  if (!dapAn) return NextResponse.json({ dung: false, loi: "Nhiệm vụ chưa cấu hình đáp án." });
  const dung = traLoi.trim().toLowerCase() === dapAn.toLowerCase();
  if (dung) await ghiDiem(ng.chien_dich_id, ng.id, "hanh_dong", `hd:${hd.id}`, hd.diem);
  return NextResponse.json({ dung });
}
