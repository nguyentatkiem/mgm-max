// F51 — Referral AI: khai brand/sản phẩm/đối tượng → Claude sinh trọn chiến dịch
import Anthropic from "@anthropic-ai/sdk";

export type SpecChienDich = {
  ten: string; slug: string; mo_ta: string;
  giai_boc_tham: string; qua_chao_mung: string; qua_chao_mung_gia_tri: string;
  moc_qua: { nguong: number; ten_qua: string; loai_qua: "coupon" | "file" | "link" | "khac"; goi_y_gia_tri: string }[];
  hanh_dong: { ten: string; mo_ta: string; diem: number; url: string; cau_hoi: string; dap_an: string }[];
  loi_moi: Record<string, string>;
};

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["ten", "slug", "mo_ta", "giai_boc_tham", "qua_chao_mung", "qua_chao_mung_gia_tri", "moc_qua", "hanh_dong", "loi_moi"],
  properties: {
    ten: { type: "string", description: "Tên chiến dịch hấp dẫn, tiếng Việt, có yếu tố mời bạn nhận quà" },
    slug: { type: "string", description: "slug ascii thường, gạch nối" },
    mo_ta: { type: "string", description: "1-2 câu mô tả trên trang đăng ký" },
    giai_boc_tham: { type: "string", description: "giải đặc biệt bốc thăm, hấp dẫn nhưng khả thi" },
    qua_chao_mung: { type: "string", description: "quà cho NGƯỜI ĐƯỢC MỜI khi xác minh" },
    qua_chao_mung_gia_tri: { type: "string", description: "mã coupon gợi ý, VD WELCOME10" },
    moc_qua: {
      type: "array",
      items: {
        type: "object", additionalProperties: false,
        required: ["nguong", "ten_qua", "loai_qua", "goi_y_gia_tri"],
        properties: {
          nguong: { type: "integer", description: "số bạn xác minh: 1, 3, 5, 10" },
          ten_qua: { type: "string" },
          loai_qua: { type: "string", enum: ["coupon", "file", "link", "khac"] },
          goi_y_gia_tri: { type: "string", description: "mã/link gợi ý; rỗng nếu loai=khac" },
        },
      },
    },
    hanh_dong: {
      type: "array",
      items: {
        type: "object", additionalProperties: false,
        required: ["ten", "mo_ta", "diem", "url", "cau_hoi", "dap_an"],
        properties: {
          ten: { type: "string" }, mo_ta: { type: "string" },
          diem: { type: "integer" }, url: { type: "string" },
          cau_hoi: { type: "string", description: "câu hỏi xác minh đã làm nhiệm vụ" },
          dap_an: { type: "string", description: "đáp án ngắn gọn" },
        },
      },
    },
    loi_moi: {
      type: "object", additionalProperties: false,
      required: ["zalo", "facebook", "messenger", "telegram", "copy"],
      properties: {
        zalo: { type: "string" }, facebook: { type: "string" }, messenger: { type: "string" },
        telegram: { type: "string" }, copy: { type: "string" },
      },
      description: "lời mời soạn sẵn theo giọng từng kênh, tiếng Việt, thân mật",
    },
  },
} as const;

export async function taoChienDichBangAI(input: {
  thuongHieu: string; website: string; sanPham: string; doiTuong: string; ganeQua: string;
}): Promise<{ ok: true; spec: SpecChienDich } | { ok: false; loi: string }> {
  try {
    const client = new Anthropic(); // đọc ANTHROPIC_API_KEY hoặc profile `ant auth login`
    const prompt = `Bạn là chuyên gia growth marketing Việt Nam, thiết kế chiến dịch viral member-get-member (mời bạn nhận quà, KHÔNG trả hoa hồng tiền mặt) cho:
- Thương hiệu: ${input.thuongHieu}
- Website: ${input.website || "(chưa có)"}
- Sản phẩm/khoá học: ${input.sanPham}
- Khách hàng mục tiêu: ${input.doiTuong}
- Ngân sách/ý tưởng quà (nếu có): ${input.ganeQua || "(tự đề xuất, ưu tiên quà số chi phí biên thấp)"}

Thiết kế trọn chiến dịch: 4 mốc quà theo số bạn xác minh (1/3/5/10, giá trị tăng dần, mốc cao nhất thật hấp dẫn), 1 giải bốc thăm đặc biệt, quà chào mừng hai chiều cho người được mời, 2 nhiệm vụ cộng điểm (có câu hỏi xác minh trả lời được sau khi làm), và lời mời soạn sẵn cho từng kênh (Zalo/Facebook/Messenger/Telegram/copy — giọng tự nhiên như bạn bè nhắn nhau, mỗi kênh một kiểu). Toàn bộ tiếng Việt.`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await (client.beta.messages.create as any)({
      model: "claude-opus-5",
      max_tokens: 8000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default", // request bị bộ lọc từ chối sẽ tự chạy lại trên model dự phòng
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
      messages: [{ role: "user", content: prompt }],
    });
    if (res.stop_reason === "refusal") {
      return { ok: false, loi: "Yêu cầu bị bộ lọc an toàn từ chối — thử mô tả sản phẩm/quà khác đi." };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const text = res.content.find((b: any) => b.type === "text")?.text || "";
    return { ok: true, spec: JSON.parse(text) as SpecChienDich };
  } catch (e) {
    const loi = String(e);
    if (loi.includes("authentication") || loi.includes("401") || loi.includes("api_key") || loi.includes("Could not resolve"))
      return { ok: false, loi: "Chưa có API key Anthropic. Thêm ANTHROPIC_API_KEY vào .env (hoặc đăng nhập `ant auth login`) rồi khởi động lại." };
    return { ok: false, loi: loi.slice(0, 300) };
  }
}
