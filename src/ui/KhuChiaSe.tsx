"use client";
import { useState } from "react";
import { Check, Copy, Facebook, Link2, MessageCircle, Send, Share2 } from "lucide-react";

const KENH: Record<string, { ten: string; mau: string; icon: React.ComponentType<{ className?: string }> }> = {
  zalo: { ten: "Zalo", mau: "bg-sky-500 hover:bg-sky-600", icon: MessageCircle },
  facebook: { ten: "Facebook", mau: "bg-blue-600 hover:bg-blue-700", icon: Facebook },
  messenger: { ten: "Messenger", mau: "bg-indigo-500 hover:bg-indigo-600", icon: Send },
  telegram: { ten: "Telegram", mau: "bg-cyan-500 hover:bg-cyan-600", icon: Send },
  copy: { ten: "Copy link", mau: "bg-slate-600 hover:bg-slate-700", icon: Link2 },
};

export default function KhuChiaSe({
  ma, linkGoc, loiMoi, loiMoiKenh = {}, kenhBat, diemShare,
}: { ma: string; linkGoc: string; loiMoi: string; loiMoiKenh?: Record<string, string>; kenhBat: string[]; diemShare: number }) {
  const [daCopy, setDaCopy] = useState(false);
  const [thongBao, setThongBao] = useState("");

  async function ghiShare(kenh: string) {
    try {
      const res = await fetch("/api/chia-se", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ma, kenh }),
      });
      const j = await res.json();
      if (j.congDiem) setThongBao(`+${diemShare} điểm share ${KENH[kenh]?.ten || kenh}!`);
    } catch { /* không chặn share vì lỗi mạng */ }
  }

  async function copyLink(kenh = "copy") {
    await navigator.clipboard.writeText(`${linkGoc}?ch=${kenh}`);
    setDaCopy(true);
    setTimeout(() => setDaCopy(false), 1600);
  }

  function moKenh(kenh: string) {
    const link = encodeURIComponent(`${linkGoc}?ch=${kenh}`);
    // F5 — lời mời soạn riêng từng kênh (admin cấu hình), fallback lời mời chung
    const text = encodeURIComponent(loiMoiKenh[kenh] || loiMoi);
    ghiShare(kenh);
    if (kenh === "facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${link}&quote=${text}`, "_blank");
    else if (kenh === "messenger") window.open(`fb-messenger://share?link=${link}`, "_blank");
    else if (kenh === "telegram") window.open(`https://t.me/share/url?url=${link}&text=${text}`, "_blank");
    else if (kenh === "zalo") { copyLink("zalo"); window.open("https://chat.zalo.me", "_blank"); }
    else copyLink("copy");
  }

  return (
    <div>
      <div className="flex items-center gap-2 rounded-xl border-2 border-blue-200 bg-blue-50 px-3 py-2.5">
        <code className="flex-1 truncate font-mono text-sm text-blue-800">{linkGoc}</code>
        <button onClick={() => copyLink()} className="nut-chinh !px-3 !py-1.5 text-sm">
          {daCopy ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {daCopy ? "Đã copy" : "Copy"}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {kenhBat.filter((k) => KENH[k]).map((k) => {
          const K = KENH[k];
          return (
            <button key={k} onClick={() => moKenh(k)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-white transition-colors cursor-pointer ${K.mau}`}>
              <K.icon className="h-4 w-4" /> {K.ten}
            </button>
          );
        })}
      </div>
      <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
        <Share2 className="h-3.5 w-3.5" /> +{diemShare} điểm cho lượt share đầu tiên mỗi kênh mỗi ngày · Zalo: link đã tự copy, dán vào chat là xong
      </p>
      {thongBao && <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{thongBao}</div>}
    </div>
  );
}
