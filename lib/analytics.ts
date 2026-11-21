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
export function trackEvent(name: AnalyticsEvent, props?: AnalyticsProps): void {
  if (typeof window === "undefined") return;
  try {
    if (!posthog.__loaded) return;
    posthog.capture(name, props);
  } catch {
    // Analytics lỗi không được ảnh hưởng trải nghiệm khách.
  }
}
