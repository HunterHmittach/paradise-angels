"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useCart } from "@/app/components/cart/CartContext";


interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error(error);
      } else {
        setProducts(data as Product[]);
      }
    }

    loadProducts();
  }, []);

  return (
  <main className="py-32">
    <h1 className="text-6xl font-bold mb-16">
      <span className="text-white">SHOP</span>{" "}
      <span className="text-yellow-400">PARADISE</span>
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {products.length === 0 && <p>No products found.</p>}

      {products.map((p) => (
        <Link href={`/shop/${p.id}`} key={p.id}>
          <div className="bg-black border border-gray-700 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer">
            <img src={p.image_url} className="w-full h-64 object-cover" />

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{p.name}</h2>
              <p className="opacity-75 text-sm">{p.description}</p>
              <p className="text-yellow-400 mt-2 font-semibold">€{p.price}</p>
            </div>
            <button
             onClick={(e) => {
             e.preventDefault(); // voorkomt navigatie naar product page
             addToCart(p);
             }}
             className="mt-3 w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-600 transition"
            >
             Add to Cart
            </button>

          </div>
        </Link>
      ))}
    </div>
  </main>
);

}
