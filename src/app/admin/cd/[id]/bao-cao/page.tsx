import { redirect } from "next/navigation";

export default async function VeBaoCao(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  redirect(`/admin/cd/${id}/bao-cao/tong-quan`);
}
