// F44 — Webhook sự kiện (UpViral chỉ có 1 event; MGM MAX bắn đủ vòng đời)
// Sự kiện: lead.xac_minh | gioi_thieu.xac_minh | moc.mo_khoa | qua.trao | boc_tham.trung_giai
import { layCaiDat } from "@/services/cai-dat";

async function post(url: string, suKien: string, payload: unknown) {
  if (!url || !/^https?:\/\//.test(url)) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-MGM-Su-Kien": suKien },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // fire-and-forget: webhook chết không được làm hỏng luồng chính
  }
}

export async function banWebhook(url: string, suKien: string, duLieu: Record<string, unknown>) {
  const payload = { su_kien: suKien, du_lieu: duLieu, luc: new Date().toISOString() };
  // Webhook riêng của chiến dịch + webhook TOÀN HỆ THỐNG (admin đặt trong Cài đặt)
  const global = await layCaiDat("webhook_global");
  await post(url, suKien, payload);
  if (global && global !== url) await post(global, suKien, payload);
}

/** Bắn 1 sự kiện test tới URL để kiểm kết nối (nút trong Cài đặt). */
export async function guiWebhookTest(url: string): Promise<{ ok: boolean; thongTin: string }> {
  if (!url || !/^https?:\/\//.test(url)) return { ok: false, thongTin: "URL không hợp lệ (phải bắt đầu http/https)." };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-MGM-Su-Kien": "test.ping" },
      body: JSON.stringify({ su_kien: "test.ping", du_lieu: { thong_diep: "Webhook test từ MGM MAX" }, luc: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    return { ok: res.ok, thongTin: res.ok ? `OK — máy chủ nhận (HTTP ${res.status})` : `Máy chủ trả HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, thongTin: String(e).slice(0, 150) };
  }
}
