"use client";
import { Trash2 } from "lucide-react";
import { actXoaChienDich } from "@/app/admin/actions";

// Nút xoá chiến dịch ngay trên danh sách — hỏi xác nhận trước khi gửi.
export default function NutXoaChienDich({ id, ten }: { id: number; ten: string }) {
  return (
    <form
      action={actXoaChienDich}
      onSubmit={(e) => {
        if (!confirm(`Xoá vĩnh viễn chiến dịch “${ten}”?\nToàn bộ lead, điểm, quà, email của chiến dịch sẽ mất — không hoàn tác được.`)) e.preventDefault();
      }}>
      <input type="hidden" name="id" value={id} />
      <button className="nut-phu !px-2.5 !py-1.5 text-xs !text-red-600" title="Xoá vĩnh viễn"><Trash2 className="h-3.5 w-3.5" /></button>
    </form>
  );
}
