# Hello Dalat Landing

Landing page + direct booking form cho Hello Dalat Hostel.
Domain: `hellodalathostel.com`

## Stack
Next.js 15 (App Router) · React 19 · TypeScript · Supabase JS · Zod

## Booking flow
```
Khách điền form → POST /api/booking
  → Zod validate (server)
  → INSERT booking_requests (status='pending', RLS anon)
  → Telegram notify Hiếu (chạy nền)
Hiếu xử lý trong PMS → Booking Requests
```

## Chạy local
```bash
npm install
cp .env.example .env.local   # điền giá trị thật
npm run dev                  # http://localhost:3000
```

## Env variables (set trên Vercel + .env.local)
| Key | Giá trị | Ghi chú |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rcfhhgywjdwqcgnpkbtl.supabase.co` | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon key) | Public — RLS bảo vệ |
| `TELEGRAM_BOT_TOKEN` | (bot token) | **Server-only** — không có prefix NEXT_PUBLIC |
| `TELEGRAM_CHAT_ID` | `-1003912419720` | Server-only |

> ⚠️ `TELEGRAM_BOT_TOKEN` KHÔNG được có tiền tố `NEXT_PUBLIC_` — nếu không sẽ lộ ra client.

## Deploy Vercel
1. Push repo lên GitHub: `hellodalathostel/hello-dalat-landing`
2. Vercel → New Project → import repo → framework tự nhận Next.js
3. Thêm 4 env variables ở trên
4. Settings → Domains → thêm `hellodalathostel.com` + `www.hellodalathostel.com`
5. Deploy

## Cập nhật phòng / giá
Sửa `lib/rooms.ts` — đồng bộ thủ công với `public.rooms`.
(Không fetch real-time để tránh lộ lịch phòng + giảm phụ thuộc.)

## Dữ liệu
- Bảng: `public.booking_requests` (đã có RLS cho anon INSERT)
- Không tạo bảng mới, không migration.
