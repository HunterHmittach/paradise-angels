"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { COLLECTION, GarmentDrawing } from "../first-wing";

const SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductPage() {
  const params = useParams();
  const requestedSlug = Array.isArray(params.id)
    ? params.id[0]
    : String(params.id || "");
  const currentIndex = COLLECTION.findIndex(
    (piece) => piece.slug === requestedSlug,
  );
  const product = COLLECTION[currentIndex];

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

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

  function openAccess() {
    setMenuOpen(false);
    setRequestSent(false);
    setAccessOpen(true);
  }

  function submitAccessRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestSent(true);
  }

  if (!product) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f2efe8] px-6 text-center text-[#0b0b0b]">
        <div>
          <h1 className="[font-family:Times_New_Roman,Times,serif] text-5xl font-normal">Piece not found</h1>
          <Link
            href="/shop"
            className="mt-8 inline-block text-[10px] uppercase tracking-[0.16em] underline underline-offset-4"
          >
            Return to collection
          </Link>
        </div>
      </div>
    );
  }

  const previous = COLLECTION[(currentIndex - 1 + COLLECTION.length) % COLLECTION.length];
  const next = COLLECTION[(currentIndex + 1) % COLLECTION.length];

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

      <header className="fixed inset-x-0 top-0 z-50 grid h-[83px] grid-cols-[1fr_auto_1fr] items-center border-b border-black/[0.17] bg-[#f2efe8]/[0.93] px-[39px] backdrop-blur-[18px] max-[900px]:grid-cols-[1fr_auto] max-[900px]:px-5">
        <nav
          aria-label="Primary"
          className="flex items-center gap-[26px] text-[11px] uppercase tracking-[0.15em] max-[900px]:hidden"
        >
          <Link href="/shop" className="hover:opacity-50">
            ← Collection
          </Link>
          <Link href="/about" className="hover:opacity-50">
            Story
          </Link>
        </nav>

        <Link
          href="/"
          aria-label="Paradise Angels home"
          className="whitespace-nowrap [font-family:Times_New_Roman,Times,serif] text-[18.5px] uppercase tracking-[0.28em] max-[900px]:col-start-1 max-[900px]:row-start-1 max-[560px]:text-sm max-[560px]:tracking-[0.21em]"
        >
          Paradise Angels
        </Link>

        <nav
          aria-label="Secondary"
          className="flex items-center gap-[26px] text-[11px] uppercase tracking-[0.15em] max-[900px]:hidden"
        >
          <Link href="/shop" className="hover:opacity-50">
            The First Wing
          </Link>
          <button
            type="button"
            onClick={openAccess}
            className="bg-transparent uppercase tracking-[0.15em] hover:opacity-50"
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
          <nav className="fixed inset-x-0 top-[83px] flex flex-col items-start gap-[22px] border-t border-black/[0.17] bg-[#f2efe8] px-5 py-[30px] text-[10px] uppercase tracking-[0.15em]">
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
        <section className="grid min-h-[100svh] grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)] max-[900px]:grid-cols-1">
          <div className="sticky top-0 grid min-h-[100svh] place-items-center overflow-hidden bg-[#d4d0c7] max-[900px]:relative max-[900px]:min-h-[70svh]">
            <GarmentDrawing
              piece={product}
              className="h-[78%] w-[78%]"
            />
            <span className="absolute bottom-[25px] left-7 [font-family:Times_New_Roman,Times,serif] text-[54px] italic">
              {product.index}
            </span>
          </div>

          <div className="flex min-h-[100svh] flex-col justify-center px-[8vw] pb-20 pt-[150px] max-[900px]:min-h-0 max-[900px]:px-6 max-[900px]:py-[75px]">
            <p className="m-0 text-[10px] uppercase tracking-[0.2em]">
              The First Wing · {product.index} / 08
            </p>

            <h1 className="mb-[25px] mt-4 [font-family:Times_New_Roman,Times,serif] text-[clamp(47px,5.5vw,82px)] font-normal leading-[0.89] tracking-[-0.045em]">
              {product.name}
            </h1>

            <p className="max-w-[450px] text-[13px] leading-[1.5] text-[#5e5b55]">
              {product.story}
            </p>

            <div className="my-8 flex justify-between border-y border-black/[0.17] py-[19px] text-[9px] uppercase tracking-[0.14em]">
              <span>{product.color}</span>
              <span>Preview · 2027</span>
            </div>

            {product.category !== "accessories" && (
              <div className="mb-[30px]">
                <span className="mb-3 block text-[9px] uppercase tracking-[0.15em]">
                  Preview size
                </span>
                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label="Select size"
                >
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`grid h-[43px] w-[43px] place-items-center border border-black/[0.17] text-xs transition ${
                        selectedSize === size
                          ? "bg-[#0b0b0b] text-[#f2efe8]"
                          : "bg-transparent hover:bg-[#0b0b0b] hover:text-[#f2efe8]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={openAccess}
              className="flex min-h-14 items-center justify-between gap-[60px] border border-[#0b0b0b] bg-[#0b0b0b] px-6 text-[9px] uppercase tracking-[0.15em] text-[#f2efe8] transition hover:bg-transparent hover:text-[#0b0b0b]"
            >
              <span>Request access to this piece</span>
              <span aria-hidden="true">→</span>
            </button>

            <dl className="mt-9 border-t border-black/[0.17]">
              {[
                ["Material", product.material],
                ["Silhouette", product.fit],
                ["Details", product.detail],
                ["Note", "Prototype specifications are subject to final sampling."],
              ].map(([term, description]) => (
                <div
                  key={term}
                  className="grid grid-cols-[130px_1fr] gap-5 border-b border-black/[0.17] py-4 text-[11px] max-[560px]:grid-cols-1 max-[560px]:gap-2"
                >
                  <dt className="uppercase tracking-[0.12em] text-[#716e68]">
                    {term}
                  </dt>
                  <dd className="m-0">{description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <nav
          aria-label="Browse products"
          className="grid grid-cols-2 border-t border-black/[0.17] max-[560px]:grid-cols-1"
        >
          <Link
            href={`/shop/${previous.slug}`}
            className="flex justify-between px-[4vw] py-9 text-[9px] uppercase tracking-[0.14em] transition hover:bg-[#0b0b0b] hover:text-[#f2efe8]"
          >
            <span>← Previous</span>
            <span>{previous.name}</span>
          </Link>
          <Link
            href={`/shop/${next.slug}`}
            className="flex justify-between border-l border-black/[0.17] px-[4vw] py-9 text-[9px] uppercase tracking-[0.14em] transition hover:bg-[#0b0b0b] hover:text-[#f2efe8] max-[560px]:border-l-0 max-[560px]:border-t"
          >
            <span>{next.name}</span>
            <span>Next →</span>
          </Link>
        </nav>
      </main>

      <footer className="flex min-h-[48vh] flex-col justify-between bg-[#0b0b0b] px-[4vw] pb-[35px] pt-20 text-[#f2efe8]">
        <div className="[font-family:Times_New_Roman,Times,serif] text-[clamp(47px,10.8vw,162px)] leading-[0.8] tracking-[-0.055em]">
          Paradise Angels
        </div>
        <div className="flex justify-between gap-5 text-[9px] uppercase tracking-[0.13em] text-[#f2efe8]/60 max-[560px]:flex-col">
          <span>Amsterdam · Est. 2027</span>
          <div className="flex gap-[22px]">
            <Link href="/shop">Collection</Link>
            <Link href="/about">Story</Link>
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
                  className="mb-[15px] mt-0 [font-family:Times_New_Roman,Times,serif] text-5xl font-normal leading-[0.9] max-[560px]:text-[39px]"
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
                  Register your interest in {product.name} and the private
                  release.
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
                  <h2 className="[font-family:Times_New_Roman,Times,serif] text-5xl font-normal leading-[0.9]">
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
