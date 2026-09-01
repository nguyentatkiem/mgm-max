import { redirect } from "next/navigation";

export default async function VeQuangBa(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  redirect(`/admin/cd/${id}/quang-ba/qr`);
}
