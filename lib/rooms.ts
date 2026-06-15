// Dữ liệu phòng — đồng bộ với public.rooms (snapshot 2026-06).
// Giá hiển thị là base_price; giá thực tế confirm thủ công qua Zalo.
export interface Room {
  id: string;
  name: string;
  type: "Family" | "Deluxe" | "Standard" | "Single";
  capacity: number;
  price: number;
  emoji: string;
}

export const ROOMS: Room[] = [
  { id: "101", name: "Family Room", type: "Family", capacity: 4, price: 750000, emoji: "🛏️" },
  { id: "201", name: "Deluxe Queen", type: "Deluxe", capacity: 2, price: 615000, emoji: "👑" },
  { id: "103", name: "Deluxe Double 1F", type: "Deluxe", capacity: 2, price: 462000, emoji: "🌿" },
  { id: "203", name: "Deluxe Double 2F", type: "Deluxe", capacity: 2, price: 462000, emoji: "🌿" },
  { id: "301", name: "Standard Double A", type: "Standard", capacity: 2, price: 390000, emoji: "🏔️" },
  { id: "302", name: "Standard Double B", type: "Standard", capacity: 2, price: 390000, emoji: "🏔️" },
  { id: "102", name: "Single 1F", type: "Single", capacity: 1, price: 290000, emoji: "☁️" },
  { id: "202", name: "Single 2F", type: "Single", capacity: 1, price: 290000, emoji: "☁️" },
];

// Map id → tên phòng (dùng cho Telegram notify ở server)
export const ROOM_NAME: Record<string, string> = Object.fromEntries(
  ROOMS.map((r) => [r.id, r.name])
);

export const VALID_ROOM_IDS = ROOMS.map((r) => r.id);

export function fmtVND(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(n);
}
