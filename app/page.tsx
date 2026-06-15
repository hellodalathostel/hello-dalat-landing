import { getRooms, fmtVND, type Room } from "@/lib/rooms";
import BookingForm from "@/components/BookingForm";
import "./page.css";

export const revalidate = 3600;

const THUMB_BG: Record<string, string> = {
  Deluxe: "#e8f0ec",
  Family: "#f0ebe0",
  Standard: "#eaecf0",
  Single: "#f4f4f4",
};

export default async function Home() {
  const rooms = await getRooms();
  return (
    <main className="ld-root">
      {/* NAV */}
      <nav className="ld-nav">
        <div className="ld-nav-logo">
          Hello <span>Dalat</span>
        </div>
        <div className="ld-nav-links">
          <a href="#rooms">Rooms</a>
          <a href="#about">About</a>
          <a href="#booking" className="ld-btn-book">
            Book now
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="ld-hero">
        <div className="ld-hero-mist" />
        <div className="ld-hero-lines" />
        <div className="ld-hero-content">
          <p className="ld-hero-eyebrow">Đà Lạt · Vietnam</p>
          <h1 className="ld-hero-title">
            Wake up to
            <br />
            <em>misty mornings</em>
            <br />
            in Đà Lạt
          </h1>
          <p className="ld-hero-sub">
            A cozy hostel tucked in the heart of the city — steps from the market, the lake, and the
            best cà phê in town.
          </p>
          <a href="#booking" className="ld-hero-cta">
            Check availability →
          </a>
        </div>
        <div className="ld-hero-badges">
          <div className="ld-badge">
            <span className="ld-badge-num">8</span>
            <span className="ld-badge-label">Rooms</span>
          </div>
          <div className="ld-badge">
            <span className="ld-badge-num">from 290k</span>
            <span className="ld-badge-label">VND / night</span>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section className="ld-section ld-rooms-bg" id="rooms">
        <div className="ld-rooms-header">
          <p className="ld-section-eyebrow">Accommodations</p>
          <h2 className="ld-section-title">Find your room</h2>
          <p className="ld-section-sub">
            Every room is designed for comfort — clean linens, hot water, fast Wi-Fi, and a view
            worth waking up for.
          </p>
        </div>
        <div className="ld-rooms-grid">
          {rooms.map((r: Room) => (
            <div className="ld-room-card" key={r.id}>
              <div className="ld-room-thumb" style={{ background: THUMB_BG[r.type] }}>
                <span style={{ fontSize: 40 }}>{r.emoji}</span>
              </div>
              <div className="ld-room-body">
                <p className="ld-room-type">{r.type}</p>
                <p className="ld-room-name">{r.name}</p>
                <div className="ld-room-meta">
                  <span className="ld-room-meta-item">
                    👤 {r.capacity} guest{r.capacity > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="ld-room-price-row">
                  <div>
                    <span className="ld-room-price">{fmtVND(r.price)}</span>
                    <span className="ld-room-price-unit"> đ / đêm</span>
                  </div>
                  <a href="#booking" className="ld-room-book-btn">
                    Book
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="ld-section ld-why" id="about">
        <p className="ld-section-eyebrow">Why Hello Dalat</p>
        <h2 className="ld-section-title">
          Small hostel,
          <br />
          big character
        </h2>
        <div className="ld-why-grid">
          <div className="ld-why-item">
            <div className="ld-why-icon">📍</div>
            <p className="ld-why-title">Central location</p>
            <p className="ld-why-desc">
              33/18/2 Phan Đình Phùng — 5 minutes walk to Đà Lạt market and Xuân Hương lake.
            </p>
          </div>
          <div className="ld-why-item">
            <div className="ld-why-icon">🌿</div>
            <p className="ld-why-title">Quiet &amp; clean</p>
            <p className="ld-why-desc">
              A tucked-away lane that keeps the street noise out — sleep well, leave refreshed.
            </p>
          </div>
          <div className="ld-why-item">
            <div className="ld-why-icon">☕</div>
            <p className="ld-why-title">Local knowledge</p>
            <p className="ld-why-desc">
              We know every cà phê, every viewpoint, every back road. Ask us anything.
            </p>
          </div>
          <div className="ld-why-item">
            <div className="ld-why-icon">💬</div>
            <p className="ld-why-title">Direct booking</p>
            <p className="ld-why-desc">
              Book with us directly — no OTA markup, flexible cancellation, Zalo support.
            </p>
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section className="ld-section ld-booking" id="booking">
        <p className="ld-section-eyebrow">Direct booking</p>
        <h2 className="ld-section-title">Reserve your stay</h2>
        <p className="ld-section-sub">
          Fill in the form and we&apos;ll confirm within a few hours via Zalo or phone.
        </p>
        <BookingForm rooms={rooms} />
      </section>

      {/* CONTACT */}
      <div className="ld-contact">
        <div className="ld-contact-info">
          <strong>Hello Dalat Hostel</strong> · 33/18/2 Phan Đình Phùng, Phường 1, Đà Lạt
          <br />
          <span>📞 0969 975 935 · hellodalathostel@gmail.com</span>
        </div>
        <div className="ld-contact-links">
          <a href="https://zalo.me/0969975935" className="ld-contact-link zalo">
            Zalo
          </a>
          <a href="tel:0969975935" className="ld-contact-link">
            Call us
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="ld-footer">
        <div className="ld-footer-logo">
          Hello <span>Dalat</span> Hostel
        </div>
        <div className="ld-footer-addr">MST 068060000252 · Hộ Kinh Doanh Chào Đà Lạt</div>
      </footer>
    </main>
  );
}
