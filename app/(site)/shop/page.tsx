"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import supabase from "@/lib/supabase";

type DatabaseProduct = {
  id: number;
  name: string;
};

type CollectionGroup = "upper" | "lower" | "accessories";
type CollectionFilter = "all" | CollectionGroup;
type GarmentShape = "hoodie" | "tee" | "trouser" | "chain" | "cap";

type CollectionPiece = {
  index: string;
  name: string;
  type: string;
  category: CollectionGroup;
  color: string;
  tone: string;
  accent: string;
  shape: GarmentShape;
};

const COLLECTION: CollectionPiece[] = [
  {
    index: "01",
    name: "Ascension Zip",
    type: "Zip hoodie",
    category: "upper",
    color: "Ink",
    tone: "#161616",
    accent: "#d5d0c6",
    shape: "hoodie",
  },
  {
    index: "02",
    name: "Halo Zip",
    type: "Zip hoodie",
    category: "upper",
    color: "Bone",
    tone: "#d8d2c6",
    accent: "#272623",
    shape: "hoodie",
  },
  {
    index: "03",
    name: "Seraph Tee",
    type: "T-shirt",
    category: "upper",
    color: "Chalk",
    tone: "#e4e0d6",
    accent: "#22211f",
    shape: "tee",
  },
  {
    index: "04",
    name: "Silence Tee",
    type: "T-shirt",
    category: "upper",
    color: "Obsidian",
    tone: "#111111",
    accent: "#d8d4ca",
    shape: "tee",
  },
  {
    index: "05",
    name: "Passage Trouser",
    type: "Trouser",
    category: "lower",
    color: "Coal",
    tone: "#242422",
    accent: "#d2cec4",
    shape: "trouser",
  },
  {
    index: "06",
    name: "Gate Trouser",
    type: "Trouser",
    category: "lower",
    color: "Sand",
    tone: "#c0b7a7",
    accent: "#292824",
    shape: "trouser",
  },
  {
    index: "07",
    name: "Eighth Door Chain",
    type: "Jewellery",
    category: "accessories",
    color: "Silver",
    tone: "#b7b6b2",
    accent: "#222222",
    shape: "chain",
  },
  {
    index: "08",
    name: "First Wing Cap",
    type: "Cap",
    category: "accessories",
    color: "Black",
    tone: "#151515",
    accent: "#d8d4ca",
    shape: "cap",
  },
];

const FILTERS: Array<{
  value: CollectionFilter;
  label: string;
  count: string;
}> = [
  { value: "all", label: "All", count: "08" },
  { value: "upper", label: "Upper", count: "04" },
  { value: "lower", label: "Lower", count: "02" },
  { value: "accessories", label: "Objects", count: "02" },
];

function normalizedName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findDatabaseProduct(
  piece: CollectionPiece,
  pieceIndex: number,
  products: DatabaseProduct[],
) {
  const exactMatch = products.find(
    (product) => normalizedName(product.name) === normalizedName(piece.name),
  );

  return exactMatch || products[pieceIndex];
}

function GarmentDrawing({ piece }: { piece: CollectionPiece }) {
  const background =
    piece.category === "accessories" ? "#cbc7be" : "#d7d3ca";
  const gradientId = `cloth-${piece.index}`;
  const shadowId = `shadow-${piece.index}`;
  const gradient = `url(#${gradientId})`;
  const shadow = `url(#${shadowId})`;

  return (
    <svg
      viewBox="0 0 500 650"
      role="img"
      aria-label={`${piece.name}, ${piece.color}`}
      xmlns="http://www.w3.org/2000/svg"
      className="block h-full w-full transition duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035] group-hover:contrast-[1.05]"
      style={{ background }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={piece.tone} />
          <stop offset=".55" stopColor={piece.tone} />
          <stop offset="1" stopColor={piece.accent} stopOpacity=".24" />
        </linearGradient>
        <filter id={shadowId}>
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodOpacity=".2" />
        </filter>
      </defs>

      <path d="M0 0h500v650H0z" fill="none" />

      {piece.shape === "hoodie" && (
        <g filter={shadow}>
          <path
            d="M176 188c8-47 34-79 74-79s67 32 75 79l61 37 68 122-66 40-36-55 13 225H136l13-225-36 55-66-40 68-122z"
            fill={gradient}
            stroke={piece.accent}
            strokeOpacity=".42"
          />
          <path
            d="M177 190c17 35 42 52 73 52s57-17 75-52c-5-50-29-81-75-81s-70 31-73 81z"
            fill="none"
            stroke={piece.accent}
            strokeOpacity=".52"
          />
          <path
            d="M250 241v316M176 420l74-12 74 12M166 504l84-34 84 34"
            fill="none"
            stroke={piece.accent}
            strokeOpacity=".44"
          />
          <circle cx="250" cy="270" r="3" fill={piece.accent} />
        </g>
      )}

      {piece.shape === "tee" && (
        <g filter={shadow}>
          <path
            d="M170 168l51-19c7 15 17 22 29 22s22-7 29-22l51 19 106 86-57 88-55-38 19 251H157l19-251-55 38-57-88z"
            fill={gradient}
            stroke={piece.accent}
            strokeOpacity=".42"
          />
          <path
            d="M221 149c2 28 12 41 29 41s27-13 29-41M158 527h184"
            fill="none"
            stroke={piece.accent}
            strokeOpacity=".48"
          />
          <path
            d="M239 207h22"
            stroke={piece.accent}
            strokeOpacity=".36"
          />
        </g>
      )}

      {piece.shape === "trouser" && (
        <g filter={shadow}>
          <path
            d="M148 117h204l18 198-49 249-78-1 7-254-7 254-78 1-35-249z"
            fill={gradient}
            stroke={piece.accent}
            strokeOpacity=".42"
          />
          <path
            d="M148 151h204M250 153v156M162 190l62 24M338 190l-62 24M181 538h62M259 538h62"
            fill="none"
            stroke={piece.accent}
            strokeOpacity=".48"
          />
          <circle cx="250" cy="134" r="3" fill={piece.accent} />
        </g>
      )}

      {piece.shape === "chain" && (
        <g
          filter={shadow}
          fill="none"
          stroke={gradient}
          strokeWidth="18"
        >
          <ellipse cx="250" cy="323" rx="135" ry="197" />
          <ellipse
            cx="171"
            cy="180"
            rx="25"
            ry="39"
            transform="rotate(-30 171 180)"
          />
          <ellipse
            cx="329"
            cy="180"
            rx="25"
            ry="39"
            transform="rotate(30 329 180)"
          />
          <ellipse
            cx="132"
            cy="285"
            rx="25"
            ry="39"
            transform="rotate(-8 132 285)"
          />
          <ellipse
            cx="368"
            cy="285"
            rx="25"
            ry="39"
            transform="rotate(8 368 285)"
          />
          <ellipse
            cx="167"
            cy="447"
            rx="25"
            ry="39"
            transform="rotate(26 167 447)"
          />
          <ellipse
            cx="333"
            cy="447"
            rx="25"
            ry="39"
            transform="rotate(-26 333 447)"
          />
          <ellipse cx="250" cy="508" rx="25" ry="39" />
          <ellipse cx="250" cy="130" rx="25" ry="39" />
        </g>
      )}

      {piece.shape === "cap" && (
        <g filter={shadow}>
          <path
            d="M112 350c10-118 57-190 142-190 89 0 137 72 143 190-83-31-190-31-285 0z"
            fill={gradient}
            stroke={piece.accent}
            strokeOpacity=".45"
          />
          <path
            d="M112 350c82-31 192-31 285 0 41 14 72 44 87 78-90-21-172-27-247-11-58 13-105-10-125-67z"
            fill={gradient}
            stroke={piece.accent}
            strokeOpacity=".45"
          />
          <path
            d="M254 160v164M173 190c42 37 69 82 81 134M335 190c-42 37-69 82-81 134"
            fill="none"
            stroke={piece.accent}
            strokeOpacity=".38"
          />
          <path
            d="M350 300c-24 6-44 18-61 38"
            fill="none"
            stroke={piece.accent}
            strokeOpacity=".72"
          />
        </g>
      )}

      <text
        x="25"
        y="35"
        fill="#111"
        opacity=".45"
        fontSize="9"
        letterSpacing="2"
      >
        PA / {piece.index}
      </text>
    </svg>
  );
}

export default function Shop() {
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [filter, setFilter] = useState<CollectionFilter>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    async function loadProductLinks() {
      const { data, error } = await supabase
        .from("products")
        .select("id, name")
        .order("id", { ascending: false });

      if (error) {
        console.error("Product link load error:", error);
        return;
      }

      setProducts((data as DatabaseProduct[]) || []);
    }

    loadProductLinks();
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

  const visiblePieces =
    filter === "all"
      ? COLLECTION
      : COLLECTION.filter((piece) => piece.category === filter);

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
          <Link href="/about" className="hover:opacity-50">
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
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-[30px] border border-black/[0.17] px-[17px] py-[10px] text-[9px] uppercase tracking-[0.13em] transition-colors duration-300 ${
                filter === item.value
                  ? "bg-[#0b0b0b] text-[#f2efe8]"
                  : "bg-transparent text-[#0b0b0b] hover:bg-[#0b0b0b] hover:text-[#f2efe8]"
              }`}
            >
              {item.label} {item.count}
            </button>
          ))}
        </div>

        <section
          className="grid grid-cols-4 gap-x-3 gap-y-[50px] px-[4vw] pb-[120px] max-[900px]:grid-cols-2 max-[900px]:px-5 max-[900px]:pb-20 max-[560px]:gap-x-2 max-[560px]:gap-y-[38px]"
          aria-label="The First Wing products"
        >
          {visiblePieces.map((piece) => {
            const pieceIndex = COLLECTION.findIndex(
              (item) => item.index === piece.index,
            );
            const databaseProduct = findDatabaseProduct(
              piece,
              pieceIndex,
              products,
            );
            const href = databaseProduct
              ? `/shop/${databaseProduct.id}`
              : "/shop";

            return (
              <Link
                key={piece.index}
                href={href}
                className="group block min-w-0"
              >
                <div className="relative aspect-[0.78] overflow-hidden bg-[#d7d3ca]">
                  <GarmentDrawing piece={piece} />
                  <div className="absolute inset-x-3 bottom-3 grid h-[42px] translate-y-[58px] place-items-center bg-black/[0.88] text-[9px] uppercase tracking-[0.16em] text-[#f2efe8] transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
                    View piece
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-x-5 gap-y-1.5 pt-[15px] max-[560px]:grid-cols-1">
                  <span className="text-xs tracking-[0.02em]">{piece.name}</span>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#6d6a64] max-[560px]:hidden">
                    {piece.index} / 08
                  </span>
                  <span className="col-span-full text-[10px] uppercase tracking-[0.15em] text-[#6d6a64]">
                    {piece.type} · {piece.color}
                  </span>
                </div>
              </Link>
            );
          })}
        </section>

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
              className="mx-auto mt-8 flex min-h-[52px] w-full max-w-[340px] items-center justify-between border border-[#f2efe8] bg-[#f2efe8] px-6 text-[9px] uppercase tracking-[0.16em] text-[#0b0b0b] hover:bg-white"
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
