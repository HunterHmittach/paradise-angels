"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  // ----------------------------
  // 1️⃣ CHECK OF USER ADMIN IS
  // ----------------------------
  useEffect(() => {
    async function checkAdmin() {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error(error);
        window.location.href = "/admin/login";
        return;
      }

      const user = data.user;

      if (!user) {
        window.location.href = "/admin/login";
        return;
      }

      if (user.app_metadata?.role !== "admin") {
        alert("Geen toegang — geen admin.");
        window.location.href = "/";
        return;
      }

      setUser(user);
      setAllowed(true);
      setLoading(false);
    }

    checkAdmin();
  }, []);

  // ----------------------------
  // 2️⃣ PRODUCTEN LADEN
  // ----------------------------
  useEffect(() => {
    if (!allowed) return;

    async function loadProducts() {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Fout bij producten ophalen:", error);
        return;
      }

      setProducts(data || []);
    }

    loadProducts();
  }, [allowed]);

  if (loading) {
    return (
      <main className="text-center mt-20 text-white">
        Loading admin panel...
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="text-center mt-20 text-white">
        Geen toegang.
      </main>
    );
  }

  // ----------------------------
  // 3️⃣ ADMIN DASHBOARD WEERGAVE
  // ----------------------------
  return (
    <main className="text-white p-10">
      <h1 className="text-3xl mb-4">Admin Dashboard</h1>
      <p className="mb-6">Welkom, admin!</p>

      {/* Product sectie */}
      <h2 className="text-xl font-semibold mb-3">Producten</h2>

      <div className="bg-gray-900 p-5 rounded-xl">
        {products.length === 0 && <p>Geen producten gevonden…</p>}

        {products.map((p) => (
          <div
            key={p.id}
            className="flex justify-between border-b border-gray-700 py-3"
          >
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-gray-400">€{p.price}</p>
            </div>

            <div className="flex gap-3">
              <a
                href={`/admin/products/${p.id}`}
                className="text-yellow-300 hover:text-yellow-200"
              >
                Bewerken
              </a>

              <a
                href={`/admin/products/delete/${p.id}`}
                className="text-red-400 hover:text-red-300"
              >
                Verwijderen
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Nieuw product knop */}
      <a
        href="/admin/products/new"
        className="block mt-6 bg-white text-black px-4 py-2 rounded-lg w-max hover:bg-gray-200"
      >
        Nieuw Product Toevoegen
      </a>
    </main>
  );
}
