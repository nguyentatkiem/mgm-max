// F51 — Referral AI: khai brand/sản phẩm/đối tượng → Claude sinh trọn chiến dịch.
// Hai đường chạy:
//   1) CLI `claude` (gói subscription đã đăng nhập trên máy chủ) — MẶC ĐỊNH, không tốn API.
//   2) SDK @anthropic-ai/sdk (nếu có ANTHROPIC_API_KEY) — tuỳ chọn.
// Ép chế độ bằng biến MGM_AI_MODE = "cli" | "api" (mặc định: có API key thì "api", không thì "cli").
import { execFile } from "node:child_process";
import { homedir } from "node:os";
import Anthropic from "@anthropic-ai/sdk";

export type SpecChienDich = {
  ten: string; slug: string; mo_ta: string;
  giai_boc_tham: string; qua_chao_mung: string; qua_chao_mung_gia_tri: string;
  moc_qua: { nguong: number; ten_qua: string; loai_qua: "coupon" | "file" | "link" | "khac"; goi_y_gia_tri: string }[];
  hanh_dong: { ten: string; mo_ta: string; diem: number; url: string; cau_hoi: string; dap_an: string }[];
  loi_moi: Record<string, string>;
};

const MODEL_AI = process.env.CLAUDE_MODEL || "claude-opus-5";

export type CheDoAI = "api" | "cli" | "none";

export function cheDoAI(): CheDoAI {
  const ep = (process.env.MGM_AI_MODE || "").toLowerCase();
  if (ep === "api") return "api";
  if (ep === "cli") return "cli";
  return process.env.ANTHROPIC_API_KEY ? "api" : "cli";
}

/** Bóc JSON từ output text (bỏ fence markdown, lấy khối {..}, dọn dấu phẩy thừa). */
function bocJson(text: string): string {
  let t = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  const dau = t.indexOf("{");
  const cuoi = t.lastIndexOf("}");
  if (dau >= 0 && cuoi > dau) t = t.slice(dau, cuoi + 1);
  return t.replace(/,(\s*[}\]])/g, "$1"); // bỏ dấu phẩy thừa trước } hoặc ]
}

const HUONG_DAN = `Bạn là chuyên gia growth marketing Việt Nam, thiết kế chiến dịch viral member-get-member (mời bạn nhận quà, KHÔNG trả hoa hồng tiền mặt).

Hãy thiết kế trọn chiến dịch và in ra DUY NHẤT một JSON hợp lệ (không giải thích, không markdown, không câu dẫn) theo đúng cấu trúc:
{
  "ten": "tên chiến dịch hấp dẫn tiếng Việt",
  "slug": "slug-ascii-thuong-gach-noi",
  "mo_ta": "1-2 câu mô tả trên trang đăng ký",
  "giai_boc_tham": "giải đặc biệt bốc thăm, hấp dẫn nhưng khả thi",
  "qua_chao_mung": "quà cho NGƯỜI ĐƯỢC MỜI khi xác minh",
  "qua_chao_mung_gia_tri": "mã coupon gợi ý, VD WELCOME10",
  "moc_qua": [ {"nguong": 1, "ten_qua": "...", "loai_qua": "coupon|file|link|khac", "goi_y_gia_tri": "mã/link hoặc rỗng"}, ... 4 mốc 1/3/5/10 giá trị tăng dần ],
  "hanh_dong": [ {"ten": "...", "mo_ta": "...", "diem": 10, "url": "https://...", "cau_hoi": "câu hỏi xác minh", "dap_an": "đáp án ngắn"}, ... 2 nhiệm vụ ],
  "loi_moi": { "zalo": "...", "facebook": "...", "messenger": "...", "telegram": "...", "copy": "..." }
}
Lời mời soạn theo giọng tự nhiên như bạn bè nhắn nhau, mỗi kênh một kiểu. Toàn bộ tiếng Việt.

QUY TẮC ĐỊNH DẠNG BẮT BUỘC (để JSON luôn hợp lệ):
- Chỉ in JSON thuần, không có chữ nào trước/sau, không bọc trong khối mã markdown.
- Trong MỌI giá trị chuỗi: KHÔNG dùng dấu ngoặc kép. Nếu cần nhấn mạnh hay trích tên, dùng « ». KHÔNG xuống dòng giữa chuỗi. KHÔNG có dấu phẩy thừa trước } hoặc ].`;

function dungPrompt(input: { thuongHieu: string; website: string; sanPham: string; doiTuong: string; ganeQua: string }): string {
  return `${HUONG_DAN}

Thông tin doanh nghiệp:
- Thương hiệu: ${input.thuongHieu}
- Website: ${input.website || "(chưa có)"}
- Sản phẩm/khoá học: ${input.sanPham}
- Khách hàng mục tiêu: ${input.doiTuong}
- Ý tưởng quà/ngân sách: ${input.ganeQua || "(tự đề xuất, ưu tiên quà số chi phí biên thấp)"}`;
}

/** Gọi CLI `claude` (gói sub). Trả về chuỗi text kết quả (là JSON của chiến dịch). */
function goiCli(prompt: string): Promise<string> {
  const args = ["-p", prompt, "--output-format", "json", "--model", MODEL_AI];
  const opts = { timeout: 180_000, maxBuffer: 16 * 1024 * 1024, env: process.env };
  const chay = (bin: string) =>
    new Promise<string>((resolve, reject) => {
      execFile(bin, args, opts, (err, stdout, stderr) => {
        if (err) return reject(err);
        try {
          const j = JSON.parse(stdout);
          if (j.is_error || j.subtype !== "success") return reject(new Error(j.result || stderr || "CLI trả lỗi"));
          resolve(String(j.result ?? ""));
        } catch {
          resolve(stdout); // phòng khi output không phải JSON bao ngoài
        }
      });
    });
  // Thử "claude" trong PATH; nếu không thấy, thử ~/.local/bin/claude
  return chay("claude").catch((e) => {
    if (String(e).includes("ENOENT")) return chay(`${homedir()}/.local/bin/claude`);
    throw e;
  });
}

/** Gọi SDK (API key). */
async function goiApi(prompt: string): Promise<string> {
  const client = new Anthropic();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await client.messages.create({
    model: MODEL_AI, max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  });
  if (res.stop_reason === "refusal") throw new Error("Yêu cầu bị bộ lọc an toàn từ chối — thử mô tả sản phẩm/quà khác đi.");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.content.find((b: any) => b.type === "text")?.text || "";
}

export async function taoChienDichBangAI(input: {
  thuongHieu: string; website: string; sanPham: string; doiTuong: string; ganeQua: string;
}): Promise<{ ok: true; spec: SpecChienDich } | { ok: false; loi: string }> {
  const prompt = dungPrompt(input);
  const che = cheDoAI();
  let loiCuoi = "";
  // Model đôi khi in JSON lỗi (ngoặc kép lồng) — thử lại tối đa 3 lần, mỗi lần sinh độc lập.
  for (let lan = 1; lan <= 3; lan++) {
    try {
      const text = che === "api" ? await goiApi(prompt) : await goiCli(prompt);
      if (!text.trim()) { loiCuoi = "AI trả kết quả rỗng"; continue; }
      try {
        const spec = JSON.parse(bocJson(text)) as SpecChienDich;
        if (!spec.ten || !Array.isArray(spec.moc_qua)) { loiCuoi = "thiếu trường bắt buộc"; continue; }
        return { ok: true, spec };
      } catch (pe) {
        loiCuoi = "JSON lỗi";
        console.error(`[AI] parse fail lần ${lan}:`, String(pe), "| raw 300:", text.slice(0, 300));
        continue; // sinh lại
      }
    } catch (e) {
      const loi = String(e);
      // Lỗi hạ tầng (không phải lỗi định dạng) → dừng ngay, báo rõ
      if (loi.includes("ENOENT"))
        return { ok: false, loi: "Chưa cài Claude CLI trên máy chủ. Cài `claude` rồi chạy `claude` + /login bằng gói subscription, hoặc điền ANTHROPIC_API_KEY vào .env." };
      if (loi.includes("authentication") || loi.includes("401") || loi.includes("Invalid API key") || loi.includes("Could not resolve") || loi.toLowerCase().includes("login"))
        return { ok: false, loi: "AI chưa xác thực. Với gói sub: chạy `claude` rồi /login trên máy chủ. Với API: điền ANTHROPIC_API_KEY vào .env." };
      loiCuoi = loi.slice(0, 200);
    }
  }
  return { ok: false, loi: `AI chưa tạo được sau 3 lần (${loiCuoi}) — bấm tạo lại giúp em, hoặc mô tả sản phẩm/quà rõ hơn.` };
}
