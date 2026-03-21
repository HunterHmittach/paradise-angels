import "./globals.css";
import type { ReactNode } from "react";
import CartProvider from "@/app/(site)/components/cart/CartContext";

export const metadata = {
  title: "Paradise Angels",
  description: "Luxury Streetwear",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}