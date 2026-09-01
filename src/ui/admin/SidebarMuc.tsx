"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type MucSidebar = { href: string; ten: string; nhom?: string };

/** Sidebar dọc kiểu UpViral: nhóm card trắng, mục active nền xanh nhạt. */
export default function SidebarMuc({ cacMuc }: { cacMuc: MucSidebar[] }) {
  const duongDan = usePathname();
  const nhoms: { nhom: string; muc: MucSidebar[] }[] = [];
  for (const m of cacMuc) {
    const nhom = m.nhom || "";
    const cuoi = nhoms[nhoms.length - 1];
    if (cuoi && cuoi.nhom === nhom) cuoi.muc.push(m);
    else nhoms.push({ nhom, muc: [m] });
  }
  return (
    <div className="space-y-3">
      {nhoms.map((n, i) => (
        <div key={i} className="the p-2">
          {n.nhom && <div className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">{n.nhom}</div>}
          {n.muc.map((m) => {
            const bat = duongDan === m.href || duongDan?.startsWith(m.href + "/");
            return (
              <Link key={m.href} href={m.href}
                className={`block rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${bat ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
                {m.ten}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
