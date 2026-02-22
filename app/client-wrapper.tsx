"use client";

import { useState } from "react";
import CartDrawer from "./(site)/components/cart/CartDrawer";
import type { ReactNode } from "react";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
      <main>{children}</main>
    </>
  );
}
