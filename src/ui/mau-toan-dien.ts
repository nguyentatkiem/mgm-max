import type { Data } from "@puckeditor/core";
import { dungData, K } from "./puck/mau-trang";

// ────────────────────────────────────────────────────────────────────────────
// MẪU CHIẾN DỊCH TOÀN DIỆN (Part A): mỗi mẫu tạo sẵn TRANG kéo-thả đã thiết kế +
// mốc quà thật + quà chào mừng + giải bốc thăm + nhiệm vụ (đáp án hợp lệ) +
// lời mời từng kênh. Chọn phát là chạy được ngay, chỉ chỉnh vài chữ.
// Server-safe (chỉ import type Data).
// ────────────────────────────────────────────────────────────────────────────

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
};

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
  },
];

export function timMauToanDien(ma: string): MauToanDien | undefined {
  return MAU_TOAN_DIEN.find((m) => m.ma === ma);
}
