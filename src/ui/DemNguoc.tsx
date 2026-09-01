"use client";
import { useEffect, useState } from "react";

export default function DemNguoc({ den }: { den: string }) {
  const [conLai, setConLai] = useState(() => new Date(den).getTime() - Date.now());
  useEffect(() => {
    const t = setInterval(() => setConLai(new Date(den).getTime() - Date.now()), 1000);
    return () => clearInterval(t);
  }, [den]);
  if (conLai <= 0) return <span className="font-bold">Đã kết thúc</span>;
  const s = Math.floor(conLai / 1000);
  const o = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
  const nhan = ["ngày", "giờ", "phút", "giây"];
  return (
    <span className="inline-flex gap-2">
      {o.map((v, i) => (
        <span key={i} className="rounded-lg bg-white/20 px-2.5 py-1 text-sm font-bold backdrop-blur">
          {String(v).padStart(2, "0")} <span className="font-normal opacity-75">{nhan[i]}</span>
        </span>
      ))}
    </span>
  );
}
