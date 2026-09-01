import { Code2, Mail, Share2, Upload } from "lucide-react";
import { mot } from "@/db";
import { layBaseUrl } from "@/services/http";
import { actImportCsv } from "../../../../actions";

export const dynamic = "force-dynamic";

export default async function TrafficSanCo(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ import?: string }>;
}) {
  const { id } = await props.params;
  const { import: kqImport } = await props.searchParams;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const baseUrl = await layBaseUrl();

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Traffic sẵn có</h1>
      <p className="text-sm text-slate-500">Biến khán giả anh ĐANG có (list email, học viên cũ, website) thành người phát tán chiến dịch.</p>

      <div className="mt-5 space-y-3">
        <details className="the p-5" open>
          <summary className="flex cursor-pointer items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Mail className="h-5 w-5" /></span>
            <div className="flex-1">
              <div className="font-bold text-slate-800">Mời list email sẵn có (one-click)</div>
              <div className="text-xs text-slate-400">Người trong list bấm link là vào thẳng trang mời bạn — khỏi điền form, khỏi xác minh</div>
            </div>
          </summary>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">Dán link này vào email gửi từ hệ thống của anh, thay {"{{EMAIL}}/{{TEN}}"} bằng merge tag của nền tảng email:</p>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-emerald-300">{`${baseUrl}/nhanh/${cd.slug}?email={{EMAIL}}&ten={{TEN}}`}</pre>
          </div>
        </details>

        <details className="the p-5">
          <summary className="flex cursor-pointer items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Upload className="h-5 w-5" /></span>
            <div className="flex-1">
              <div className="font-bold text-slate-800">Import lead từ CSV</div>
              <div className="text-xs text-slate-400">Đưa danh sách có sẵn vào chiến dịch — đã xác minh sẵn, không gửi email làm phiền</div>
            </div>
          </summary>
          <div className="mt-4 border-t border-slate-100 pt-4">
            {kqImport && (
              <div className="mb-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                ✓ Import xong: {kqImport.split("-")[0]} người mới, {kqImport.split("-")[1]} bỏ qua.
              </div>
            )}
            <form action={actImportCsv}>
              <input type="hidden" name="chien_dich_id" value={cd.id} />
              <textarea name="du_lieu" rows={4} required className="o-nhap font-mono text-sm"
                placeholder={"Mỗi dòng: ten,email[,ma_nguoi_moi]\nNguyễn Văn A,a@gmail.com"} />
              <button className="nut-chinh mt-2 !py-2 text-sm"><Upload className="h-4 w-4" /> Import</button>
            </form>
          </div>
        </details>

        <details className="the p-5">
          <summary className="flex cursor-pointer items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Code2 className="h-5 w-5" /></span>
            <div className="flex-1">
              <div className="font-bold text-slate-800">Nhúng lên website của anh</div>
              <div className="text-xs text-slate-400">Form iframe hoặc nút nổi popup — dán 1 dòng là chạy</div>
            </div>
          </summary>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <pre className="overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-emerald-300">{`<script src="${baseUrl}/nhung/${cd.slug}/popup.js" defer></script>`}</pre>
            <p className="mt-2 text-xs text-slate-400">Chi tiết cả 2 cách ở Thiết lập › Nhúng website.</p>
          </div>
        </details>

        <details className="the p-5">
          <summary className="flex cursor-pointer items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Share2 className="h-5 w-5" /></span>
            <div className="flex-1">
              <div className="font-bold text-slate-800">Tự chia sẻ phát súng đầu</div>
              <div className="text-xs text-slate-400">Chiến dịch cần 20–50 người đầu tiên làm mồi — chính anh là người mời số 0</div>
            </div>
          </summary>
          <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
            Đăng link <code className="font-mono text-blue-700">{baseUrl}/c/{cd.slug}</code> lên trang cá nhân, nhóm Zalo lớp học, cộng đồng của anh — kèm ảnh quà thật và hạn chót để tạo cấp bách.
          </div>
        </details>
      </div>
    </div>
  );
}
