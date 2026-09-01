// Next.js instrumentation: chạy cron nội bộ 5 phút/lần (F27 tự chốt campaign, F38 nhắc im ắng, email queue)
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { chayCron } = await import("./services/cron");
    setInterval(() => {
      chayCron().then((kq) => { if (kq !== "không có gì để làm") console.log("[cron]", kq); })
        .catch((e) => console.error("[cron] lỗi:", e));
    }, 5 * 60 * 1000);
  }
}
