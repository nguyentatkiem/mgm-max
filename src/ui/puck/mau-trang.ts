import type { Data } from "@puckeditor/core";

// ────────────────────────────────────────────────────────────────────────────
// Thư viện MẪU TRANG cho trình kéo-thả (Part B) + helper dựng layout dùng chung
// cho cả mẫu chiến dịch toàn diện (Part A). Server-safe (chỉ import type).
// ────────────────────────────────────────────────────────────────────────────

type Khoi = { type: string; props: Record<string, unknown> };

// Dựng Data từ danh sách block, tự gán id duy nhất theo (type + thứ tự).
export function dungData(khoi: Khoi[], root: Record<string, unknown> = {}): Data {
  return {
    root: { props: root },
    content: khoi.map((k, i) => ({ type: k.type, props: { id: `${k.type}-${i + 1}`, ...k.props } })),
    zones: {},
  } as Data;
}

// Các block dựng nhanh (khớp props trong config.tsx)
export const K = {
  tieuDe: (text: string, mau = "#ffffff", cap = "h1", canh = "center") => ({ type: "TieuDe", props: { text, cap, canh, mau } }),
  vanBan: (noiDung: string, mau = "#e2e8f0", co = "16", canh = "center") => ({ type: "VanBan", props: { noiDung, canh, co, mau } }),
  anh: (url = "", alt = "", boGoc = "16") => ({ type: "Anh", props: { url, alt, boGoc } }),
  video: (url = "") => ({ type: "Video", props: { url } }),
  nut: (nhan: string, link = "#form-dang-ky", mau = "", canh = "center") => ({ type: "Nut", props: { nhan, link, mau, canh } }),
  cach: (cao = 24) => ({ type: "KhoangCach", props: { cao } }),
  dongHo: (den = "") => ({ type: "DongHo", props: { den } }),
  form: (tieuDe = "", ghiChu = "") => ({ type: "FormDangKy", props: { tieuDe, ghiChu } }),
  mocQua: (tieuDe = "🎁 Mời càng nhiều — quà càng lớn") => ({ type: "MocQua", props: { tieuDe } }),
  soNguoi: (chuThich = "người đã tham gia") => ({ type: "SoNguoi", props: { chuThich } }),
  dieuKhoan: () => ({ type: "DieuKhoan", props: {} }),
  bacGia: (tieuDe: string, bac: { so: number; gia: string; ghi: string }[]) => ({ type: "BacGia", props: { tieuDe, bac } }),
  vongQuay: (tieuDe: string, giai: string[]) => ({ type: "VongQuay", props: { tieuDe, giaiThuong: giai.map((ten) => ({ ten })) } }),
};

export type MauTrang = { ma: string; ten: string; emoji: string; moTa: string; data: Data };

// 6 bố cục trang dựng sẵn — áp 1 chạm trong editor.
export const MAU_TRANG: MauTrang[] = [
  {
    ma: "toi-gian", ten: "Tối giản", emoji: "⚡", moTa: "Ngắn gọn: tiêu đề + form. Hợp gom lead nhanh.",
    data: dungData([
      K.soNguoi(),
      K.tieuDe("Mời bạn — cùng nhận quà"),
      K.vanBan("Để lại email, chia sẻ cho bạn bè và mở khoá quà theo từng mốc."),
      K.form("Đăng ký ngay", "Miễn phí 100% — huỷ bất cứ lúc nào."),
      K.dieuKhoan(),
    ]),
  },
  {
    ma: "ban-khoa-hoc", ten: "Bán khoá học", emoji: "🎓", moTa: "Video giới thiệu + mốc quà + form. Hợp khoá học online.",
    data: dungData([
      K.soNguoi(),
      K.tieuDe("Học cùng nhau — mời bạn, cả hai cùng có quà"),
      K.vanBan("Đăng ký khoá học, chia sẻ cho bạn bè và mở khoá ưu đãi theo từng mốc giới thiệu."),
      K.video(""),
      K.form("Nhận suất học ngay", "Miễn phí 100% — huỷ bất cứ lúc nào."),
      K.mocQua(),
      K.dieuKhoan(),
    ]),
  },
  {
    ma: "ra-mat", ten: "Ra mắt / Danh sách chờ", emoji: "⏳", moTa: "Đồng hồ đếm ngược + đặc quyền sớm. Hợp gom hàng chờ.",
    data: dungData([
      K.tieuDe("Sắp ra mắt — vào danh sách chờ đặc quyền"),
      K.vanBan("Đăng ký trước để nhận ưu đãi mở bán sớm. Mời bạn để lên hạng ưu tiên."),
      K.cach(8),
      K.dongHo(),
      K.cach(8),
      K.soNguoi("người đang chờ"),
      K.form("Giữ suất ưu tiên"),
      K.dieuKhoan(),
    ]),
  },
  {
    ma: "boc-tham", ten: "Bốc thăm / Minigame", emoji: "🏆", moTa: "Giải lớn + hạn chót. Mỗi điểm là một vé.",
    data: dungData([
      K.tieuDe("Săn giải lớn — mỗi điểm là một vé"),
      K.anh(""),
      K.vanBan("Đăng ký để nhận vé, mời bạn để nhân vé. Càng nhiều điểm càng dễ trúng!"),
      K.dongHo(),
      K.form("Lấy vé may mắn"),
      K.mocQua("🎁 Quà chắc chắn theo mốc"),
      K.dieuKhoan(),
    ]),
  },
  {
    ma: "su-kien", ten: "Sự kiện / Webinar", emoji: "🎤", moTa: "Đếm ngược tới giờ G + mốc quà. Hợp hội thảo online.",
    data: dungData([
      K.soNguoi("người đã ghi danh"),
      K.tieuDe("Ghi danh sự kiện — rủ bạn cùng dự"),
      K.vanBan("Đăng ký giữ chỗ. Mời bạn cùng tham gia để mở khoá tài liệu và quà đặc biệt."),
      K.dongHo(),
      K.form("Ghi danh miễn phí"),
      K.mocQua("🎁 Mời bạn — mở khoá tài liệu"),
      K.dieuKhoan(),
    ]),
  },
  {
    ma: "day-du", ten: "Đầy đủ", emoji: "✨", moTa: "Có đủ ảnh, mốc quà, social proof, điều khoản.",
    data: dungData([
      K.soNguoi(),
      K.tieuDe("Mời bạn — nhận quà cực đã"),
      K.vanBan("Chương trình tri ân: đăng ký, chia sẻ và nhận quà tăng dần theo số bạn mời."),
      K.anh(""),
      K.form("Đăng ký nhận quà ngay"),
      K.mocQua(),
      K.dieuKhoan(),
    ]),
  },
];
