import { Save, Share2, Trophy, UserPlus } from "lucide-react";
import { mot } from "@/db";
import { actSuaDiemSo } from "../../../../../actions";

export const dynamic = "force-dynamic";

export default async function CauHinhDiem(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Cấu hình điểm</h1>
      <p className="text-sm text-slate-500">Điểm lái hành vi: mời-bạn-xác-minh nên nặng gấp ~20 lần share suông.</p>

      <form action={actSuaDiemSo}>
        <input type="hidden" name="id" value={cd.id} />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="the p-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50"><Trophy className="h-6 w-6 text-blue-600" /></span>
            <h2 className="mt-3 font-black text-slate-800">Điểm đăng ký</h2>
            <p className="mt-1 text-xs text-slate-400">Cộng khi xác minh email xong — cho họ cảm giác đã gần phần quà đầu.</p>
            <input name="diem_dang_ky" type="number" min={0} defaultValue={cd.diem_dang_ky} className="o-nhap mx-auto mt-3 max-w-[140px] text-center text-xl font-black" />
          </div>
          <div className="the p-6 text-center !border-blue-300 !bg-blue-50/40">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600"><UserPlus className="h-6 w-6 text-white" /></span>
            <h2 className="mt-3 font-black text-slate-800">Điểm mời 1 bạn xác minh</h2>
            <p className="mt-1 text-xs text-slate-400">Nguồn điểm nặng ký nhất — chỉ tính khi bạn bè XÁC MINH email và qua cửa chống gian lận.</p>
            <input name="diem_moi_ban" type="number" min={1} defaultValue={cd.diem_moi_ban} className="o-nhap mx-auto mt-3 max-w-[140px] text-center text-xl font-black" />
          </div>
        </div>

        <div className="the mt-4 p-6">
          <h2 className="flex items-center gap-2 font-bold text-slate-900"><Share2 className="h-5 w-5 text-blue-600" /> Điểm chia sẻ (2 tầng)</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div><label className="nhan">Bấm nút share (1 lần/kênh/ngày)</label>
              <input name="diem_share" type="number" min={0} defaultValue={cd.diem_share} className="o-nhap" /></div>
            <div><label className="nhan">Mỗi click THẬT quay lại từ link</label>
              <input name="diem_click" type="number" min={0} defaultValue={cd.diem_click} className="o-nhap" /></div>
            <div><label className="nhan">Trần click/ngày</label>
              <input name="cap_click_ngay" type="number" min={0} defaultValue={cd.cap_click_ngay} className="o-nhap" /></div>
          </div>
          <p className="mt-2 text-xs text-slate-400">Không mạng nào cho xác minh share thật — nên điểm bấm nút để thấp, điểm click thật (đo được) mới là thước đo chuẩn.</p>
        </div>
        <button className="nut-chinh mt-4"><Save className="h-4 w-4" /> Lưu cấu hình điểm</button>
      </form>
    </div>
  );
}
