import SidebarMuc from "@/ui/admin/SidebarMuc";

export default async function KhungBaoCao(props: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const g = (duoi: string) => `/admin/cd/${id}/bao-cao/${duoi}`;
  return (
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[250px_1fr]">
      <aside>
        {/* 6 mục khớp 1:1 sidebar Reports trong ảnh gốc: Dashboard/Traffic/Actions/Leads/Emails/Split test */}
        <SidebarMuc cacMuc={[
          { href: g("tong-quan"), ten: "Dashboard" },
          { href: g("traffic"), ten: "Traffic" },
          { href: g("nhiem-vu"), ten: "Hành động" },
          { href: g("nguoi"), ten: "Leads" },
          { href: g("email"), ten: "Email" },
          { href: g("ab"), ten: "Split test" },
        ]} />
      </aside>
      <div className="min-w-0">{props.children}</div>
    </div>
  );
}
