import { createClient } from "@supabase/supabase-js";

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

// Emoji map để mapType trả về đúng emoji theo type DB
const ROOM_EMOJI_BY_DB_TYPE: Record<string, string> = {
  family:          "🛏️",
  deluxe_queen:    "👑",
  deluxe_double:   "🌿",
  standard_double: "🏔️",
  single:          "☁️",
};

function mapDbTypeToRoomType(dbType: string): Room["type"] {
  if (dbType === "family")            return "Family";
  if (dbType.startsWith("deluxe"))    return "Deluxe";
  if (dbType.startsWith("standard"))  return "Standard";
  return "Single";
}

// Fetch giá phòng từ Supabase — dùng trong Server Component
// Revalidate qua Next.js fetch cache, không dùng trực tiếp ở đâu khác
export async function getRooms(): Promise<Room[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data, error } = await supabase
    .from("rooms")
    .select("id, name, type, capacity, base_price")
    .eq("is_active", true)
    .order("id");

  if (error || !data) {
    // Fallback về ROOMS tĩnh nếu DB lỗi
    return ROOMS;
  }

  return data.map((r) => ({
    id: r.id,
    name: r.name,
    type: mapDbTypeToRoomType(r.type),
    capacity: r.capacity,
    price: r.base_price,
    emoji: ROOM_EMOJI_BY_DB_TYPE[r.type] ?? "🛏️",
  }));
}
