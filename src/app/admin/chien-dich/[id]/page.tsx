import { redirect } from "next/navigation";

export default async function VeThietLapMoi(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  redirect(`/admin/cd/${id}/thiet-lap`);
}
