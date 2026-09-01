import Link from "next/link";
import { headers } from "next/headers";
import { Dice5, Gauge, LogOut, Mail, Megaphone, Rocket, Settings, Sparkles, Users } from "lucide-react";
import { laAdmin } from "@/services/auth";
import { actDangXuat } from "./actions";

const MUC = [
  { href: "/admin", ten: "Tổng quan", icon: Gauge },
  { href: "/admin/chien-dich", ten: "Chiến dịch", icon: Megaphone },
  { href: "/admin/ai", ten: "Tạo bằng AI", icon: Sparkles },
  { href: "/admin/lead", ten: "Người tham gia", icon: Users },
  { href: "/admin/boc-tham", ten: "Bốc thăm", icon: Dice5 },
  { href: "/admin/email", ten: "Email", icon: Mail },
  { href: "/admin/cai-dat", ten: "Cài đặt", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const daDangNhap = await laAdmin();
  const h = await headers();
  const duongDan = h.get("x-invoke-path") || "";
  if (!daDangNhap) return <>{children}</>; // trang đăng nhập tự render

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-4 sm:flex">
        <Link href="/admin" className="flex items-center gap-2 px-2 py-1.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white"><Rocket className="h-5 w-5" /></span>
          <span className="text-lg font-black tracking-tight text-slate-900">MGM <span className="text-blue-600">MAX</span></span>
        </Link>
        <nav className="mt-6 space-y-1">
          {MUC.map((m) => (
            <Link key={m.href} href={m.href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${duongDan === m.href ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
              <m.icon className="h-4.5 w-4.5" /> {m.ten}
            </Link>
          ))}
        </nav>
        <form action={actDangXuat} className="mt-auto">
          <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 cursor-pointer">
            <LogOut className="h-4.5 w-4.5" /> Đăng xuất
          </button>
        </form>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="border-b border-slate-200 bg-white px-4 py-2 sm:hidden">
          <div className="flex gap-1 overflow-x-auto">
            {MUC.map((m) => (
              <Link key={m.href} href={m.href} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-blue-50 whitespace-nowrap">{m.ten}</Link>
            ))}
          </div>
        </div>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
