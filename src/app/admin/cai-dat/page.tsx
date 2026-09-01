import { Save, ShieldCheck } from "lucide-react";
import { layCaiDat } from "@/services/cai-dat";
import { cheDoAI } from "@/services/ai";
import { yeuCauAdmin } from "../bao-ve";
import { actLuuCaiDat } from "../actions";

export const dynamic = "force-dynamic";

export default async function TrangCaiDat() {
  await yeuCauAdmin();
  const whitelistIp = await layCaiDat("whitelist_ip");
  const blacklistEmail = await layCaiDat("blacklist_email");
  const blacklistIp = await layCaiDat("blacklist_ip");
  const coResend = !!process.env.RESEND_API_KEY;
  const che = cheDoAI();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-black text-slate-900">Cài đặt hệ thống</h1>
      <form action={actLuuCaiDat} className="the mt-5 space-y-5 p-6">
        <div>
          <label className="nhan">Whitelist IP (mỗi IP một dòng)</label>
          <textarea name="whitelist_ip" rows={3} defaultValue={whitelistIp} className="o-nhap font-mono text-sm" placeholder="IP của đội vận hành — để tự test không dính giới hạn 3 đăng ký/IP/ngày" />
        </div>
        <div>
          <label className="nhan">Blacklist email (mỗi email một dòng)</label>
          <textarea name="blacklist_email" rows={3} defaultValue={blacklistEmail} className="o-nhap font-mono text-sm" placeholder="email-xau@vd.com" />
        </div>
        <div>
          <label className="nhan">Blacklist IP (mỗi IP một dòng — chặn hẳn không cho đăng ký)</label>
          <textarea name="blacklist_ip" rows={3} defaultValue={blacklistIp} className="o-nhap font-mono text-sm" placeholder="1.2.3.4" />
        </div>
        <button className="nut-chinh"><Save className="h-4 w-4" /> Lưu cài đặt</button>
      </form>

      <div className="the mt-5 p-6 text-sm text-slate-600">
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><ShieldCheck className="h-5 w-5 text-blue-600" /> Trạng thái hệ thống</h2>
        <ul className="mt-3 space-y-2">
          <li>• Gửi email: {coResend ? <b className="text-emerald-600">Resend (thật)</b> : <b className="text-blue-700">Giả lập</b>} — cấu hình qua biến môi trường <code className="font-mono">RESEND_API_KEY</code></li>
          <li>• Referral AI: {che === "cli" ? <b className="text-emerald-600">Claude CLI (gói subscription)</b> : <b className="text-blue-700">Claude API (ANTHROPIC_API_KEY)</b>} — CLI: chạy <code className="font-mono">claude</code> + <code className="font-mono">/login</code> trên máy chủ; hoặc ép chế độ bằng <code className="font-mono">MGM_AI_MODE=cli|api</code></li>
          <li>• Cron nội bộ chạy 5 phút/lần: tự đóng campaign hết hạn + tự bốc thăm (chờ duyệt), nhắc người im ắng 3 ngày, xử lý email — gọi tay: <code className="font-mono">GET /api/cron</code></li>
          <li>• Chống gian lận đang bật: chặn email rác dùng-một-lần, giới hạn 3 đăng ký/IP/ngày, captcha tự bật từ lượt thứ 3 cùng IP, chặn tự giới thiệu, double opt-in bắt buộc, chấm điểm rủi ro ≥50 → cách ly</li>
          <li>• Mật khẩu admin: biến <code className="font-mono">ADMIN_MAT_KHAU</code> (mặc định <code className="font-mono">mgmmax123</code>)</li>
          <li>• Múi giờ tính "ngày" cho điểm share/click: <b>Asia/Ho_Chi_Minh</b></li>
        </ul>
      </div>
    </div>
  );
}
