import { ExternalLink, Megaphone, Star, Users2, Video } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TrafficBenNgoai() {
  const CARDS = [
    { icon: Star, ten: "KOC / Influencer", mota: "Bắt tay người có sẵn khán giả đúng tệp: đưa họ link nguồn riêng để đo hiệu quả từng người.", hanh: "Tạo link nguồn cho KOC", href: "../thiet-lap/nang-cao/utm" },
    { icon: Users2, ten: "Cộng đồng & nhóm", mota: "Nhóm Zalo, group Facebook, forum đúng chủ đề — chia sẻ kèm giá trị thật, đừng spam link trần.", hanh: "Mở Facebook Groups", href: "https://www.facebook.com/groups/", ngoai: true },
    { icon: Megaphone, ten: "Quảng cáo trả phí", mota: "Đổ ads vào trang đăng ký: mỗi lead trả phí kéo thêm lead miễn phí qua vòng lặp mời bạn (CPL thực giảm mạnh).", hanh: "Mở Trình quản lý QC", href: "https://adsmanager.facebook.com/", ngoai: true },
    { icon: Video, ten: "Nội dung ngắn", mota: "Video TikTok/Reels khoe quà + hướng dẫn tham gia — gắn link ở bio, dùng link nguồn riêng để đo.", hanh: "Tạo link nguồn", href: "../thiet-lap/nang-cao/utm" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Traffic bên ngoài</h1>
      <p className="text-sm text-slate-500">Gợi ý kéo thêm người mới vào phễu — phần khó nhất nhưng ăn nhất khi kết hợp vòng lặp mời bạn.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <div key={c.ten} className="the flex flex-col p-6 text-center">
            <c.icon className="mx-auto h-8 w-8 text-blue-600" />
            <div className="mt-3 font-black text-slate-800">{c.ten}</div>
            <p className="mt-2 flex-1 text-sm text-slate-500">{c.mota}</p>
            <a href={c.href} target={c.ngoai ? "_blank" : undefined}
              className="nut-phu mx-auto mt-4 !py-2 text-sm">{c.hanh} {c.ngoai && <ExternalLink className="h-3.5 w-3.5" />}</a>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">Đây là gợi ý chiến thuật — các nền tảng bên ngoài không thuộc MGM MAX.</p>
    </div>
  );
}
