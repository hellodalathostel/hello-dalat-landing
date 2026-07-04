// =====================================================================
// lib/content.ts — Nội dung tĩnh cho các section mới (v2)
// Mọi text guest-facing = English. Comment nội bộ = tiếng Việt.
// =====================================================================

// ---------------------------------------------------------------
// ẢNH — bật cờ này sau khi đã bỏ ảnh vào public/images/
// Xem SHOTLIST.md ở root repo để biết cần chụp gì.
// ---------------------------------------------------------------
export const HAS_PHOTOS = false;

export const HERO_IMAGE = "/images/hero.jpg";

// Map room id → ảnh. Thiếu ảnh nào thì card đó fallback về emoji.
export const ROOM_IMAGES: Record<string, string> = {
  "101": "/images/rooms/101.jpg",
  "201": "/images/rooms/201.jpg",
  "102": "/images/rooms/102.jpg",
  "202": "/images/rooms/202.jpg",
  "103": "/images/rooms/103.jpg",
  "203": "/images/rooms/203.jpg",
  "301": "/images/rooms/301.jpg",
  "302": "/images/rooms/302.jpg",
};

// ---------------------------------------------------------------
// PROOF STRIP — dải trust ngay dưới hero
// BOOKING_SCORE: điền điểm thật từ Booking.com (vd "9.2") rồi item
// thứ 4 sẽ tự hiển thị. Để null = ẩn.
// ---------------------------------------------------------------
export const BOOKING_SCORE: string | null = null; // TODO(Hiếu): điền điểm Booking.com thật

export interface ProofItem {
  num: string;
  label: string;
}

export const PROOF_ITEMS: ProofItem[] = [
  { num: "8", label: "rooms only — small by design" },
  { num: "5 min", label: "walk to the night market" },
  { num: "Family-run", label: "hosts on site, every day" },
  ...(BOOKING_SCORE ? [{ num: BOOKING_SCORE, label: "guest score on Booking.com" }] : []),
];

// ---------------------------------------------------------------
// TESTIMONIALS — ⚠️ PLACEHOLDER, KHÔNG ĐƯỢC DEPLOY KHI ĐANG BẬT
// Giữ SHOW_TESTIMONIALS = false cho tới khi thay 3 entry dưới đây
// bằng review THẬT từ Booking.com (paraphrase ngắn, tên + quốc tịch
// thật). Không bịa review cho khách xem.
// ---------------------------------------------------------------
export const SHOW_TESTIMONIALS = false;

export interface Testimonial {
  quote: string;
  name: string;
  country: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "[Replace with a real Booking.com review — short, specific, in the guest's own words.]",
    name: "Guest name",
    country: "Country",
  },
  {
    quote: "[Replace with a real Booking.com review.]",
    name: "Guest name",
    country: "Country",
  },
  {
    quote: "[Replace with a real Booking.com review.]",
    name: "Guest name",
    country: "Country",
  },
];

// ---------------------------------------------------------------
// TOURS — đối tác Viet Challenge Tours (Mr. Chung). KHÔNG đặt link
// ngoài: khách liên hệ hostel để book (quyết định 04/07/2026 —
// giữ khách trong funnel của hostel).
// ---------------------------------------------------------------
export interface Tour {
  icon: string;
  name: string;
  desc: string;
}

export const TOURS: Tour[] = [
  {
    icon: "🧗",
    name: "Canyoning Đà Lạt",
    desc:
      "Abseil down waterfalls, zipline and cliff-jump through Datanla canyon with Viet Challenge Tours — winner of TripAdvisor's Best of the Best. Ask us at the desk and we'll book it for you.",
  },
  {
    icon: "🏞️",
    name: "Top Sights & Waterfalls day tour",
    desc:
      "One easy, fun day covering Đà Lạt's icons: Datanla waterfall with its alpine coaster, Crazy House, Clay Tunnel, a coffee plantation, and go-kart racing. Message us and we'll arrange everything.",
  },
];

// ---------------------------------------------------------------
// FAQ — đáp án đã được Hiếu xác nhận 04/07/2026.
// ---------------------------------------------------------------
export interface Faq {
  q: string;
  a: string;
  link?: { href: string; label: string }; // link phụ hiển thị sau đáp án
}

export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/fKWDDgJ1MxpXrW8eA";

export const FAQS: Faq[] = [
  {
    q: "What time is check-in and check-out?",
    a: "Check-in from 2:00 PM, check-out by 12:00 PM. Arriving earlier or leaving later? Message us — we'll do our best to accommodate.",
  },
  {
    q: "How does direct booking work?",
    a: "Send the form below and we'll confirm availability within a few hours via phone or Zalo. No prepayment needed to request — we'll sort out the details together.",
  },
  {
    q: "Where exactly are you?",
    a: "33/18/2 Phan Đình Phùng, in a quiet lane just off the main street — about 5 minutes on foot to Đà Lạt market and Xuân Hương lake.",
    link: { href: GOOGLE_MAPS_URL, label: "Open in Google Maps →" },
  },
  {
    q: "Is there parking?",
    a: "Motorbike parking is available at the hostel. For cars, ask us in advance and we'll point you to the nearest option.",
  },
  {
    q: "How can I pay?",
    a: "Cash (VND) or Vietnamese bank transfer at check-in. We'll send payment details when we confirm your booking.",
  },
  {
    q: "What's the cancellation policy?",
    a: "Direct bookings are flexible — just message us before your check-in day and we'll cancel free of charge.",
  },
];