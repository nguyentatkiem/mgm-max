"use client";
import { useState } from "react";
import { usePuck, type Data } from "@puckeditor/core";
import { LayoutGrid, Save, Trash2, X } from "lucide-react";
import { MAU_TRANG } from "./mau-trang";

export type MauLuu = { id: number; ten: string; data: Data };

// Thanh công cụ MẪU TRANG trong trình kéo-thả: áp mẫu 1 chạm + lưu trang đang dựng thành mẫu.
// Render trong overrides.headerActions của Puck nên dùng được usePuck().
export default function CongCuMau({
  mauDaLuu, luuMau, xoaMau, children,
}: {
  mauDaLuu: MauLuu[];
  luuMau: (ten: string, data: Data) => Promise<{ id: number; ten: string }>;
  xoaMau: (id: number) => Promise<void>;
  children?: React.ReactNode;
}) {
  const { dispatch, appState } = usePuck();
  const [mo, setMo] = useState(false);
  const [saved, setSaved] = useState<MauLuu[]>(mauDaLuu);
  const [dangLuu, setDangLuu] = useState(false);

  function ap(data: Data) {
    dispatch({ type: "setData", data });
    setMo(false);
  }

  async function luu() {
    const ten = window.prompt("Đặt tên cho mẫu trang này:", "Mẫu của tôi");
    if (!ten) return;
    setDangLuu(true);
    try {
      const data = appState.data as Data;
      const r = await luuMau(ten, data);
      setSaved((s) => [{ id: r.id, ten: r.ten, data }, ...s]);
    } finally {
      setDangLuu(false);
    }
  }

  async function xoa(id: number) {
    if (!window.confirm("Xoá mẫu này?")) return;
    await xoaMau(id);
    setSaved((s) => s.filter((m) => m.id !== id));
  }

  const nutPhu = "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-slate-600 hover:bg-slate-100";

  return (
    <>
      <button type="button" onClick={() => setMo(true)} className={nutPhu} title="Chọn bố cục trang dựng sẵn">
        <LayoutGrid className="h-4 w-4" /> Mẫu trang
      </button>
      <button type="button" onClick={luu} disabled={dangLuu} className={nutPhu} title="Lưu bố cục đang dựng thành mẫu">
        <Save className="h-4 w-4" /> {dangLuu ? "Đang lưu…" : "Lưu mẫu"}
      </button>
      {children}

      {mo && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-slate-900/50 p-6" onClick={() => setMo(false)}>
          <div className="mt-6 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">Chọn mẫu bố cục trang</h2>
              <button onClick={() => setMo(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <p className="mt-1 text-sm text-slate-500">Áp mẫu sẽ thay toàn bộ bố cục hiện tại (chưa xuất bản — anh xem rồi bấm Publish).</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {MAU_TRANG.map((m) => (
                <button key={m.ma} onClick={() => ap(m.data)}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 text-left transition-colors hover:border-blue-400 hover:bg-blue-50/50">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-2xl">{m.emoji}</span>
                  <span>
                    <span className="block text-sm font-black text-slate-800">{m.ten}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{m.moTa}</span>
                  </span>
                </button>
              ))}
            </div>

            {saved.length > 0 && (
              <>
                <div className="mt-5 text-[11px] font-bold uppercase tracking-wide text-slate-400">Mẫu anh đã lưu</div>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {saved.map((m) => (
                    <div key={m.id} className="flex items-center gap-2 rounded-xl border border-slate-200 p-3">
                      <button onClick={() => ap(m.data)} className="flex flex-1 items-center gap-3 text-left">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-lg">💾</span>
                        <span className="text-sm font-bold text-slate-800">{m.ten}</span>
                      </button>
                      <button onClick={() => xoa(m.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" title="Xoá mẫu">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
