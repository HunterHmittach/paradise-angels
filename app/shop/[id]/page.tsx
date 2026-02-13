"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useCart } from "@/app/components/cart/CartContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) console.error(error);
      else setProduct(data);
    }

    loadProduct();
  }, [params.id]);

  if (!product)
    return (
      <p className="p-10 text-center opacity-80">Loading product...</p>
    );

  return (
    <main className="p-10 flex flex-col lg:flex-row gap-10">
      {/* Product Image */}
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full lg:w-1/2 rounded-xl object-cover shadow-lg"
      />

      {/* Product Info */}
      <div className="lg:w-1/2">
        <h1 className="text-4xl font-bold">{product.name}</h1>

        <p className="text-xl text-yellow-400 font-semibold mt-4">
          €{product.price}
        </p>

        <p className="opacity-75 mt-4">{product.description}</p>

        <button
  className="mt-6 px-6 py-3 bg-white text-black rounded-full hover:bg-gray-300 transition"
  onClick={() =>
    addToCart({
      ...product!,
      quantity: 1
    })
  }
>
  Add to Cart
</button>

      </div>
    </main>
  );
}
