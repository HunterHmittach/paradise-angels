"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size?: string | null;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const removeItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#f4f3ef] text-black px-10 md:px-24 pt-40 pb-28">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-5xl tracking-[0.25em] uppercase">
          Cart
        </h1>

        {cart.length === 0 ? (
          <div className="mt-24">
            <p className="text-black/60 tracking-[0.15em] uppercase text-sm">
              Your cart is empty.
            </p>

            <Link
              href="/shop"
              className="inline-block mt-10 border border-black px-10 py-4 uppercase tracking-[0.25em] text-xs hover:bg-black hover:text-white transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-20 space-y-12">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="grid grid-cols-[120px_1fr_auto] gap-8 items-center border-b border-black/10 pb-10"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[120px] h-[150px] object-cover bg-[#e9e7df]"
                  />

                  <div>
                    <h2 className="font-serif text-2xl tracking-[0.18em] uppercase">
                      {item.name}
                    </h2>

                    {item.size && (
                      <p className="mt-3 text-sm text-black/50 tracking-[0.2em] uppercase">
                        Size: {item.size}
                      </p>
                    )}

                    <p className="mt-3 text-sm text-black/50 tracking-[0.2em] uppercase">
                      Quantity: {item.quantity}
                    </p>

                    <button
                      onClick={() => removeItem(index)}
                      className="mt-5 text-xs tracking-[0.25em] uppercase text-black/40 hover:text-black transition"
                    >
                      Remove
                    </button>
                  </div>

                  <p className="tracking-[0.2em] uppercase text-sm">
                    €{item.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div>
                <p className="text-sm tracking-[0.3em] uppercase text-black/50">
                  Total
                </p>
                <p className="mt-3 font-serif text-3xl tracking-[0.15em]">
                  €{total.toFixed(2)}
                </p>
              </div>

              <Link
                href="/checkout"
                className="bg-black text-white px-14 py-5 uppercase tracking-[0.3em] text-xs hover:bg-black/80 transition"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}