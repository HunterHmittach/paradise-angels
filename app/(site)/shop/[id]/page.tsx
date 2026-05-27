"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Minus, Plus, ChevronDown } from "lucide-react";
import supabase from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  category?: string | null;
  price: number;
  image_url: string;
  description?: string | null;
  sizes?: string[] | string | null;
  gallery_images?: string[] | string | null;
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size?: string | null;
  quantity: number;
};

function imagePath(src?: string | null) {
  if (!src) return "/black-hoodie.png";

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  return src.startsWith("/") ? src : `/${src}`;
}

function toArray(value?: string[] | string | null) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  return value
    .split(/[,\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getGallery(mainImage: string, gallery?: string[] | string | null) {
  const extras = toArray(gallery).map(imagePath);
  return Array.from(new Set([mainImage, ...extras]));
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>("description");

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Product load error:", error);
      }

      setProduct((data as Product) || null);
      setLoading(false);
    }

    loadProduct();
  }, [productId]);

  useEffect(() => {
    async function loadWishlist() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session?.user) return;

      const { data, error } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", sessionData.session.user.id);

      if (error) {
        console.error("Wishlist load error:", error);
        return;
      }

      setWishlist(data?.map((item) => item.product_id) || []);
    }

    loadWishlist();
  }, []);

  const mainImage = useMemo(() => {
    return imagePath(product?.image_url);
  }, [product?.image_url]);

  const galleryImages = useMemo(() => {
    return getGallery(mainImage, product?.gallery_images);
  }, [mainImage, product?.gallery_images]);

  const sizes = useMemo(() => {
    return toArray(product?.sizes);
  }, [product?.sizes]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f6f2] text-black flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.5em] text-black/40">
          Loading Product
        </p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f7f6f2] text-black flex items-center justify-center px-10">
        <div className="text-center">
          <h1 className="font-serif text-4xl tracking-[0.25em] uppercase">
            Product Not Found
          </h1>

          <Link
            href="/shop"
            className="inline-block mt-10 text-xs uppercase tracking-[0.35em] text-black/40 hover:text-black transition"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const p = product;
  const isSaved = wishlist.includes(p.id);

  async function toggleWishlist() {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session?.user) {
      window.location.href = "/login";
      return;
    }

    const user = sessionData.session.user;

    if (isSaved) {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", p.id);

      if (error) {
        alert(error.message);
        return;
      }

      setWishlist((prev) => prev.filter((id) => id !== p.id));
      return;
    }

    const { error } = await supabase.from("wishlists").insert({
      user_id: user.id,
      customer_email: user.email,
      product_id: p.id,
      product_name: p.name,
      product_image: mainImage,
      price: p.price,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setWishlist((prev) => [...prev, p.id]);
  }

  function addToCart() {
    if (sizes.length > 0 && !selectedSize) {
      alert("Please select a size.");
      return false;
    }

    const existingCart = localStorage.getItem("cart");
    const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

    const existingItem = cart.find(
      (item) => item.id === p.id && item.size === selectedSize
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image: mainImage,
        size: selectedSize,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    setAdded(true);

    return true;
  }

  function checkoutNow() {
    const success = addToCart();

    if (success) {
      router.push("/checkout");
    }
  }

  const sections = [
    {
      id: "description",
      title: "Description",
      content:
        p.description ||
        "A refined Paradise Angels piece designed with presence, silence and identity.",
    },
    {
      id: "delivery",
      title: "Delivery & Returns",
      content:
        "Worldwide tracked delivery. Shipping details are confirmed after checkout.",
    },
    {
      id: "care",
      title: "Product Care",
      content:
        "Handle with care. Wash gently, avoid harsh heat and preserve the shape of the piece.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-black">
      <section className="pt-28">
        <div className="grid lg:grid-cols-[58%_42%]">
          {/* LEFT: BIG LV-STYLE IMAGE AREA */}
          <section className="bg-[#f1f0ec] border-r border-black/10">
            <div className="h-20 px-8 md:px-14 flex items-center justify-between border-b border-black/10 bg-[#f7f6f2]">
              <Link
                href="/shop"
                className="text-xs uppercase tracking-[0.35em] text-black/40 hover:text-black transition"
              >
                ← Back
              </Link>

              <p className="text-xs uppercase tracking-[0.4em] text-black/35">
                PA-{p.id}
              </p>
            </div>

            {galleryImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative h-[calc(100vh-7rem)] min-h-[760px] bg-[#f1f0ec] overflow-hidden"
              >
                {galleryImages.length > 1 && (
                  <div className="absolute top-8 left-8 right-8 z-10 flex items-center justify-between text-xs uppercase tracking-[0.35em] text-black/35">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{index === 0 ? "Main" : "View"}</span>
                  </div>
                )}

                <img
                  src={image}
                  alt={`${p.name} ${index + 1}`}
                  className="block h-full w-full object-cover object-center"
                />
              </div>
            ))}
          </section>

          {/* RIGHT: CLEAN STICKY BUY PANEL */}
          <aside className="bg-[#fbfaf7]">
            <div className="lg:sticky lg:top-28 min-h-[calc(100vh-7rem)] px-8 md:px-16 py-14 flex items-center">
              <div className="w-full max-w-xl mx-auto">
                <div className="flex items-start justify-between gap-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.45em] text-black/35">
                      {p.category || "Apparel"}
                    </p>

                    <h1 className="mt-7 font-serif text-5xl md:text-6xl uppercase tracking-[0.16em] leading-tight">
                      {p.name}
                    </h1>
                  </div>

                  <button
                    type="button"
                    onClick={toggleWishlist}
                    className="h-12 w-12 shrink-0 flex items-center justify-center rounded-full border border-black/10 hover:bg-white transition"
                    aria-label="Toggle wishlist"
                  >
                    <Heart
                      size={20}
                      className={isSaved ? "fill-black text-black" : "text-black"}
                    />
                  </button>
                </div>

                <div className="mt-10 border-y border-black/10 py-7 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.35em] text-black/35">
                    Price
                  </p>

                  <p className="text-2xl tracking-[0.25em]">
                    €{Number(p.price).toFixed(2)}
                  </p>
                </div>

                {sizes.length > 0 && (
                  <div className="mt-9">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.35em] text-black/35">
                        Select Size
                      </p>

                      <button
                        type="button"
                        className="text-xs underline underline-offset-4 text-black/50 hover:text-black transition"
                      >
                        Size Guide
                      </button>
                    </div>

                    <div className="mt-5 grid grid-cols-4 gap-3">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`h-14 border text-sm tracking-[0.22em] transition ${
                            selectedSize === size
                              ? "bg-black text-white border-black"
                              : "border-black/20 hover:border-black bg-transparent"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-9">
                  <p className="text-xs uppercase tracking-[0.35em] text-black/35">
                    Quantity
                  </p>

                  <div className="mt-5 flex items-center w-40 border border-black/20">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="h-12 w-12 flex items-center justify-center hover:bg-black hover:text-white transition"
                    >
                      <Minus size={15} />
                    </button>

                    <div className="h-12 flex-1 flex items-center justify-center text-sm tracking-[0.25em]">
                      {quantity}
                    </div>

                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="h-12 w-12 flex items-center justify-center hover:bg-black hover:text-white transition"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                <div className="mt-10 space-y-4">
                  <button
                    type="button"
                    onClick={addToCart}
                    className="w-full bg-black text-white py-5 rounded-full uppercase tracking-[0.25em] text-xs hover:bg-black/80 transition"
                  >
                    {added ? "Added To Bag" : "Add To Shopping Bag"}
                  </button>

                  <button
                    type="button"
                    onClick={checkoutNow}
                    className="w-full border border-black py-5 rounded-full uppercase tracking-[0.25em] text-xs hover:bg-black hover:text-white transition"
                  >
                    Checkout
                  </button>
                </div>

                <p className="mt-6 text-center text-sm text-black/45">
                  Complimentary tracked delivery on every order.
                </p>

                <div className="mt-12">
                  {sections.map((section) => {
                    const isOpen = openSection === section.id;

                    return (
                      <div key={section.id} className="border-t border-black/10">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenSection(isOpen ? null : section.id)
                          }
                          className="w-full py-5 flex items-center justify-between text-left"
                        >
                          <span className="text-sm tracking-[0.18em]">
                            {section.title}
                          </span>

                          <ChevronDown
                            size={18}
                            className={`transition ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <p className="pb-6 text-black/55 leading-relaxed">
                            {section.content}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <div className="border-t border-black/10" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}