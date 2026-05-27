"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description?: string | null;
  image_url: string;
  price: number;
  category?: string | null;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
      }

      setProducts(data || []);
      setLoading(false);
    }

    loadProducts();
  }, []);

  async function deleteProduct(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete product");
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading products...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-10 md:px-20 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-white/40">
              Paradise Angels Admin
            </p>

            <h1 className="mt-6 text-4xl md:text-6xl font-serif tracking-[0.18em] uppercase">
              Products
            </h1>
          </div>

          <Link
            href="/admin/products/new"
            className="border border-white px-6 py-4 text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-black transition"
          >
            New Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="mt-16 border border-white/10 bg-white/[0.03] p-10">
            <p className="text-white/50">
              No products found.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-white/10 bg-white/[0.03] overflow-hidden"
              >
                <div className="bg-neutral-900 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-[420px] object-cover hover:scale-105 transition duration-700"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-2xl tracking-[0.15em] uppercase">
                        {product.name}
                      </h2>

                      {product.category && (
                        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/40">
                          {product.category}
                        </p>
                      )}
                    </div>

                    <p className="text-sm tracking-[0.2em]">
                      €{Number(product.price).toFixed(2)}
                    </p>
                  </div>

                  {product.description && (
                    <p className="mt-6 text-sm text-white/50 leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-8 flex items-center justify-between">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-xs uppercase tracking-[0.25em] text-yellow-300 hover:text-yellow-200 transition"
                    >
                      Edit Product
                    </Link>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-xs uppercase tracking-[0.25em] text-red-400 hover:text-red-300 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}