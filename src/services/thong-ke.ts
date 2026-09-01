import { q, mot } from "@/db";
import { heSoK, phanTram } from "@/core/thong-ke";
import { soSanhHang, anDanh, type DongHang } from "@/core/xep-hang";

export type SoLieuTongQuan = {
  clicks: number; dangKy: number; xacMinh: number; tuGioiThieu: number; coShare: number; coMoiThanhCong: number;
  k: number; ptXacMinh: number; ptTuGioiThieu: number;
  kenh: { kenh: string; clicks: number; dangKy: number }[];
  topNguoiMoi: { id: number; ten: string; email: string; soBan: number; diem: number }[];
  choDuyet: number; khoQuaSapHet: { ten_qua: string; con: number }[];
};

export async function tongQuan(chienDichId: number): Promise<SoLieuTongQuan> {
  const clicks = Number((await mot(`select count(*) as so from click_link c join nguoi_tham_gia n on n.ma=c.ma where n.chien_dich_id=$1`, [chienDichId]))?.so || 0);
  const dangKy = Number((await mot(`select count(*) as so from nguoi_tham_gia where chien_dich_id=$1`, [chienDichId]))?.so || 0);
  const xacMinh = Number((await mot(`select count(*) as so from nguoi_tham_gia where chien_dich_id=$1 and xac_minh`, [chienDichId]))?.so || 0);
  const tuGioiThieu = Number((await mot(`select count(*) as so from nguoi_tham_gia where chien_dich_id=$1 and xac_minh and nguoi_moi_id is not null`, [chienDichId]))?.so || 0);
  const coShare = Number((await mot(`select count(distinct nguoi_id) as so from so_diem where chien_dich_id=$1 and hanh_dong='share'`, [chienDichId]))?.so || 0);
  const coMoiThanhCong = Number((await mot(`select count(distinct nguoi_moi_id) as so from gioi_thieu where chien_dich_id=$1 and trang_thai='xac_minh'`, [chienDichId]))?.so || 0);
  const kenh = await q(
    `select coalesce(nullif(c.kenh,''),'khac') as kenh, count(*) as clicks,
            (select count(*) from nguoi_tham_gia n2 where n2.chien_dich_id=$1 and n2.kenh_vao=coalesce(nullif(c.kenh,''),'khac')) as dangky
     from click_link c join nguoi_tham_gia n on n.ma=c.ma where n.chien_dich_id=$1 group by 1 order by 2 desc`,
    [chienDichId]
  );
  const topNguoiMoi = await q(
    `select n.id, n.ten, n.email,
            count(g.id) filter (where g.trang_thai='xac_minh') as soban,
            coalesce((select sum(diem) from so_diem s where s.nguoi_id=n.id),0) as diem
     from nguoi_tham_gia n left join gioi_thieu g on g.nguoi_moi_id=n.id
     where n.chien_dich_id=$1 and n.xac_minh group by n.id order by soban desc, diem desc limit 10`,
    [chienDichId]
  );
  const choDuyet = Number((await mot(`select count(*) as so from gioi_thieu where chien_dich_id=$1 and trang_thai='cach_ly'`, [chienDichId]))?.so || 0);
  const khoQuaSapHet = await q(
    `select m.ten_qua, count(k.id) filter (where not k.da_phat) as con
     from moc_qua m join kho_coupon k on k.moc_id=m.id
     where m.chien_dich_id=$1 and m.loai_qua='coupon' and m.coupon_dung_chung=''
     group by m.id having count(k.id) filter (where not k.da_phat) <= 3`,
    [chienDichId]
  );
  return {
    clicks, dangKy, xacMinh, tuGioiThieu, coShare, coMoiThanhCong,
    k: heSoK(tuGioiThieu, xacMinh - tuGioiThieu),
    ptXacMinh: phanTram(xacMinh, dangKy),
    ptTuGioiThieu: phanTram(tuGioiThieu, xacMinh),
    kenh: kenh.map((r) => ({ kenh: r.kenh, clicks: Number(r.clicks), dangKy: Number(r.dangky) })),
    topNguoiMoi: topNguoiMoi.map((r) => ({ id: r.id, ten: r.ten, email: r.email, soBan: Number(r.soban), diem: Number(r.diem) })),
    choDuyet,
    khoQuaSapHet: khoQuaSapHet.map((r) => ({ ten_qua: r.ten_qua, con: Number(r.con) })),
  };
}

export type HangLeaderboard = { hang: number; id: number; ten: string; diem: number; soBan: number; laToi?: boolean };

export async function bangXepHang(chienDichId: number, gioiHan = 10, cuaNguoiId?: number): Promise<{ top: HangLeaderboard[]; toi: HangLeaderboard | null }> {
  const rows = await q(
    `select n.id, n.ten,
            coalesce((select sum(diem) from so_diem s where s.nguoi_id=n.id),0) as diem,
            (select count(*) from gioi_thieu g where g.nguoi_moi_id=n.id and g.trang_thai='xac_minh') as soban,
            coalesce((select max(extract(epoch from tao_luc)) from so_diem s where s.nguoi_id=n.id),0) as luc
     from nguoi_tham_gia n
     where n.chien_dich_id=$1 and n.xac_minh and not n.chan
       and not exists (select 1 from gioi_thieu g2 where g2.nguoi_duoc_moi_id=n.id and g2.trang_thai='cach_ly')`,
    [chienDichId]
  );
  const dong: DongHang[] = rows.map((r) => ({ id: r.id, ten: r.ten, diem: Number(r.diem), soBan: Number(r.soban), datDiemLuc: Number(r.luc) * 1000 }));
  dong.sort(soSanhHang);
  const top = dong.slice(0, gioiHan).map((d, i) => ({ hang: i + 1, id: d.id, ten: anDanh(d.ten), diem: d.diem, soBan: d.soBan }));
  let toi: HangLeaderboard | null = null;
  if (cuaNguoiId) {
    const idx = dong.findIndex((d) => d.id === cuaNguoiId);
    if (idx >= 0) toi = { hang: idx + 1, id: cuaNguoiId, ten: dong[idx].ten, diem: dong[idx].diem, soBan: dong[idx].soBan, laToi: true };
  }
  return { top, toi };
}

export async function xuatCsv(chienDichId: number): Promise<string> {
  const rows = await q(
    `select n.ten, n.email, n.ma, n.xac_minh, n.kenh_vao, n.tao_luc, n.diem_rui_ro,
            coalesce((select sum(diem) from so_diem s where s.nguoi_id=n.id),0) as diem,
            (select count(*) from gioi_thieu g where g.nguoi_moi_id=n.id and g.trang_thai='xac_minh') as soban,
            (select email from nguoi_tham_gia m where m.id=n.nguoi_moi_id) as nguoi_moi
     from nguoi_tham_gia n where n.chien_dich_id=$1 order by n.id`,
    [chienDichId]
  );
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const dau = "ten,email,ma,xac_minh,kenh_vao,tao_luc,diem_rui_ro,diem,so_ban_moi,nguoi_moi";
  return [dau, ...rows.map((r) =>
    [r.ten, r.email, r.ma, r.xac_minh, r.kenh_vao, new Date(r.tao_luc).toISOString(), r.diem_rui_ro, r.diem, r.soban, r.nguoi_moi || ""].map(esc).join(",")
  )].join("\n");
}
