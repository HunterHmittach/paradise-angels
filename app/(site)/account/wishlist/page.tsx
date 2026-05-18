"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import supabase from "@/lib/supabase";

type WishlistItem = {
  id: number;
  product_id: number;
  product_name: string | null;
  product_image: string | null;
  price: number | null;
  customer_email: string | null;
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session?.user) {
        window.location.href = "/login";
        return;
      }

      const userId = sessionData.session.user.id;

      const { data, error } = await supabase
        .from("wishlists")
        .select("id, product_id, product_name, product_image, price, customer_email")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      }

      setItems(data || []);
      setLoading(false);
    }

    loadWishlist();
  }, []);

  const removeFromWishlist = async (wishlistId: number) => {
    await supabase.from("wishlists").delete().eq("id", wishlistId);

    setItems((prev) => prev.filter((item) => item.id !== wishlistId));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f3ef] text-black px-10 md:px-24 pt-40">
        Loading wishlist...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f3ef] text-black px-10 md:px-24 pt-40 pb-28">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.45em] uppercase text-black/40">
          Paradise Angels
        </p>

        <h1 className="mt-8 font-serif text-5xl md:text-7xl tracking-[0.25em] uppercase">
          Wishlist
        </h1>

        {items.length === 0 ? (
          <div className="mt-16">
            <p className="text-black/60">Your saved pieces will appear here.</p>

            <Link
              href="/shop"
              className="inline-block mt-10 border border-black px-10 py-4 uppercase tracking-[0.25em] text-xs hover:bg-black hover:text-white transition"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          <section className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-16">
            {items.map((item) => (
              <div key={item.id} className="group">
                <Link href={`/shop/${item.product_id}`}>
                  <div className="overflow-hidden bg-[#e9e7df]">
                    <img
                      src={item.product_image || "/black-hoodie.png"}
                      alt={item.product_name || "Product"}
                      className="w-full h-[480px] object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="mt-6 flex justify-between items-start">
                  <div>
                    <h2 className="font-serif text-base tracking-[0.2em] uppercase">
                      {item.product_name || "Product"}
                    </h2>

                    <p className="mt-3 text-sm tracking-widest">
                      €{Number(item.price || 0).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-xs tracking-[0.25em] uppercase text-black/40 hover:text-black transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}