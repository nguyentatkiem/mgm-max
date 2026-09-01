import { NextRequest, NextResponse } from "next/server";

// F3 — script popup: dán 1 thẻ <script> vào website là có nút nổi mở form đăng ký
export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  // Bảo mật (C3): slug chỉ gồm [a-z0-9-] — chặn chèn mã (XSS) vào JS phục vụ
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) {
    return new NextResponse("/* slug không hợp lệ */", { status: 400, headers: { "Content-Type": "application/javascript; charset=utf-8" } });
  }
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3005").replace(/[^a-zA-Z0-9.:-]/g, "");
  const src = `${proto}://${host}/nhung/${slug}`;

  const js = `(function(){
  if (document.getElementById('mgm-nut')) return;
  var nut = document.createElement('button');
  nut.id = 'mgm-nut';
  nut.textContent = '🎁 Nhận quà';
  nut.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99998;background:#2563eb;color:#fff;border:0;border-radius:999px;padding:12px 20px;font-weight:700;font-size:15px;box-shadow:0 8px 24px rgba(37,99,235,.4);cursor:pointer;font-family:system-ui';
  var khung = document.createElement('div');
  khung.style.cssText = 'display:none;position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.55)';
  khung.innerHTML = '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:min(400px,92vw);height:min(560px,88vh);background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.35)">'
    + '<button id="mgm-dong" style="position:absolute;top:8px;right:10px;z-index:2;background:#f1f5f9;border:0;border-radius:999px;width:30px;height:30px;font-size:16px;cursor:pointer">✕</button>'
    + '<iframe src="${src}" style="width:100%;height:100%;border:0"></iframe></div>';
  document.body.appendChild(nut);
  document.body.appendChild(khung);
  nut.onclick = function(){ khung.style.display = 'block'; };
  khung.onclick = function(e){ if (e.target === khung) khung.style.display = 'none'; };
  khung.querySelector('#mgm-dong').onclick = function(){ khung.style.display = 'none'; };
})();`;

  return new NextResponse(js, { headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "public, max-age=300" } });
}
