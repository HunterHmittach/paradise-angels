"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, User, Shield } from "lucide-react";
import LogoMark from "./LogoMark";
import supabase from "@/lib/supabase";

const ADMIN_EMAILS = ["hunterhmittach@gmail.com", "m.hmittach@gmail.com"];

type CartItem = {
  quantity: number;
};

export default function Navbar() {
  const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setScrolled(latest > 80);
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

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = localStorage.getItem("cart");
      const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };

    updateCartCount();
    window.addEventListener("cart-updated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const scale = useTransform(scrollY, [0, 180], [1, 0.96]);

  return (
    <motion.nav className="fixed top-0 left-0 w-full z-50 border-b border-black/10 bg-[#f4f1ea]/92 text-black backdrop-blur-xl transition-all duration-700">
      <motion.div
        style={{ scale }}
        className="flex items-center justify-between px-8 md:px-24 py-7"
      >
        <LogoMark />

        <div className="hidden lg:flex gap-16 text-xs tracking-[0.42em] uppercase">
          <Link href="/" className="hover:opacity-50 transition">
            Home
          </Link>
          <Link href="/about" className="hover:opacity-50 transition">
            About
          </Link>
          <Link href="/shop" className="hover:opacity-50 transition">
            Shop
          </Link>
          <Link href="/contact" className="hover:opacity-50 transition">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-7">
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 uppercase tracking-[0.3em] text-[10px] hover:opacity-50 transition"
            >
              <Shield size={16} />
              {!scrolled && <span className="hidden md:block">Admin</span>}
            </Link>
          )}

          <Link
            href="/account"
            className="flex items-center gap-2 uppercase tracking-[0.3em] text-[10px] hover:opacity-50 transition"
          >
            <User size={16} />
            <span className="hidden md:block">Account</span>
          </Link>

          <Link href="/cart" className="relative flex items-center">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
}