import { mot, q } from "@/db";

export const dynamic = "force-dynamic";

export default async function BaoCaoNhiemVu(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const tong = await mot(
    `select count(*) filter (where hanh_dong='share') as share,
            count(distinct nguoi_id) filter (where hanh_dong='share') as nguoi_share,
            count(*) filter (where hanh_dong='hanh_dong') as nv,
            count(distinct nguoi_id) filter (where hanh_dong='hanh_dong') as nguoi_nv
     from so_diem where chien_dich_id=$1`, [cd.id]);
  const tongNguoi = Number((await mot(`select count(*) as so from nguoi_tham_gia where chien_dich_id=$1 and xac_minh`, [cd.id]))?.so || 1);
  const theoKenh = await q(
    `select split_part(doi_tuong, ':', 2) as kenh, count(*) as so from so_diem
     where chien_dich_id=$1 and hanh_dong='share' group by 1 order by 2 desc`, [cd.id]);
  const theoNv = await q(
    `select h.ten, count(s.id) as so from hanh_dong_tuy_chinh h
     left join so_diem s on s.hanh_dong='hanh_dong' and s.doi_tuong='hd:'||h.id
     where h.chien_dich_id=$1 group by h.id order by 2 desc`, [cd.id]);

  const pt = (a: number) => (tongNguoi ? Math.round((a / tongNguoi) * 100) : 0);

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Nút hành động</h1>
      <p className="text-sm text-slate-500">Theo dõi tương tác qua share mạng xã hội và nhiệm vụ cộng điểm.</p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { ten: "Tổng lượt share", so: Number(tong?.share || 0) },
          { ten: "% người có share", so: `${pt(Number(tong?.nguoi_share || 0))}%` },
          { ten: "Tổng lượt nhiệm vụ", so: Number(tong?.nv || 0) },
          { ten: "% người làm nhiệm vụ", so: `${pt(Number(tong?.nguoi_nv || 0))}%` },
        ].map((o) => (
          <div key={o.ten} className="the p-4 text-center">
            <div className="text-2xl font-black text-slate-900">{o.so}</div>
            <div className="mt-0.5 text-xs font-semibold text-slate-400">{o.ten}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="the p-6">
          <h2 className="font-bold text-slate-900">Share theo kênh</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {theoKenh.map((k) => (
              <li key={k.kenh} className="flex justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                <span className="font-semibold capitalize text-slate-700">{k.kenh}</span><b className="text-blue-700">{Number(k.so)}</b>
              </li>
            ))}
            {theoKenh.length === 0 && <li className="text-slate-400">Chưa có lượt share nào.</li>}
          </ul>
        </div>
        <div className="the p-6">
          <h2 className="font-bold text-slate-900">Nhiệm vụ hoàn thành</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {theoNv.map((k) => (
              <li key={k.ten} className="flex justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                <span className="font-semibold text-slate-700">{k.ten}</span><b className="text-blue-700">{Number(k.so)}</b>
              </li>
            ))}
            {theoNv.length === 0 && <li className="text-slate-400">Chưa có nhiệm vụ nào.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
