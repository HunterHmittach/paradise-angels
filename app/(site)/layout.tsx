import "../globals.css";
import type { ReactNode } from "react";

import CartProvider from "./components/cart/CartContext";
import ClientWrapper from "../client-wrapper";
// Als jij auth-provider wil gebruiken en hij staat in app/auth-provider.tsx:
import { AuthProvider } from "../auth-provider";

export const metadata = {
  title: "Paradise Angels",
  description: "Luxury fashion + visuals + creative identity brand",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0d0d0d] text-white">
        <div className="max-w-6xl mx-auto px-6">
          <AuthProvider>
            <CartProvider>
              <ClientWrapper>{children}</ClientWrapper>
            </CartProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
