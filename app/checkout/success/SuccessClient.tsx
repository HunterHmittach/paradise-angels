"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/app/components/cart/CartContext";

type Order = {
  id: number;
  email: string;
  total: number;
  status: "pending" | "paid" | "failed" | string;
  created_at?: string;
};

type Item = {
  product_id: number;
  quantity: number;
  price: number;
  line_total: number;
  product: { id: number; name: string; image_url?: string } | null;
};

export default function SuccessClient() {
  const sp = useSearchParams();
  const payment_intent = sp.get("payment_intent");

  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cleared, setCleared] = useState(false);

  const canFetch = useMemo(() => Boolean(payment_intent), [payment_intent]);

  async function fetchOrder() {
    if (!payment_intent) return;
    const res = await fetch(
      `/api/orders/by-payment-intent?payment_intent=${encodeURIComponent(payment_intent)}`
    );
    const text = await res.text();
    if (!res.ok) throw new Error(text);
    const data = JSON.parse(text);
    setOrder(data.order);
    setItems(data.items ?? []);
  }

  useEffect(() => {
    if (!canFetch) {
      setError("Missing payment_intent in URL.");
      return;
    }

    let stopped = false;

    async function poll() {
      try {
        await fetchOrder();
        if (!stopped) setError(null);
      } catch (e: any) {
        if (!stopped) setError(e?.message ?? "Failed to load order.");
      }
    }

    poll();

    const id = setInterval(async () => {
      if (stopped) return;
      if (order?.status === "paid" || order?.status === "failed") return;
      await poll();
    }, 1500);

    return () => {
      stopped = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canFetch, payment_intent]);

  useEffect(() => {
    if (order?.status === "paid" && !cleared) {
      clearCart();
      setCleared(true);
    }
  }, [order?.status, cleared, clearCart]);

  return (
    <div className="max-w-2xl mx-auto py-24 px-6">
      <h1 className="text-4xl font-bold mb-4">Bedankt! 🎉</h1>

      {!order && !error && <p className="opacity-80">Payment verwerken… even wachten.</p>}
      {error && <p className="text-red-400 break-words">Error: {error}</p>}

      {order && (
        <div className="mt-6 space-y-3">
          <div className="bg-black border border-gray-700 rounded-xl p-4">
            <p><span className="opacity-70">Order:</span> #{order.id}</p>
            <p><span className="opacity-70">Status:</span> <b>{order.status}</b></p>
            <p><span className="opacity-70">Totaal:</span> €{Number(order.total).toFixed(2)}</p>

            {order.status === "paid" && (
              <p className="text-green-400 mt-2">✅ Betaald — winkelwagen is geleegd.</p>
            )}
            {order.status === "pending" && (
              <p className="opacity-80 mt-2">⏳ Wachten op bevestiging (webhook)…</p>
            )}
          </div>

          <div className="bg-black border border-gray-700 rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-3">Items</h2>
            {items.length === 0 ? (
              <p className="opacity-70">Geen items gevonden.</p>
            ) : (
              <ul className="space-y-2">
                {items.map((it, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold">
                        {it.product?.name ?? `Product #${it.product_id}`}
                      </div>
                      <div className="opacity-70 text-sm">
                        €{Number(it.price).toFixed(2)} × {it.quantity}
                      </div>
                    </div>
                    <div className="font-semibold">€{Number(it.line_total).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
