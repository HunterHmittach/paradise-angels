"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/components/cart/CartContext";

export default function CartDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

  // ESC sluit cart
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setOpen]);

  // Sluit cart bij route change
  useEffect(() => {
    setOpen(false);
  }, [router, setOpen]);

  if (!open) return null;

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setOpen(false)}
      />

      {/* DRAWER */}
      <div className="fixed right-0 top-0 h-full w-96 bg-black text-white z-50 shadow-xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-300 hover:text-white"
          >
            Close
          </button>
        </div>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => {
              const subtotal = item.price * item.quantity;

              return (
                <div key={item.id} className="border-b border-gray-700 pb-4">
                  <div className="flex gap-3">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-yellow-400">€{item.price}</p>
                      <p className="text-sm text-gray-300">
                        Subtotal: €{subtotal.toFixed(2)}
                      </p>

                      {/* QUANTITY */}
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() =>
                            item.quantity > 1 &&
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-9 h-9 rounded bg-gray-800 hover:bg-gray-700"
                        >
                          –
                        </button>

                        <span className="min-w-6 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-9 h-9 rounded bg-gray-800 hover:bg-gray-700"
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* TOTAL */}
            <p className="text-lg font-semibold mt-4">
              Total:{" "}
              <span className="text-yellow-400">
                €{total.toFixed(2)}
              </span>
            </p>

            <button
               className="mt-2 w-full bg-white text-black py-2 rounded-lg font-semibold"
               onClick={() => {
                 setOpen(false);
                 router.push("/checkout");
                 }}
                 >
                 Checkout
                 </button>


            <button
              className="mt-2 w-full bg-red-600 py-2 rounded-lg"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
