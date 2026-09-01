import SidebarMuc from "@/ui/admin/SidebarMuc";

export default async function KhungQuangBa(props: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const g = (duoi: string) => `/admin/cd/${id}/quang-ba/${duoi}`;
  return (
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[250px_1fr]">
      <aside>
        <SidebarMuc cacMuc={[
          { href: g("qr"), ten: "Mã QR" },
          { href: g("san-co"), ten: "Traffic sẵn có" },
          { href: g("ben-ngoai"), ten: "Traffic bên ngoài" },
        ]} />
      </aside>
      <div className="min-w-0">{props.children}</div>
    </div>
  );
}
