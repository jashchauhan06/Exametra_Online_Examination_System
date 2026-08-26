import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exametra",
  description: "Secure assessments. Instant evaluation. Clear results.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
