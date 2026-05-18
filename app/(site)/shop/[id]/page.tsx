"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import supabase from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  category: "Apparel" | "Perfumes";
  price: number;
  image: string;
  description: string;
  sizes?: string[];
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size?: string | null;
  quantity: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Black Hoodie",
    category: "Apparel",
    price: 89.99,
    image: "/black-hoodie.png",
    description:
      "A heavyweight cotton hoodie crafted with a structured silhouette, refined proportions and Paradise Angels identity.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Black T-Shirt",
    category: "Apparel",
    price: 20,
    image: "/black-tshirt.png",
    description:
      "A premium cotton t-shirt designed as an essential Paradise Angels piece with a clean and minimal finish.",
    sizes: ["S", "M", "L", "XL"],
  },
];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = Number(params.id);
  const product = products.find((item) => item.id === productId);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    async function loadWishlist() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session?.user) return;

      const userId = sessionData.session.user.id;

      const { data } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", userId);

      if (data) {
        setWishlist(data.map((item) => item.product_id));
      }
    }

    loadWishlist();
  }, []);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f4f3ef] flex items-center justify-center text-black">
        <p className="font-serif text-3xl tracking-[0.2em] uppercase">
          Product not found
        </p>
      </main>
    );
  }

  const isSaved = wishlist.includes(product.id);

  const toggleWishlist = async () => {
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
    } else {
      await supabase.from("wishlists").insert({
        user_id: user.id,
        customer_email: user.email,
        product_id: product.id,
        product_name: product.name,
        product_image: product.image,
        price: product.price,
      });

      setWishlist((prev) => [...prev, product.id]);
    }
  };

  const addToCart = () => {
    if (product.sizes && !selectedSize) {
      alert("Please select a size.");
      return false;
    }

    const existingCart = localStorage.getItem("cart");
    const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

    const existingItem = cart.find(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    setAdded(true);

    return true;
  };

  const checkoutNow = () => {
    const success = addToCart();

    if (success) {
      router.push("/checkout");
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f3ef] text-black px-10 md:px-24 pt-40 pb-28">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-start">
        <section className="relative bg-[#e9e7df] overflow-hidden">
          <button
            type="button"
            onClick={toggleWishlist}
            className="absolute top-6 right-6 z-10 h-12 w-12 rounded-full bg-[#f4f3ef]/80 backdrop-blur-md border border-black/10 flex items-center justify-center hover:bg-white transition"
          >
            <Heart
              size={19}
              className={`transition ${
                isSaved ? "fill-black text-black" : "text-black"
              }`}
            />
          </button>

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[650px] object-cover"
          />
        </section>

        <section className="pt-4">
          <div className="flex items-start justify-between gap-8">
            <h1 className="font-serif text-4xl md:text-5xl tracking-[0.22em] uppercase leading-tight">
              {product.name}
            </h1>

            <button
              type="button"
              onClick={toggleWishlist}
              className="mt-2 h-11 w-11 border border-black/10 flex items-center justify-center hover:bg-white transition md:hidden"
            >
              <Heart
                size={18}
                className={`transition ${
                  isSaved ? "fill-black text-black" : "text-black"
                }`}
              />
            </button>
          </div>

          <p className="mt-8 text-black/60 leading-relaxed max-w-md">
            {product.description}
          </p>

          <p className="mt-10 text-lg tracking-[0.25em] uppercase">
            €{product.price.toFixed(2)}
          </p>

          {product.sizes && (
            <div className="mt-12">
              <p className="text-xs tracking-[0.35em] uppercase mb-5">
                Select Size
              </p>

              <div className="flex gap-4">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-12 border text-sm tracking-widest transition ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "border-black/30 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-14 flex flex-col gap-4 max-w-md">
            <button
              onClick={addToCart}
              className="w-full border border-black py-5 uppercase tracking-[0.3em] text-xs hover:bg-black hover:text-white transition duration-500"
            >
              {added ? "Added to Cart" : "Add to Cart"}
            </button>

            <button
              onClick={checkoutNow}
              className="w-full bg-black text-white py-5 text-center uppercase tracking-[0.3em] text-xs hover:bg-black/80 transition duration-500"
            >
              Checkout
            </button>
          </div>

          <Link
            href="/shop"
            className="inline-block mt-12 text-xs tracking-[0.3em] uppercase text-black/40 hover:text-black transition"
          >
            ← Back to Shop
          </Link>
        </section>
      </div>
    </main>
  );
}