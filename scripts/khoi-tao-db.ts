// Khởi tạo schema vào DB mgm_max (tạo DB trước bằng: createdb mgm_max)
import { readFileSync } from "node:fs";
import { Pool } from "pg";

const url = process.env.DATABASE_URL || "postgres://localhost:5432/mgm_max";
const pool = new Pool({ connectionString: url });

async function main() {
  const sql = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");
  await pool.query(sql);
  console.log("✓ Schema đã áp vào", url);
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
