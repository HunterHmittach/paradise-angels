"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
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

type Filter = "All" | "Apparel" | "Perfumes";
type Sort = "New" | "Price" | "Popular";

const FILTERS: Filter[] = ["All", "Apparel", "Perfumes"];

function collectionNumber(value: number) {
  return String(value).padStart(2, "0");
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [sort, setSort] = useState<Sort>("New");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Product load error:", error);
        setLoadError(true);
      }

      setProducts((data as Product[]) || []);
      setLoading(false);
    }

    loadProducts();
  }, []);

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

      if (data) setWishlist(data.map((item) => item.product_id));
    }

    loadWishlist();
  }, []);

  async function toggleWishlist(product: Product) {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session?.user) {
      window.location.href = "/login";
      return;
    }

    const user = sessionData.session.user;

    if (wishlist.includes(product.id)) {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id);

      if (error) {
        console.error("Wishlist delete error:", error);
        return;
      }

      setWishlist((current) =>
        current.filter((productId) => productId !== product.id),
      );
      return;
    }

    const { error } = await supabase.from("wishlists").insert({
      user_id: user.id,
      customer_email: user.email,
      product_id: product.id,
      product_name: product.name,
      product_image: product.image_url,
      price: product.price,
    });

    if (error) {
      console.error("Wishlist insert error:", error);
      return;
    }

    setWishlist((current) => [...current, product.id]);
  }

  const filteredProducts = useMemo(() => {
    const result = products.filter(
      (product) => filter === "All" || product.category === filter,
    );

    if (sort === "Price") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "Popular") {
      result.sort(
        (a, b) =>
          Number(Boolean(b.popular)) - Number(Boolean(a.popular)) ||
          b.id - a.id,
      );
    }

    if (sort === "New") {
      result.sort(
        (a, b) =>
          Number(Boolean(b.is_new)) - Number(Boolean(a.is_new)) || b.id - a.id,
      );
    }

    return result;
  }, [filter, products, sort]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f3f0e9] text-[#111111]">
      <header className="border-b border-black/15 px-5 pb-10 pt-36 sm:px-8 lg:px-12 lg:pb-14 lg:pt-44">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-black/55">
            <p>Collection 01</p>
            <p>Amsterdam · 2027</p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <h1 className="max-w-5xl font-serif text-[clamp(3.4rem,8vw,8.5rem)] uppercase leading-[0.82] tracking-[-0.035em]">
              The First
              <br />
              <span className="italic">Wing</span>
            </h1>

            <div className="max-w-xl lg:justify-self-end">
              <p className="text-base leading-8 text-black/60 sm:text-lg">
                Eight pieces mark the beginning. A study in restraint, identity
                and the moment before ascent.
              </p>

              <p className="mt-7 text-xs uppercase tracking-[0.34em] text-black/45">
                Eight doors · One beginning
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="sticky top-[88px] z-30 border-b border-black/15 bg-[#f3f0e9]/95 px-5 py-5 backdrop-blur-xl sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {FILTERS.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={`border-b pb-1 text-xs uppercase tracking-[0.28em] transition-colors duration-500 ${
                  filter === category
                    ? "border-black text-black"
                    : "border-transparent text-black/40 hover:text-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-black/45">
            <span>Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
              className="cursor-pointer border-0 bg-transparent py-1 text-xs uppercase tracking-[0.22em] text-black outline-none"
            >
              <option value="New">Newest</option>
              <option value="Price">Price</option>
              <option value="Popular">Popular</option>
            </select>
          </label>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1800px]">
          {loading && (
            <div className="grid grid-cols-1 gap-x-4 gap-y-16 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[0.78] bg-black/[0.06]" />
                  <div className="mt-5 h-4 w-1/2 bg-black/[0.06]" />
                  <div className="mt-3 h-3 w-1/3 bg-black/[0.05]" />
                </div>
              ))}
            </div>
          )}

          {!loading && loadError && products.length === 0 && (
            <div className="flex min-h-[45vh] items-center justify-center border border-black/15 px-6 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-black/50">
                The collection could not be loaded.
              </p>
            </div>
          )}

          {!loading && !loadError && filteredProducts.length === 0 && (
            <div className="flex min-h-[45vh] items-center justify-center border border-black/15 px-6 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-black/50">
                No pieces are available in this category.
              </p>
            </div>
          )}

          {!loading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-x-4 gap-y-16 sm:grid-cols-2 xl:grid-cols-4 xl:gap-y-24">
              {filteredProducts.map((product, index) => {
                const isSaved = wishlist.includes(product.id);
                const position = collectionNumber(index + 1);
                const total = collectionNumber(filteredProducts.length);

                return (
                  <article key={product.id} className="group min-w-0">
                    <div className="relative aspect-[0.78] overflow-hidden bg-[#e8e4dc]">
                      <Link
                        href={`/shop/${product.id}`}
                        aria-label={`View ${product.name}`}
                        className="absolute inset-0 z-10"
                      >
                        <img
                          src={product.image_url || "/black-hoodie.png"}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.025]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5" />

                        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-[#151515] px-6 py-5 text-white transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0">
                          <span className="text-xs uppercase tracking-[0.3em]">
                            View piece
                          </span>
                          <ArrowRight size={16} strokeWidth={1.4} />
                        </div>
                      </Link>

                      <span className="absolute left-5 top-5 z-20 text-xs uppercase tracking-[0.25em] text-black/35">
                        PA / {position}
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        aria-label={
                          isSaved
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                        }
                        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-[#f3f0e9]/85 text-black backdrop-blur-md transition hover:bg-white"
                      >
                        <Heart
                          size={16}
                          strokeWidth={1.5}
                          className={isSaved ? "fill-black" : ""}
                        />
                      </button>
                    </div>

                    <Link href={`/shop/${product.id}`} className="block pt-5">
                      <div className="flex items-start justify-between gap-5">
                        <h2 className="text-base leading-6 tracking-[-0.01em] transition-opacity group-hover:opacity-55">
                          {product.name}
                        </h2>
                        <p className="shrink-0 text-xs tracking-[0.24em] text-black/55">
                          {position} / {total}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-5 text-xs uppercase tracking-[0.2em] text-black/50">
                        <p>{product.category || "Paradise Angels"}</p>
                        <p>€{Number(product.price).toFixed(2)}</p>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-24 lg:pt-20">
        <div className="relative mx-auto flex min-h-[520px] max-w-[1800px] items-center justify-center overflow-hidden bg-[#111111] px-7 py-24 text-center text-[#f3f0e9]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_48%)]" />

          <div className="relative z-10 max-w-5xl">
            <p className="text-xs uppercase tracking-[0.34em] text-white/65">
              First release · 2027
            </p>

            <h2 className="mt-8 font-serif text-[clamp(3rem,7vw,7rem)] leading-[0.93] tracking-[-0.035em]">
              Be present when the
              <br />
              <span className="italic">eighth door opens.</span>
            </h2>

            <Link
              href="/about"
              className="mx-auto mt-12 flex w-full max-w-sm items-center justify-between bg-[#f3f0e9] px-7 py-6 text-xs uppercase tracking-[0.25em] text-black transition-colors duration-500 hover:bg-white"
            >
              <span>Discover the story</span>
              <ArrowRight size={16} strokeWidth={1.4} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
