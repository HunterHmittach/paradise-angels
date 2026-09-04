"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const collectionHasItsOwnNavbar = pathname.startsWith("/shop");

  return (
    <>
      {!collectionHasItsOwnNavbar && <Navbar />}
      <main>{children}</main>
    </>
  );
}
