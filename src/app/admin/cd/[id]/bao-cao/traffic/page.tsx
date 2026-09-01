import { mot, q } from "@/db";

export const dynamic = "force-dynamic";

export default async function TrafficTheoNguon(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ loai?: string }>;
}) {
  const { id } = await props.params;
  const { loai = "gioi-thieu" } = await props.searchParams;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);

  // giới thiệu: click qua link cá nhân theo kênh share; nguồn: link /t theo keyword
  // (gộp click và đăng ký thành 2 truy vấn con rồi JOIN — tránh lỗi GROUP BY với subquery tương quan)
  const gioiThieu = await q(
    `select k.ten, k.ghe, coalesce(d.dk, 0) as dk
     from (select coalesce(nullif(c.kenh,''),'khac') as ten, count(*) as ghe
           from click_link c join nguoi_tham_gia n on n.ma=c.ma
           where n.chien_dich_id=$1 group by 1) k
     left join (select coalesce(nullif(kenh_vao,''),'khac') as ten, count(*) as dk
                from nguoi_tham_gia where chien_dich_id=$1 group by 1) d on d.ten=k.ten
     order by k.ghe desc`, [cd.id]);
  const nguon = await q(
    `select k.ten, k.ghe, coalesce(d.dk, 0) as dk
     from (select c.kenh as ten, count(*) as ghe from click_link c
           where c.ma = $2 group by 1) k
     left join (select kenh_vao as ten, count(*) as dk
                from nguoi_tham_gia where chien_dich_id=$1 group by 1) d on d.ten=k.ten
     order by k.ghe desc`, [cd.id, `src:${cd.id}`]);

  const rows = loai === "nguon" ? nguon : gioiThieu;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Traffic theo nguồn</h1>
      <p className="text-sm text-slate-500">Khách ghé đến từ đâu — và nguồn nào thực sự ra đăng ký.</p>

      <div className="mt-4 flex gap-2">
        <a href="?loai=gioi-thieu" className={`pill ${loai !== "nguon" ? "pill-bat" : "pill-tat"}`}>Từ link mời (kênh share)</a>
        <a href="?loai=nguon" className={`pill ${loai === "nguon" ? "pill-bat" : "pill-tat"}`}>Từ link nguồn (/t)</a>
      </div>

      <div className="the mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Nguồn</th><th className="px-4 py-3 text-right">Lượt ghé</th>
              <th className="px-4 py-3 text-right">Đăng ký</th><th className="px-4 py-3 text-right">Tỉ lệ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.ten} className="border-b border-slate-100">
                <td className="px-4 py-3 font-semibold capitalize text-slate-700">{r.ten}</td>
                <td className="px-4 py-3 text-right">{Number(r.ghe)}</td>
                <td className="px-4 py-3 text-right font-bold text-blue-700">{Number(r.dk)}</td>
                <td className="px-4 py-3 text-right text-slate-500">{Number(r.ghe) ? Math.round((Number(r.dk) / Number(r.ghe)) * 100) : 0}%</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-400">Chưa có dữ liệu.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
