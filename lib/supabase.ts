import { createClient } from "@supabase/supabase-js";

// Client dùng anon key — chỉ cho API route server-side.
// RLS policy "anon_insert_booking_request" cho phép INSERT vào booking_requests.
// Không expose service_role ra ngoài.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});
