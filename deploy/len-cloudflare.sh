#!/bin/bash
# Mở link công khai trycloudflare trỏ vào app local.
# Dùng: ./deploy/len-cloudflare.sh [cổng]  (mặc định 3005)
PORT="${1:-3005}"
echo "→ Mở tunnel Cloudflare cho http://localhost:$PORT …"
exec cloudflared tunnel --url "http://localhost:$PORT"
