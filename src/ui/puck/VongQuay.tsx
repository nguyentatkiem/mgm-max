"use client";
import { useState } from "react";

// Vòng quay may mắn — engagement block. Quay ra 1 giải ngẫu nhiên (client-side),
// hiện kết quả để khách chụp màn hình đổi quà. Không gắn sổ điểm (trao quà thủ công/coupon).
const MAU_SEG = ["#2563eb", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export default function VongQuay({ giaiThuong, mau }: { giaiThuong: string[]; mau: string }) {
  const items = (giaiThuong && giaiThuong.length ? giaiThuong : ["Voucher 10%", "Ebook tặng", "Voucher 20%", "Chúc may mắn", "Quà bí ẩn", "Freeship"]).slice(0, 8);
  const n = items.length;
  const seg = 360 / n;
  const [goc, setGoc] = useState(0);
  const [ketQua, setKetQua] = useState<string | null>(null);
  const [dangQuay, setDangQuay] = useState(false);

  function quay() {
    if (dangQuay) return;
    setDangQuay(true);
    setKetQua(null);
    const idx = Math.floor(Math.random() * n);
    const dung = 5 * 360 + (360 - idx * seg - seg / 2); // kim ở đỉnh (0°), dừng giữa ô idx
    setGoc((g) => g + dung);
    setTimeout(() => { setKetQua(items[idx]); setDangQuay(false); }, 4300);
  }

  const grad = items.map((_, i) => `${MAU_SEG[i % MAU_SEG.length]} ${i * seg}deg ${(i + 1) * seg}deg`).join(", ");

  return (
    <div style={{ textAlign: "center", margin: "18px 0" }}>
      <div style={{ position: "relative", width: 250, height: 250, margin: "0 auto" }}>
        <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", zIndex: 2, fontSize: 26, lineHeight: 1, color: "#fff", filter: "drop-shadow(0 1px 2px rgba(0,0,0,.4))" }}>▼</div>
        <div style={{
          width: 250, height: 250, borderRadius: "50%", background: `conic-gradient(${grad})`,
          transform: `rotate(${goc}deg)`, transition: "transform 4.2s cubic-bezier(.15,.6,.3,1)",
          border: "8px solid #fff", boxShadow: "0 10px 30px rgba(2,6,23,.25)",
        }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 44, height: 44, marginTop: -22, marginLeft: -22, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.2)" }} />
      </div>
      <button type="button" onClick={quay} disabled={dangQuay} style={{
        marginTop: 16, background: mau || "#2563eb", color: "#fff", border: 0, padding: "12px 28px",
        borderRadius: 14, fontWeight: 800, fontSize: 16, cursor: dangQuay ? "wait" : "pointer", opacity: dangQuay ? 0.8 : 1,
      }}>{dangQuay ? "Đang quay…" : "QUAY NGAY 🎡"}</button>
      {ketQua ? (
        <div style={{ marginTop: 14, background: "#fff", borderRadius: 14, padding: "12px 16px", display: "inline-block", fontWeight: 800, color: "#0f172a" }}>
          🎉 Bạn trúng: <span style={{ color: mau || "#2563eb" }}>{ketQua}</span>! Chụp màn hình gửi shop để nhận nhé.
        </div>
      ) : (
        <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,.85)" }}>Có thể trúng: {items.join(" · ")}</div>
      )}
    </div>
  );
}
