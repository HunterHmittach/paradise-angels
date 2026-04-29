"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* =========================
   PRODUCT TYPE
========================= */
type Product = {
  id: number;
  name: string;
  category: "Apparel" | "Perfumes";
  price: number;
  image: string;
  hoverImage: string;
  popular: boolean;
  isNew: boolean;
};

/* =========================
   PRODUCTS DATA
========================= */
const products: Product[] = [
  {
    id: 1,
    name: "Black Hoodie",
    category: "Apparel",
    price: 89.99,
    image: "/black-hoodie.png",
    hoverImage: "/black-hoodie.png",
    popular: true,
    isNew: true,
  },
  {
    id: 2,
    name: "Black T-Shirt",
    category: "Apparel",
    price: 20,
    image: "/black-tshirt.png",
    hoverImage: "/black-tshirt.png",
    popular: false,
    isNew: true,
  },
];

export default function Shop() {
  const [filter, setFilter] = useState<"All" | "Apparel" | "Perfumes">("All");
  const [sort, setSort] = useState<"New" | "Price" | "Popular">("New");
  const [quickView, setQuickView] = useState<Product | null>(null);

  /* FILTER */
  let filteredProducts = [...products];

  if (filter !== "All") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === filter
    );
  }

  /* SORT */
  if (sort === "Price") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "Popular") {
    filteredProducts.sort((a, b) =>
      b.popular === a.popular ? 0 : b.popular ? 1 : -1
    );
  }

  if (sort === "New") {
    filteredProducts.sort((a, b) =>
      b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1
    );
  }

  return (
    <main className="bg-[#f4f3ef] text-black min-h-screen">

      {/* ================= HEADER ================= */}
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

      {/* ================= GRID ================= */}
      <section className="px-10 md:px-24 py-20">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-16">

          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >

              {/* IMAGE SWAP */}
              <div
                onClick={() => setQuickView(product)}
                className="relative overflow-hidden bg-[#e9e7df] cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[480px] object-cover transition duration-700 group-hover:opacity-0 group-hover:scale-105"
                />
                <img
                  src={product.hoverImage}
                  alt=""
                  className="absolute inset-0 w-full h-[480px] object-cover opacity-0 transition duration-700 group-hover:opacity-100 group-hover:scale-105"
                />
              </div>

              {/* INFO */}
              <div className="mt-6 flex justify-between items-start">

                <Link href={`/shop/${product.id}`}>
                  <h2 className="font-serif text-base tracking-[0.2em] uppercase hover:underline">
                    {product.name}
                  </h2>
                </Link>

                <p className="text-sm tracking-widest">
                  €{product.price.toFixed(2)}
                </p>

              </div>

            </motion.div>
          ))}

        </div>
      </section>

      {/* ================= PAGINATION ================= */}
      <section className="pb-20 flex justify-center gap-6 text-sm tracking-widest uppercase">
        <button className="opacity-40">01</button>
        <button className="hover:underline">02</button>
        <button className="hover:underline">03</button>
      </section>

      {/* ================= QUICK VIEW ================= */}
      {quickView && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white w-[90%] md:w-[600px] p-10 relative">

            <button
              onClick={() => setQuickView(null)}
              className="absolute top-4 right-4 text-black/60"
            >
              ✕
            </button>

            <img
              src={quickView.image}
              alt={quickView.name}
              className="w-full h-[350px] object-cover mb-6"
            />

            <h2 className="font-serif text-2xl tracking-widest uppercase">
              {quickView.name}
            </h2>

            <p className="mt-4 text-black/60">
              Luxury construction. Precision tailoring.
            </p>

            <p className="mt-6 tracking-widest">
              €{quickView.price.toFixed(2)}
            </p>

            <Link href={`/shop/${quickView.id}`}>
              <button className="mt-6 px-8 py-3 border border-black hover:bg-black hover:text-white transition">
                View Product
              </button>
            </Link>

          </div>

        </div>
      )}

    </main>
  );
}