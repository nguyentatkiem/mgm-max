import SidebarMuc from "@/ui/admin/SidebarMuc";

export default async function KhungBaoCao(props: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const g = (duoi: string) => `/admin/cd/${id}/bao-cao/${duoi}`;
  return (
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[250px_1fr]">
      <aside>
        <SidebarMuc cacMuc={[
          { href: g("tong-quan"), ten: "Tổng quan" },
          { href: g("traffic"), ten: "Traffic theo nguồn" },
          { href: g("nhiem-vu"), ten: "Share & nhiệm vụ" },
          { href: g("nguoi"), ten: "Lead theo ngày" },
          { href: g("email"), ten: "Email" },
          { href: g("ab"), ten: "A/B test" },
        ]} />
      </aside>
      <div className="min-w-0">{props.children}</div>
    </div>
  );
}
