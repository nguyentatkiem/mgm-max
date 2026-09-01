"use client";
import { useFormStatus } from "react-dom";
import { Loader2, Wand2 } from "lucide-react";

// Nút "Sinh chiến dịch" có trạng thái CHỜ — vì gọi Claude mất ~30–60s,
// không có phản hồi thì người dùng tưởng nút hỏng.
export default function NutSinh({ modelLabel }: { modelLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        disabled={pending}
        aria-busy={pending}
        className="nut-chinh w-full disabled:cursor-wait disabled:opacity-80"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Claude đang thiết kế chiến dịch…
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" /> Sinh chiến dịch (Claude {modelLabel}, ~30–60 giây)
          </>
        )}
      </button>
      {pending && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-center text-sm text-blue-700">
          <p className="font-semibold">Đang gọi Claude qua gói subscription…</p>
          <p className="mt-0.5 text-xs text-blue-600/90">Thường mất 30–60 giây (có thể tới ~2 phút nếu sinh lại). Vui lòng chờ, đừng đóng hay tải lại trang.</p>
        </div>
      )}
    </>
  );
}
