import Link from "next/link";
import { MailCheck, ArrowRight } from "lucide-react";
import { mot } from "@/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TrangCamOn(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ma?: string; t?: string; nhung?: string }>;
}) {
  const { slug } = await props.params;
  const { t = "", nhung = "" } = await props.searchParams;
  const cd = await mot(`select * from chien_dich where slug=$1`, [slug]);
  if (!cd) redirect("/");

  const noiDung = (
    <div className={`the ${nhung ? "p-5" : "p-8"} text-center`}>
      <div className={`mx-auto flex ${nhung ? "h-12 w-12" : "h-16 w-16"} items-center justify-center rounded-full bg-blue-100`}>
        <MailCheck className={`${nhung ? "h-6 w-6" : "h-8 w-8"} text-blue-600`} />
      </div>
      <h1 className={`mt-4 font-black text-slate-900 ${nhung ? "text-lg" : "text-2xl"}`}>Còn 1 bước nữa!</h1>
      <p className={`mt-2 text-slate-500 ${nhung ? "text-sm" : ""}`}>
        Chúng tôi vừa gửi email xác nhận. Mở hộp thư và bấm link để kích hoạt
        <b> link mời bạn riêng</b> của bạn — chưa xác nhận thì lượt mời chưa được tính điểm.
      </p>
      {cd.che_do_demo && t && (
        <div className="mt-5 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-4 text-sm">
          <div className="font-bold text-blue-700">🔧 Chế độ demo đang bật</div>
          <p className="mt-1 text-slate-600">Không cần mở email — bấm nút dưới để xác minh ngay:</p>
          <Link href={`/xac-minh/${t}`} target={nhung ? "_top" : undefined} className="nut-chinh mt-3">
            Xác minh ngay <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );

  if (nhung) return <main className="bg-white p-4"><div className="mx-auto max-w-sm">{noiDung}</div></main>;
  return <main className="mx-auto max-w-lg px-4 py-20">{noiDung}</main>;
}
