import "../globals.css";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0d0d0d] text-white">{children}</body>
    </html>
  );
}
