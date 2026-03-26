"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import LogoMark from "./LogoMark";

export default function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setScrolled(latest > 120);
    });
  }, [scrollY]);

  const background = useTransform(
    scrollY,
    [0, 200],
    ["rgba(0,0,0,0)", "rgba(244,241,234,0.85)"]
  );

  const blur = useTransform(scrollY, [0, 200], [0, 20]);

  const textColor = useTransform(
    scrollY,
    [0, 200],
    ["#000000", "#000000"]
  );

  const scale = useTransform(scrollY, [0, 200], [1, 0.85]);

  return (
    <>
      {/* Scroll progress line */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-neutral-400 origin-left z-[60]"
      />

      <motion.nav
        style={{
          background,
          backdropFilter: blur.get() ? `blur(${blur.get()}px)` : undefined,
        }}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-700"
      >
        <motion.div
          style={{ color: textColor, scale }}
          className="flex items-center justify-between px-12 md:px-24 py-8 transition-all duration-700"
        >
          {/* Logo */}
          <LogoMark />

          {/* Full menu only in hero */}
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

          {/* Cart always visible */}
          <Link
            href="/cart"
            className="relative group flex items-center justify-center"
          >
            <ShoppingBag
              size={18}
              className="transition-all duration-500 group-hover:scale-110"
            />
          </Link>
        </motion.div>
      </motion.nav>
    </>
  );
}