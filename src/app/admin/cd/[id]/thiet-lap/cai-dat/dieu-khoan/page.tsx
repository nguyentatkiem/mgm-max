import { AlertTriangle, Save } from "lucide-react";
import { mot } from "@/db";
import { actSuaDieuKhoan } from "../../../../../actions";

export const dynamic = "force-dynamic";

export default async function DieuKhoan(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Điều khoản chương trình</h1>
          <p className="text-sm text-slate-500">Ghi rõ luật chơi để người tham gia biết chính xác quyền lợi trước khi vào.</p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Nội dung dưới đây chỉ là khung gợi ý do anh tự soạn và tự chịu trách nhiệm pháp lý — nên ghi rõ: điều kiện tham gia, thời hạn, cách chọn người thắng, cách trao quà, quyền từ chối lượt gian lận.</span>
      </div>

      <form action={actSuaDieuKhoan} className="the mt-4 space-y-4 p-5">
        <input type="hidden" name="id" value={cd.id} />
        <div>
          <label className="nhan">Tiêu đề</label>
          <input name="tieu_de" defaultValue={cd.dieu_khoan_tieu_de} className="o-nhap" placeholder="VD: Thể lệ chương trình «Mời bạn nhận quà» đợt 1" />
        </div>
        <div>
          <label className="nhan">Nội dung (hiện thành link «Điều khoản» trên trang đăng ký khi có nội dung)</label>
          <textarea name="noi_dung" rows={12} defaultValue={cd.dieu_khoan} className="o-nhap text-sm"
            placeholder={"1. Đối tượng tham gia: …\n2. Thời gian: …\n3. Cách tính điểm và mở quà: …\n4. Cách chọn và trao giải: …\n5. Ban tổ chức có quyền loại lượt tham gia gian lận."} />
        </div>
        <button className="nut-chinh"><Save className="h-4 w-4" /> Lưu điều khoản</button>
      </form>
    </div>
  );
}
