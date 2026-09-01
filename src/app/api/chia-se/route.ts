import { NextRequest, NextResponse } from "next/server";
import { mot } from "@/db";
import { ghiDiem, ngayHomNay } from "@/services/diem";

// Bấm nút share: +điểm 1 lần/kênh/ngày (khoá UNIQUE của sổ điểm tự chặn lặp)
export async function POST(req: NextRequest) {
  let body: { ma?: string; kenh?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ congDiem: false }); }
  const { ma, kenh } = body;
  if (!ma || !kenh || String(kenh).length > 20) return NextResponse.json({ congDiem: false });
  const ng = await mot(
    `select n.id, n.xac_minh, n.chan, n.chien_dich_id, c.trang_thai, c.diem_share, c.kenh_share from nguoi_tham_gia n join chien_dich c on c.id=n.chien_dich_id where n.ma=$1`,
    [ma]
  );
  // Chặn (C6): chỉ cộng khi campaign đang chạy + người đã xác minh + không bị chặn
  if (!ng || !ng.xac_minh || ng.chan || ng.trang_thai !== "chay" || !ng.kenh_share.split(",").includes(kenh))
    return NextResponse.json({ congDiem: false });
  const moi = await ghiDiem(ng.chien_dich_id, ng.id, "share", `share:${kenh}:${ngayHomNay()}`, ng.diem_share);
  return NextResponse.json({ congDiem: moi });
}
