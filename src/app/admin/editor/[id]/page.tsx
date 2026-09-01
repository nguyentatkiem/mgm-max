import { redirect } from "next/navigation";
import { mot, q } from "@/db";
import { yeuCauAdmin } from "../../bao-ve";
import { actLuuLayout, actLuuMauTrang, actXoaMauTrang } from "../../actions";
import { metaTrangCoBan } from "@/services/trang-meta";
import { coLayout, layoutMacDinh } from "@/ui/puck/config";
import type { MauLuu } from "@/ui/puck/CongCuMau";
import PuckStudio from "@/ui/puck/PuckStudio";

export const dynamic = "force-dynamic";

// Trình KÉO-THẢ (Puck) thiết kế trang đăng ký — kéo block, sửa thuộc tính, chọn mẫu, xuất bản.
export default async function EditorTrang(props: { params: Promise<{ id: string }> }) {
  await yeuCauAdmin();
  const { id } = await props.params;
  const cd = await mot(`select * from chien_dich where id=$1`, [Number(id)]);
  if (!cd) redirect("/admin");

  const metadata = await metaTrangCoBan(cd);
  const data = coLayout(cd.layout_json) ? cd.layout_json : layoutMacDinh;
  const mauDaLuu = await q<MauLuu>(`select id, ten, data from mau_trang order by tao_luc desc`);

  return (
    <PuckStudio
      id={cd.id}
      slug={cd.slug}
      backHref={`/admin/cd/${cd.id}/thiet-lap/trang-dang-ky`}
      data={data}
      metadata={metadata}
      luu={actLuuLayout}
      mauDaLuu={mauDaLuu}
      luuMau={actLuuMauTrang}
      xoaMau={actXoaMauTrang}
    />
  );
}
