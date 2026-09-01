import { mot, q } from "@/db";

export async function layCaiDat(khoa: string): Promise<string> {
  const r = await mot<{ gia_tri: string }>(`select gia_tri from cai_dat where khoa=$1`, [khoa]);
  return r?.gia_tri || "";
}

export async function ghiCaiDat(khoa: string, giaTri: string) {
  await q(
    `insert into cai_dat (khoa, gia_tri) values ($1,$2)
     on conflict (khoa) do update set gia_tri=excluded.gia_tri`,
    [khoa, giaTri]
  );
}
