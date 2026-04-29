"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

/* =========================
   PRODUCT TYPE
========================= */
type Product = {
  id: number;
  name: string;
  category: "Apparel" | "Perfumes";
  price: number;
  image: string;
  description: string;
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
    description:
      "Crafted from premium heavyweight cotton. Structured silhouette. Minimalist luxury design.",
  },
  {
    id: 2,
    name: "Black T-Shirt",
    category: "Apparel",
    price: 20,
    image: "/black-tshirt.png",
    description:
      "Essential everyday piece. Precision cut. Refined construction with elevated finishing.",
  },
];

export default function ProductPage() {
  const params = useParams();
  const productId = Number(params.id);
  const product = products.find((p) => p.id === productId);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );
  }

  return (
    <main className="bg-[#f4f3ef] text-black min-h-screen px-10 md:px-24 pt-40 pb-24">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">

        {/* ================= IMAGE ================= */}
        <div className="bg-[#e9e7df]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[650px] object-cover"
          />
        </div>

        {/* ================= INFO ================= */}
        <div className="flex flex-col justify-start">

          <h1 className="font-serif text-4xl tracking-[0.25em] uppercase">
            {product.name}
          </h1>

          <p className="mt-6 text-black/60 leading-relaxed max-w-md">
            {product.description}
          </p>

          <p className="mt-10 text-xl tracking-widest">
            €{product.price.toFixed(2)}
          </p>

          {/* ================= SIZE SELECTOR ================= */}
          {product.category === "Apparel" && (
            <div className="mt-10">
              <p className="text-sm tracking-widest uppercase mb-4">
                Size
              </p>
              <div className="flex gap-4">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border transition ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-black/30"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= ADD TO CART ================= */}
          <button
            className="mt-14 px-10 py-4 border border-black hover:bg-black hover:text-white transition tracking-widest uppercase"
          >
            Add to Cart
          </button>

          {/* ================= BACK ================= */}
          <Link
            href="/shop"
            className="mt-10 text-sm tracking-widest uppercase text-black/40 hover:text-black"
          >
            ← Back to Shop
          </Link>

        </div>

      </div>
    </main>
  );
}