// Công thức đo lường thuần cho dashboard.

/** Hệ số viral K = số người xác minh MỚI đến từ giới thiệu ÷ tổng người xác minh không do giới thiệu.
 *  K > 1: mỗi người kéo về hơn 1 người nữa — tự tăng trưởng. */
export function heSoK(xacMinhTuGioiThieu: number, xacMinhTrucTiep: number): number {
  if (xacMinhTrucTiep <= 0) return xacMinhTuGioiThieu > 0 ? Infinity : 0;
  return Math.round((xacMinhTuGioiThieu / xacMinhTrucTiep) * 100) / 100;
}

export function phanTram(tu: number, mau: number): number {
  if (mau <= 0) return 0;
  return Math.round((tu / mau) * 1000) / 10;
}
