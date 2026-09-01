import { PenSquare, Share2 } from "lucide-react";
import { mot } from "@/db";

export const dynamic = "force-dynamic";

export default async function TrangChiaSe(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  const mau = await mot(`select ma from nguoi_tham_gia where chien_dich_id=$1 and xac_minh order by id limit 1`, [Number(id)]);

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Thiết kế trang chia sẻ</h1>
      <p className="text-sm text-slate-500">Trang mỗi người tham gia nhận sau khi xác minh: link mời riêng, tiến độ quà, bảng xếp hạng, nhiệm vụ.</p>

      {mau ? (
        <div className="the mt-5 overflow-hidden">
          <iframe src={`/toi/${mau.ma}`} className="h-[460px] w-full" title="Xem trước trang chia sẻ" />
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
            <div className="text-sm text-slate-500">Xem trước bằng dữ liệu của người tham gia đầu tiên.</div>
            <a href={`/admin/editor/${cd.id}`} className="nut-chinh !py-2 text-sm"><PenSquare className="h-4 w-4" /> Chỉnh bộ màu &amp; nội dung</a>
          </div>
        </div>
      ) : (
        <div className="the mt-5 p-10 text-center">
          <Share2 className="mx-auto h-10 w-10 text-slate-300" />
          <div className="mt-3 font-bold text-slate-700">Chưa có người tham gia nào để xem trước</div>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Trang chia sẻ dùng chung bộ màu với trang đăng ký. Đăng ký thử một người (bật chế độ demo) là xem được ngay tại đây.
          </p>
          <a href={`/c/${cd.slug}`} target="_blank" className="nut-phu mt-4 !py-2 text-sm">Mở trang đăng ký để thử</a>
        </div>
      )}

      <div className="the mt-5 p-6 text-sm text-slate-600">
        <b className="text-slate-800">Trang chia sẻ tự động gồm:</b> link mời riêng + mã QR · nút share theo kênh ({cd.kenh_share}) ·
        thanh tiến độ mốc quà · trung tâm quà đã mở · nhiệm vụ cộng điểm · bảng xếp hạng (ẩn danh một phần).
      </div>
    </div>
  );
}
