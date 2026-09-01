import Link from "next/link";
import { MailCheck, ScanFace, ShieldCheck, SpellCheck2 } from "lucide-react";
import { mot } from "@/db";
import { NGUONG_CACH_LY } from "@/core/gian-lan";
import { NGUONG_CAPTCHA } from "@/services/captcha";

export const dynamic = "force-dynamic";

export default async function ChatLuongLead(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  await mot(`select id from chien_dich where id=$1`, [Number(id)]);

  const CAC_LOP = [
    { icon: MailCheck, ten: "Double opt-in", mota: "Chưa xác minh email = chưa được tính điểm, chưa vào danh sách. Lọc ~90% bot rẻ tiền.", bat: true, khoa: true },
    { icon: SpellCheck2, ten: "Chặn email dùng-một-lần", mota: "Từ chối các domain email rác (mailinator, yopmail…) ngay tại form.", bat: true, khoa: true },
    { icon: ScanFace, ten: `Captcha tự bật (từ lượt thứ ${NGUONG_CAPTCHA + 1} cùng IP/ngày)`, mota: "Câu hỏi toán học tự nhúng — không cần dịch vụ ngoài, người thật 3 giây là qua.", bat: true, khoa: true },
    { icon: ShieldCheck, ten: `Chấm điểm rủi ro & khu cách ly (ngưỡng ${NGUONG_CACH_LY})`, mota: "Trùng IP với người mời, email hàng loạt, đăng ký dồn dập… → referral bị giữ lại chờ anh duyệt, KHÔNG tự cộng điểm.", bat: true, khoa: true },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Chất lượng lead</h1>
      <p className="text-sm text-slate-500">Giữ danh sách sạch bằng xác minh + 4 lớp chống gian lận (bật mặc định cho mọi chiến dịch).</p>

      <div className="mt-5 space-y-3">
        {CAC_LOP.map((l) => (
          <div key={l.ten} className="hang-cai">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><l.icon className="h-5 w-5" /></span>
              <div className="min-w-0">
                <div className="font-bold text-slate-800">{l.ten}</div>
                <div className="text-xs text-slate-400">{l.mota}</div>
              </div>
            </div>
            <span className={`cong-tac bat opacity-70`} title="Lớp bảo vệ lõi — luôn bật"><span className="num" /></span>
          </div>
        ))}
      </div>

      <div className="the mt-5 p-5 text-sm text-slate-600">
        <b className="text-slate-800">Thêm:</b> giới hạn 3 đăng ký/IP/ngày · whitelist IP cho đội vận hành và blacklist email/IP chỉnh ở{" "}
        <Link href="/admin/cai-dat" className="font-semibold text-blue-700 hover:underline">Cài đặt hệ thống</Link> · referral bị cách ly nằm ở tab{" "}
        <Link href={`/admin/cd/${id}/nguoi-tham-gia?tab=gian-lan`} className="font-semibold text-blue-700 hover:underline">Người tham gia › Gian lận</Link>.
      </div>
    </div>
  );
}
