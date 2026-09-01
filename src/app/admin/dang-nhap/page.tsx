import { Lock, Rocket } from "lucide-react";
import { redirect } from "next/navigation";
import { laAdmin } from "@/services/auth";
import { actDangNhap } from "../actions";

export default async function TrangDangNhap(props: { searchParams: Promise<{ loi?: string }> }) {
  if (await laAdmin()) redirect("/admin");
  const { loi } = await props.searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-700 to-blue-500 px-4">
      <div className="the w-full max-w-sm p-8">
        <div className="flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"><Rocket className="h-5 w-5" /></span>
          <span className="text-xl font-black text-slate-900">MGM <span className="text-blue-600">MAX</span></span>
        </div>
        <p className="mt-2 text-center text-sm text-slate-500">Trang quản trị chiến dịch viral</p>
        {loi && <div className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">Mật khẩu chưa đúng.</div>}
        <form action={actDangNhap} className="mt-5 space-y-3">
          <input name="mat_khau" type="password" required className="o-nhap" placeholder="Mật khẩu admin" autoFocus />
          <button className="nut-chinh w-full"><Lock className="h-4 w-4" /> Đăng nhập</button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-400">Mặc định: <code className="font-mono">mgmmax123</code> (đổi bằng biến ADMIN_MAT_KHAU)</p>
      </div>
    </main>
  );
}
