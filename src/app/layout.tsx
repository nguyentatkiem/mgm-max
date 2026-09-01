import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MGM MAX — Mời bạn, nhận quà",
  description: "Nền tảng chiến dịch viral member-get-member cho sản phẩm số & khoá học",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
