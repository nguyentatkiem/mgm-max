import { Code2 } from "lucide-react";
import { mot } from "@/db";
import { layBaseUrl } from "@/services/http";

export const dynamic = "force-dynamic";

export default async function NhungWebsite(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const baseUrl = await layBaseUrl();

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Nhúng vào website</h1>
      <p className="text-sm text-slate-500">Đặt form đăng ký ngay trên website sẵn có của anh — 2 cách, dán là chạy.</p>

      <div className="the mt-5 p-6">
        <div className="flex items-center gap-2 font-bold text-slate-900"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm text-white">1</span> Form nhúng giữa trang (iframe)</div>
        <p className="mt-1 pl-9 text-sm text-slate-500">Hiện form đăng ký gọn ngay trong nội dung trang.</p>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-emerald-300">{`<iframe src="${baseUrl}/nhung/${cd.slug}" width="100%" height="520" style="border:0;border-radius:12px"></iframe>`}</pre>
      </div>

      <div className="the mt-4 p-6">
        <div className="flex items-center gap-2 font-bold text-slate-900"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm text-white">2</span> Nút nổi + popup (1 dòng script)</div>
        <p className="mt-1 pl-9 text-sm text-slate-500">Nút «🎁 Nhận quà» nổi góc phải màn hình, bấm mở form — không đụng gì tới layout trang.</p>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-emerald-300">{`<script src="${baseUrl}/nhung/${cd.slug}/popup.js" defer></script>`}</pre>
      </div>

      <div className="the mt-4 flex items-start gap-3 p-5 text-sm text-slate-600">
        <Code2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div>Form nhúng dùng chung toàn bộ cơ chế với trang chính: double opt-in, chống gian lận, cookie giới thiệu. Đăng ký từ iframe vẫn tính điểm cho người mời bình thường.</div>
      </div>
    </div>
  );
}
