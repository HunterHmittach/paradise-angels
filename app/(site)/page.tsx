import Link from "next/link";
import { COLLECTION, GarmentDrawing } from "./shop/first-wing";

const FEATURED = COLLECTION.slice(0, 3);

function WingEight() {
  return (
    <div
      aria-hidden="true"
      className="relative grid h-full min-h-[calc(100svh-83px)] place-items-center overflow-hidden max-[900px]:min-h-[58svh]"
    >
      <span className="absolute inset-y-0 left-1/2 w-px bg-[#f2efe8]/15" />
      <span className="pa-wing pa-wing-left" />
      <span className="pa-wing pa-wing-right" />
      <span className="relative z-10 [font-family:Times_New_Roman,Times,serif] text-[clamp(190px,25vw,390px)] font-normal italic leading-none text-[#f2efe8]">
        8
      </span>
      <span className="absolute bottom-8 left-8 text-[10px] uppercase tracking-[0.2em] text-[#f2efe8]/55 max-[560px]:bottom-5 max-[560px]:left-5">
        Eight doors · One beginning
      </span>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#f2efe8] [font-family:Arial,Helvetica,sans-serif]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20 opacity-[0.035]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 180 180\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.65\'/%3E%3C/svg%3E")',
        }}
      />

      <main className="pt-[83px]">
        <section className="grid min-h-[calc(100svh-83px)] grid-cols-2 bg-[#121211] max-[900px]:grid-cols-1">
          <div className="border-r border-[#f2efe8]/15 max-[900px]:border-b max-[900px]:border-r-0">
            <WingEight />
          </div>

          <div className="flex min-h-[calc(100svh-83px)] items-center px-[9vw] py-[10vw] max-[900px]:min-h-0 max-[900px]:px-7 max-[900px]:py-20">
            <div>
              <p className="m-0 text-[10px] uppercase tracking-[0.2em] text-[#f2efe8]/75">
                Collection 001 · House code 008
              </p>
              <h1 className="mb-11 mt-7 [font-family:Times_New_Roman,Times,serif] text-[clamp(45px,4.7vw,72px)] font-normal leading-[0.96] tracking-[-0.035em]">
                “The door is not
                <br />
                found. It is
                <br />
                <em className="font-normal">earned.”</em>
              </h1>
              <p className="max-w-[430px] text-base leading-[1.7] text-[#f2efe8]/65">
                The First Wing begins with eight pieces: seven thresholds and an
                eighth that opens into possibility. A first collection built not
                around noise, but around meaning.
              </p>
              <Link
                href="/shop"
                className="mt-9 inline-flex items-center gap-8 border-b border-[#f2efe8]/45 pb-2 text-[11px] uppercase tracking-[0.18em] transition-all duration-300 hover:gap-11 hover:border-[#f2efe8]"
              >
                Enter The First Wing <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#f2efe8] px-[4vw] py-[120px] text-[#0b0b0b] max-[900px]:px-5 max-[900px]:py-[85px]">
          <div className="mb-[54px] flex items-end justify-between gap-8 max-[900px]:flex-col max-[900px]:items-start">
            <div>
              <p className="m-0 text-[10px] uppercase tracking-[0.2em]">
                Selected pieces · 01—03
              </p>
              <h2 className="m-0 mt-3 [font-family:Times_New_Roman,Times,serif] text-[clamp(45px,6.8vw,98px)] font-normal leading-[0.9] tracking-[-0.045em]">
                Made for the
                <br />
                <em className="font-normal">unmatched.</em>
              </h2>
            </div>
            <Link
              href="/shop"
              className="relative text-[10px] uppercase tracking-[0.2em] after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100"
            >
              View all eight →
            </Link>
          </div>

          <div className="grid grid-cols-[1.25fr_.75fr_.75fr] gap-3 max-[900px]:flex max-[900px]:snap-x max-[900px]:overflow-x-auto max-[900px]:pb-5">
            {FEATURED.map((piece, index) => (
              <Link
                key={piece.slug}
                href={`/shop/${piece.slug}`}
                className="group min-w-0 max-[900px]:w-[76vw] max-[900px]:shrink-0 max-[900px]:snap-start max-[560px]:w-[84vw]"
              >
                <div
                  className={`relative overflow-hidden ${
                    index === 0 ? "aspect-[0.86]" : "aspect-[0.78]"
                  }`}
                >
                  <GarmentDrawing piece={piece} />
                  <span className="absolute inset-x-3 bottom-3 grid h-[42px] translate-y-[58px] place-items-center bg-[#0b0b0b]/90 text-[9px] uppercase tracking-[0.16em] text-[#f2efe8] transition-transform duration-500 group-hover:translate-y-0">
                    View piece
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-x-5 gap-y-1.5 pt-[15px]">
                  <span className="text-sm tracking-[0.02em]">{piece.name}</span>
                  <span className="text-xs uppercase tracking-[0.15em] text-[#6d6a64]">
                    {piece.index} / 08
                  </span>
                  <span className="col-span-full text-xs uppercase tracking-[0.15em] text-[#6d6a64]">
                    {piece.type} · {piece.color}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid min-h-[68vh] grid-cols-[0.72fr_1.28fr] border-t border-[#f2efe8]/15 bg-[#0b0b0b] max-[900px]:grid-cols-1">
          <div className="flex items-end border-r border-[#f2efe8]/15 p-[4vw] max-[900px]:min-h-[32vh] max-[900px]:border-b max-[900px]:border-r-0 max-[900px]:p-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2efe8]/55">
                Chapter I · Amsterdam 2027
              </p>
              <p className="mt-4 text-[11px] uppercase tracking-[0.2em]">
                Silence is luxury
              </p>
            </div>
          </div>
          <div className="flex items-center px-[9vw] py-[9vw] max-[900px]:px-7 max-[900px]:py-20">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2efe8]/55">
                The story
              </p>
              <h2 className="my-7 [font-family:Times_New_Roman,Times,serif] text-[clamp(48px,6vw,92px)] font-normal leading-[0.88] tracking-[-0.045em]">
                Seven thresholds.
                <br />
                <em className="font-normal">An eighth beginning.</em>
              </h2>
              <Link
                href="/about"
                className="inline-flex items-center gap-8 border-b border-[#f2efe8]/45 pb-2 text-[11px] uppercase tracking-[0.18em] transition-all duration-300 hover:gap-11 hover:border-[#f2efe8]"
              >
                Read our story <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex min-h-[48vh] flex-col justify-between border-t border-[#f2efe8]/15 bg-[#0b0b0b] px-[4vw] pb-9 pt-20 text-[#f2efe8]">
        <div className="whitespace-nowrap [font-family:Times_New_Roman,Times,serif] text-[clamp(47px,10.8vw,162px)] leading-[0.8] tracking-[-0.055em]">
          Paradise Angels
        </div>
        <div className="flex justify-between gap-5 text-[10px] uppercase tracking-[0.13em] text-[#f2efe8]/60 max-[560px]:flex-col">
          <span>Amsterdam · Est. 2027</span>
          <div className="flex gap-[22px]">
            <Link href="/shop">Collection</Link>
            <Link href="/about">Story</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <span>© {new Date().getFullYear()} Paradise Angels</span>
        </div>
      </footer>

      <style>{`
        .pa-wing {
          position: absolute;
          top: 16%;
          width: 44%;
          height: 68%;
          border: 1px solid rgba(242, 239, 232, 0.25);
          border-radius: 100% 8% 100% 0;
          will-change: transform;
        }

        .pa-wing-left {
          left: 15%;
          transform: rotate(-26deg) skewY(-8deg);
          animation: pa-wing-left 9s ease-in-out infinite alternate;
        }

        .pa-wing-right {
          right: 15%;
          transform: scaleX(-1) rotate(-26deg) skewY(-8deg);
          animation: pa-wing-right 9s ease-in-out infinite alternate;
        }

        @keyframes pa-wing-left {
          to { transform: rotate(-23deg) skewY(-8deg) translateY(-8px); }
        }

        @keyframes pa-wing-right {
          to { transform: scaleX(-1) rotate(-23deg) skewY(-8deg) translateY(-8px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .pa-wing { animation: none; }
        }
      `}</style>
    </div>
  );
}
