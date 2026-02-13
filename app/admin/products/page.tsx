"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from("products").select("*");

      if (!error) {
        setProducts(data);
      }

      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <p className="text-white p-10">Loading...</p>;

  return (
    <main className="p-10 text-white">
      <h1 className="text-3xl mb-4">Producten beheren</h1>

      <Link
        href="/admin/products/new"
        className="bg-green-600 px-4 py-2 rounded"
      >
        Nieuw product
      </Link>

      <div className="mt-6 space-y-4">
        {products.map((p) => (
          <div key={p.id} className="border border-gray-700 p-4 rounded">
            <h2 className="text-xl">{p.name}</h2>
            <p className="opacity-70">{p.description}</p>

            <img
              src={p.image_url}
              className="w-32 h-32 object-cover mt-2 rounded"
            />

            <div className="mt-3 flex gap-4">
              <Link
                href={`/admin/products/${p.id}/edit`}
                className="text-yellow-400"
              >
                Bewerken
              </Link>

              <button
                className="text-red-500"
                onClick={async () => {
                  await supabase.from("products").delete().eq("id", p.id);
                  window.location.reload();
                }}
              >
                Verwijderen
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
