"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import supabase from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  category?: string | null;
  price: number;
  image_url: string;
};

type CollectionGroup = "upper" | "lower" | "accessories";
type CollectionFilter = "all" | CollectionGroup;

type CollectionProduct = Product & {
  collectionGroup: CollectionGroup;
  collectionIndex: string;
};

const FILTER_LABELS: Array<{
  value: CollectionFilter;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "upper", label: "Upper" },
  { value: "lower", label: "Lower" },
  { value: "accessories", label: "Objects" },
];

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

function getCollectionGroup(product: Product): CollectionGroup {
  const searchable = `${product.name} ${product.category || ""}`.toLowerCase();

  if (/trouser|pants?|lower|bottom/.test(searchable)) return "lower";

  if (
    /chain|cap|hat|jewel|accessor|object|perfume|fragrance/.test(searchable)
  ) {
    return "accessories";
  }

  return "upper";
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<CollectionFilter>("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

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
    if (!accessOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setAccessOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [accessOpen]);

  const collectionProducts = useMemo<CollectionProduct[]>(
    () =>
      products.map((product, index) => ({
        ...product,
        collectionGroup: getCollectionGroup(product),
        collectionIndex: twoDigits(index + 1),
      })),
    [products],
  );

  const visibleProducts = useMemo(
    () =>
      filter === "all"
        ? collectionProducts
        : collectionProducts.filter(
            (product) => product.collectionGroup === filter,
          ),
    [collectionProducts, filter],
  );

  const counts = useMemo(
    () => ({
      all: collectionProducts.length,
      upper: collectionProducts.filter(
        (product) => product.collectionGroup === "upper",
      ).length,
      lower: collectionProducts.filter(
        (product) => product.collectionGroup === "lower",
      ).length,
      accessories: collectionProducts.filter(
        (product) => product.collectionGroup === "accessories",
      ).length,
    }),
    [collectionProducts],
  );

  function openAccess() {
    setMenuOpen(false);
    setRequestSent(false);
    setAccessOpen(true);
  }

  function submitAccessRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestSent(true);
  }

  return (
    <div className="min-h-screen bg-[#f2efe8] text-[#0b0b0b] [font-family:Arial,Helvetica,sans-serif]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20 opacity-[0.035]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 180 180\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.65\'/%3E%3C/svg%3E")',
        }}
      />

      <header className="fixed inset-x-0 top-0 z-50 grid h-[76px] grid-cols-[1fr_auto_1fr] items-center border-b border-black/[0.17] bg-[#f2efe8]/[0.93] px-9 backdrop-blur-[18px] max-[900px]:grid-cols-[1fr_auto] max-[900px]:px-5">
        <nav
          aria-label="Primary"
          className="flex items-center gap-6 text-[10px] uppercase tracking-[0.15em] max-[900px]:hidden"
        >
          <Link
            href="/shop"
            aria-current="page"
            className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-current"
          >
            Collection
          </Link>
          <Link
            href="/about"
            className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100"
          >
            Story
          </Link>
        </nav>

        <Link
          href="/"
          aria-label="Paradise Angels home"
          className="whitespace-nowrap font-serif text-[17px] uppercase tracking-[0.28em] max-[900px]:col-start-1 max-[900px]:row-start-1 max-[560px]:text-sm max-[560px]:tracking-[0.21em]"
        >
          Paradise Angels
        </Link>

        <nav
          aria-label="Secondary"
          className="flex items-center justify-end gap-6 text-[10px] uppercase tracking-[0.15em] max-[900px]:hidden"
        >
          <Link
            href="/shop"
            className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100"
          >
            The First Wing
          </Link>
          <button
            type="button"
            onClick={openAccess}
            className="relative cursor-pointer bg-transparent uppercase tracking-[0.15em] after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100"
          >
            Private access
          </button>
        </nav>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((current) => !current)}
          className="hidden bg-transparent py-3 text-[10px] uppercase tracking-[0.14em] max-[900px]:col-start-2 max-[900px]:row-start-1 max-[900px]:block"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        {menuOpen && (
          <nav className="fixed inset-x-0 top-[76px] flex flex-col items-start gap-[22px] border-t border-black/[0.17] bg-[#f2efe8] px-5 py-[30px] text-[10px] uppercase tracking-[0.15em]">
            <Link href="/shop" onClick={() => setMenuOpen(false)}>
              Collection / The First Wing
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              Story
            </Link>
            <button
              type="button"
              onClick={openAccess}
              className="bg-transparent uppercase tracking-[0.15em]"
            >
              Private access
            </button>
          </nav>
        )}
      </header>

      <main>
        <section className="px-[4vw] pb-[70px] pt-40 max-[900px]:px-5 max-[900px]:pb-[55px] max-[900px]:pt-[130px]">
          <div className="mb-[25px] flex items-end justify-between gap-[30px] max-[900px]:flex-col max-[900px]:items-start">
            <p className="m-0 text-[10px] uppercase tracking-[0.2em]">
              Collection 001 · Eight pieces
            </p>

            <h1 className="m-0 font-serif text-[clamp(45px,6.8vw,98px)] font-normal leading-[0.9] tracking-[-0.045em]">
              The First <em className="font-normal">Wing</em>
            </h1>
          </div>

          <p className="ml-auto max-w-[440px] text-sm leading-[1.5] text-[#68655f] max-[900px]:ml-0">
            A complete opening statement in ink, bone and silver. Structured
            essentials, conceived in Amsterdam for a 2027 release.
          </p>
        </section>

        <div
          className="flex flex-wrap gap-2 px-[4vw] pb-[35px] max-[900px]:px-5 max-[900px]:pb-7"
          aria-label="Filter collection"
        >
          {FILTER_LABELS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`cursor-pointer rounded-[30px] border border-black/[0.17] px-[17px] py-[10px] text-[9px] uppercase tracking-[0.13em] transition-colors duration-300 ${
                filter === item.value
                  ? "bg-[#0b0b0b] text-[#f2efe8]"
                  : "bg-transparent text-[#0b0b0b] hover:bg-[#0b0b0b] hover:text-[#f2efe8]"
              }`}
            >
              {item.label} {twoDigits(counts[item.value])}
            </button>
          ))}
        </div>

        <section
          className="grid grid-cols-4 gap-x-3 gap-y-[50px] px-[4vw] pb-[120px] max-[900px]:grid-cols-2 max-[900px]:px-5 max-[900px]:pb-20 max-[560px]:gap-x-2 max-[560px]:gap-y-[38px]"
          aria-label="The First Wing products"
        >
          {loading &&
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[0.78] bg-[#d7d3ca]" />
                <div className="mt-[15px] h-3 w-1/2 bg-black/10" />
                <div className="mt-2 h-2 w-1/3 bg-black/[0.07]" />
              </div>
            ))}

          {!loading &&
            visibleProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group block min-w-0"
              >
                <div className="relative aspect-[0.78] overflow-hidden bg-[#d7d3ca]">
                  <img
                    src={product.image_url || "/black-hoodie.png"}
                    alt={product.name}
                    className="block h-full w-full object-cover transition duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035] group-hover:contrast-[1.05]"
                  />

                  <span className="absolute left-6 top-[25px] text-[9px] uppercase tracking-[0.2em] text-black/45">
                    PA / {product.collectionIndex}
                  </span>

                  <div className="absolute inset-x-3 bottom-3 grid h-[42px] translate-y-[58px] place-items-center bg-black/[0.88] text-[9px] uppercase tracking-[0.16em] text-[#f2efe8] transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
                    View piece
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-x-5 gap-y-1.5 pt-[15px] max-[560px]:grid-cols-1">
                  <span className="text-xs tracking-[0.02em]">
                    {product.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#6d6a64] max-[560px]:hidden">
                    {product.collectionIndex} / {twoDigits(products.length)}
                  </span>
                  <span className="col-span-full text-[10px] uppercase tracking-[0.15em] text-[#6d6a64]">
                    {product.category || "Paradise Angels"} · €
                    {Number(product.price).toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
        </section>

        {!loading && loadError && products.length === 0 && (
          <div className="mx-[4vw] mb-[120px] border border-black/[0.17] px-6 py-20 text-center text-xs uppercase tracking-[0.16em] text-black/55">
            The collection could not be loaded.
          </div>
        )}

        {!loading && !loadError && visibleProducts.length === 0 && (
          <div className="mx-[4vw] mb-[120px] border border-black/[0.17] px-6 py-20 text-center text-xs uppercase tracking-[0.16em] text-black/55">
            No pieces in this category.
          </div>
        )}

        <section className="mx-[4vw] mb-[4vw] grid min-h-[55vh] place-items-center bg-[#0b0b0b] px-5 py-[60px] text-center text-[#f2efe8]">
          <div>
            <p className="m-0 text-[10px] uppercase tracking-[0.2em]">
              Private release · 2027
            </p>
            <h2 className="mt-6 max-w-[800px] font-serif text-[clamp(45px,6.8vw,98px)] font-normal leading-[0.9] tracking-[-0.045em]">
              Be present when the
              <br />
              <em className="font-normal">eighth door opens.</em>
            </h2>
            <button
              type="button"
              onClick={openAccess}
              className="mx-auto mt-8 flex min-h-[52px] w-full max-w-[340px] items-center justify-between border border-[#f2efe8] bg-[#f2efe8] px-6 text-[9px] uppercase tracking-[0.16em] text-[#0b0b0b] transition hover:bg-white"
            >
              <span>Request private access</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </main>

      <footer className="flex min-h-[48vh] flex-col justify-between bg-[#0b0b0b] px-[4vw] pb-[35px] pt-20 text-[#f2efe8]">
        <div className="font-serif text-[clamp(47px,10.8vw,162px)] leading-[0.8] tracking-[-0.055em]">
          Paradise Angels
        </div>

        <div className="flex justify-between gap-5 text-[9px] uppercase tracking-[0.13em] text-[#f2efe8]/60 max-[560px]:flex-col">
          <span>Amsterdam · Est. 2027</span>
          <div className="flex gap-[22px]">
            <Link href="/">Home</Link>
            <Link href="/about">Story</Link>
            <button
              type="button"
              onClick={openAccess}
              className="bg-transparent uppercase tracking-[0.13em]"
            >
              Access
            </button>
          </div>
          <span>© {new Date().getFullYear()} HoPA</span>
        </div>
      </footer>

      {accessOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="access-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAccessOpen(false);
          }}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-5"
        >
          <div className="w-full max-w-[590px] bg-[#f2efe8] p-[42px] text-[#0b0b0b] max-[560px]:px-[22px] max-[560px]:py-7">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="m-0 text-[10px] uppercase tracking-[0.2em]">
                  Private release · 2027
                </p>
                <h2
                  id="access-title"
                  className="mb-[15px] mt-0 font-serif text-5xl font-normal leading-[0.9] max-[560px]:text-[39px]"
                >
                  Request access
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setAccessOpen(false)}
                className="bg-transparent text-[25px] leading-none"
              >
                ×
              </button>
            </div>

            {!requestSent ? (
              <>
                <p className="text-xs text-[#69655f]">
                  Leave your details to be considered for early access to The
                  First Wing.
                </p>

                <form
                  onSubmit={submitAccessRequest}
                  className="mt-7 grid gap-3"
                >
                  <label className="grid gap-[7px] text-[9px] uppercase tracking-[0.13em]">
                    Name
                    <input
                      name="name"
                      autoComplete="name"
                      required
                      className="min-h-[45px] rounded-none border-0 border-b border-black/[0.17] bg-transparent outline-none focus:border-black"
                    />
                  </label>

                  <label className="grid gap-[7px] text-[9px] uppercase tracking-[0.13em]">
                    Email
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="min-h-[45px] rounded-none border-0 border-b border-black/[0.17] bg-transparent outline-none focus:border-black"
                    />
                  </label>

                  <button
                    type="submit"
                    className="mt-4 flex min-h-[52px] items-center justify-between border border-black bg-black px-6 text-[9px] uppercase tracking-[0.16em] text-[#f2efe8]"
                  >
                    <span>Submit request</span>
                    <span aria-hidden="true">→</span>
                  </button>

                  <p className="text-[9px] text-[#69655f]">
                    Prototype preview: no details are transmitted or stored
                    yet.
                  </p>
                </form>
              </>
            ) : (
              <div className="grid min-h-[285px] place-items-center text-center">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#69655f]">
                    Request noted
                  </p>
                  <h2 className="font-serif text-5xl font-normal leading-[0.9]">
                    Until the door opens.
                  </h2>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
