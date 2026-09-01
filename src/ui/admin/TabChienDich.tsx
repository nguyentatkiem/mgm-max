"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Gauge, Megaphone, Settings2, Users } from "lucide-react";

const TABS = [
  { duoi: "tong-quan", ten: "Tổng quan", icon: Gauge },
  { duoi: "thiet-lap", ten: "Thiết lập", icon: Settings2 },
  { duoi: "quang-ba", ten: "Quảng bá", icon: Megaphone },
  { duoi: "bao-cao", ten: "Báo cáo", icon: BarChart3 },
  { duoi: "nguoi-tham-gia", ten: "Người tham gia", icon: Users },
];

export default function TabChienDich({ cdId }: { cdId: number }) {
  const duongDan = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {TABS.map((t) => {
        const href = `/admin/cd/${cdId}/${t.duoi}`;
        const bat = duongDan?.startsWith(href);
        return (
          <Link key={t.duoi} href={href}
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold transition-colors ${bat ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100"}`}>
            <t.icon className="h-4.5 w-4.5" /> <span className="hidden md:inline">{t.ten}</span>
          </Link>
        );
      })}
    </nav>
  );
}
