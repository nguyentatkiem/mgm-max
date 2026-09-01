import { NextRequest, NextResponse } from "next/server";
import { chayCron } from "@/services/cron";

// Gọi tay/scheduler ngoài: GET /api/cron?key=<CRON_SECRET> (hoặc header Authorization: Bearer <CRON_SECRET>).
// Bảo mật (C2): bắt buộc khớp CRON_SECRET. Cron nội bộ (instrumentation.ts) gọi thẳng chayCron() nên không cần.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET || "";
  if (!secret) {
    return NextResponse.json({ ok: false, loi: "Chưa cấu hình CRON_SECRET — đặt biến môi trường rồi gọi lại." }, { status: 403 });
  }
  const key = req.nextUrl.searchParams.get("key") || (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (key !== secret) {
    return NextResponse.json({ ok: false, loi: "Sai CRON_SECRET." }, { status: 401 });
  }
  const kq = await chayCron();
  return NextResponse.json({ ok: true, ket_qua: kq });
}
