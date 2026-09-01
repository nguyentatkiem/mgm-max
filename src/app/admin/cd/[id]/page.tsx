import { redirect } from "next/navigation";

export default async function VeChienDich(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  redirect(`/admin/cd/${id}/tong-quan`);
}
