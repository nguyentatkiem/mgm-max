import { mot, q, pool } from "@/db";
import { sinhMa, sinhToken, chuanHoaMa, maHopLe } from "@/core/ma";
import { chamDiemRuiRo, emailHangLoat, emailRac, NGUONG_CACH_LY } from "@/core/gian-lan";
import { mocMoKhoa, mocKeTiep, sapChamMoc, type Moc } from "@/core/moc";
import { ghiDiem } from "./diem";
import { xepEmail } from "./email";
import { layCaiDat } from "./cai-dat";

const GIOI_HAN_IP_NGAY = 3;

export type KetQuaDangKy =
  | { ok: true; ma: string; token: string; demo: boolean; daXacMinh: boolean }
  | { ok: false; loi: string };

export async function dangKy(tham: {
  slug: string; ten: string; email: string; maNguoiMoi: string; kenh: string; ip: string; ua: string; baseUrl: string;
}): Promise<KetQuaDangKy> {
  const cd = await mot(`select * from chien_dich where slug=$1`, [tham.slug]);
  if (!cd || cd.trang_thai !== "chay") return { ok: false, loi: "Chiến dịch không tồn tại hoặc đã đóng." };

  const email = tham.email.trim().toLowerCase();
  const ten = tham.ten.trim();
  if (!ten || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, loi: "Tên hoặc email chưa hợp lệ." };
  if (emailRac(email)) return { ok: false, loi: "Vui lòng dùng email thật (không nhận email dùng-một-lần)." };

  // Đã đăng ký rồi → trả lại đúng người cũ (idempotent, không tạo trùng)
  const cu = await mot(`select * from nguoi_tham_gia where chien_dich_id=$1 and email=$2`, [cd.id, email]);
  if (cu) return { ok: true, ma: cu.ma, token: cu.token_xac_minh || "", demo: cd.che_do_demo, daXacMinh: cu.xac_minh };

  // Rate-limit theo IP (trừ IP trong whitelist)
  const whitelist = (await layCaiDat("whitelist_ip")).split(/\s+/).filter(Boolean);
  if (tham.ip && !whitelist.includes(tham.ip)) {
    const dem = await mot<{ so: string }>(
      `select count(*) as so from nguoi_tham_gia where chien_dich_id=$1 and ip=$2 and tao_luc > now() - interval '1 day'`,
      [cd.id, tham.ip]
    );
    if (Number(dem?.so || 0) >= GIOI_HAN_IP_NGAY)
      return { ok: false, loi: "Quá nhiều lượt đăng ký từ mạng của bạn hôm nay. Thử lại sau nhé." };
  }
  const blacklist = (await layCaiDat("blacklist_email")).split(/\s+/).filter(Boolean);
  if (blacklist.includes(email)) return { ok: false, loi: "Email này không thể tham gia chương trình." };

  // Tìm người mời (chặn tự giới thiệu ngay tại cửa)
  let nguoiMoi = null;
  const maNM = chuanHoaMa(tham.maNguoiMoi || "");
  if (maNM && maHopLe(maNM)) {
    nguoiMoi = await mot(`select * from nguoi_tham_gia where ma=$1 and chien_dich_id=$2`, [maNM, cd.id]);
    if (nguoiMoi && (nguoiMoi.email === email || nguoiMoi.chan)) nguoiMoi = null;
  }

  // Sinh mã riêng (thử lại nếu đụng UNIQUE — xác suất cực thấp)
  let ma = sinhMa();
  const token = sinhToken();
  for (let lan = 0; lan < 3; lan++) {
    try {
      const moi = await mot(
        `insert into nguoi_tham_gia (chien_dich_id, ten, email, ma, token_xac_minh, ip, ua, nguoi_moi_id, kenh_vao)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id`,
        [cd.id, ten, email, ma, token, tham.ip, tham.ua.slice(0, 300), nguoiMoi?.id || null, tham.kenh]
      );
      if (nguoiMoi) {
        await q(
          `insert into gioi_thieu (chien_dich_id, nguoi_moi_id, nguoi_duoc_moi_id) values ($1,$2,$3)
           on conflict (nguoi_duoc_moi_id) do nothing`,
          [cd.id, nguoiMoi.id, moi!.id]
        );
      }
      break;
    } catch (e: unknown) {
      if (String(e).includes("nguoi_tham_gia_ma_key")) { ma = sinhMa(); continue; }
      throw e;
    }
  }

  await xepEmail(cd.id, "xac_minh", email, ten, {
    ten, ten_chien_dich: cd.ten, link_xac_minh: `${tham.baseUrl}/xac-minh/${token}`,
  });
  return { ok: true, ma, token, demo: cd.che_do_demo, daXacMinh: false };
}

/** Xác minh email → kích hoạt điểm + xử referral + quà hai chiều. Trả về mã để redirect sang trang riêng. */
export async function xacMinh(token: string, baseUrl: string): Promise<string | null> {
  const ng = await mot(`select * from nguoi_tham_gia where token_xac_minh=$1`, [token]);
  if (!ng) return null;
  if (ng.xac_minh) return ng.ma; // link bấm lại — vô hại

  const cd = await mot(`select * from chien_dich where id=$1`, [ng.chien_dich_id]);
  await q(`update nguoi_tham_gia set xac_minh=true, xac_minh_luc=now() where id=$1`, [ng.id]);
  await ghiDiem(cd.id, ng.id, "dang_ky", "", cd.diem_dang_ky);

  const linkRieng = `${baseUrl}/toi/${ng.ma}`;
  let dongQua = "";
  // Thưởng hai chiều: người được mời cũng có quà chào mừng
  if (cd.hai_chieu && cd.qua_chao_mung && ng.nguoi_moi_id) {
    await q(
      `insert into qua_da_trao (nguoi_id, loai, ten_qua, loai_qua, gia_tri) values ($1,'chao_mung',$2,'coupon',$3)`,
      [ng.id, cd.qua_chao_mung, cd.qua_chao_mung_gia_tri]
    );
    dongQua = `Quà chào mừng của bạn: ${cd.qua_chao_mung}${cd.qua_chao_mung_gia_tri ? ` — ${cd.qua_chao_mung_gia_tri}` : ""}\n\n`;
  }
  await xepEmail(cd.id, "chao_mung", ng.email, ng.ten, {
    ten: ng.ten, ten_chien_dich: cd.ten, link_rieng: linkRieng, qua_chao_mung: dongQua,
  });

  // Xử referral đang chờ
  const gt = await mot(`select * from gioi_thieu where nguoi_duoc_moi_id=$1 and trang_thai='cho'`, [ng.id]);
  if (gt) {
    const nguoiMoi = await mot(`select * from nguoi_tham_gia where id=$1`, [gt.nguoi_moi_id]);
    const cacRefereeKhac = await q(
      `select n.email, n.ip, n.tao_luc from gioi_thieu g join nguoi_tham_gia n on n.id=g.nguoi_duoc_moi_id
       where g.nguoi_moi_id=$1 and g.nguoi_duoc_moi_id<>$2`,
      [gt.nguoi_moi_id, ng.id]
    );
    const trong10Phut = cacRefereeKhac.filter(
      (r) => Math.abs(new Date(r.tao_luc).getTime() - new Date(ng.tao_luc).getTime()) < 10 * 60 * 1000
    ).length;
    const diemRuiRo = chamDiemRuiRo({
      cungIpVoiNguoiMoi: !!ng.ip && ng.ip === nguoiMoi?.ip,
      emailHangLoat: emailHangLoat(ng.email, cacRefereeKhac.map((r) => r.email)),
      nhieuRefereeCungIp: !!ng.ip && cacRefereeKhac.some((r) => r.ip === ng.ip),
      dangKyDonDap: trong10Phut >= 5,
      chuaXacMinh48h: false,
    });
    await q(`update gioi_thieu set diem_rui_ro=$2 where id=$1`, [gt.id, diemRuiRo]);
    await q(`update nguoi_tham_gia set diem_rui_ro=$2 where id=$1`, [ng.id, diemRuiRo]);
    if (diemRuiRo >= NGUONG_CACH_LY) {
      await q(`update gioi_thieu set trang_thai='cach_ly', ly_do_cach_ly=$2 where id=$1`,
        [gt.id, `Điểm rủi ro ${diemRuiRo} (ngưỡng ${NGUONG_CACH_LY})`]);
    } else {
      await xacNhanGioiThieu(gt.id, baseUrl);
    }
  }
  return ng.ma;
}

/** Công nhận 1 referral: cộng điểm người mời + check mốc quà + email. Dùng cả khi admin duyệt cách ly. */
export async function xacNhanGioiThieu(gioiThieuId: number, baseUrl: string) {
  const gt = await mot(`select * from gioi_thieu where id=$1`, [gioiThieuId]);
  if (!gt || gt.trang_thai === "xac_minh") return;
  const cd = await mot(`select * from chien_dich where id=$1`, [gt.chien_dich_id]);
  const nguoiMoi = await mot(`select * from nguoi_tham_gia where id=$1`, [gt.nguoi_moi_id]);
  if (!cd || !nguoiMoi) return;

  await q(`update gioi_thieu set trang_thai='xac_minh', xac_minh_luc=now() where id=$1`, [gioiThieuId]);
  await ghiDiem(cd.id, nguoiMoi.id, "moi_ban", `gt:${gioiThieuId}`, cd.diem_moi_ban);

  const soBan = await demBanXacMinh(nguoiMoi.id);
  const linkRieng = `${baseUrl}/toi/${nguoiMoi.ma}`;
  const cacMoc: Moc[] = await q(`select id, nguong, ten_qua from moc_qua where chien_dich_id=$1 order by nguong`, [cd.id]);
  const daTrao = (await q(`select moc_id from qua_da_trao where nguoi_id=$1 and moc_id is not null`, [nguoiMoi.id])).map((r) => r.moc_id);

  // Mở mốc đủ điều kiện
  for (const moc of mocMoKhoa(soBan, cacMoc, daTrao)) {
    const giaTri = await traoQuaMoc(moc.id, nguoiMoi.id);
    if (giaTri === null) continue; // đã trao rồi (đụng UNIQUE)
    await xepEmail(cd.id, "mo_qua", nguoiMoi.email, nguoiMoi.ten, {
      ten: nguoiMoi.ten, ten_chien_dich: cd.ten, ten_qua: moc.ten_qua,
      gia_tri_qua: giaTri ? `Nhận quà của bạn: ${giaTri}\n` : "", link_rieng: linkRieng,
    });
  }

  // Email tiến độ + đòn "sắp chạm mốc"
  const ke = mocKeTiep(soBan, cacMoc);
  const tienDo = ke ? `Còn ${ke.nguong - soBan} bạn nữa là mở khoá «${ke.ten_qua}».\n` : "Bạn đã mở hết các mốc quà!\n";
  await xepEmail(cd.id, "moi_thanh_cong", nguoiMoi.email, nguoiMoi.ten, {
    ten: nguoiMoi.ten, ten_chien_dich: cd.ten, so_ban: String(soBan), diem_moi: String(cd.diem_moi_ban),
    tien_do: tienDo, link_rieng: linkRieng,
  });
  if (sapChamMoc(soBan, cacMoc) && ke) {
    await xepEmail(cd.id, "sap_moc", nguoiMoi.email, nguoiMoi.ten, {
      ten: nguoiMoi.ten, qua_ke_tiep: ke.ten_qua, link_rieng: linkRieng,
    });
  }
}

export async function demBanXacMinh(nguoiId: number): Promise<number> {
  const r = await mot<{ so: string }>(
    `select count(*) as so from gioi_thieu where nguoi_moi_id=$1 and trang_thai='xac_minh'`, [nguoiId]);
  return Number(r?.so || 0);
}

/** Trao quà của 1 mốc: coupon (kho khoá hàng chống phát trùng / dùng chung), file, link, khác.
 *  Trả về giá trị quà; null nếu người này đã được trao mốc này rồi. */
async function traoQuaMoc(mocId: number, nguoiId: number): Promise<string | null> {
  const client = await pool.connect();
  try {
    await client.query("begin");
    const moc = (await client.query(`select * from moc_qua where id=$1`, [mocId])).rows[0];
    let giaTri = moc.gia_tri || "";
    if (moc.loai_qua === "coupon") {
      if (moc.coupon_dung_chung) giaTri = moc.coupon_dung_chung;
      else {
        const cp = (await client.query(
          `select id, ma from kho_coupon where moc_id=$1 and da_phat=false order by id limit 1 for update skip locked`, [mocId]
        )).rows[0];
        if (cp) {
          await client.query(`update kho_coupon set da_phat=true, nguoi_id=$2 where id=$1`, [cp.id, nguoiId]);
          giaTri = cp.ma;
        } else giaTri = "(kho mã tạm hết — admin sẽ bổ sung và gửi lại)";
      }
    }
    const trao = await client.query(
      `insert into qua_da_trao (nguoi_id, moc_id, loai, ten_qua, loai_qua, gia_tri)
       values ($1,$2,'moc',$3,$4,$5) on conflict do nothing returning id`,
      [nguoiId, mocId, moc.ten_qua, moc.loai_qua, giaTri]
    );
    await client.query("commit");
    return trao.rows.length ? giaTri : null;
  } catch (e) {
    await client.query("rollback");
    throw e;
  } finally {
    client.release();
  }
}
