import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { VALID_ROOM_IDS, ROOM_NAME, fmtVND } from "@/lib/rooms";

// Validation server-side — chống bypass client. Khớp schema booking_requests.
const bookingSchema = z
  .object({
    name: z.string().trim().min(2, "Tên quá ngắn").max(100),
    phone: z
      .string()
      .trim()
      .min(8, "SĐT không hợp lệ")
      .max(20)
      .regex(/^[0-9+\s().-]+$/, "SĐT chỉ chứa số và ký tự + - ( )"),
    email: z.string().trim().email("Email không hợp lệ").max(150).optional().or(z.literal("")),
    room_id: z.enum(VALID_ROOM_IDS as [string, ...string[]], {
      errorMap: () => ({ message: "Phòng không hợp lệ" }),
    }),
    check_in: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày check-in không hợp lệ"),
    check_out: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày check-out không hợp lệ"),
    note: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  .refine((d) => d.check_out > d.check_in, {
    message: "Check-out phải sau check-in",
    path: ["check_out"],
  })
  .refine((d) => d.check_in >= new Date().toISOString().split("T")[0], {
    message: "Check-in không thể ở quá khứ",
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
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Dữ liệu không hợp lệ";
    return NextResponse.json({ ok: false, error: firstError }, { status: 400 });
  }

  const d = parsed.data;

  // INSERT vào staging table booking_requests (status mặc định 'pending' do DB).
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
      { ok: false, error: "Không thể gửi yêu cầu. Vui lòng gọi 0969 975 935." },
      { status: 500 }
    );
  }

  // Await notify trước khi return — tránh serverless tắt sớm.
  await notifyTelegram(d);

  return NextResponse.json({ ok: true });
}
