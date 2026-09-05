"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const CONVERSATIONS = [
  {
    number: "01",
    roman: "I",
    label: "General",
    title: "The house.",
    note: "Questions about Paradise Angels, The First Wing or the world surrounding the collection.",
  },
  {
    number: "02",
    roman: "II",
    label: "Orders",
    title: "Aftercare.",
    note: "Help with an order, delivery, return or the care of a Paradise Angels piece.",
  },
  {
    number: "03",
    roman: "III",
    label: "Press & partnerships",
    title: "Creative dialogue.",
    note: "Editorial requests, partnerships and considered creative collaborations.",
  },
] as const;

const RECIPIENTS: Record<string, string> = {
  General: "contact@paradiseangels.nl",
  Orders: "orders@paradiseangels.nl",
  "Press & partnerships": "contact@paradiseangels.nl",
};

function openEmail(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const topic = String(form.get("topic") || "General");
  const message = String(form.get("message") || "").trim();
  const recipient = RECIPIENTS[topic] || RECIPIENTS.General;

  const subject = encodeURIComponent(`Paradise Angels — ${topic} — ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`,
  );

  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
}

function SignalLine() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="relative h-full min-h-[410px] w-full">
      <span className="absolute inset-y-[7%] left-1/2 w-px bg-[#f2efe8]/25" />
      <span className="absolute left-1/2 top-[7%] h-3 w-3 -translate-x-1/2 rounded-full border border-[#f2efe8]/45" />
      <span className="absolute bottom-[7%] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-[#f2efe8]/45" />
      <motion.span
        className="absolute left-1/2 top-[8%] h-20 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#f2efe8] to-transparent"
        animate={reduceMotion ? undefined : { top: ["8%", "72%", "8%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="absolute left-[calc(50%+20px)] top-1/2 -translate-y-1/2 whitespace-nowrap text-xs uppercase tracking-[0.22em] text-[#f2efe8]/50 [writing-mode:vertical-rl]">
        A line remains open
      </span>
    </div>
  );
}

export default function ContactPage() {
  const reduceMotion = useReducedMotion();
  const [selectedTopic, setSelectedTopic] = useState("General");

  function chooseDirection(topic: string) {
    setSelectedTopic(topic);
    document.getElementById("contact-form")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  }

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
        <section className="grid min-h-[calc(100svh-83px)] grid-cols-[0.72fr_1.28fr] border-b border-[#f2efe8]/15 max-[900px]:grid-cols-1">
          <div className="relative grid min-h-[calc(100svh-83px)] grid-cols-[1fr_110px] overflow-hidden border-r border-[#f2efe8]/15 bg-[#0b0b0b] text-[#f2efe8] max-[900px]:min-h-[68svh] max-[900px]:border-b max-[900px]:border-r-0 max-[560px]:grid-cols-[1fr_76px]">
            <div className="flex flex-col justify-between px-[4vw] py-[5vw] max-[900px]:px-6 max-[900px]:py-10">
              <p className="m-0 text-xs uppercase tracking-[0.22em] text-[#f2efe8]/55">
                Correspondence · 001
              </p>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="m-0 [font-family:Times_New_Roman,Times,serif] text-[clamp(62px,8vw,124px)] font-normal leading-[0.78] tracking-[-0.055em]">
                  Send
                  <br />
                  <em className="font-normal">a signal.</em>
                </h1>
                <p className="mb-0 mt-10 max-w-[460px] text-base leading-[1.7] text-[#f2efe8]/65">
                  Every exchange begins with a line. Choose the right one and
                  we will continue the conversation from there.
                </p>
              </motion.div>

              <div className="flex items-end justify-between gap-5 text-xs uppercase tracking-[0.18em] text-[#f2efe8]/50">
                <span>Amsterdam</span>
                <span>Private correspondence</span>
              </div>
            </div>

            <div className="border-l border-[#f2efe8]/15">
              <SignalLine />
            </div>
          </div>

          <div className="flex items-center bg-[#f2efe8] px-[8vw] py-[8vw] text-[#0b0b0b] max-[900px]:px-6 max-[900px]:py-20">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[720px]"
            >
              <p className="m-0 text-xs uppercase tracking-[0.22em] opacity-50">
                Write to the house
              </p>
              <h2 className="mb-14 mt-5 [font-family:Times_New_Roman,Times,serif] text-[clamp(45px,5.5vw,82px)] font-normal leading-[0.88] tracking-[-0.05em]">
                Begin your
                <br />
                <em className="font-normal">correspondence.</em>
              </h2>

              <form
                id="contact-form"
                onSubmit={openEmail}
                className="grid scroll-mt-[110px] grid-cols-2 gap-x-7 max-[560px]:grid-cols-1"
              >
                <label className="group border-b border-black/25 py-5">
                  <span className="block text-xs uppercase tracking-[0.17em] opacity-50">
                    01 · Name
                  </span>
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    placeholder="Your name"
                    className="mt-3 w-full rounded-none border-0 bg-transparent p-0 text-base outline-none placeholder:text-black/30"
                  />
                </label>

                <label className="group border-b border-black/25 py-5">
                  <span className="block text-xs uppercase tracking-[0.17em] opacity-50">
                    02 · Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className="mt-3 w-full rounded-none border-0 bg-transparent p-0 text-base outline-none placeholder:text-black/30"
                  />
                </label>

                <label className="col-span-full border-b border-black/25 py-5">
                  <span className="block text-xs uppercase tracking-[0.17em] opacity-50">
                    03 · Direction
                  </span>
                  <select
                    name="topic"
                    value={selectedTopic}
                    onChange={(event) => setSelectedTopic(event.target.value)}
                    className="mt-3 w-full cursor-pointer rounded-none border-0 bg-transparent p-0 text-base outline-none"
                  >
                    <option>General</option>
                    <option>Orders</option>
                    <option>Press &amp; partnerships</option>
                  </select>
                </label>

                <label className="col-span-full border-b border-black/25 py-5">
                  <span className="block text-xs uppercase tracking-[0.17em] opacity-50">
                    04 · Message
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Write your message"
                    className="mt-3 w-full resize-none rounded-none border-0 bg-transparent p-0 text-base leading-[1.65] outline-none placeholder:text-black/30"
                  />
                </label>

                <div className="col-span-full mt-8 flex items-center justify-between gap-7 max-[560px]:flex-col max-[560px]:items-start">
                  <p className="m-0 max-w-[300px] text-xs leading-[1.55] text-black/45">
                    This opens your email app so you can review and send the
                    message yourself.
                  </p>
                  <button
                    type="submit"
                    className="group flex min-h-[56px] min-w-[245px] items-center justify-between border border-black bg-black px-6 text-xs uppercase tracking-[0.18em] text-[#f2efe8] transition-colors hover:bg-transparent hover:text-black max-[560px]:w-full"
                  >
                    Continue in email
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        <section className="bg-[#d8d4cb] px-[4vw] py-[10vw] text-[#0b0b0b] max-[900px]:px-5 max-[900px]:py-24">
          <div className="mb-16 grid grid-cols-[0.6fr_1.4fr] gap-8 max-[900px]:grid-cols-1">
            <p className="m-0 text-xs uppercase tracking-[0.22em] opacity-50">
              Correspondence index
            </p>
            <h2 className="m-0 [font-family:Times_New_Roman,Times,serif] text-[clamp(49px,7vw,108px)] font-normal leading-[0.85] tracking-[-0.055em]">
              Three paths.
              <br />
              <em className="font-normal">One house.</em>
            </h2>
          </div>

          <div className="grid grid-cols-3 border-y border-black/20 max-[900px]:grid-cols-1">
            {CONVERSATIONS.map((conversation, index) => (
              <button
                key={conversation.number}
                type="button"
                onClick={() => chooseDirection(conversation.label)}
                className={`group flex min-h-[470px] flex-col items-start justify-between bg-transparent p-[3.5vw] text-left transition-colors duration-500 hover:bg-[#0b0b0b] hover:text-[#f2efe8] focus-visible:bg-[#0b0b0b] focus-visible:text-[#f2efe8] focus-visible:outline-none max-[900px]:min-h-[360px] max-[900px]:p-7 ${
                  index > 0
                    ? "border-l border-black/20 max-[900px]:border-l-0 max-[900px]:border-t"
                    : ""
                }`}
              >
                <span className="flex w-full items-center justify-between text-xs uppercase tracking-[0.18em] opacity-50">
                  <span>{conversation.number} · {conversation.label}</span>
                  <span aria-hidden="true">↑</span>
                </span>

                <span
                  aria-hidden="true"
                  className="my-8 block [font-family:Times_New_Roman,Times,serif] text-[clamp(105px,12vw,190px)] italic leading-[0.7] opacity-15 transition-opacity duration-500 group-hover:opacity-30"
                >
                  {conversation.roman}
                </span>

                <span>
                  <span className="block [font-family:Times_New_Roman,Times,serif] text-[clamp(35px,3.4vw,54px)] leading-[0.9]">
                    {conversation.title}
                  </span>
                  <span className="mt-6 block max-w-[330px] text-base leading-[1.65] opacity-60">
                    {conversation.note}
                  </span>
                  <span className="mt-9 inline-flex items-center gap-7 border-b border-current/40 pb-2 text-xs uppercase tracking-[0.16em]">
                    Choose this direction <span aria-hidden="true">↑</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="grid min-h-[64vh] grid-cols-2 border-t border-[#f2efe8]/15 bg-[#0b0b0b] text-[#f2efe8] max-[900px]:grid-cols-1">
          <div className="flex items-end border-r border-[#f2efe8]/15 p-[4vw] max-[900px]:min-h-[32vh] max-[900px]:border-b max-[900px]:border-r-0 max-[900px]:p-6">
            <p className="m-0 text-xs uppercase tracking-[0.2em] text-[#f2efe8]/50">
              Follow the process · Amsterdam
            </p>
          </div>
          <div className="flex items-center px-[8vw] py-[9vw] max-[900px]:px-6 max-[900px]:py-20">
            <div>
              <p className="m-0 text-xs uppercase tracking-[0.2em] text-[#f2efe8]/50">
                Social correspondence
              </p>
              <a
                href="https://www.instagram.com/houseofparadiseangels/"
                target="_blank"
                rel="noreferrer"
                className="group mt-7 inline-flex items-end gap-7 [font-family:Times_New_Roman,Times,serif] text-[clamp(41px,6vw,91px)] leading-[0.9] tracking-[-0.045em]"
              >
                Instagram
                <span className="mb-2 text-lg transition-transform group-hover:translate-x-2" aria-hidden="true">
                  ↗
                </span>
              </a>
              <p className="mt-7 text-base text-[#f2efe8]/55">
                @houseofparadiseangels
              </p>
            </div>
          </div>
        </section>
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
