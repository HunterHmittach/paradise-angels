import "./globals.css";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Paradise Angels",
  description: "Luxury Streetwear",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f4f1ea] text-black">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
