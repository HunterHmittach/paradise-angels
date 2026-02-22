import type { ReactNode } from "react";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      {children}
    </div>
  );
}
