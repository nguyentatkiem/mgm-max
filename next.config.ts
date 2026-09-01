import type { NextConfig } from "next";

const config: NextConfig = {
  // Chạy sau tunnel trycloudflare nên tin header x-forwarded-* để dựng URL tuyệt đối
  experimental: { serverActions: { allowedOrigins: ["*.trycloudflare.com", "localhost:3005"] } },
};

export default config;
