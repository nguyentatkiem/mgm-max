"use client";
import { useState } from "react";
import { BadgeCheck, ExternalLink, HelpCircle, Zap } from "lucide-react";

type HanhDong = { id: number; ten: string; mo_ta: string; url: string; diem: number; cau_hoi: string; daLam: boolean };

export default function NhiemVu({ ma, danhSach }: { ma: string; danhSach: HanhDong[] }) {
  const [dangMo, setDangMo] = useState<number | null>(null);
  const [traLoi, setTraLoi] = useState("");
  const [ketQua, setKetQua] = useState<Record<number, string>>({});
  const [daXong, setDaXong] = useState<number[]>(danhSach.filter((h) => h.daLam).map((h) => h.id));

  async function nop(h: HanhDong) {
    const res = await fetch("/api/hanh-dong", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ma, hanhDongId: h.id, traLoi }),
    });
    const j = await res.json();
    if (j.dung) {
      setDaXong((d) => [...d, h.id]);
      setKetQua((k) => ({ ...k, [h.id]: `+${h.diem} điểm! 🎉` }));
      setDangMo(null);
    } else {
      setKetQua((k) => ({ ...k, [h.id]: "Chưa đúng — xem kỹ rồi thử lại nhé." }));
    }
    setTraLoi("");
  }

  if (!danhSach.length) return null;
  return (
    <div className="space-y-3">
      {danhSach.map((h) => {
        const xong = daXong.includes(h.id);
        return (
          <div key={h.id} className={`rounded-xl border p-4 ${xong ? "border-emerald-200 bg-emerald-50/60" : "border-slate-200 bg-white"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  {xong ? <BadgeCheck className="h-5 w-5 text-emerald-500" /> : <Zap className="h-5 w-5 text-amber-500" />}
                  {h.ten}
                </div>
                <div className="mt-0.5 text-sm text-slate-500">{h.mo_ta}</div>
              </div>
              <span className="hieu bg-blue-100 text-blue-700 shrink-0">+{h.diem}đ</span>
            </div>
            {!xong && (
              <div className="mt-3">
                {dangMo !== h.id ? (
                  <div className="flex gap-2">
                    {h.url && (
                      <a href={h.url} target="_blank" rel="noopener" className="nut-phu !py-1.5 text-sm">
                        <ExternalLink className="h-4 w-4" /> Làm nhiệm vụ
                      </a>
                    )}
                    <button onClick={() => setDangMo(h.id)} className="nut-chinh !py-1.5 text-sm">
                      <HelpCircle className="h-4 w-4" /> Trả lời nhận điểm
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-sm font-medium text-slate-700">{h.cau_hoi}</div>
                    <div className="mt-2 flex gap-2">
                      <input value={traLoi} onChange={(e) => setTraLoi(e.target.value)} className="o-nhap !py-1.5 text-sm" placeholder="Câu trả lời…" />
                      <button onClick={() => nop(h)} className="nut-chinh !py-1.5 text-sm shrink-0">Nộp</button>
                    </div>
                  </div>
                )}
                {ketQua[h.id] && <div className="mt-2 text-sm font-semibold text-blue-700">{ketQua[h.id]}</div>}
              </div>
            )}
            {xong && ketQua[h.id] && <div className="mt-1 text-sm font-semibold text-emerald-600">{ketQua[h.id]}</div>}
          </div>
        );
      })}
    </div>
  );
}
