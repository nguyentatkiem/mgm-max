"use client";
import { useEffect } from "react";

/** Chèn mã tracking (GA4/Pixel…) do admin khai — tạo fragment để script thực thi được. */
export default function ChenMa({ ma }: { ma: string }) {
  useEffect(() => {
    if (!ma?.trim()) return;
    try {
      const frag = document.createRange().createContextualFragment(ma);
      document.head.appendChild(frag);
    } catch { /* mã lỗi thì bỏ qua, không làm hỏng trang */ }
  }, [ma]);
  return null;
}
