import type { Data } from "@puckeditor/core";
import { dungData, K } from "./puck/mau-trang";

// ────────────────────────────────────────────────────────────────────────────
// MẪU CHIẾN DỊCH TOÀN DIỆN (Part A): mỗi mẫu tạo sẵn TRANG kéo-thả đã thiết kế +
// mốc quà thật + quà chào mừng + giải bốc thăm + nhiệm vụ (đáp án hợp lệ) +
// lời mời từng kênh. Chọn phát là chạy được ngay, chỉ chỉnh vài chữ.
// Server-safe (chỉ import type Data).
// ────────────────────────────────────────────────────────────────────────────

export type EmailMau = { loai: string; tieuDe: string; noiDung: string };

export type MauToanDien = {
  ma: string; loai: string; ten: string; emoji: string; chip: string; moTa: string;
  cd: {
    ten: string; moTa: string; tieuDe: string; nutCta: string;
    mauChinh: string; mauNen: string; giaiBocTham: string;
    quaChaoMung: string; quaChaoMungGiaTri: string; haiChieu: boolean;
  };
  mocQua: { nguong: number; tenQua: string; loaiQua: "coupon" | "file" | "link" | "khac"; giaTri: string }[];
  nhiemVu: { ten: string; moTa: string; diem: number; url: string; cauHoi: string; dapAn: string }[];
  loiMoi: Record<string, string>;
  layout: Data;
  email?: EmailMau[];
};

// Dựng bộ email mẫu tailored (subject chuẩn, nội dung theo giọng từng mẫu).
// Loại email khớp MAU_MAC_DINH trong services/email.ts. Loại không truyền sẽ dùng mặc định.
function bo(o: { chaoMung: string; moi: string; sapMoc: string; moQua: string; trungGiai?: string }): EmailMau[] {
  const e: EmailMau[] = [
    { loai: "chao_mung", tieuDe: "🎉 Link mời bạn riêng của bạn đây — {{ten_chien_dich}}", noiDung: o.chaoMung },
    { loai: "moi_thanh_cong", tieuDe: "+{{diem_moi}} điểm! Bạn đã mời được {{so_ban}} bạn 🎉", noiDung: o.moi },
    { loai: "sap_moc", tieuDe: "⏳ Chỉ còn 1 bạn nữa là bạn nhận «{{qua_ke_tiep}}»!", noiDung: o.sapMoc },
    { loai: "mo_qua", tieuDe: "🎁 Bạn vừa mở khoá: {{ten_qua}}", noiDung: o.moQua },
  ];
  if (o.trungGiai) e.push({ loai: "trung_giai", tieuDe: "🏆 Chúc mừng! Bạn trúng {{giai}} — {{ten_chien_dich}}", noiDung: o.trungGiai });
  return e;
}

export const MAU_TOAN_DIEN: MauToanDien[] = [
  // 1) Bốc thăm / minigame
  {
    ma: "san-giai-lon", loai: "boc_tham", ten: "Săn giải lớn", emoji: "🏆", chip: "Bùng nổ viral",
    moTa: "Giải đặc biệt có hạn chót — mỗi điểm là một vé, càng mời càng dễ trúng.",
    cd: {
      ten: "Săn giải lớn — mời bạn nhân vé",
      moTa: "Đăng ký nhận vé, mời bạn để nhân vé. Càng nhiều điểm càng dễ trúng giải đặc biệt!",
      tieuDe: "Săn giải lớn — mỗi điểm là một vé", nutCta: "Lấy vé may mắn ngay",
      mauChinh: "#dc2626", mauNen: "#fef2f2",
      giaiBocTham: "01 điện thoại flagship (hoặc 20 triệu tiền mặt) — quay số công khai khi kết thúc",
      quaChaoMung: "Voucher 50k cho lần mua đầu", quaChaoMungGiaTri: "WELCOME50", haiChieu: true,
    },
    mocQua: [
      { nguong: 1, tenQua: "+5 vé may mắn cộng thêm", loaiQua: "khac", giaTri: "" },
      { nguong: 3, tenQua: "Ebook «Bí kíp săn deal» bản PDF", loaiQua: "file", giaTri: "" },
      { nguong: 5, tenQua: "Mã giảm 30% toàn shop", loaiQua: "coupon", giaTri: "SAN30" },
      { nguong: 10, tenQua: "Phần quà vật lý gửi tận nhà", loaiQua: "khac", giaTri: "" },
    ],
    nhiemVu: [
      { ten: "Xem video giới thiệu", moTa: "Xem hết video rồi trả lời câu hỏi (anh sửa video + đáp án cho khớp)", diem: 15, url: "https://youtube.com/watch?v=…", cauHoi: "Giải đặc biệt của chương trình là gì?", dapAn: "điện thoại" },
      { ten: "Theo dõi Fanpage", moTa: "Like & theo dõi trang để nhận thông báo quay số", diem: 10, url: "https://facebook.com/…", cauHoi: "Tên chương trình minigame là gì?", dapAn: "săn giải lớn" },
    ],
    loiMoi: {
      zalo: "Mình đang săn giải lớn nè, mỗi điểm là 1 vé — vào chung cho vui, càng đông càng dễ trúng: {{link}}",
      facebook: "Đang có minigame giải cực xịn 🎁 Đăng ký free rồi rủ bạn để nhân vé nè: {{link}}",
      messenger: "Ê vào săn giải này với mình đi, free mà quà to lắm: {{link}}",
      telegram: "Minigame giải lớn — đăng ký free, mời bạn nhân vé: {{link}}",
      copy: "Săn giải lớn cùng mình — mỗi điểm 1 vé, mời bạn càng dễ trúng: {{link}}",
    },
    layout: dungData([
      K.soNguoi("người đang săn giải"),
      K.tieuDe("Săn giải lớn — mỗi điểm là một vé", "#ffffff"),
      K.vanBan("Đăng ký để nhận vé, mời bạn để nhân vé. Càng nhiều điểm càng dễ trúng giải đặc biệt!", "#fee2e2"),
      K.dongHo(),
      K.form("Lấy vé may mắn ngay", "Miễn phí — quay số công khai khi kết thúc."),
      K.mocQua("🎁 Quà chắc chắn theo từng mốc"),
      K.dieuKhoan(),
    ]),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nBạn đã có vé rồi! Mời bạn bè để nhân vé và mở khoá quà chắc chắn theo mốc.\nLink của bạn: {{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Tuyệt {{ten}}! Thêm 1 người = thêm vé cho bạn. Đang có {{so_ban}} bạn xác minh — càng nhiều điểm càng dễ trúng.\nMời tiếp: {{link_rieng}}",
      sapMoc: "{{ten}} ơi, chỉ 1 bạn nữa là bạn nhận «{{qua_ke_tiep}}»! Gửi link ngay: {{link_rieng}}",
      moQua: "🎁 Chúc mừng {{ten}}! Bạn vừa mở khoá: {{ten_qua}} {{gia_tri_qua}}\nXem tất cả quà: {{link_rieng}}",
      trungGiai: "🏆 CHÚC MỪNG {{ten}}! Bạn đã trúng {{giai}}. Bọn mình sẽ liên hệ qua email này để trao giải. Trang của bạn: {{link_rieng}}",
    }),
  },

  // 2) Danh sách chờ / ra mắt
  {
    ma: "danh-sach-cho", loai: "hang_cho", ten: "Danh sách chờ ra mắt", emoji: "⏳", chip: "Gom sự chú ý",
    moTa: "Gom hàng chờ trước ngày mở bán, mời bạn để lên hạng ưu tiên & nhận ưu đãi sớm.",
    cd: {
      ten: "Danh sách chờ ra mắt", moTa: "Đăng ký trước để nhận ưu đãi mở bán sớm. Mời bạn để lên hạng ưu tiên.",
      tieuDe: "Sắp ra mắt — vào danh sách chờ đặc quyền", nutCta: "Giữ suất ưu tiên",
      mauChinh: "#0f172a", mauNen: "#f1f5f9",
      giaiBocTham: "", quaChaoMung: "Ưu đãi mở bán sớm -20%", quaChaoMungGiaTri: "EARLY20", haiChieu: false,
    },
    mocQua: [
      { nguong: 1, tenQua: "Lên hạng ưu tiên trong danh sách chờ", loaiQua: "khac", giaTri: "" },
      { nguong: 3, tenQua: "Tài liệu độc quyền trước ngày mở bán", loaiQua: "file", giaTri: "" },
      { nguong: 5, tenQua: "Voucher mở bán -35%", loaiQua: "coupon", giaTri: "EARLY35" },
      { nguong: 10, tenQua: "Quà tặng kèm đơn đầu tiên", loaiQua: "khac", giaTri: "" },
    ],
    nhiemVu: [
      { ten: "Trả lời khảo sát nhanh", moTa: "Hỏi 1 câu để hiểu nhu cầu (anh đổi câu hỏi/đáp án)", diem: 10, url: "", cauHoi: "Bạn mong sản phẩm giải quyết vấn đề gì? (gõ: đúng)", dapAn: "đúng" },
      { ten: "Theo dõi kênh cập nhật", moTa: "Theo dõi để nhận tin mở bán sớm nhất", diem: 10, url: "https://facebook.com/…", cauHoi: "Ngày mở bán dự kiến ghi ở đâu?", dapAn: "fanpage" },
    ],
    loiMoi: {
      zalo: "Sắp có cái này hay lắm, mình vừa vào danh sách chờ để nhận ưu đãi sớm — vào chung nha: {{link}}",
      facebook: "Đăng ký danh sách chờ để mua sớm giá tốt nè 👇 rủ bạn cùng lên hạng ưu tiên: {{link}}",
      messenger: "Vào danh sách chờ này với mình đi, mở bán sớm được giảm nhiều: {{link}}",
      telegram: "Danh sách chờ ra mắt — đăng ký để nhận ưu đãi sớm: {{link}}",
      copy: "Vào danh sách chờ ra mắt cùng mình, mời bạn để lên hạng ưu tiên: {{link}}",
    },
    layout: dungData([
      K.tieuDe("Sắp ra mắt — vào danh sách chờ đặc quyền", "#0f172a"),
      K.vanBan("Đăng ký trước để nhận ưu đãi mở bán sớm. Mời bạn để lên hạng ưu tiên.", "#334155"),
      K.cach(8),
      K.dongHo(),
      K.cach(8),
      K.soNguoi("người đang chờ"),
      K.form("Giữ suất ưu tiên"),
      K.mocQua("🎁 Mời bạn — lên hạng & mở khoá quà"),
      K.dieuKhoan(),
    ], { mauNen: "#f1f5f9", mauChinh: "#0f172a" }),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nBạn đã vào danh sách chờ! Mời bạn bè để lên hạng ưu tiên và mở ưu đãi mở bán sớm.\nLink của bạn: {{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Cảm ơn {{ten}}! Bạn vừa lên hạng nhờ 1 người bạn. Đang có {{so_ban}} bạn — càng nhiều càng ưu tiên.\n{{link_rieng}}",
      sapMoc: "{{ten}} ơi, chỉ 1 bạn nữa là bạn mở «{{qua_ke_tiep}}» trước ngày mở bán! {{link_rieng}}",
      moQua: "🎁 {{ten}} vừa mở khoá đặc quyền sớm: {{ten_qua}} {{gia_tri_qua}}\nXem tại: {{link_rieng}}",
    }),
  },

  // 3) Mốc quà evergreen
  {
    ma: "moi-ban-mo-qua", loai: "moc_qua", ten: "Mời bạn mở quà", emoji: "🎖️", chip: "Gom lead bền vững",
    moTa: "Không cần hạn chót — mời đủ số bạn xác minh là quà tự mở khoá. Chạy quanh năm.",
    cd: {
      ten: "Mời bạn mở quà (evergreen)", moTa: "Mời bạn bè cùng tham gia, mỗi mốc bạn xác minh mở một phần quà.",
      tieuDe: "Mời bạn — mở quà theo từng mốc", nutCta: "Tham gia & nhận quà",
      mauChinh: "#0d9488", mauNen: "#f0fdfa",
      giaiBocTham: "", quaChaoMung: "Quà chào mừng khi xác minh email", quaChaoMungGiaTri: "HELLO", haiChieu: true,
    },
    mocQua: [
      { nguong: 1, tenQua: "Bộ tài liệu khởi động (PDF)", loaiQua: "file", giaTri: "" },
      { nguong: 3, tenQua: "Mã giảm 20%", loaiQua: "coupon", giaTri: "MOI20" },
      { nguong: 5, tenQua: "Buổi tư vấn/nhóm kín (link)", loaiQua: "link", giaTri: "https://…" },
      { nguong: 10, tenQua: "Phần thưởng lớn cho top người mời", loaiQua: "khac", giaTri: "" },
    ],
    nhiemVu: [
      { ten: "Vào nhóm cộng đồng", moTa: "Tham gia nhóm để nhận hỗ trợ & quà", diem: 10, url: "https://zalo.me/g/…", cauHoi: "Tin ghim đầu nhóm chào bằng từ gì?", dapAn: "xin chào" },
      { ten: "Đọc bài hướng dẫn", moTa: "Đọc bài rồi trả lời câu hỏi (anh chỉnh cho khớp)", diem: 10, url: "https://…", cauHoi: "Bài hướng dẫn có mấy bước?", dapAn: "3" },
    ],
    loiMoi: {
      zalo: "Cái này hay nè, mời bạn là có quà luôn — mình gửi link, vào nhận chung: {{link}}",
      facebook: "Tham gia rồi mời bạn để mở quà theo mốc nè 🎁 free hết: {{link}}",
      messenger: "Vào cái này với mình đi, mời bạn là có quà liền: {{link}}",
      telegram: "Chương trình mời bạn nhận quà — tham gia free: {{link}}",
      copy: "Tham gia cùng mình, mời bạn để mở quà theo từng mốc: {{link}}",
    },
    layout: dungData([
      K.soNguoi(),
      K.tieuDe("Mời bạn — mở quà theo từng mốc", "#ffffff"),
      K.vanBan("Đăng ký, chia sẻ cho bạn bè và mở khoá quà tăng dần theo số bạn mời xác minh.", "#ccfbf1"),
      K.form("Tham gia & nhận quà", "Miễn phí, không cần hạn chót."),
      K.mocQua(),
      K.dieuKhoan(),
    ], { mauChinh: "#0d9488", mauNen: "#f0fdfa" }),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nEmail đã xác nhận! Mời bạn bè để mở quà theo từng mốc — không cần hạn chót, mời lúc nào cũng được.\nLink của bạn: {{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Tuyệt {{ten}}! Một người bạn vừa xác minh qua bạn. Đang có {{so_ban}} bạn.\nMời tiếp để mở mốc kế: {{link_rieng}}",
      sapMoc: "{{ten}} ơi, chỉ 1 bạn nữa là bạn mở «{{qua_ke_tiep}}»! Gửi link ngay: {{link_rieng}}",
      moQua: "🎁 Chúc mừng {{ten}}! Bạn vừa mở khoá: {{ten_qua}} {{gia_tri_qua}}\nXem tất cả quà: {{link_rieng}}",
    }),
  },

  // 4) Giới thiệu hai chiều
  {
    ma: "doi-ben-cung-loi", loai: "gioi_thieu", ten: "Đôi bên cùng lợi", emoji: "🤝", chip: "Lead chất lượng cao",
    moTa: "Thưởng cho CẢ người mời lẫn người được mời — lead chất lượng, chi phí thấp.",
    cd: {
      ten: "Giới thiệu bạn — cả hai cùng có quà", moTa: "Bạn giới thiệu nhận quà, người được mời cũng có ưu đãi riêng.",
      tieuDe: "Giới thiệu bạn — đôi bên cùng có quà", nutCta: "Lấy link giới thiệu của tôi",
      mauChinh: "#2563eb", mauNen: "#eff6ff",
      giaiBocTham: "", quaChaoMung: "Ưu đãi -15% cho người được mời", quaChaoMungGiaTri: "FRIEND15", haiChieu: true,
    },
    mocQua: [
      { nguong: 1, tenQua: "Mã giảm 15% cho bạn", loaiQua: "coupon", giaTri: "REF15" },
      { nguong: 3, tenQua: "Nâng cấp/tài liệu độc quyền", loaiQua: "file", giaTri: "" },
      { nguong: 5, tenQua: "Voucher 40% hoặc quà tương đương", loaiQua: "coupon", giaTri: "REF40" },
      { nguong: 10, tenQua: "Đặc quyền VIP / quà lớn", loaiQua: "khac", giaTri: "" },
    ],
    nhiemVu: [
      { ten: "Hoàn tất hồ sơ", moTa: "Cập nhật thông tin để nhận quà đúng người", diem: 10, url: "", cauHoi: "Gõ «xong» khi đã cập nhật", dapAn: "xong" },
      { ten: "Chia sẻ trải nghiệm", moTa: "Đăng 1 câu cảm nhận thật (anh chỉnh đáp án)", diem: 10, url: "", cauHoi: "Bạn chấm sản phẩm mấy sao? (gõ số)", dapAn: "5" },
    ],
    loiMoi: {
      zalo: "Mình dùng cái này thấy ổn, giới thiệu bạn thì cả hai cùng có ưu đãi — thử nha: {{link}}",
      facebook: "Giới thiệu bạn là cả hai cùng nhận quà 🤝 mình để link đây: {{link}}",
      messenger: "Cái này hay nè, mình mời bạn thì bạn cũng được giảm giá đó: {{link}}",
      telegram: "Chương trình giới thiệu đôi bên cùng lợi: {{link}}",
      copy: "Giới thiệu bạn — cả hai cùng có quà, link của mình: {{link}}",
    },
    layout: dungData([
      K.soNguoi("người đã tham gia"),
      K.tieuDe("Giới thiệu bạn — đôi bên cùng có quà", "#ffffff"),
      K.vanBan("Bạn giới thiệu được nhận quà, người được mời cũng có ưu đãi riêng. Ai cũng vui.", "#dbeafe"),
      K.form("Lấy link giới thiệu của tôi", "Bạn của bạn được giảm ngay khi tham gia."),
      K.mocQua("🎁 Mời càng nhiều — quà càng lớn"),
      K.dieuKhoan(),
    ], { mauChinh: "#2563eb", mauNen: "#eff6ff" }),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nĐây là link giới thiệu của bạn — mỗi người bạn mời, cả hai cùng nhận quà.\n{{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Cảm ơn {{ten}}! Một người bạn vừa nhận ưu đãi qua bạn, và bạn cũng tiến gần quà hơn. Đang có {{so_ban}} bạn.\n{{link_rieng}}",
      sapMoc: "{{ten}} ơi, chỉ 1 bạn nữa là bạn nhận «{{qua_ke_tiep}}»! Gửi link ngay: {{link_rieng}}",
      moQua: "🎁 {{ten}} vừa nhận: {{ten_qua}} {{gia_tri_qua}}\nCảm ơn bạn đã lan toả: {{link_rieng}}",
    }),
  },

  // 5) Viral khoá học
  {
    ma: "viral-khoa-hoc", loai: "tu_do", ten: "Viral khoá học", emoji: "🎓", chip: "Cho khoá học online",
    moTa: "Video giới thiệu + mốc quà học liệu — biến học viên thành kênh giới thiệu.",
    cd: {
      ten: "Học cùng nhau — mời bạn nhận quà", moTa: "Đăng ký khoá học, mời bạn bè để mở khoá ưu đãi và học liệu.",
      tieuDe: "Học AI cùng nhau — mời bạn, nhận quà", nutCta: "Nhận suất học ngay",
      mauChinh: "#4f46e5", mauNen: "#eef2ff",
      giaiBocTham: "01 suất học miễn phí trọn khoá — bốc thăm khi kết thúc",
      quaChaoMung: "Ebook mở đầu miễn phí", quaChaoMungGiaTri: "", haiChieu: true,
    },
    mocQua: [
      { nguong: 1, tenQua: "Ebook «50 prompt vàng» (PDF)", loaiQua: "file", giaTri: "" },
      { nguong: 3, tenQua: "Bộ template + video hướng dẫn", loaiQua: "link", giaTri: "https://…" },
      { nguong: 5, tenQua: "Mã giảm 30% học phí", loaiQua: "coupon", giaTri: "HOC30" },
      { nguong: 10, tenQua: "1 buổi review/coaching 1-1", loaiQua: "khac", giaTri: "" },
    ],
    nhiemVu: [
      { ten: "Xem video bài mở đầu", moTa: "Xem hết bài giới thiệu rồi trả lời (anh chỉnh cho khớp)", diem: 15, url: "https://youtube.com/watch?v=…", cauHoi: "Khoá học kéo dài mấy tuần?", dapAn: "8" },
      { ten: "Tải ebook mở đầu", moTa: "Tải & đọc ebook để nắm lộ trình", diem: 10, url: "https://…", cauHoi: "Ebook có bao nhiêu prompt?", dapAn: "50" },
    ],
    loiMoi: {
      zalo: "Mình đang học khoá này hay lắm, rủ bạn vào học chung — cả hai còn được quà nè: {{link}}",
      facebook: "Học khoá này đi, đăng ký free rồi rủ bạn để mở khoá học liệu + ưu đãi 🎓: {{link}}",
      messenger: "Vào học chung khoá này với mình nha, mời nhau còn có quà: {{link}}",
      telegram: "Khoá học viral — đăng ký free, mời bạn nhận quà học liệu: {{link}}",
      copy: "Học cùng mình — mời bạn để mở khoá học liệu và ưu đãi: {{link}}",
    },
    layout: dungData([
      K.soNguoi("học viên đã ghi danh"),
      K.tieuDe("Học AI cùng nhau — mời bạn, nhận quà", "#ffffff"),
      K.vanBan("Đăng ký khoá học, chia sẻ cho bạn bè và mở khoá ưu đãi theo từng mốc giới thiệu.", "#e0e7ff"),
      K.video(""),
      K.form("Nhận suất học ngay", "Miễn phí 100% — huỷ bất cứ lúc nào."),
      K.mocQua("🎁 Mời bạn — mở khoá học liệu"),
      K.dieuKhoan(),
    ], { mauChinh: "#4f46e5", mauNen: "#eef2ff" }),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nChào mừng học viên mới! Mời bạn bè cùng học để mở khoá học liệu, ưu đãi và cơ hội trúng suất học miễn phí.\nLink của bạn: {{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Giỏi lắm {{ten}}! Một người bạn vừa ghi danh qua bạn. Đang có {{so_ban}} bạn — càng nhiều điểm càng dễ trúng suất học miễn phí.\n{{link_rieng}}",
      sapMoc: "{{ten}} ơi, chỉ 1 bạn nữa là bạn mở «{{qua_ke_tiep}}»! Gửi link ngay: {{link_rieng}}",
      moQua: "🎁 Chúc mừng {{ten}}! Bạn vừa mở khoá: {{ten_qua}} {{gia_tri_qua}}\nVào học/nhận quà: {{link_rieng}}",
      trungGiai: "🏆 CHÚC MỪNG {{ten}}! Bạn đã trúng {{giai}}. Bọn mình sẽ liên hệ để sắp xếp. Trang của bạn: {{link_rieng}}",
    }),
  },

  // 6) Mua chung mở giá
  {
    ma: "mua-chung-mo-gia", loai: "moc_qua", ten: "Mua chung mở giá", emoji: "🛒", chip: "Gom đơn hạ giá",
    moTa: "Càng đông người tham gia, giá càng giảm. Rủ bạn để chốt mức tốt nhất.",
    cd: {
      ten: "Mua chung — càng đông càng rẻ", moTa: "Rủ bạn cùng tham gia để mở mức giá tốt hơn cho tất cả.",
      tieuDe: "Mua chung — càng đông càng rẻ", nutCta: "Tham gia mua chung",
      mauChinh: "#ea580c", mauNen: "#fff7ed", giaiBocTham: "",
      quaChaoMung: "Freeship cho đơn đầu tiên", quaChaoMungGiaTri: "FREESHIP", haiChieu: true,
    },
    mocQua: [
      { nguong: 1, tenQua: "Freeship cho đơn của bạn", loaiQua: "coupon", giaTri: "FREESHIP" },
      { nguong: 3, tenQua: "Giảm thêm 5% cá nhân", loaiQua: "coupon", giaTri: "THEM5" },
      { nguong: 5, tenQua: "Quà tặng kèm đơn", loaiQua: "khac", giaTri: "" },
      { nguong: 10, tenQua: "Giảm thêm 15% cá nhân", loaiQua: "coupon", giaTri: "THEM15" },
    ],
    nhiemVu: [
      { ten: "Vào nhóm chốt đơn", moTa: "Tham gia nhóm Zalo để nhận thông báo mở giá", diem: 10, url: "https://zalo.me/g/…", cauHoi: "Tin ghim đầu nhóm chào bằng từ gì?", dapAn: "xin chào" },
    ],
    loiMoi: {
      zalo: "Đang mua chung món này, càng đông càng rẻ — vào chung cho được giá nha: {{link}}",
      facebook: "Mua chung đi mọi người, đủ số là giảm sâu 🛒: {{link}}",
      messenger: "Vào mua chung với mình đi, thêm người là rẻ hơn đó: {{link}}",
      telegram: "Mua chung — càng đông giá càng giảm: {{link}}",
      copy: "Mua chung cùng mình cho được giá tốt: {{link}}",
    },
    layout: dungData([
      K.soNguoi("người đang mua chung"),
      K.tieuDe("Mua chung — càng đông càng rẻ", "#ffffff"),
      K.vanBan("Mỗi người tham gia kéo giá xuống cho tất cả. Rủ bạn để chốt mức tốt nhất!", "#ffedd5"),
      K.bacGia("Càng đông — giá càng giảm", [
        { so: 1, gia: "990k", ghi: "giá lẻ" }, { so: 10, gia: "790k", ghi: "" }, { so: 30, gia: "590k", ghi: "" }, { so: 50, gia: "490k", ghi: "tốt nhất" },
      ]),
      K.form("Tham gia mua chung", "Chốt đơn khi đạt mốc — bạn được báo qua email."),
      K.mocQua("🎁 Mời bạn — nhận thêm ưu đãi cá nhân"),
      K.dieuKhoan(),
    ], { mauChinh: "#ea580c", mauNen: "#fff7ed" }),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nBạn đã tham gia mua chung! Rủ càng nhiều bạn, giá chốt càng thấp cho tất cả.\nLink rủ bạn của bạn: {{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Tuyệt {{ten}}! Thêm 1 người vào mua chung — cả nhóm tiến gần mức giá tốt hơn. Đang có {{so_ban}} bạn.\nRủ tiếp: {{link_rieng}}",
      sapMoc: "{{ten}} ơi, chỉ 1 bạn nữa là bạn mở «{{qua_ke_tiep}}». Gửi link ngay: {{link_rieng}}",
      moQua: "Chúc mừng {{ten}}! Bạn vừa mở: {{ten_qua}} {{gia_tri_qua}}\nXem tất cả: {{link_rieng}}",
    }),
  },

  // 7) Flash Sale giờ vàng
  {
    ma: "flash-sale-gio-vang", loai: "boc_tham", ten: "Flash Sale giờ vàng", emoji: "⚡", chip: "Urgency mạnh",
    moTa: "Đếm ngược gắt + mời bạn để mở mã giảm sốc. Hợp shop online, sản phẩm số.",
    cd: {
      ten: "Flash Sale giờ vàng", moTa: "Đăng ký giữ suất, mời bạn để mở mã giảm sốc trước giờ G.",
      tieuDe: "⚡ Flash Sale giờ vàng — nhanh tay!", nutCta: "Giữ suất giá sốc",
      mauChinh: "#e11d48", mauNen: "#fff1f2", giaiBocTham: "01 voucher 1 triệu — quay số khi kết thúc",
      quaChaoMung: "Mã giảm 10% dùng ngay", quaChaoMungGiaTri: "FLASH10", haiChieu: true,
    },
    mocQua: [
      { nguong: 1, tenQua: "Mã giảm 20% giờ vàng", loaiQua: "coupon", giaTri: "FLASH20" },
      { nguong: 3, tenQua: "Mã giảm 30%", loaiQua: "coupon", giaTri: "FLASH30" },
      { nguong: 5, tenQua: "Quà tặng giới hạn", loaiQua: "khac", giaTri: "" },
      { nguong: 10, tenQua: "Ưu đãi VIP mua trước", loaiQua: "khac", giaTri: "" },
    ],
    nhiemVu: [
      { ten: "Theo dõi Fanpage", moTa: "Theo dõi để nhận thông báo mở bán", diem: 10, url: "https://facebook.com/…", cauHoi: "Tên chương trình sale là gì?", dapAn: "flash sale giờ vàng" },
    ],
    loiMoi: {
      zalo: "Sắp flash sale giờ vàng, giảm sốc lắm — mình gửi link, giữ suất chung nha: {{link}}",
      facebook: "⚡ Flash sale sắp mở, đăng ký free để mở mã giảm sốc: {{link}}",
      messenger: "Vào giữ suất flash sale này với mình đi, giá sốc lắm: {{link}}",
      telegram: "Flash sale giờ vàng — đăng ký giữ suất giá sốc: {{link}}",
      copy: "Giữ suất flash sale giờ vàng cùng mình: {{link}}",
    },
    layout: dungData([
      K.soNguoi("người đã giữ suất"),
      K.tieuDe("⚡ Flash Sale giờ vàng — nhanh tay!", "#ffffff"),
      K.vanBan("Số suất giá sốc có hạn. Đăng ký giữ suất và mời bạn để mở mã giảm sâu hơn.", "#ffe4e6"),
      K.dongHo(),
      K.form("Giữ suất giá sốc", "Miễn phí — mã giảm gửi qua email khi mở bán."),
      K.mocQua("🎁 Mời bạn — mở mã giảm sâu hơn"),
      K.dieuKhoan(),
    ], { mauChinh: "#e11d48", mauNen: "#fff1f2" }),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nĐã giữ suất Flash Sale! Mời bạn để mở mã giảm sâu hơn trước giờ G.\nLink của bạn: {{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Nhanh tay {{ten}}! Thêm 1 bạn — bạn tiến gần mã giảm sốc hơn. Đang có {{so_ban}} bạn.\n{{link_rieng}}",
      sapMoc: "{{ten}} ơi, chỉ 1 bạn nữa là mở «{{qua_ke_tiep}}» — sắp hết giờ vàng! {{link_rieng}}",
      moQua: "🎉 {{ten}} vừa mở: {{ten_qua}} {{gia_tri_qua}}\nDùng ngay kẻo hết giờ: {{link_rieng}}",
      trungGiai: "Chúc mừng {{ten}}! Bạn trúng {{giai}} trong Flash Sale. Bọn mình sẽ liên hệ trao giải. {{link_rieng}}",
    }),
  },

  // 8) Vòng quay may mắn
  {
    ma: "vong-quay-may-man", loai: "tu_do", ten: "Vòng quay may mắn", emoji: "🎡", chip: "Minigame vui",
    moTa: "Mỗi lượt mời = 1 lượt quay trúng quà ngay. Engagement cực cao.",
    cd: {
      ten: "Vòng quay may mắn", moTa: "Đăng ký nhận lượt quay, mời bạn để có thêm lượt. Quay trúng quà liền tay!",
      tieuDe: "🎡 Vòng quay may mắn", nutCta: "Nhận lượt quay",
      mauChinh: "#7c3aed", mauNen: "#f5f3ff", giaiBocTham: "",
      quaChaoMung: "1 lượt quay miễn phí", quaChaoMungGiaTri: "", haiChieu: true,
    },
    mocQua: [
      { nguong: 1, tenQua: "+2 lượt quay", loaiQua: "khac", giaTri: "" },
      { nguong: 3, tenQua: "Mã giảm 15%", loaiQua: "coupon", giaTri: "QUAY15" },
      { nguong: 5, tenQua: "+5 lượt quay", loaiQua: "khac", giaTri: "" },
      { nguong: 10, tenQua: "Phần quà đặc biệt", loaiQua: "khac", giaTri: "" },
    ],
    nhiemVu: [
      { ten: "Chia sẻ để thêm lượt", moTa: "Chia sẻ minigame để nhận thêm lượt quay", diem: 10, url: "", cauHoi: "Gõ «đã chia sẻ» sau khi chia sẻ", dapAn: "đã chia sẻ" },
    ],
    loiMoi: {
      zalo: "Có vòng quay trúng quà nè, vào quay chung cho vui, mời nhau còn thêm lượt: {{link}}",
      facebook: "🎡 Quay là trúng, vào chơi free nè: {{link}}",
      messenger: "Vào quay số trúng quà với mình đi: {{link}}",
      telegram: "Vòng quay may mắn — quay trúng quà ngay: {{link}}",
      copy: "Vào vòng quay may mắn cùng mình nè: {{link}}",
    },
    layout: dungData([
      K.soNguoi("người đã chơi"),
      K.tieuDe("🎡 Vòng quay may mắn", "#ffffff"),
      K.vanBan("Đăng ký nhận lượt quay đầu tiên. Mời bạn để có thêm lượt — quay là trúng!", "#ede9fe"),
      K.vongQuay("Thử vận may của bạn", ["Voucher 10%", "Ebook tặng", "Voucher 20%", "Chúc may mắn", "Quà bí ẩn", "Freeship", "Voucher 50%", "Quay lại"]),
      K.form("Nhận lượt quay", "Miễn phí — mời bạn để thêm lượt quay."),
      K.mocQua("🎁 Mời bạn — nhận thêm lượt & quà"),
      K.dieuKhoan(),
    ], { mauChinh: "#7c3aed", mauNen: "#f5f3ff" }),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nBạn có lượt quay rồi đó! Mời bạn để nhận thêm lượt và tăng cơ hội trúng.\nLink của bạn: {{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Yeah {{ten}}! Thêm 1 bạn = thêm lượt quay. Đang có {{so_ban}} bạn.\nQuay tiếp: {{link_rieng}}",
      sapMoc: "{{ten}} ơi, 1 bạn nữa là mở «{{qua_ke_tiep}}»! {{link_rieng}}",
      moQua: "🎉 {{ten}} mở khoá: {{ten_qua}} {{gia_tri_qua}}\n{{link_rieng}}",
    }),
  },

  // 9) Cuộc thi sáng tạo (UGC)
  {
    ma: "cuoc-thi-ugc", loai: "boc_tham", ten: "Cuộc thi sáng tạo (UGC)", emoji: "🏅", chip: "Lan toả nội dung",
    moTa: "Người tham gia nộp bài + kêu gọi vote; mời bạn để tăng điểm. Bình chọn tính theo điểm giới thiệu.",
    cd: {
      ten: "Cuộc thi sáng tạo", moTa: "Nộp bài dự thi, mời bạn bè bình chọn — người nhiều điểm nhất thắng lớn.",
      tieuDe: "🏅 Cuộc thi sáng tạo — nộp bài, gọi vote", nutCta: "Tham gia dự thi",
      mauChinh: "#0891b2", mauNen: "#ecfeff", giaiBocTham: "Giải nhất: 5 triệu + vinh danh (theo bảng xếp hạng điểm)",
      quaChaoMung: "Bộ tài liệu tham khảo dự thi", quaChaoMungGiaTri: "", haiChieu: false,
    },
    mocQua: [
      { nguong: 1, tenQua: "Huy hiệu thí sinh + tài liệu", loaiQua: "file", giaTri: "" },
      { nguong: 5, tenQua: "Lọt nhóm nổi bật (tăng hiển thị)", loaiQua: "khac", giaTri: "" },
      { nguong: 10, tenQua: "Vào chung kết", loaiQua: "khac", giaTri: "" },
      { nguong: 20, tenQua: "Ứng viên giải nhất", loaiQua: "khac", giaTri: "" },
    ],
    nhiemVu: [
      { ten: "Nộp bài dự thi", moTa: "Đăng bài công khai rồi dán link vào ô trả lời (anh đổi cách xác minh)", diem: 20, url: "", cauHoi: "Bạn đã đăng bài công khai chưa? (gõ: rồi)", dapAn: "rồi" },
      { ten: "Kêu gọi bình chọn", moTa: "Chia sẻ link để bạn bè vào vote (mỗi lượt giới thiệu là 1 điểm)", diem: 10, url: "", cauHoi: "Gõ «đã kêu gọi» khi đã chia sẻ", dapAn: "đã kêu gọi" },
    ],
    loiMoi: {
      zalo: "Mình đang thi cái này, vào vote ủng hộ mình với nha (bấm link là được): {{link}}",
      facebook: "Mình dự thi nè cả nhà, vào ủng hộ mình 1 vote nhé 🙏: {{link}}",
      messenger: "Vào vote cho bài dự thi của mình với: {{link}}",
      telegram: "Ủng hộ mình 1 vote cuộc thi này nha: {{link}}",
      copy: "Vào vote ủng hộ bài dự thi của mình: {{link}}",
    },
    layout: dungData([
      K.soNguoi("thí sinh & người ủng hộ"),
      K.tieuDe("🏅 Cuộc thi sáng tạo — nộp bài, gọi vote", "#ffffff"),
      K.vanBan("Cách tham gia: 1) Đăng ký nhận link riêng · 2) Nộp bài dự thi · 3) Kêu gọi bạn bè vote. Người nhiều điểm nhất thắng!", "#cffafe"),
      K.form("Tham gia dự thi", "Miễn phí — điểm bình chọn tính theo số bạn ủng hộ."),
      K.mocQua("🏆 Càng nhiều vote — càng tiến sâu"),
      K.dieuKhoan(),
    ], { mauChinh: "#0891b2", mauNen: "#ecfeff" }),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nBạn đã ghi danh dự thi! Nộp bài và kêu gọi bạn bè vào vote để leo bảng xếp hạng.\nTrang thí sinh của bạn: {{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Có thêm 1 người vừa vote cho bạn, {{ten}}! Bạn đang có {{so_ban}} lượt ủng hộ.\nKêu gọi tiếp: {{link_rieng}}",
      sapMoc: "{{ten}} ơi, chỉ 1 vote nữa là bạn đạt «{{qua_ke_tiep}}»! {{link_rieng}}",
      moQua: "🎉 {{ten}} vừa đạt: {{ten_qua}}\nTiếp tục kêu gọi vote nhé: {{link_rieng}}",
      trungGiai: "Chúc mừng {{ten}}! Bài dự thi của bạn đã đoạt {{giai}}. Bọn mình sẽ liên hệ trao giải. {{link_rieng}}",
    }),
  },

  // 10) Tặng ebook lan toả
  {
    ma: "tang-ebook-lan-toa", loai: "moc_qua", ten: "Tặng ebook lan toả", emoji: "📖", chip: "Gom lead bằng freebie",
    moTa: "Nhận ebook miễn phí ngay, mời bạn để mở khoá cả bộ tài liệu lớn hơn.",
    cd: {
      ten: "Tải ebook miễn phí + mời bạn nhận cả bộ", moTa: "Nhận ebook ngay khi đăng ký. Mời bạn để mở khoá thêm tài liệu giá trị.",
      tieuDe: "📖 Ebook miễn phí — mời bạn nhận cả bộ", nutCta: "Tải ebook miễn phí",
      mauChinh: "#0d9488", mauNen: "#f0fdfa", giaiBocTham: "",
      quaChaoMung: "Ebook mở đầu (PDF) gửi ngay", quaChaoMungGiaTri: "", haiChieu: true,
    },
    mocQua: [
      { nguong: 1, tenQua: "Bộ checklist & template (PDF)", loaiQua: "file", giaTri: "" },
      { nguong: 3, tenQua: "Ebook nâng cao (PDF)", loaiQua: "file", giaTri: "" },
      { nguong: 5, tenQua: "Video khoá học mini (link)", loaiQua: "link", giaTri: "https://…" },
      { nguong: 10, tenQua: "Buổi Q&A nhóm kín", loaiQua: "link", giaTri: "https://…" },
    ],
    nhiemVu: [
      { ten: "Đọc ebook mở đầu", moTa: "Đọc để nhận nhiều giá trị nhất (anh chỉnh câu hỏi)", diem: 10, url: "https://…", cauHoi: "Ebook mở đầu có bao nhiêu chương?", dapAn: "5" },
    ],
    loiMoi: {
      zalo: "Có bộ ebook này hay lắm, tải free nè — mời bạn còn được mở thêm tài liệu: {{link}}",
      facebook: "Ebook miễn phí cực chất 📖 tải ở đây, rủ bạn để mở cả bộ: {{link}}",
      messenger: "Gửi bạn link tải ebook free này nè: {{link}}",
      telegram: "Ebook miễn phí — tải + mời bạn nhận cả bộ: {{link}}",
      copy: "Tải ebook miễn phí + mời bạn nhận thêm: {{link}}",
    },
    layout: dungData([
      K.soNguoi("người đã tải"),
      K.tieuDe("📖 Ebook miễn phí — mời bạn nhận cả bộ", "#ffffff"),
      K.vanBan("Nhận ebook mở đầu ngay khi đăng ký. Mời bạn bè để mở khoá thêm checklist, template và video.", "#ccfbf1"),
      K.anh(""),
      K.form("Tải ebook miễn phí", "Gửi vào email của bạn ngay sau khi xác nhận."),
      K.mocQua("🎁 Mời bạn — mở khoá cả bộ tài liệu"),
      K.dieuKhoan(),
    ], { mauChinh: "#0d9488", mauNen: "#f0fdfa" }),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nEbook của bạn đây! Mời bạn bè để mở khoá thêm checklist, template và video độc quyền.\nTrang của bạn: {{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Cảm ơn {{ten}}! Thêm 1 bạn — bạn tiến gần bộ tài liệu lớn hơn. Đang có {{so_ban}} bạn.\n{{link_rieng}}",
      sapMoc: "{{ten}} ơi, 1 bạn nữa là mở «{{qua_ke_tiep}}»! {{link_rieng}}",
      moQua: "🎁 {{ten}} vừa mở: {{ten_qua}} {{gia_tri_qua}}\nTải tại trang của bạn: {{link_rieng}}",
    }),
  },

  // 11) Tri ân khách cũ
  {
    ma: "tri-an-khach-cu", loai: "gioi_thieu", ten: "Tri ân khách cũ", emoji: "💝", chip: "Loyalty 2 chiều",
    moTa: "Khách hiện tại giới thiệu bạn bè — cả hai cùng nhận ưu đãi. Hợp spa, shop, dịch vụ.",
    cd: {
      ten: "Tri ân khách thân thiết", moTa: "Cảm ơn bạn đã đồng hành! Giới thiệu bạn bè, cả hai cùng nhận quà.",
      tieuDe: "💝 Tri ân khách thân thiết — giới thiệu nhận quà", nutCta: "Lấy ưu đãi tri ân",
      mauChinh: "#be185d", mauNen: "#fdf2f8", giaiBocTham: "",
      quaChaoMung: "Ưu đãi -15% cho bạn được giới thiệu", quaChaoMungGiaTri: "THANKS15", haiChieu: true,
    },
    mocQua: [
      { nguong: 1, tenQua: "Voucher 20% lần tới", loaiQua: "coupon", giaTri: "TRIAN20" },
      { nguong: 3, tenQua: "Quà tặng tri ân", loaiQua: "khac", giaTri: "" },
      { nguong: 5, tenQua: "Nâng hạng thành viên VIP", loaiQua: "khac", giaTri: "" },
      { nguong: 10, tenQua: "Dịch vụ/sản phẩm tặng kèm", loaiQua: "khac", giaTri: "" },
    ],
    nhiemVu: [
      { ten: "Đánh giá trải nghiệm", moTa: "Để lại đánh giá thật để nhận thêm ưu đãi", diem: 10, url: "", cauHoi: "Bạn chấm dịch vụ mấy sao? (gõ số)", dapAn: "5" },
    ],
    loiMoi: {
      zalo: "Chỗ này mình dùng ưng lắm, giới thiệu bạn thì cả hai cùng được ưu đãi nè: {{link}}",
      facebook: "Giới thiệu bạn là cả hai cùng có quà 💝 mình để link đây: {{link}}",
      messenger: "Cái này hay nè, mình mời bạn thì bạn được giảm luôn đó: {{link}}",
      telegram: "Chương trình tri ân — giới thiệu bạn cùng nhận quà: {{link}}",
      copy: "Giới thiệu bạn — cả hai cùng nhận ưu đãi tri ân: {{link}}",
    },
    layout: dungData([
      K.soNguoi("khách đã tham gia"),
      K.tieuDe("💝 Tri ân khách thân thiết", "#ffffff"),
      K.vanBan("Cảm ơn bạn đã đồng hành! Giới thiệu bạn bè — bạn nhận quà, người được mời cũng có ưu đãi riêng.", "#fce7f3"),
      K.form("Lấy ưu đãi tri ân", "Bạn của bạn được giảm ngay khi tham gia."),
      K.mocQua("🎁 Giới thiệu càng nhiều — quà càng lớn"),
      K.dieuKhoan(),
    ], { mauChinh: "#be185d", mauNen: "#fdf2f8" }),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nCảm ơn bạn đã đồng hành! Đây là link giới thiệu của bạn — mỗi người bạn mời, cả hai cùng nhận quà.\n{{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Cảm ơn {{ten}}! Một người bạn vừa nhận ưu đãi qua bạn. Đang có {{so_ban}} bạn.\n{{link_rieng}}",
      sapMoc: "{{ten}} ơi, 1 bạn nữa là bạn nhận «{{qua_ke_tiep}}»! {{link_rieng}}",
      moQua: "💝 {{ten}} vừa nhận: {{ten_qua}} {{gia_tri_qua}}\nCảm ơn bạn rất nhiều: {{link_rieng}}",
    }),
  },

  // 12) Cộng tác viên nhận quà
  {
    ma: "ctv-nhan-qua", loai: "gioi_thieu", ten: "Cộng tác viên nhận quà", emoji: "🧑‍💼", chip: "CTV theo bậc",
    moTa: "Cộng tác viên mời theo bậc, nhận đặc quyền & quà (không hoa hồng tiền mặt).",
    cd: {
      ten: "Cộng tác viên — mời bạn nhận đặc quyền", moTa: "Trở thành CTV: mời bạn, lên bậc và nhận đặc quyền, quà, đào tạo.",
      tieuDe: "🧑‍💼 Cộng tác viên — lên bậc nhận đặc quyền", nutCta: "Đăng ký cộng tác viên",
      mauChinh: "#1d4ed8", mauNen: "#eff6ff", giaiBocTham: "",
      quaChaoMung: "Bộ tài liệu CTV + nhóm hỗ trợ", quaChaoMungGiaTri: "", haiChieu: true,
    },
    mocQua: [
      { nguong: 3, tenQua: "Bậc Đồng: mã giảm cho khách của bạn", loaiQua: "coupon", giaTri: "CTV10" },
      { nguong: 10, tenQua: "Bậc Bạc: quà + ưu tiên hỗ trợ", loaiQua: "khac", giaTri: "" },
      { nguong: 20, tenQua: "Bậc Vàng: đặc quyền + đào tạo riêng", loaiQua: "khac", giaTri: "" },
      { nguong: 50, tenQua: "Bậc Kim cương: quà lớn + vinh danh", loaiQua: "khac", giaTri: "" },
    ],
    nhiemVu: [
      { ten: "Vào nhóm CTV", moTa: "Tham gia nhóm để nhận tài liệu & hỗ trợ", diem: 10, url: "https://zalo.me/g/…", cauHoi: "Tin ghim nhóm CTV chào bằng từ gì?", dapAn: "chào ctv" },
      { ten: "Xem hướng dẫn CTV", moTa: "Xem video hướng dẫn cách mời hiệu quả", diem: 15, url: "https://youtube.com/watch?v=…", cauHoi: "Video hướng dẫn dài mấy phút?", dapAn: "10" },
    ],
    loiMoi: {
      zalo: "Mình đang làm CTV chương trình này, quà và đặc quyền ổn lắm — vào làm chung nha: {{link}}",
      facebook: "Tuyển CTV nhận quà (không cần vốn) 🧑‍💼 đăng ký ở đây: {{link}}",
      messenger: "Vào làm cộng tác viên với mình đi, mời bạn là có quà: {{link}}",
      telegram: "Cộng tác viên nhận quà theo bậc — đăng ký: {{link}}",
      copy: "Làm cộng tác viên cùng mình, lên bậc nhận đặc quyền: {{link}}",
    },
    layout: dungData([
      K.soNguoi("cộng tác viên"),
      K.tieuDe("🧑‍💼 Cộng tác viên — lên bậc nhận đặc quyền", "#ffffff"),
      K.vanBan("Không cần vốn: đăng ký làm CTV, mời bạn bè và lên bậc để nhận quà, đặc quyền và đào tạo.", "#dbeafe"),
      K.form("Đăng ký cộng tác viên", "Miễn phí — có nhóm hỗ trợ và tài liệu sẵn."),
      K.mocQua("🏅 Các bậc cộng tác viên"),
      K.dieuKhoan(),
    ], { mauChinh: "#1d4ed8", mauNen: "#eff6ff" }),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nChào mừng CTV mới! Đây là link giới thiệu của bạn. Mời bạn bè để lên bậc và mở đặc quyền.\n{{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Làm tốt lắm {{ten}}! Bạn vừa có thêm 1 lượt giới thiệu, đang ở {{so_ban}} bạn.\nXem tiến độ bậc: {{link_rieng}}",
      sapMoc: "{{ten}} ơi, chỉ 1 bạn nữa là bạn lên «{{qua_ke_tiep}}»! {{link_rieng}}",
      moQua: "🏅 {{ten}} vừa đạt: {{ten_qua}} {{gia_tri_qua}}\nTiếp tục nào: {{link_rieng}}",
    }),
  },

  // 13) Kéo thành viên vào nhóm
  {
    ma: "keo-thanh-vien-nhom", loai: "tu_do", ten: "Kéo thành viên vào nhóm", emoji: "👥", chip: "Grow cộng đồng",
    moTa: "Mời bạn vào nhóm Zalo/FB + hoàn thành nhiệm vụ social để nhận quà.",
    cd: {
      ten: "Gia nhập cộng đồng — mời bạn nhận quà", moTa: "Vào cộng đồng, làm vài nhiệm vụ nhỏ và mời bạn để nhận quà.",
      tieuDe: "👥 Gia nhập cộng đồng — mời bạn nhận quà", nutCta: "Tham gia cộng đồng",
      mauChinh: "#0f766e", mauNen: "#f0fdfa", giaiBocTham: "",
      quaChaoMung: "Bộ tài nguyên cộng đồng", quaChaoMungGiaTri: "", haiChieu: false,
    },
    mocQua: [
      { nguong: 1, tenQua: "Tài nguyên độc quyền thành viên", loaiQua: "file", giaTri: "" },
      { nguong: 3, tenQua: "Huy hiệu thành viên tích cực", loaiQua: "khac", giaTri: "" },
      { nguong: 5, tenQua: "Suất tham gia sự kiện offline/online", loaiQua: "khac", giaTri: "" },
      { nguong: 10, tenQua: "Quà tặng cộng đồng", loaiQua: "khac", giaTri: "" },
    ],
    nhiemVu: [
      { ten: "Vào nhóm Zalo", moTa: "Tham gia nhóm cộng đồng chính", diem: 10, url: "https://zalo.me/g/…", cauHoi: "Tin ghim đầu nhóm chào bằng từ gì?", dapAn: "xin chào" },
      { ten: "Theo dõi Fanpage", moTa: "Theo dõi để cập nhật hoạt động", diem: 10, url: "https://facebook.com/…", cauHoi: "Tên cộng đồng là gì?", dapAn: "cộng đồng" },
    ],
    loiMoi: {
      zalo: "Vào cộng đồng này với mình nha, nhiều tài nguyên hay mà còn có quà: {{link}}",
      facebook: "Tham gia cộng đồng của tụi mình nè 👥 vào đây: {{link}}",
      messenger: "Vào nhóm cộng đồng này với mình đi: {{link}}",
      telegram: "Gia nhập cộng đồng — mời bạn nhận quà: {{link}}",
      copy: "Vào cộng đồng cùng mình, mời bạn nhận quà: {{link}}",
    },
    layout: dungData([
      K.soNguoi("thành viên"),
      K.tieuDe("👥 Gia nhập cộng đồng — mời bạn nhận quà", "#ffffff"),
      K.vanBan("Đăng ký, hoàn thành vài nhiệm vụ nhỏ (vào nhóm, theo dõi) và mời bạn để mở khoá quà thành viên.", "#ccfbf1"),
      K.form("Tham gia cộng đồng", "Miễn phí — nhận tài nguyên ngay khi vào."),
      K.mocQua("🎁 Mời bạn — mở khoá quà thành viên"),
      K.dieuKhoan(),
    ], { mauChinh: "#0f766e", mauNen: "#f0fdfa" }),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nChào mừng vào cộng đồng! Hoàn thành nhiệm vụ và mời bạn bè để nhận quà thành viên.\nTrang của bạn: {{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Tuyệt {{ten}}! Cộng đồng có thêm 1 thành viên qua bạn. Đang có {{so_ban}} bạn.\n{{link_rieng}}",
      sapMoc: "{{ten}} ơi, 1 bạn nữa là mở «{{qua_ke_tiep}}»! {{link_rieng}}",
      moQua: "🎁 {{ten}} vừa mở: {{ten_qua}} {{gia_tri_qua}}\n{{link_rieng}}",
    }),
  },

  // 14) Học nhỏ giọt (drip)
  {
    ma: "hoc-nho-giot", loai: "moc_qua", ten: "Học nhỏ giọt (drip)", emoji: "🔓", chip: "Mở khoá từng chương",
    moTa: "Mời bạn để mở lần lượt từng chương khoá học. Giữ học viên quay lại và lan toả.",
    cd: {
      ten: "Học miễn phí — mời bạn mở từng chương", moTa: "Đăng ký học chương 1 miễn phí. Mời bạn để mở khoá các chương tiếp theo.",
      tieuDe: "🔓 Mở khoá khoá học theo từng chương", nutCta: "Học chương 1 miễn phí",
      mauChinh: "#4338ca", mauNen: "#eef2ff", giaiBocTham: "",
      quaChaoMung: "Chương 1 mở ngay sau khi xác nhận", quaChaoMungGiaTri: "", haiChieu: true,
    },
    mocQua: [
      { nguong: 1, tenQua: "Mở khoá Chương 2 (link)", loaiQua: "link", giaTri: "https://…" },
      { nguong: 3, tenQua: "Mở khoá Chương 3 + bài tập", loaiQua: "link", giaTri: "https://…" },
      { nguong: 5, tenQua: "Mở khoá Chương 4 + template", loaiQua: "link", giaTri: "https://…" },
      { nguong: 10, tenQua: "Mở toàn bộ khoá + chứng nhận", loaiQua: "khac", giaTri: "" },
    ],
    nhiemVu: [
      { ten: "Học xong Chương 1", moTa: "Xem hết chương 1 rồi trả lời câu hỏi (anh chỉnh)", diem: 15, url: "https://…", cauHoi: "Chương 1 nói về chủ đề gì? (1 từ khoá)", dapAn: "nhập môn" },
    ],
    loiMoi: {
      zalo: "Khoá học này mở từng chương khi rủ bạn, học free mà hay lắm — vào học chung nha: {{link}}",
      facebook: "Học free theo chương, rủ bạn để mở tiếp 🔓: {{link}}",
      messenger: "Vào học khoá này với mình đi, rủ nhau mở thêm chương: {{link}}",
      telegram: "Khoá học mở khoá theo chương — học free: {{link}}",
      copy: "Học cùng mình, mời bạn để mở từng chương: {{link}}",
    },
    layout: dungData([
      K.soNguoi("học viên"),
      K.tieuDe("🔓 Mở khoá khoá học theo từng chương", "#ffffff"),
      K.video(""),
      K.vanBan("Đăng ký học Chương 1 miễn phí. Mỗi người bạn mời sẽ mở khoá thêm một chương mới cho bạn.", "#e0e7ff"),
      K.form("Học chương 1 miễn phí", "Chương 1 gửi ngay sau khi xác nhận email."),
      K.mocQua("🔓 Mời bạn — mở khoá các chương tiếp theo"),
      K.dieuKhoan(),
    ], { mauChinh: "#4338ca", mauNen: "#eef2ff" }),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nChương 1 của bạn đã mở! Mời bạn bè để mở khoá các chương tiếp theo.\nVào học: {{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Giỏi lắm {{ten}}! Bạn vừa mở thêm nội dung mới. Đang có {{so_ban}} bạn.\nHọc tiếp: {{link_rieng}}",
      sapMoc: "{{ten}} ơi, 1 bạn nữa là mở «{{qua_ke_tiep}}»! {{link_rieng}}",
      moQua: "🔓 {{ten}} vừa mở khoá: {{ten_qua}} {{gia_tri_qua}}\nVào học ngay: {{link_rieng}}",
    }),
  },

  // 15) Mời tải app
  {
    ma: "moi-tai-app", loai: "gioi_thieu", ten: "Mời tải app", emoji: "📱", chip: "App referral 2 chiều",
    moTa: "Mời bạn cài app, cả hai cùng nhận điểm/quà trong app. Hợp startup, ứng dụng.",
    cd: {
      ten: "Mời bạn tải app — cả hai cùng có quà", moTa: "Tải app và mời bạn bè: bạn và người được mời đều nhận điểm/quà trong app.",
      tieuDe: "📱 Mời bạn tải app — đôi bên cùng có quà", nutCta: "Nhận link mời của tôi",
      mauChinh: "#2563eb", mauNen: "#eff6ff", giaiBocTham: "",
      quaChaoMung: "100 điểm thưởng trong app cho người mới", quaChaoMungGiaTri: "", haiChieu: true,
    },
    mocQua: [
      { nguong: 1, tenQua: "100 điểm thưởng trong app", loaiQua: "khac", giaTri: "" },
      { nguong: 3, tenQua: "Voucher trong app", loaiQua: "coupon", giaTri: "APP20" },
      { nguong: 5, tenQua: "Nâng cấp Premium 1 tháng", loaiQua: "khac", giaTri: "" },
      { nguong: 10, tenQua: "Premium 6 tháng", loaiQua: "khac", giaTri: "" },
    ],
    nhiemVu: [
      { ten: "Cài app & mở lần đầu", moTa: "Tải app và đăng nhập để kích hoạt quà", diem: 15, url: "https://…", cauHoi: "Tên app là gì?", dapAn: "app" },
    ],
    loiMoi: {
      zalo: "Tải app này đi, dùng hay mà mình mời bạn thì cả hai được điểm/quà nè: {{link}}",
      facebook: "Tải app này qua link mình để cả hai cùng có quà 📱: {{link}}",
      messenger: "Tải app này giúp mình với, cả hai được thưởng đó: {{link}}",
      telegram: "Mời bạn tải app — đôi bên cùng nhận quà: {{link}}",
      copy: "Tải app qua link của mình, cả hai cùng có quà: {{link}}",
    },
    layout: dungData([
      K.soNguoi("người đã cài app"),
      K.tieuDe("📱 Mời bạn tải app — đôi bên cùng có quà", "#ffffff"),
      K.vanBan("Lấy link mời của bạn, gửi cho bạn bè. Khi họ cài app, cả hai cùng nhận điểm/quà trong app.", "#dbeafe"),
      K.form("Nhận link mời của tôi", "Người được mời nhận thưởng ngay khi cài app."),
      K.mocQua("🎁 Mời càng nhiều — quà càng lớn"),
      K.dieuKhoan(),
    ], { mauChinh: "#2563eb", mauNen: "#eff6ff" }),
    email: bo({
      chaoMung: "Chào {{ten}},\n\nĐây là link mời tải app của bạn. Mỗi người cài qua link, cả hai cùng nhận quà trong app.\n{{link_rieng}}\n\n{{qua_chao_mung}}",
      moi: "Tuyệt {{ten}}! Một người bạn vừa cài app qua bạn. Đang có {{so_ban}} bạn.\n{{link_rieng}}",
      sapMoc: "{{ten}} ơi, 1 bạn nữa là bạn nhận «{{qua_ke_tiep}}»! {{link_rieng}}",
      moQua: "🎁 {{ten}} vừa nhận: {{ten_qua}} {{gia_tri_qua}}\nMở app để dùng nhé: {{link_rieng}}",
    }),
  },
];

export function timMauToanDien(ma: string): MauToanDien | undefined {
  return MAU_TOAN_DIEN.find((m) => m.ma === ma);
}
