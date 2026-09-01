import { Mail, Save } from "lucide-react";
import { mot, q } from "@/db";
import { MAU_MAC_DINH } from "@/services/email";
import { actLuuMauEmail, actTatBatEmail } from "../../../../../actions";

export const dynamic = "force-dynamic";

const ICON_MAU: Record<string, string> = {
  xac_minh: "bg-sky-50 text-sky-600", chao_mung: "bg-blue-50 text-blue-600", moi_thanh_cong: "bg-emerald-50 text-emerald-600",
  sap_moc: "bg-amber-50 text-amber-600", mo_qua: "bg-violet-50 text-violet-600", trung_giai: "bg-rose-50 text-rose-600",
  nhac: "bg-slate-100 text-slate-600",
};

export default async function EmailTuDong(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const mauGhiDe = await q(`select * from mau_email where chien_dich_id=$1`, [cd.id]);
  const tat: Record<string, boolean> = cd.email_tat || {};
  const coResend = !!process.env.RESEND_API_KEY;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Email tự động</h1>
      <p className="text-sm text-slate-500">Bật/tắt và tuỳ chỉnh từng email hệ thống gửi cho người tham gia.</p>

      <div className="mt-5 space-y-3">
        {Object.entries(MAU_MAC_DINH).map(([loai, macDinh]) => {
          const ghiDe = mauGhiDe.find((m) => m.loai === loai);
          const dangBat = tat[loai] !== false;
          const batBuoc = loai === "xac_minh";
          return (
            <details key={loai} className="the p-4">
              <summary className="flex cursor-pointer items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${ICON_MAU[loai] || "bg-slate-100 text-slate-600"}`}><Mail className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-800">{macDinh.ten} {ghiDe && <span className="hieu bg-blue-100 text-blue-700">đã tuỳ chỉnh</span>}</div>
                  <div className="truncate text-xs text-slate-400">{macDinh.tieu_de}</div>
                </div>
                {batBuoc ? (
                  <span className="hieu bg-slate-100 text-slate-500 shrink-0">luôn bật</span>
                ) : (
                  <form action={actTatBatEmail} className="shrink-0">
                    <input type="hidden" name="id" value={cd.id} /><input type="hidden" name="loai" value={loai} />
                    <button className={`cong-tac ${dangBat ? "bat" : "tat"}`} title={dangBat ? "Đang bật — bấm để tắt" : "Đang tắt — bấm để bật"}><span className="num" /></button>
                  </form>
                )}
              </summary>
              <form action={actLuuMauEmail} className="mt-4 border-t border-slate-100 pt-4">
                <input type="hidden" name="chien_dich_id" value={cd.id} /><input type="hidden" name="loai" value={loai} />
                <input name="tieu_de" defaultValue={ghiDe?.tieu_de || macDinh.tieu_de} className="o-nhap !py-2 text-sm" />
                <textarea name="noi_dung" rows={4} defaultValue={ghiDe?.noi_dung || macDinh.noi_dung} className="o-nhap mt-2 !py-2 text-sm" />
                <button className="nut-phu mt-2 !py-1.5 text-xs"><Save className="h-3.5 w-3.5" /> Lưu mẫu</button>
              </form>
            </details>
          );
        })}
      </div>

      <div className="the mt-5 p-5 text-sm text-slate-600">
        <b className="text-slate-800">Người gửi:</b> {coResend ? "Resend (gửi thật, domain riêng)" : "chế độ giả lập — email nằm ở menu Email trên cùng để xem nội dung"}.
        Biến dùng được: {"{{ten}} {{ten_chien_dich}} {{link_rieng}} {{link_xac_minh}} {{so_ban}} {{tien_do}} {{ten_qua}} {{gia_tri_qua}} {{qua_ke_tiep}} {{giai}} {{hang}} {{diem}}"}
      </div>
    </div>
  );
}
