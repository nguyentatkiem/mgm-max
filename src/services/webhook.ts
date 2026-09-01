// F44 — Webhook sự kiện (UpViral chỉ có 1 event; MGM MAX bắn đủ vòng đời)
// Sự kiện: lead.xac_minh | gioi_thieu.xac_minh | moc.mo_khoa | qua.trao | boc_tham.trung_giai

export async function banWebhook(url: string, suKien: string, duLieu: Record<string, unknown>) {
  if (!url || !/^https?:\/\//.test(url)) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-MGM-Su-Kien": suKien },
      body: JSON.stringify({ su_kien: suKien, du_lieu: duLieu, luc: new Date().toISOString() }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // fire-and-forget: webhook chết không được làm hỏng luồng chính
  }
}
