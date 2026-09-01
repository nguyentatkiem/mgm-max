import { Pool } from "pg";

const url = process.env.DATABASE_URL || "postgres://localhost:5432/mgm_max";

const globalForPool = globalThis as unknown as { __mgmPool?: Pool };
export const pool = globalForPool.__mgmPool ?? new Pool({ connectionString: url, max: 10 });
if (!globalForPool.__mgmPool) globalForPool.__mgmPool = pool;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function q<T = any>(sql: string, thamSo: any[] = []): Promise<T[]> {
  const kq = await pool.query(sql, thamSo);
  return kq.rows as T[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mot<T = any>(sql: string, thamSo: any[] = []): Promise<T | null> {
  const rows = await q<T>(sql, thamSo);
  return rows[0] ?? null;
}
