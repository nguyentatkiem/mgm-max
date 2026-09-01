// Danh mục LOẠI chiến dịch + TEMPLATE khởi tạo (nội dung tự soạn tiếng Việt cho MGM MAX)

export type LoaiChienDich = {
  ma: string; ten: string; chip: string; moTa: string; emoji: string;
};

export const CAC_LOAI: LoaiChienDich[] = [
  { ma: "boc_tham", ten: "Bốc thăm & Minigame", chip: "Bùng nổ viral", emoji: "🏆", moTa: "Giải lớn có hạn chót — mỗi điểm là một vé, càng mời càng dễ trúng." },
  { ma: "hang_cho", ten: "Danh sách chờ & Ra mắt", chip: "Gom sự chú ý", emoji: "⏳", moTa: "Gom hàng chờ trước ngày mở bán, mời bạn để nhận đặc quyền sớm." },
  { ma: "moc_qua", ten: "Mốc quà & Giới thiệu bạn", chip: "Gom lead bền vững", emoji: "🎖️", moTa: "Không cần hạn chót — mời đủ số bạn là quà tự mở khoá." },
  { ma: "gioi_thieu", ten: "Chương trình giới thiệu", chip: "Lead chất lượng cao", emoji: "🤝", moTa: "Thưởng hai chiều cho người mời và người được mời." },
  { ma: "tu_do", ten: "Tự do", chip: "Tự trộn cơ chế", emoji: "🎁", moTa: "Kết hợp mốc quà, bốc thăm và nhiệm vụ theo ý anh." },
];

export type MauChienDich = {
  ma: string; ten: string; chipThuong: string; emoji: string;
  // preset áp vào campaign khi tạo
  tieuDe: string; moTa: string; nutCta: string; mauChinh: string; mauNen: string;
  giaiBocTham?: string; taoMocMau?: boolean; haiChieu?: boolean;
};

export const MAU_THEO_LOAI: Record<string, MauChienDich[]> = {
  boc_tham: [
    { ma: "may-gom-lead", ten: "Máy gom lead", chipThuong: "Giải đặc biệt", emoji: "🎯", mauChinh: "#2563eb", mauNen: "#eff6ff",
      tieuDe: "Cơ hội rinh [Giải đặc biệt]!", moTa: "Điền thông tin bên dưới để nhận vé may mắn — mời thêm bạn bè để nhân số vé của bạn!", nutCta: "Đăng ký nhận vé ngay", giaiBocTham: "[Giải đặc biệt — anh điền sau]" },
    { ma: "khuyen-mai-tet", ten: "Khuyến mãi Tết", chipThuong: "Giải đặc biệt", emoji: "🧧", mauChinh: "#dc2626", mauNen: "#fef2f2",
      tieuDe: "Lì xì cực lớn: [Giải đặc biệt]", moTa: "Tết này mời bạn bè cùng tham gia — quà tặng liền tay, giải lớn chờ bốc thăm!", nutCta: "Nhận lì xì may mắn", giaiBocTham: "[Giải Tết — anh điền sau]" },
    { ma: "tang-list-email", ten: "Tăng list email", chipThuong: "Giải đặc biệt", emoji: "📧", mauChinh: "#0f172a", mauNen: "#f1f5f9",
      tieuDe: "Săn quà [Giải đặc biệt] cùng chúng tôi", moTa: "Đăng ký một chạm — mời bạn bè để tăng cơ hội thắng giải.", nutCta: "Tham gia ngay", giaiBocTham: "[Giải — anh điền sau]" },
  ],
  hang_cho: [
    { ma: "uu-dai-doc-quyen", ten: "Ưu đãi độc quyền", chipThuong: "Giải đặc biệt", emoji: "💎", mauChinh: "#1e293b", mauNen: "#f8fafc",
      tieuDe: "Vào danh sách chờ — nhận [đặc quyền] sớm nhất", moTa: "Sản phẩm sắp ra mắt. Đăng ký giữ chỗ và mời bạn bè để được ưu tiên trước.", nutCta: "Giữ chỗ cho tôi", giaiBocTham: "" },
  ],
  moc_qua: [
    { ma: "gom-lead-evergreen", ten: "Gom lead evergreen", chipThuong: "Mốc quà", emoji: "🌱", mauChinh: "#0d9488", mauNen: "#f0fdfa",
      tieuDe: "Mời bạn — mở khoá kho quà!", moTa: "Chỉ cần đăng ký và mời bạn bè: đủ mốc là quà tự về, không cần chờ quay số.", nutCta: "Bắt đầu nhận quà", taoMocMau: true },
  ],
  gioi_thieu: [
    { ma: "referral-evergreen", ten: "Referral evergreen", chipThuong: "Chỉ mốc quà", emoji: "🔁", mauChinh: "#7c3aed", mauNen: "#f5f3ff",
      tieuDe: "Sẵn sàng nhận [Phần thưởng]?", moTa: "Đăng ký rồi bắt đầu giới thiệu — chỉ cần 2 người bạn là mở khoá phần thưởng đầu tiên!", nutCta: "Bắt đầu thôi!", taoMocMau: true, haiChieu: true },
  ],
  tu_do: [
    { ma: "tu-dung", ten: "Tự dựng từ đầu", chipThuong: "Mọi loại thưởng", emoji: "🛠️", mauChinh: "#2563eb", mauNen: "",
      tieuDe: "", moTa: "", nutCta: "", giaiBocTham: "" },
  ],
};

// Bộ mẫu NHIỆM VỤ cộng điểm (icon = tên lucide phía UI)
export const MAU_NHIEM_VU = [
  { ma: "tu_do", ten: "Nhiệm vụ tự do", moTa: "Tự đặt yêu cầu và câu hỏi xác minh", icon: "Sparkles", mau: "#64748b", diem: 10, urlGoiY: "", cauHoi: "", ten2: "" },
  { ma: "zalo_nhom", ten: "Vào nhóm Zalo", moTa: "Mời tham gia nhóm Zalo cộng đồng", icon: "MessageCircle", mau: "#0ea5e9", diem: 10, urlGoiY: "https://zalo.me/g/…", cauHoi: "Tin ghim đầu nhóm có từ khoá gì?" },
  { ma: "tiktok_follow", ten: "Theo dõi TikTok", moTa: "Theo dõi kênh TikTok của anh", icon: "Music2", mau: "#0f172a", diem: 10, urlGoiY: "https://tiktok.com/@…", cauHoi: "Video ghim đầu kênh nói về gì?" },
  { ma: "ig_follow", ten: "Theo dõi Instagram", moTa: "Theo dõi tài khoản Instagram", icon: "Instagram", mau: "#a855f7", diem: 10, urlGoiY: "https://instagram.com/…", cauHoi: "Bài ghim đầu trang là gì?" },
  { ma: "fb_share", ten: "Chia sẻ lên Facebook", moTa: "Đăng nội dung lên trang cá nhân", icon: "Facebook", mau: "#2563eb", diem: 5, urlGoiY: "", cauHoi: "Bạn đã đăng bài ở chế độ nào?" },
  { ma: "fb_nhom", ten: "Chia sẻ vào nhóm FB", moTa: "Chia sẻ vào nhóm Facebook phù hợp", icon: "Users", mau: "#1d4ed8", diem: 10, urlGoiY: "", cauHoi: "Tên nhóm bạn vừa chia sẻ?" },
  { ma: "yt_sub", ten: "Đăng ký YouTube", moTa: "Đăng ký kênh YouTube", icon: "Youtube", mau: "#dc2626", diem: 10, urlGoiY: "https://youtube.com/@…", cauHoi: "Video mới nhất của kênh tên gì?" },
  { ma: "yt_cmt", ten: "Bình luận YouTube", moTa: "Bình luận vào video để tăng tương tác", icon: "MessageSquare", mau: "#ef4444", diem: 10, urlGoiY: "https://youtube.com/watch?v=…", cauHoi: "Bạn đã bình luận nội dung gì?" },
  { ma: "xem_video", ten: "Xem video giới thiệu", moTa: "Xem hết video rồi trả lời câu hỏi", icon: "PlayCircle", mau: "#f59e0b", diem: 15, urlGoiY: "https://youtube.com/watch?v=…", cauHoi: "Trong video có nhắc tới con số nào?" },
];
