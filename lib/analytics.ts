import posthog from "posthog-js";

// Tên event cố định — thêm event mới thì thêm vào đây để tránh gõ sai tên.
export type AnalyticsEvent =
  | "booking_cta_click"
  | "booking_com_click"
  | "contact_click"
  | "form_submit";

// Chỉ cho phép giá trị nguyên thuỷ. TUYỆT ĐỐI không truyền tên/SĐT/email/CCCD của khách.
export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

// Gửi event lên PostHog. An toàn khi:
// - chạy ở server (SSR) → bỏ qua
// - PostHog chưa init (thiếu key, bị DNT, adblock) → bỏ qua
// - posthog.capture throw → nuốt lỗi, không làm hỏng UI
// outbound = true: click rời trang (tel:, zalo.me, booking.com) → gửi ngay bằng sendBeacon,
// không chờ batch, để event không bị mất khi trình duyệt chuyển trang.
export function trackEvent(
  name: AnalyticsEvent,
  props?: AnalyticsProps,
  options?: { outbound?: boolean }
): void {
  if (typeof window === "undefined") return;
  try {
    if (!posthog.__loaded) return;
    if (options?.outbound) {
      posthog.capture(name, props, { send_instantly: true, transport: "sendBeacon" });
    } else {
      posthog.capture(name, props);
    }
  } catch {
    // Analytics lỗi không được ảnh hưởng trải nghiệm khách.
  }
}
