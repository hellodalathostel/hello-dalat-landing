import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hellodalathostel.com"),
  title: "Hello Dalat Hostel — Cozy stay in the heart of Đà Lạt",
  description:
    "A cozy 8-room hostel in central Đà Lạt, steps from the market and Xuân Hương lake. Book directly — no OTA markup, flexible cancellation, Zalo support.",
  keywords: ["Đà Lạt hostel", "Dalat hostel", "Hello Dalat", "khách sạn Đà Lạt", "homestay Đà Lạt"],
  openGraph: {
    title: "Hello Dalat Hostel — Cozy stay in the heart of Đà Lạt",
    description:
      "Wake up to misty mornings in Đà Lạt. 8 cozy rooms, central location, direct booking.",
    url: "https://hellodalathostel.com",
    siteName: "Hello Dalat Hostel",
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://hellodalathostel.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
