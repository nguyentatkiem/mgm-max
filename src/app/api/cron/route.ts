import { NextResponse } from "next/server";
import { chayCron } from "@/services/cron";

// Gọi tay hoặc từ scheduler ngoài: GET /api/cron
export async function GET() {
  const kq = await chayCron();
  return NextResponse.json({ ok: true, ket_qua: kq });
}
