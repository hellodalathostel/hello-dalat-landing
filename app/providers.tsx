"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

// Khởi tạo PostHog một lần ở client.
// Thiếu NEXT_PUBLIC_POSTHOG_KEY (vd: dev local) → bỏ qua, không gửi dữ liệu, không throw.
function initPostHog(): void {
  if (typeof window === "undefined") return;
  if (!POSTHOG_KEY) return;
  if (posthog.__loaded) return; // tránh init lặp (React StrictMode chạy effect 2 lần ở dev)

  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: "history_change",
      respect_dnt: true,
      session_recording: { maskAllInputs: true },
    });
  } catch {
    // Analytics không được phép làm hỏng trang — nuốt lỗi.
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return <>{children}</>;
}
