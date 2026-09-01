import Link from "next/link";
import { MailCheck, ArrowRight } from "lucide-react";
import { mot } from "@/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TrangCamOn(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ma?: string; t?: string }>;
}) {
  const { slug } = await props.params;
  const { t = "" } = await props.searchParams;
  const cd = await mot(`select * from chien_dich where slug=$1`, [slug]);
  if (!cd) redirect("/");

  return (
    <main className="mx-auto max-w-lg px-4 py-20">
      <div className="the p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <MailCheck className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="mt-4 text-2xl font-black text-slate-900">Còn 1 bước nữa!</h1>
        <p className="mt-2 text-slate-500">
          Chúng tôi vừa gửi email xác nhận. Mở hộp thư và bấm link để kích hoạt
          <b> link mời bạn riêng</b> của bạn — chưa xác nhận thì lượt mời chưa được tính điểm.
        </p>
        {cd.che_do_demo && t && (
          <div className="mt-6 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-4 text-sm">
            <div className="font-bold text-blue-700">🔧 Chế độ demo đang bật</div>
            <p className="mt-1 text-slate-600">Không cần mở email — bấm nút dưới để xác minh ngay:</p>
            <Link href={`/xac-minh/${t}`} className="nut-chinh mt-3">
              Xác minh ngay <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
