import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ENT 312 CBT Practice",
  description:
    "Computer-based test practice for Entrepreneurship and Venture Creation (ENT 312)",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ENT 312 CBT",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
