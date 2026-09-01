import { mot, q } from "@/db";
import { MAU_MAC_DINH } from "@/services/email";

export const dynamic = "force-dynamic";

export default async function BaoCaoEmail(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const tong = await mot(
    `select count(*) filter (where trang_thai in ('da_gui','gia_lap')) as gui,
            count(*) filter (where trang_thai='cho') as cho,
            count(*) filter (where trang_thai='loi') as loi
     from hang_doi_email where chien_dich_id=$1`, [cd.id]);
  const theoLoai = await q(
    `select loai, count(*) as so from hang_doi_email where chien_dich_id=$1 group by loai order by 2 desc`, [cd.id]);

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Email chiến dịch</h1>
      <p className="text-sm text-slate-500">Hiệu suất các email tự động của riêng chiến dịch này.</p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { ten: "Đã gửi / giả lập", so: Number(tong?.gui || 0), mau: "text-emerald-600" },
          { ten: "Đang chờ", so: Number(tong?.cho || 0), mau: "text-amber-600" },
          { ten: "Lỗi", so: Number(tong?.loi || 0), mau: "text-red-600" },
        ].map((o) => (
          <div key={o.ten} className="the p-4 text-center">
            <div className={`text-2xl font-black ${o.mau}`}>{o.so}</div>
            <div className="mt-0.5 text-xs font-semibold text-slate-400">{o.ten}</div>
          </div>
        ))}
      </div>

      <div className="the mt-5 p-6">
        <h2 className="font-bold text-slate-900">Theo loại email</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {theoLoai.map((k) => (
            <li key={k.loai} className="flex justify-between rounded-xl bg-slate-50 px-4 py-2.5">
              <span className="font-semibold text-slate-700">{MAU_MAC_DINH[k.loai]?.ten || k.loai}</span>
              <b className="text-blue-700">{Number(k.so)}</b>
            </li>
          ))}
          {theoLoai.length === 0 && <li className="text-slate-400">Chưa có email nào.</li>}
        </ul>
        <p className="mt-3 text-xs text-slate-400">Tỉ lệ mở cần bật gửi thật qua Resend (webhook mở email) — hiện trong lộ trình đợt sau.</p>
      </div>
    </div>
  );
}
