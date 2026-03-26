"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import LogoMark from "./LogoMark";

export default function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  /* Detect scroll */
  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setScrolled(latest > 120);
    });
  }, [scrollY]);

  /* Background transition */
  const background = useTransform(
    scrollY,
    [0, 200],
    ["rgba(255,255,255,0)", "rgba(244,241,234,0.92)"]
  );

  /* Proper blur as string */
  const backdropBlur = useTransform(
    scrollY,
    [0, 200],
    ["blur(0px)", "blur(20px)"]
  );

  /* Always dark text (no white glitch) */
  const textColor = useTransform(
    scrollY,
    [0, 200],
    ["#111111", "#000000"]
  );

  /* Elegant scale shrink */
  const scale = useTransform(scrollY, [0, 200], [1, 0.9]);

  /* Subtle opacity shift */
  const opacity = useTransform(scrollY, [0, 200], [1, 0.85]);

  return (
    <>
      {/* Scroll Progress Line */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-neutral-400 origin-left z-[60]"
      />

      <motion.nav
        style={{ background, backdropFilter: backdropBlur }}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-700"
      >
        <motion.div
          style={{ color: textColor, scale, opacity }}
          className="flex items-center justify-between px-12 md:px-24 py-8 transition-all duration-700"
        >
          {/* Left Logo */}
          <div className="flex items-center gap-4">
            <LogoMark />
          </div>

          {/* Center Menu (only hero state) */}
          {!scrolled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="flex gap-16 text-xs tracking-[0.45em] uppercase"
            >
              <Link
                href="/"
                className="relative group transition-all duration-500"
              >
                Home
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-black transition-all duration-500 group-hover:w-full" />
              </Link>

              <Link
                href="/about"
                className="relative group transition-all duration-500"
              >
                About
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-black transition-all duration-500 group-hover:w-full" />
              </Link>

              <Link
                href="/shop"
                className="relative group transition-all duration-500"
              >
                Shop
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-black transition-all duration-500 group-hover:w-full" />
              </Link>

              <Link
                href="/contact"
                className="relative group transition-all duration-500"
              >
                Contact
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-black transition-all duration-500 group-hover:w-full" />
              </Link>
            </motion.div>
          )}

          {/* Cart Icon */}
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