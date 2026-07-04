import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { VALID_ROOM_IDS, ROOM_NAME } from "@/lib/rooms";

// =====================================================================
// RATE LIMIT — in-memory, $0, không cần Redis.
// Caveat: serverless mỗi instance có Map riêng → limit là "per instance",
// đủ để chặn spam bot thông thường. Nếu sau này cần chặt hơn: Upstash.
// =====================================================================
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 phút
const RATE_MAX = 5; // tối đa 5 request / IP / 10 phút

const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Dọn map định kỳ để không phình bộ nhớ
  if (hits.size > 1000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

// Hôm nay theo giờ Việt Nam — tránh lệch ngày do server chạy UTC.
function todayVN(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
}

// =====================================================================
// VALIDATION — server-side, chống bypass client. Khớp schema
// booking_requests. Error messages = English (guest-facing).
// =====================================================================
const bookingSchema = z
  .object({
    name: z.string().trim().min(2, "Name is too short").max(100),
    phone: z
      .string()
      .trim()
      .min(8, "Please enter a valid phone number")
      .max(20)
      .regex(/^[0-9+\s().-]+$/, "Phone number can only contain digits and + - ( )"),
    email: z.string().trim().email("Please enter a valid email").max(150).optional().or(z.literal("")),
    room_id: z.enum(VALID_ROOM_IDS as [string, ...string[]], {
      errorMap: () => ({ message: "Please select a valid room" }),
    }),
    check_in: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid check-in date"),
    check_out: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid check-out date"),
    note: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  .refine((d) => d.check_out > d.check_in, {
    message: "Check-out must be after check-in",
    path: ["check_out"],
  })
  .refine((d) => d.check_in >= todayVN(), {
    message: "Check-in date can't be in the past",
    path: ["check_in"],
  });

// Gửi thông báo Telegram cho Hiếu — lỗi notify KHÔNG làm fail booking.
async function notifyTelegram(data: z.infer<typeof bookingSchema>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const roomName = ROOM_NAME[data.room_id] ?? data.room_id;
  const text = [
    "🔔 *Yêu cầu đặt phòng mới*",
    "",
    `👤 ${data.name}`,
    `📞 ${data.phone}`,
    data.email ? `✉️ ${data.email}` : null,
    `🛏️ Phòng ${data.room_id} — ${roomName}`,
    `📅 ${data.check_in} → ${data.check_out}`,
    data.note ? `📝 ${data.note}` : null,
    "",
    "_Xử lý trong PMS → Booking Requests_",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
  } catch (err) {
    console.error("[booking] Telegram notify failed:", err);
  }
}

export async function POST(req: NextRequest) {
  // 1) Rate limit theo IP
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a few minutes, or call +84 969 975 935." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // 2) Honeypot — bot điền field ẩn "website" → trả ok giả, không insert,
  //    không báo lỗi để bot không biết đường lách.
  if (typeof body === "object" && body !== null && (body as Record<string, unknown>).website) {
    return NextResponse.json({ ok: true });
  }

  // 3) Zod validate
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Invalid request";
    return NextResponse.json({ ok: false, error: firstError }, { status: 400 });
  }

  const d = parsed.data;

  // 4) INSERT vào staging table booking_requests (status mặc định 'pending' do DB).
  const { error } = await supabase.from("booking_requests").insert({
    name: d.name,
    phone: d.phone,
    email: d.email || null,
    room_id: d.room_id,
    check_in: d.check_in,
    check_out: d.check_out,
    note: d.note || null,
  });

  if (error) {
    console.error("[booking] insert failed:", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't send your request. Please call +84 969 975 935." },
      { status: 500 }
    );
  }

  // 5) Await notify trước khi return — tránh serverless tắt sớm.
  await notifyTelegram(d);

  return NextResponse.json({ ok: true });
}