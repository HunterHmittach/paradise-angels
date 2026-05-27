"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import supabase from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  category?: "Apparel" | "Perfumes" | null;
  price: number;
  description?: string | null;
  image_url: string;
  popular?: boolean | null;
  is_new?: boolean | null;
};

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<"All" | "Apparel" | "Perfumes">("All");
  const [sort, setSort] = useState<"New" | "Price" | "Popular">("New");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (error) console.error(error);

      setProducts(data || []);
      setLoading(false);
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function loadWishlist() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) return;

      const { data } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", sessionData.session.user.id);

      if (data) setWishlist(data.map((item) => item.product_id));
    }

    loadWishlist();
  }, []);

  const toggleWishlist = async (product: Product) => {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session?.user) {
      window.location.href = "/login";
      return;
    }

    const user = sessionData.session.user;

    if (wishlist.includes(product.id)) {
      await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id);

      setWishlist((prev) => prev.filter((id) => id !== product.id));
      return;
    }

    await supabase.from("wishlists").insert({
      user_id: user.id,
      customer_email: user.email,
      product_id: product.id,
      product_name: product.name,
      product_image: product.image_url,
      price: product.price,
    });

    setWishlist((prev) => [...prev, product.id]);
  };

  let filteredProducts = [...products];

  if (filter !== "All") {
    filteredProducts = filteredProducts.filter((p) => p.category === filter);
  }

  if (sort === "Price") {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (sort === "Popular") {
    filteredProducts.sort((a, b) => Number(b.popular) - Number(a.popular));
  }

  if (sort === "New") {
    filteredProducts.sort((a, b) => Number(b.is_new) - Number(a.is_new));
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f3ef] text-black flex items-center justify-center">
        Loading shop...
      </main>
    );
  }

  return (
    <main className="bg-[#f4f3ef] text-black min-h-screen">
      <section className="px-10 md:px-24 pt-28 pb-10 border-b border-black/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-8">
          <h1 className="font-serif text-5xl tracking-[0.25em] uppercase">
            Shop
          </h1>

          <div className="flex gap-8 text-sm tracking-widest uppercase">
            {["All", "Apparel", "Perfumes"].map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setFilter(cat as "All" | "Apparel" | "Perfumes")
                }
                className={`transition ${
                  filter === cat ? "text-black" : "text-black/40"
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="border-l border-black/20 pl-8">
              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value as "New" | "Price" | "Popular")
                }
                className="bg-transparent outline-none text-black/60"
              >
                <option value="New">New</option>
                <option value="Price">Price</option>
                <option value="Popular">Popular</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="px-10 md:px-24 py-20">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-16">
          {filteredProducts.map((product) => {
            const isSaved = wishlist.includes(product.id);

            return (
              <div key={product.id} className="group relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className="absolute top-5 right-5 z-20 h-10 w-10 rounded-full bg-[#f4f3ef]/80 backdrop-blur-md flex items-center justify-center border border-black/10 hover:bg-white transition"
                >
                  <Heart
                    size={17}
                    className={isSaved ? "fill-black text-black" : "text-black"}
                  />
                </button>

                <Link href={`/shop/${product.id}`}>
                  <div className="cursor-pointer">
                    <div className="relative overflow-hidden bg-[#e9e7df]">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-[480px] object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-6 flex justify-between items-start">
                      <h2 className="font-serif text-base tracking-[0.2em] uppercase hover:underline">
                        {product.name}
                      </h2>

                      <p className="text-sm tracking-widest">
                        €{Number(product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}