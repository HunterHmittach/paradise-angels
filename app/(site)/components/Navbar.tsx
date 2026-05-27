"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, User, Shield } from "lucide-react";
import LogoMark from "./LogoMark";
import supabase from "@/lib/supabase";

const ADMIN_EMAILS = [
  "hunterhmittach@gmail.com",
  "m.hmittach@gmail.com",
];

type CartItem = {
  quantity: number;
};

export default function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();

  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setScrolled(latest > 120);
    });
  }, [scrollY]);

  useEffect(() => {
    async function checkAdmin() {
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email?.toLowerCase() || "";

      setIsAdmin(ADMIN_EMAILS.includes(email));
    }

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = localStorage.getItem("cart");
      const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

      const count = cart.reduce((sum, item) => sum + item.quantity, 0);

      setCartCount(count);
    };

    updateCartCount();

    window.addEventListener("cart-updated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const background = useTransform(
    scrollY,
    [0, 200],
    ["rgba(0,0,0,0)", "rgba(244,241,234,0.85)"]
  );

  const blur = useTransform(scrollY, [0, 200], [0, 20]);

  const textColor = useTransform(scrollY, [0, 200], ["#000000", "#000000"]);

  const scale = useTransform(scrollY, [0, 200], [1, 0.85]);

  return (
    <>
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-neutral-400 origin-left z-[60]"
      />

      <motion.nav
        style={{ background, backdropFilter: blur }}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-700"
      >
        <motion.div
          style={{ color: textColor, scale }}
          className="flex items-center justify-between px-12 md:px-24 py-8 transition-all duration-700"
        >
          <LogoMark />

          {!scrolled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="flex gap-16 text-xs tracking-[0.4em] uppercase"
            >
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/contact">Contact</Link>
            </motion.div>
          )}

          <div className="flex items-center gap-8">
            {isAdmin && (
              <Link
                href="/admin"
                className="group flex items-center gap-2 uppercase tracking-[0.3em] text-[10px]"
              >
                <Shield
                  size={16}
                  className="transition-all duration-500 group-hover:scale-110"
                />

                {!scrolled && (
                  <span className="hidden md:block">
                    Admin
                  </span>
                )}
              </Link>
            )}

            <Link
              href="/account"
              className="group flex items-center gap-2 uppercase tracking-[0.3em] text-[10px]"
            >
              <User
                size={16}
                className="transition-all duration-500 group-hover:scale-110"
              />

              {!scrolled && (
                <span className="hidden md:block">
                  Account
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative group flex items-center justify-center"
            >
              <ShoppingBag
                size={18}
                className="transition-all duration-500 group-hover:scale-110"
              />

              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
}