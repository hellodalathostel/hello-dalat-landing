"use client";

import { useState } from "react";
import { fmtVND, type Room } from "@/lib/rooms";

type Status = "idle" | "submitting" | "success" | "error";

interface BookingFormProps {
  rooms: Room[];
}

export default function BookingForm({ rooms }: BookingFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    room_id: "",
    check_in: "",
    check_out: "",
    note: "",
    website: "", // honeypot — người thật không bao giờ thấy/điền field này
  });

  const today = new Date().toISOString().split("T")[0];

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Client-side validation cho UX nhanh — server vẫn validate lại bằng Zod.
  function validate(): string | null {
    if (form.name.trim().length < 2) return "Please enter your full name";
    if (form.phone.trim().length < 8) return "Please enter a valid phone number";
    if (!form.room_id) return "Please select a room";
    if (!form.check_in) return "Please pick a check-in date";
    if (!form.check_out) return "Please pick a check-out date";
    if (form.check_out <= form.check_in) return "Check-out must be after check-in";
    return null;
  }

  async function handleSubmit() {
    const err = validate();
    if (err) {
      setErrorMsg(err);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Connection failed. Please call or message us at +84 969 975 935.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bf-success">
        <div className="bf-success-icon">✓</div>
        <p className="bf-success-title">Request sent!</p>
        <p className="bf-success-sub">
          We&apos;ll reach out to confirm your stay within a few hours.
          <br />
          Check your Zalo or phone.
        </p>
      </div>
    );
  }

  return (
    <div className="bf-form">
      <div className="bf-grid">
        <div>
          <label className="bf-label">Full name *</label>
          <input
            className="bf-input"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <label className="bf-label">Phone / WhatsApp / Zalo *</label>
          <input
            className="bf-input"
            type="tel"
            placeholder="+84 912 345 678"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div>
          <label className="bf-label">Email</label>
          <input
            className="bf-input"
            type="email"
            placeholder="optional"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <label className="bf-label">Room *</label>
          <select
            className="bf-input bf-select"
            value={form.room_id}
            onChange={(e) => update("room_id", e.target.value)}
          >
            <option value="">Select a room</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — {fmtVND(r.price)}₫/night
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="bf-label">Check-in *</label>
          <input
            className="bf-input"
            type="date"
            min={today}
            value={form.check_in}
            onChange={(e) => update("check_in", e.target.value)}
          />
        </div>
        <div>
          <label className="bf-label">Check-out *</label>
          <input
            className="bf-input"
            type="date"
            min={form.check_in || today}
            value={form.check_out}
            onChange={(e) => update("check_out", e.target.value)}
          />
        </div>
        <div className="bf-full">
          <label className="bf-label">Special requests</label>
          <textarea
            className="bf-input bf-textarea"
            placeholder="Early check-in, extra bed, any questions..."
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
          />
        </div>
      </div>

      {/* Honeypot — ẩn khỏi người thật, bot auto-fill sẽ điền và bị drop ở server */}
      <div className="bf-hp" aria-hidden="true">
        <label htmlFor="bf-website">Website</label>
        <input
          id="bf-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      {status === "error" && <p className="bf-error">{errorMsg}</p>}

      <button className="bf-submit" onClick={handleSubmit} disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send booking request"}
      </button>
      <p className="bf-note">We&apos;ll confirm via Zalo or phone within 2–4 hours</p>
    </div>
  );
}