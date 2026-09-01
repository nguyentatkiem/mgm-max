"use client";
import { useState } from "react";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { config, type MetaTrang } from "./config";

// Trình kéo-thả (client). Nhận server action `luu` để xuất bản data JSON vào DB.
export default function PuckStudio({
  id, slug, backHref, data, metadata, luu,
}: {
  id: number;
  slug: string;
  backHref: string;
  data: Data;
  metadata: MetaTrang;
  luu: (id: number, data: Data) => Promise<void>;
}) {
  const [trangThai, setTrangThai] = useState<"" | "dang" | "xong" | "loi">("");

  async function xuatBan(d: Data) {
    setTrangThai("dang");
    try {
      await luu(id, JSON.parse(JSON.stringify(d)));
      setTrangThai("xong");
      setTimeout(() => setTrangThai(""), 2500);
    } catch {
      setTrangThai("loi");
    }
  }

  return (
    <div style={{ height: "calc(100vh - 56px)" }}>
      <Puck
        config={config}
        data={data}
        metadata={{ ...metadata, dangSua: true }}
        iframe={{ enabled: false }}
        onPublish={xuatBan}
        height="100%"
        headerTitle="Trình kéo-thả trang đăng ký"
        headerPath={`/c/${slug}`}
        overrides={{
          headerActions: ({ children }) => (
            <>
              <a href={`/c/${slug}`} target="_blank" rel="noreferrer"
                style={{ fontSize: 13, fontWeight: 700, color: "#475569", textDecoration: "none", alignSelf: "center", marginRight: 4 }}>
                Xem trang ↗
              </a>
              <a href={backHref}
                style={{ fontSize: 13, fontWeight: 700, color: "#475569", textDecoration: "none", alignSelf: "center", marginRight: 8 }}>
                Thoát
              </a>
              {trangThai === "dang" && <span style={{ fontSize: 13, color: "#2563eb", alignSelf: "center", marginRight: 8 }}>Đang lưu…</span>}
              {trangThai === "xong" && <span style={{ fontSize: 13, color: "#16a34a", alignSelf: "center", marginRight: 8 }}>✓ Đã xuất bản</span>}
              {trangThai === "loi" && <span style={{ fontSize: 13, color: "#dc2626", alignSelf: "center", marginRight: 8 }}>Lỗi lưu!</span>}
              {children}
            </>
          ),
        }}
      />
    </div>
  );
}
