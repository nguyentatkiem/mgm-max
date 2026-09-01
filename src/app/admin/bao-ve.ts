import { redirect } from "next/navigation";
import { laAdmin } from "@/services/auth";

export async function yeuCauAdmin() {
  if (!(await laAdmin())) redirect("/admin/dang-nhap");
}
