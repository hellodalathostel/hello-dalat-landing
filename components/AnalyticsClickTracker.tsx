"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsProps } from "@/lib/analytics";

// Lắng nghe click toàn trang (event delegation) để page.tsx giữ nguyên là server component.
// Cách gắn:
//   - CTA đặt phòng: <a data-track="booking_cta_click" data-track-location="hero" data-track-room="101">
//   - Link liên hệ / Booking.com: tự nhận theo href (tel:, mailto:, zalo.me, wa.me, booking.com)
//     — có thể thêm data-track-location để biết vị trí nút.
// Không bao giờ gửi href/text của link (tránh lọt SĐT, email vào event).

type ContactChannel = "phone" | "zalo" | "whatsapp" | "email";

function detectContactChannel(href: string): ContactChannel | null {
  const h = href.trim().toLowerCase();
  if (h.startsWith("tel:")) return "phone";
  if (h.startsWith("mailto:")) return "email";
  if (h.startsWith("whatsapp:")) return "whatsapp";
  try {
    const host = new URL(h, window.location.href).hostname;
    if (host === "zalo.me" || host.endsWith(".zalo.me")) return "zalo";
    if (host === "wa.me" || host === "whatsapp.com" || host.endsWith(".whatsapp.com")) {
      return "whatsapp";
    }
  } catch {
    // href không parse được → không phải link liên hệ
  }
  return null;
}

function isBookingComLink(href: string): boolean {
  try {
    const host = new URL(href, window.location.href).hostname.toLowerCase();
    return host === "booking.com" || host.endsWith(".booking.com");
  } catch {
    return false;
  }
}

// Vị trí nút: ưu tiên data-track-location, sau đó id của section/nav/footer gần nhất.
function resolveLocation(el: Element): string {
  const explicit = el.getAttribute("data-track-location");
  if (explicit) return explicit;
  const section = el.closest("section[id], nav, footer, header");
  if (section) return section.id || section.tagName.toLowerCase();
  return "page";
}

function handleClick(e: MouseEvent): void {
  const target = e.target;
  if (!(target instanceof Element)) return;

  // 1) Phần tử gắn data-track tường minh
  const tracked = target.closest<HTMLElement>("[data-track]");
  if (tracked && tracked.dataset.track === "booking_cta_click") {
    const props: AnalyticsProps = { location: resolveLocation(tracked) };
    if (tracked.dataset.trackRoom) props.room = tracked.dataset.trackRoom;
    trackEvent("booking_cta_click", props);
    return;
  }

  // 2) Link tự nhận theo href
  const link = target.closest<HTMLAnchorElement>("a[href]");
  if (!link) return;
  const href = link.getAttribute("href") ?? "";

  if (isBookingComLink(href)) {
    trackEvent("booking_com_click", { location: resolveLocation(link) }, { outbound: true });
    return;
  }

  const channel = detectContactChannel(href);
  if (channel) {
    trackEvent(
      "contact_click",
      { channel, location: resolveLocation(link) },
      { outbound: true }
    );
  }
}

export default function AnalyticsClickTracker() {
  useEffect(() => {
    // capture phase: bắt được click kể cả khi link điều hướng ngay (tel:, zalo.me)
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
