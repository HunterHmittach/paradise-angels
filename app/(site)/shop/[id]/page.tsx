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

type Review = {
  id: number;
  product_id: number;
  user_id: string | null;
  customer_email: string | null;
  rating: number;
  review: string;
  created_at: string;
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

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  
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
  async function loadReviews() {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setReviews((data as Review[]) || []);
  }

  if (productId) {
    loadReviews();
  }
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

async function submitReview(e: React.FormEvent) {
  e.preventDefault();

  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session?.user) {
    window.location.href = "/login";
    return;
  }

  const user = sessionData.session.user;

  if (!reviewText.trim()) {
    alert("Please write a review.");
    return;
  }

  const { data, error } = await supabase
    .from("product_reviews")
    .insert({
      product_id: p.id,
      user_id: user.id,
      customer_email: user.email,
      rating: reviewRating,
      review: reviewText.trim(),
    })
    .select()
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  setReviews((prev) => [data as Review, ...prev]);
  setReviewText("");
  setReviewRating(5);
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
    <main className="min-h-screen bg-[#f7f6f2] text-black overflow-x-hidden">
      <section className="pt-28">
        <div className="h-5 w-full px-8 md:px-14 flex items-center justify-between bg-[#f7f6f2] border-b border-black/10">
  <Link
    href="/shop"
    className="relative -top-2.5 text-[10px] uppercase tracking-[0.35em] text-black/40"
  >
    ← Back
  </Link>

  <p className="relative -top-2.5 text-[10px] uppercase tracking-[0.4em] text-black/35">
    PA-{p.id}
  </p>
</div>

<div className="grid lg:grid-cols-[55%_45%]">
  {/* LEFT: BIG LV-STYLE IMAGE AREA */}
  <section className="bg-[#f1f0ec] border-r border-black/10">

            <div className="bg-[#f1f0ec]">
           {/* HERO */}
<div className="relative h-[90vh] min-h-[700px] overflow-hidden">
  <img
    src={galleryImages[0]}
    alt={p.name}
    className="w-full h-full object-cover"
  />
</div>

{/* 2 naast elkaar */}
{galleryImages.length > 2 && (
  <div className="grid grid-cols-2">
    <div className="h-[700px] overflow-hidden">
      <img
        src={galleryImages[1]}
        alt={p.name}
        className="w-full h-full object-cover"
      />
    </div>

    <div className="h-[700px] overflow-hidden">
      <img
        src={galleryImages[2]}
        alt={p.name}
        className="w-full h-full object-cover"
      />
    </div>
  </div>
)}

{/* brede foto */}
{galleryImages.length > 3 && (
  <div className="h-[900px] overflow-hidden">
    <img
      src={galleryImages[3]}
      alt={p.name}
      className="w-full h-full object-cover"
    />
  </div>
)}

  {/* WIDE IMAGE */}
  {galleryImages.length > 3 && (
    <div className="relative h-[680px] overflow-hidden border-t border-black/10">
      <img
        src={galleryImages[3]}
        alt={`${p.name} full look`}
        className="block h-full w-full object-cover object-center hover:scale-[1.03] transition duration-[2200ms]"
      />
    </div>
  )}

  {/* EXTRA FIFTH IMAGE */}
  {galleryImages.length > 4 && (
    <div className="relative h-[680px] overflow-hidden border-t border-black/10">
      <img
        src={galleryImages[4]}
        alt={`${p.name} editorial`}
        className="block h-full w-full object-cover object-center hover:scale-[1.03] transition duration-[2200ms]"
      />
    </div>
  )}
</div>
          </section>

          {/* RIGHT: CLEAN STICKY BUY PANEL */}
          <aside className="bg-[#fbfaf7]">
            <div className="lg:sticky lg:top-28 min-h-[calc(100vh-7rem)] px-8 md:px-16 py-14 flex items-center">
              <div className="w-full max-w-2xl mx-auto">
                <div className="flex items-start justify-between gap-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.45em] text-black/35">
                      {p.category || "Apparel"}
                    </p>

                    <h1 className="mt-7 font-serif text-4xl md:text-6xl uppercase tracking-[0.16em] leading-[1.05] max-w-full break-words">
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
                    className="w-full bg-black text-white py-6 uppercase tracking-[0.35em] text-[11px] hover:bg-[#1a1a1a] transition duration-700"
                  >
                    {added ? "Added To Bag" : "Add To Shopping Bag"}
                  </button>

                  <button
                    type="button"
                    onClick={checkoutNow}
                    className="w-full border border-black/20 py-6 uppercase tracking-[0.35em] text-[11px] hover:bg-black hover:text-white transition duration-700"
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
      <section className="border-t border-black/10 bg-[#f7f6f2] px-8 md:px-24 py-28">
  <div className="max-w-6xl mx-auto grid lg:grid-cols-[36%_64%] gap-20">
    <div>
      <p className="text-[10px] uppercase tracking-[0.55em] text-black/35">
        Customer Notes
      </p>

      <h2 className="mt-8 font-serif uppercase tracking-[0.14em] leading-[0.95] text-4xl md:text-6xl">
        Verified
        <br />
        Reviews
      </h2>

      <p className="mt-10 max-w-sm text-black/55 leading-[2]">
        Real impressions from customers who experienced Paradise Angels.
      </p>
    </div>

    <div>
      <form
        onSubmit={submitReview}
        className="border border-black/10 bg-white/35 p-8 md:p-10"
      >
        <p className="text-[10px] uppercase tracking-[0.45em] text-black/35">
          Leave A Review
        </p>

        <div className="mt-8 flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setReviewRating(star)}
              className={`text-2xl transition ${
                star <= reviewRating ? "text-black" : "text-black/20"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
          rows={4}
          placeholder="Share your experience..."
          className="mt-8 w-full bg-transparent border-b border-black/20 py-4 outline-none placeholder:text-black/30 focus:border-black resize-none"
        />

        <button
          type="submit"
          className="mt-8 border border-black px-10 py-4 uppercase tracking-[0.3em] text-xs hover:bg-black hover:text-white transition"
        >
          Submit Review
        </button>
      </form>

      <div className="mt-12 space-y-6">
        {reviews.length === 0 ? (
          <div className="border border-black/10 p-8 bg-white/25">
            <p className="text-black/50 leading-[2]">
              No reviews yet. Be the first verified customer to share your
              experience.
            </p>
          </div>
        ) : (
          reviews.map((item) => (
            <div
              key={item.id}
              className="border border-black/10 bg-white/25 p-8"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="tracking-[0.18em]">
                  {"★".repeat(item.rating)}
                  <span className="text-black/20">
                    {"★".repeat(5 - item.rating)}
                  </span>
                </div>

                <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">
                  Verified Customer
                </p>
              </div>

              <p className="mt-6 text-black/65 leading-[2]">{item.review}</p>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
</section>
    </main>
  );
}