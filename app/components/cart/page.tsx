"use client";

import { useCart } from "@/app/components/cart/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="p-10 text-white">
      <h1 className="text-3xl mb-6">Your Cart</h1>

      {cart.length === 0 && <p>Your cart is empty.</p>}

      {cart.map((item) => (
        <div key={item.id} className="mb-4 p-4 bg-gray-800 rounded">
          <img src={item.image_url} className="w-32 rounded" />
          <h2 className="text-xl">{item.name}</h2>
          <p>€{item.price}</p>
          <p>Aantal: {item.quantity}</p>

          <button
            onClick={() => removeFromCart(item.id)}
            className="mt-2 px-4 py-2 bg-red-500 rounded"
          >
            Remove
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <h2 className="text-2xl mt-4">Totaal: €{total.toFixed(2)}</h2>

          <button
            onClick={clearCart}
            className="mt-4 px-4 py-2 bg-yellow-600 rounded"
          >
            Clear Cart
          </button>
        </>
      )}
    </main>
  );
}
