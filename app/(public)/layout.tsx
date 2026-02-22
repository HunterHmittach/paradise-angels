import type { ReactNode } from "react";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      style={{ background: "black", color: "white" }}
      className="min-h-screen flex items-center justify-center"
    >
      {children}
    </div>
  );
}
