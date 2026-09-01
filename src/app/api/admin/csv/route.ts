import { NextRequest, NextResponse } from "next/server";
import { laAdmin } from "@/services/auth";
import { xuatCsv } from "@/services/thong-ke";

export async function GET(req: NextRequest) {
  if (!(await laAdmin())) return new NextResponse("Chưa đăng nhập", { status: 401 });
  const cd = Number(req.nextUrl.searchParams.get("cd") || 0);
  const csv = await xuatCsv(cd);
  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mgm-max-leads-${cd}.csv"`,
    },
  });
}
