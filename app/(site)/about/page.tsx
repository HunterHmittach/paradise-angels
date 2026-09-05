"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  COLLECTION,
  GarmentDrawing,
  type CollectionPiece,
} from "../shop/first-wing";

const DOOR_MEANINGS: Record<string, { title: string; copy: string }> = {
  "ascension-zip": {
    title: "Ascension",
    copy: "The first movement upward. Restraint becomes direction and the journey takes form.",
  },
  "halo-zip": {
    title: "Light",
    copy: "A quiet counterpoint to shadow. Proof that softness can still hold structure.",
  },
  "seraph-tee": {
    title: "Purity",
    copy: "Reduced to what matters: proportion, weight and the confidence to leave space untouched.",
  },
  "silence-tee": {
    title: "Silence",
    copy: "Presence without announcement. A piece that holds attention before a mark asks for it.",
  },
  "passage-trouser": {
    title: "Passage",
    copy: "Made for the distance between where you began and what you are becoming.",
  },
  "gate-trouser": {
    title: "Threshold",
    copy: "A gate is both an ending and an invitation. Crossing it is always a choice.",
  },
  "eighth-door-chain": {
    title: "Connection",
    copy: "Eight forms held as one. Each link remembers the threshold before it.",
  },
  "first-wing-cap": {
    title: "Flight",
    copy: "The final piece of the chapter, carrying the sign that the first movement has begun.",
  },
};

function ChapterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 text-xs uppercase tracking-[0.2em] opacity-55">
      {children}
    </p>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function OpeningDoor() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const leftX = useTransform(scrollYProgress, [0, 0.72], ["0%", "-96%"]);
  const rightX = useTransform(scrollYProgress, [0, 0.72], ["0%", "96%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.28, 0.58], [1, 1, 0]);
  const insideScale = useTransform(scrollYProgress, [0, 0.75], [0.9, 1]);
  const insideOpacity = useTransform(scrollYProgress, [0.1, 0.72], [0.15, 1]);

  return (
    <section ref={sectionRef} className="relative h-[190svh] bg-[#f2efe8]">
      <div className="sticky top-[83px] h-[calc(100svh-83px)] overflow-hidden bg-[#f2efe8] text-[#0b0b0b]">
        <motion.div
          style={{
            scale: reduceMotion ? 1 : insideScale,
            opacity: reduceMotion ? 1 : insideOpacity,
          }}
          className="absolute inset-0 grid place-items-center px-6 text-center"
        >
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-full w-px bg-black/15"
          />
          <div className="relative z-10">
            <p className="mb-7 text-xs uppercase tracking-[0.25em] opacity-55">
              House code
            </p>
            <p className="m-0 [font-family:Times_New_Roman,Times,serif] text-[clamp(150px,29vw,440px)] italic leading-[0.65] tracking-[-0.09em]">
              VIII
            </p>
            <p className="mx-auto mt-12 max-w-[540px] [font-family:Times_New_Roman,Times,serif] text-[clamp(27px,3vw,43px)] leading-[1.05]">
              The house does not claim arrival.
              <br />
              <em>It marks the direction.</em>
            </p>
          </div>
          <p className="absolute bottom-7 left-7 m-0 text-xs uppercase tracking-[0.18em] opacity-55">
            Amsterdam · Est. 2027
          </p>
          <p className="absolute bottom-7 right-7 m-0 text-xs uppercase tracking-[0.18em] opacity-55">
            The story begins
          </p>
        </motion.div>

        <motion.div
          style={{ x: reduceMotion ? "-96%" : leftX }}
          className="absolute inset-y-0 left-0 z-10 w-1/2 border-r border-[#f2efe8]/20 bg-[#0b0b0b]"
        />
        <motion.div
          style={{ x: reduceMotion ? "96%" : rightX }}
          className="absolute inset-y-0 right-0 z-10 w-1/2 border-l border-[#f2efe8]/20 bg-[#0b0b0b]"
        />

        <motion.div
          style={{ opacity: reduceMotion ? 0 : titleOpacity }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center text-[#f2efe8]"
        >
          <p className="mb-8 text-xs uppercase tracking-[0.25em] opacity-60">
            Paradise Angels presents
          </p>
          <h1 className="m-0 [font-family:Times_New_Roman,Times,serif] text-[clamp(64px,10vw,158px)] font-normal leading-[0.76] tracking-[-0.055em]">
            The Eighth
            <br />
            <em className="font-normal">Door.</em>
          </h1>
          <p className="absolute bottom-8 text-xs uppercase tracking-[0.2em] opacity-50">
            Scroll to enter ↓
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function EightDoorsArchive() {
  const [activePiece, setActivePiece] = useState<CollectionPiece>(COLLECTION[0]);

  return (
    <section className="bg-[#0b0b0b] py-[10vw] text-[#f2efe8] max-[900px]:py-24">
      <div className="mb-16 grid grid-cols-[0.55fr_1.45fr] gap-8 px-[4vw] max-[900px]:grid-cols-1 max-[900px]:px-5">
        <ChapterLabel>Chapter III · The First Wing</ChapterLabel>
        <Reveal>
          <h2 className="m-0 [font-family:Times_New_Roman,Times,serif] text-[clamp(52px,7.5vw,116px)] font-normal leading-[0.82] tracking-[-0.06em]">
            Eight doors.
            <br />
            <em className="font-normal">Choose one.</em>
          </h2>
          <p className="mb-0 mt-9 max-w-[560px] text-base leading-[1.7] text-[#f2efe8]/55">
            Each piece carries its own threshold. Move across the doors to
            reveal the meaning held behind the form.
          </p>
        </Reveal>
      </div>

      <div className="mx-[4vw] flex h-[720px] overflow-hidden border-y border-[#f2efe8]/20 max-[900px]:hidden">
        {COLLECTION.map((piece) => {
          const active = activePiece.slug === piece.slug;
          const meaning = DOOR_MEANINGS[piece.slug];

          return (
            <div
              key={piece.slug}
              onMouseEnter={() => setActivePiece(piece)}
              className={`relative min-w-0 overflow-hidden border-r border-[#f2efe8]/20 transition-[flex] duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] last:border-r-0 ${
                active ? "flex-[5] bg-[#d8d4cb]" : "flex-[0.65] bg-[#111110]"
              }`}
            >
              {active ? (
                <div className="grid h-full grid-cols-[1.08fr_.92fr] text-[#0b0b0b]">
                  <div className="relative min-w-0 overflow-hidden border-r border-black/15">
                    <GarmentDrawing piece={piece} />
                    <span className="absolute left-5 top-5 text-xs uppercase tracking-[0.18em] opacity-50">
                      Door {piece.index} / 08
                    </span>
                  </div>

                  <div className="flex min-w-[270px] flex-col justify-between p-[3vw]">
                    <div className="flex items-start justify-between gap-5 text-xs uppercase tracking-[0.16em] opacity-50">
                      <span>{piece.type}</span>
                      <span>{piece.color}</span>
                    </div>
                    <div>
                      <p className="mb-6 text-xs uppercase tracking-[0.2em] opacity-50">
                        {meaning.title}
                      </p>
                      <h3 className="m-0 [font-family:Times_New_Roman,Times,serif] text-[clamp(39px,4.1vw,64px)] font-normal leading-[0.85] tracking-[-0.045em]">
                        {piece.name}
                      </h3>
                      <p className="mb-0 mt-8 text-base leading-[1.7] text-black/65">
                        {meaning.copy}
                      </p>
                    </div>
                    <Link
                      href={`/shop/${piece.slug}`}
                      className="inline-flex w-fit items-center gap-8 border-b border-black/45 pb-2 text-xs uppercase tracking-[0.17em] transition-all hover:gap-11 hover:border-black"
                    >
                      View piece <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label={`Open door ${piece.index}: ${piece.name}`}
                  onFocus={() => setActivePiece(piece)}
                  onClick={() => setActivePiece(piece)}
                  className="flex h-full w-full flex-col items-center justify-between bg-transparent py-7 text-[#f2efe8] focus-visible:outline focus-visible:outline-1 focus-visible:outline-inset focus-visible:outline-[#f2efe8]"
                >
                  <span className="text-xs tracking-[0.18em] opacity-45">
                    {piece.index}
                  </span>
                  <span className="[writing-mode:vertical-rl] rotate-180 [font-family:Times_New_Roman,Times,serif] text-[clamp(21px,1.7vw,29px)] leading-none">
                    {piece.name}
                  </span>
                  <span className="text-sm opacity-45" aria-hidden="true">
                    +
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mx-5 hidden border-t border-[#f2efe8]/20 max-[900px]:block">
        {COLLECTION.map((piece) => {
          const active = activePiece.slug === piece.slug;
          const meaning = DOOR_MEANINGS[piece.slug];

          return (
            <article key={piece.slug} className="border-b border-[#f2efe8]/20">
              <button
                type="button"
                aria-expanded={active}
                onClick={() => setActivePiece(piece)}
                className="grid w-full grid-cols-[42px_1fr_auto] items-center gap-4 bg-transparent py-6 text-left text-[#f2efe8]"
              >
                <span className="text-xs tracking-[0.16em] opacity-45">
                  {piece.index}
                </span>
                <span className="[font-family:Times_New_Roman,Times,serif] text-[clamp(25px,7vw,37px)] leading-none">
                  {piece.name}
                </span>
                <span className="text-xl font-light" aria-hidden="true">
                  {active ? "−" : "+"}
                </span>
              </button>

              {active && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="pb-7"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-[#d8d4cb]">
                    <GarmentDrawing piece={piece} />
                  </div>
                  <div className="bg-[#d8d4cb] p-6 text-[#0b0b0b]">
                    <p className="m-0 text-xs uppercase tracking-[0.18em] opacity-50">
                      {meaning.title} · {piece.type} · {piece.color}
                    </p>
                    <p className="mb-0 mt-5 text-base leading-[1.7] text-black/65">
                      {meaning.copy}
                    </p>
                    <Link
                      href={`/shop/${piece.slug}`}
                      className="mt-7 inline-flex items-center gap-7 border-b border-black/45 pb-2 text-xs uppercase tracking-[0.17em]"
                    >
                      View piece <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function InfinityEnding() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative grid min-h-[calc(100svh-83px)] place-items-center overflow-hidden bg-[#0b0b0b] px-6 py-24 text-center text-[#f2efe8]">
      <span className="absolute inset-y-0 left-1/2 w-px bg-[#f2efe8]/15" />
      <motion.span
        aria-hidden="true"
        initial={reduceMotion ? false : { rotate: 0, opacity: 0.18 }}
        whileInView={reduceMotion ? undefined : { rotate: 90, opacity: 1 }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute [font-family:Times_New_Roman,Times,serif] text-[clamp(270px,52vw,790px)] italic leading-none"
      >
        8
      </motion.span>

      <Reveal>
        <div className="relative z-10 mx-auto max-w-[850px]">
          <ChapterLabel>Chapter IV · Becoming</ChapterLabel>
          <h2 className="mb-10 mt-7 [font-family:Times_New_Roman,Times,serif] text-[clamp(48px,7.7vw,118px)] font-normal leading-[0.82] tracking-[-0.055em]">
            Not the destination.
            <br />
            <em className="font-normal">The first evidence of flight.</em>
          </h2>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-8 border-b border-[#f2efe8]/50 pb-2 text-xs uppercase tracking-[0.18em] transition-all duration-300 hover:gap-11 hover:border-[#f2efe8]"
          >
            Enter The First Wing <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-clip bg-[#0b0b0b] [font-family:Arial,Helvetica,sans-serif]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.035]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 180 180\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.65\'/%3E%3C/svg%3E")',
        }}
      />

      <main className="pt-[83px]">
        <OpeningDoor />

        <section className="bg-[#f2efe8] px-[7vw] py-[13vw] text-[#0b0b0b] max-[900px]:px-6 max-[900px]:py-24">
          <Reveal>
            <div className="grid grid-cols-[0.55fr_1.45fr] gap-[8vw] max-[900px]:grid-cols-1 max-[900px]:gap-12">
              <ChapterLabel>Chapter I · The beginning</ChapterLabel>
              <div>
                <h2 className="m-0 [font-family:Times_New_Roman,Times,serif] text-[clamp(54px,8.4vw,132px)] font-normal leading-[0.81] tracking-[-0.06em]">
                  Before the
                  <br />
                  <em className="font-normal">first garment.</em>
                </h2>
                <div className="ml-auto mt-16 max-w-[590px] border-l border-black/20 pl-8 max-[560px]:mt-11 max-[560px]:pl-5">
                  <p className="m-0 text-lg leading-[1.75] text-black/70">
                    Paradise Angels is being built in Amsterdam for 2027. It
                    begins with a refusal: clothing does not need noise to hold
                    meaning. Form, material and proportion can speak before a
                    logo does.
                  </p>
                  <p className="mb-0 mt-7 text-lg leading-[1.75] text-black/70">
                    The house is for those who choose their own direction and
                    carry conviction quietly. Not made to fit every category.
                    Made for the unmatched.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="grid min-h-screen grid-cols-2 border-y border-[#f2efe8]/15 bg-[#111110] text-[#f2efe8] max-[900px]:grid-cols-1">
          <div className="relative grid place-items-center overflow-hidden border-r border-[#f2efe8]/15 px-6 py-24 max-[900px]:min-h-[65svh] max-[900px]:border-b max-[900px]:border-r-0">
            <span className="absolute inset-y-0 left-1/2 w-px bg-[#f2efe8]/15" />
            <span className="absolute inset-x-0 top-1/2 h-px bg-[#f2efe8]/15" />
            <Reveal>
              <p className="m-0 [font-family:Times_New_Roman,Times,serif] text-[clamp(190px,32vw,490px)] italic leading-[0.65] tracking-[-0.1em]">
                8
              </p>
            </Reveal>
          </div>

          <div className="flex items-center px-[8vw] py-[11vw] max-[900px]:px-6 max-[900px]:py-24">
            <Reveal>
              <ChapterLabel>Chapter II · House code 008</ChapterLabel>
              <h2 className="mb-12 mt-7 [font-family:Times_New_Roman,Times,serif] text-[clamp(53px,6.7vw,103px)] font-normal leading-[0.84] tracking-[-0.055em]">
                A number with
                <br />
                <em className="font-normal">no final point.</em>
              </h2>
              <div className="divide-y divide-[#f2efe8]/15 border-y border-[#f2efe8]/15">
                <div className="grid grid-cols-[48px_1fr] gap-5 py-6">
                  <span className="text-xs opacity-45">01</span>
                  <p className="m-0 text-base leading-[1.65] text-[#f2efe8]/70">
                    Eight doors inspire the house code: separate thresholds,
                    joined by one direction.
                  </p>
                </div>
                <div className="grid grid-cols-[48px_1fr] gap-5 py-6">
                  <span className="text-xs opacity-45">02</span>
                  <p className="m-0 text-base leading-[1.65] text-[#f2efe8]/70">
                    Turn the figure sideways and it becomes infinity—a reminder
                    that arrival can also be a beginning.
                  </p>
                </div>
                <div className="grid grid-cols-[48px_1fr] gap-5 py-6">
                  <span className="text-xs opacity-45">03</span>
                  <p className="m-0 text-base leading-[1.65] text-[#f2efe8]/70">
                    The wing represents movement. The First Wing is not a claim
                    of completion, but proof that the journey has started.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <EightDoorsArchive />

        <section className="bg-[#f2efe8] px-[4vw] py-[11vw] text-[#0b0b0b] max-[900px]:px-5 max-[900px]:py-24">
          <Reveal>
            <ChapterLabel>The principles</ChapterLabel>
            <div className="mt-12 grid grid-cols-3 border-y border-black/20 max-[900px]:grid-cols-1">
              {[
                ["01", "Restraint", "Silence is luxury.", "A piece should hold attention before a logo asks for it."],
                ["02", "Identity", "For the unmatched.", "Built for the person who refuses easy categories and wears conviction calmly."],
                ["03", "Becoming", "Never finished.", "Every collection is a passage, opened only when the work is ready."],
              ].map(([number, name, title, copy], index) => (
                <article
                  key={number}
                  className={`min-h-[410px] p-[3.5vw] max-[900px]:min-h-0 max-[900px]:px-1 max-[900px]:py-12 ${
                    index > 0
                      ? "border-l border-black/20 max-[900px]:border-l-0 max-[900px]:border-t"
                      : ""
                  }`}
                >
                  <p className="m-0 text-xs uppercase tracking-[0.18em] opacity-50">
                    {number} · {name}
                  </p>
                  <h3 className="mb-8 mt-20 [font-family:Times_New_Roman,Times,serif] text-[clamp(38px,4vw,62px)] font-normal leading-[0.93] max-[900px]:mt-10">
                    {title}
                  </h3>
                  <p className="m-0 max-w-[330px] text-base leading-[1.7] text-black/65">
                    {copy}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <InfinityEnding />
      </main>

      <footer className="flex min-h-[48vh] flex-col justify-between border-t border-[#f2efe8]/15 bg-[#0b0b0b] px-[4vw] pb-9 pt-20 text-[#f2efe8]">
        <div className="whitespace-nowrap [font-family:Times_New_Roman,Times,serif] text-[clamp(47px,10.8vw,162px)] leading-[0.8] tracking-[-0.055em]">
          Paradise Angels
        </div>
        <div className="flex justify-between gap-5 text-xs uppercase tracking-[0.13em] text-[#f2efe8]/60 max-[560px]:flex-col">
          <span>Amsterdam · Est. 2027</span>
          <div className="flex gap-[22px]">
            <Link href="/shop">Collection</Link>
            <Link href="/about">Story</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <span>© {new Date().getFullYear()} Paradise Angels</span>
        </div>
      </footer>
    </div>
  );
}
