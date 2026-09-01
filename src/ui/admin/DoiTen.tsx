"use client";
import { useRef, useState } from "react";
import { Pencil } from "lucide-react";

/** Đổi tên chiến dịch inline trên top bar (submit form server action ẩn). */
export default function DoiTen({ id, ten, action }: { id: number; ten: string; action: (form: FormData) => void }) {
  const [sua, setSua] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  if (!sua) {
    return (
      <button onClick={() => setSua(true)} className="group inline-flex max-w-[320px] items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm border border-slate-200 cursor-pointer">
        <span className="truncate font-bold text-slate-900">{ten}</span>
        <Pencil className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-blue-600" />
      </button>
    );
  }
  return (
    <form ref={ref} action={action} className="inline-flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <input name="ten" defaultValue={ten} autoFocus maxLength={120}
        onBlur={() => ref.current?.requestSubmit()}
        onKeyDown={(e) => { if (e.key === "Enter") ref.current?.requestSubmit(); }}
        className="w-64 rounded-full border border-blue-400 bg-white px-4 py-2 font-bold text-slate-900 outline-none ring-2 ring-blue-100" />
    </form>
  );
}
