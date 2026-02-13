"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/cart/CartDrawer";
import type { ReactNode } from "react";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Navbar setCartOpen={setCartOpen} />
      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
      <main>{children}</main>
    </>
  );
}
