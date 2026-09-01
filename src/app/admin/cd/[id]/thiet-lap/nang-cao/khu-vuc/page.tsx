import { Globe2, MapPinned, Save } from "lucide-react";
import { mot } from "@/db";
import { actSuaKhuVuc } from "../../../../../actions";

export const dynamic = "force-dynamic";

export default async function KhuVuc(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const dangGioiHan = !!cd.khu_vuc;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Giới hạn khu vực</h1>
      <p className="text-sm text-slate-500">Chọn nơi được phép tham gia chiến dịch (nhận diện theo IP).</p>

      <form action={actSuaKhuVuc} className="mt-5 space-y-4">
        <input type="hidden" name="id" value={cd.id} />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={`the cursor-pointer p-5 ${!dangGioiHan ? "!border-blue-400 !bg-blue-50/50" : ""}`}>
            <input type="radio" name="che_do" value="toan_cau" defaultChecked={!dangGioiHan} className="sr-only" />
            <Globe2 className={`h-7 w-7 ${!dangGioiHan ? "text-blue-600" : "text-slate-400"}`} />
            <div className="mt-2 font-black text-slate-800">Toàn cầu</div>
            <div className="mt-1 text-xs text-slate-400">Ai cũng tham gia được, ở bất kỳ đâu.</div>
          </label>
          <label className={`the cursor-pointer p-5 ${dangGioiHan ? "!border-blue-400 !bg-blue-50/50" : ""}`}>
            <input type="radio" name="che_do" value="gioi_han" defaultChecked={dangGioiHan} className="sr-only" />
            <MapPinned className={`h-7 w-7 ${dangGioiHan ? "text-blue-600" : "text-slate-400"}`} />
            <div className="mt-2 font-black text-slate-800">Giới hạn quốc gia</div>
            <div className="mt-1 text-xs text-slate-400">Chỉ IP thuộc danh sách dưới mới đăng ký được.</div>
          </label>
        </div>
        <div className="the p-5">
          <label className="nhan">Mã quốc gia được phép (ISO 2 ký tự, cách nhau dấu phẩy)</label>
          <input name="khu_vuc" defaultValue={cd.khu_vuc} className="o-nhap font-mono uppercase" placeholder="VN, SG, US" />
          <p className="mt-2 text-xs text-slate-400">Nhận diện qua header quốc gia của Cloudflare — chạy qua tunnel/Cloudflare là tự có. Không có header thì cho qua (không chặn oan).</p>
          <button className="nut-chinh mt-3"><Save className="h-4 w-4" /> Lưu</button>
        </div>
      </form>
    </div>
  );
}
