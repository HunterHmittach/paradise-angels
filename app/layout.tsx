import "./globals.css";
import type { ReactNode } from "react";

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
      <body>{children}</body>
    </html>
  );
}
