import { FlaskConical } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ABTest() {
  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Split test</h1>
      <p className="text-sm text-slate-500">So biến thể trang &amp; email, hệ tự dồn traffic cho bản thắng.</p>
      <div className="the mt-5 p-12 text-center">
        <FlaskConical className="mx-auto h-10 w-10 text-slate-300" />
        <div className="mt-3 font-bold text-slate-700">Sắp ra mắt</div>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
          Thử nghiệm tiêu đề trang, lời mời và tiêu đề email theo cơ chế tự học (multi-armed bandit) — nằm trong đợt tính năng kế tiếp (P12).
        </p>
      </div>
    </div>
  );
}
