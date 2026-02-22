"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import ClientWrapper from "../client-wrapper";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/cart/CartDrawer";

export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <ClientWrapper>
      <Navbar setCartOpen={setCartOpen} />

      <CartDrawer open={cartOpen} setOpen={setCartOpen} />

      <main>{children}</main>
    </ClientWrapper>
  );
}
