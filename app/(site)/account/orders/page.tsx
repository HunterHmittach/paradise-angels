"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Order = {
  id: number;
  email: string;
  user_id?: string | null;
  total: number;
  status: string;
  created_at: string;
  tracking_code?: string | null;
  shipping_carrier?: string | null;
};

export default function AccountOrdersPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      const userEmail = user.email || "";
      const userId = user.id;

      setEmail(userEmail);

      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, email, user_id, total, status, created_at, tracking_code, shipping_carrier"
        )
        .or(`user_id.eq.${userId},email.eq.${userEmail}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Orders load error:", error);
        setOrders([]);
        setLoading(false);
        return;
      }

      const uniqueOrders = Array.from(
        new Map((data || []).map((order) => [order.id, order])).values()
      );

      setOrders(uniqueOrders as Order[]);
      setLoading(false);
    }

    loadOrders();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f3ef] text-black flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.45em] text-black/40">
          Loading orders...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f3ef] text-black px-10 md:px-24 pt-40 pb-28">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="text-xs tracking-[0.45em] uppercase text-black/40">
              Paradise Angels
            </p>

            <h1 className="mt-8 font-serif text-5xl md:text-7xl tracking-[0.25em] uppercase">
              Orders
            </h1>

            <p className="mt-8 text-black/50">Signed in as {email}</p>
          </div>

          <Link
            href="/shop"
            className="w-fit border border-black px-8 py-4 uppercase tracking-[0.25em] text-xs hover:bg-black hover:text-white transition"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-16 border border-black/10 bg-white/40">
          {orders.length === 0 ? (
            <div className="p-10">
              <p className="text-black/60">No orders found.</p>

              <Link
                href="/shop"
                className="inline-block mt-8 border border-black px-8 py-4 uppercase tracking-[0.25em] text-xs hover:bg-black hover:text-white transition"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const hasTracking =
                Boolean(order.tracking_code) || Boolean(order.shipping_carrier);

              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="grid md:grid-cols-5 gap-6 px-8 py-7 border-b border-black/10 hover:bg-white transition"
                >
                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-black/40">
                      Order
                    </p>
                    <p className="mt-2 font-serif text-2xl tracking-[0.15em]">
                      #{order.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-black/40">
                      Date
                    </p>
                    <p className="mt-2 text-black/70">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-black/40">
                      Status
                    </p>
                    <p
                      className={`mt-2 uppercase tracking-[0.2em] text-sm ${
                        order.status === "paid"
                          ? "text-green-700"
                          : "text-amber-700"
                      }`}
                    >
                      {order.status || "pending"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-black/40">
                      Tracking
                    </p>
                    <p className="mt-2 text-black/70">
                      {hasTracking
                        ? `${order.shipping_carrier || ""} ${
                            order.tracking_code || ""
                          }`.trim()
                        : "Not shipped yet"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-black/40">
                      Total
                    </p>
                    <p className="mt-2">€{Number(order.total).toFixed(2)}</p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}