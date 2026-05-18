"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import supabase from "@/lib/supabase";

const ADMIN_EMAILS = [
  "hunterhmittach@gmail.com",
  "m.hmittach@gmail.com",
];

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function checkAdmin() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        window.location.href = "/admin/login";
        return;
      }

      if (!ADMIN_EMAILS.includes(user.email || "")) {
        alert("Geen toegang — geen admin.");
        window.location.href = "/";
        return;
      }

      setAllowed(true);
      setLoading(false);
    }

    checkAdmin();
  }, []);

  useEffect(() => {
    if (!allowed) return;

    async function loadProducts() {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error(error);
        return;
      }

      setProducts(data || []);
    }

    loadProducts();
  }, [allowed]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading admin panel...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-10 md:px-20 py-28">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.4em] uppercase text-white/40">
          Paradise Angels Admin
        </p>

        <h1 className="mt-6 text-4xl md:text-6xl font-serif tracking-[0.18em] uppercase">
          Dashboard
        </h1>

        <div className="mt-14 grid md:grid-cols-4 gap-5">
          <Link
            href="/admin/orders"
            className="border border-white/10 bg-white/[0.03] p-8 hover:bg-white/[0.08] transition"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Manage
            </p>
            <h2 className="mt-4 text-2xl font-serif tracking-[0.15em] uppercase">
              Orders
            </h2>
          </Link>

          <Link
            href="/admin/products"
            className="border border-white/10 bg-white/[0.03] p-8 hover:bg-white/[0.08] transition"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Manage
            </p>
            <h2 className="mt-4 text-2xl font-serif tracking-[0.15em] uppercase">
              Products
            </h2>
          </Link>

          <Link
            href="/admin/wishlists"
            className="border border-white/10 bg-white/[0.03] p-8 hover:bg-white/[0.08] transition"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Insight
            </p>
            <h2 className="mt-4 text-2xl font-serif tracking-[0.15em] uppercase">
              Wishlists
            </h2>
          </Link>

          <Link
            href="/shop"
            className="border border-white/10 bg-white/[0.03] p-8 hover:bg-white/[0.08] transition"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              View
            </p>
            <h2 className="mt-4 text-2xl font-serif tracking-[0.15em] uppercase">
              Storefront
            </h2>
          </Link>
        </div>

        <section className="mt-20">
          <div className="flex items-center justify-between gap-6">
            <h2 className="text-2xl font-serif tracking-[0.18em] uppercase">
              Products
            </h2>

            <Link
              href="/admin/products/new"
              className="border border-white px-5 py-3 text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-black transition"
            >
              New Product
            </Link>
          </div>

          <div className="mt-8 border border-white/10 bg-white/[0.03]">
            {products.length === 0 && (
              <p className="p-6 text-white/50">Geen producten gevonden.</p>
            )}

            {products.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center border-b border-white/10 px-6 py-5"
              >
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-white/40">€{p.price}</p>
                </div>

                <div className="flex gap-5">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-yellow-300"
                  >
                    Bewerken
                  </Link>

                  <Link
                    href={`/admin/products/delete/${p.id}`}
                    className="text-red-400"
                  >
                    Verwijderen
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}