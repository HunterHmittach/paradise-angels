"use client";

export default function ComingSoon() {
  return (
    <main className="relative min-h-screen bg-black text-[#f4f1ea] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,241,234,0.16),transparent_52%)]" />

      <div className="absolute top-8 left-8 md:top-12 md:left-14 text-[10px] tracking-[0.6em] uppercase text-white/45">
        Paradise Angels
      </div>

      <div className="absolute top-8 right-8 md:top-12 md:right-14 text-[10px] tracking-[0.6em] uppercase text-white/45">
        2027
      </div>

      <section className="relative min-h-screen flex items-center justify-center px-6 text-center uppercase">
        <div>
          <p className="text-[10px] md:text-xs tracking-[0.8em] text-white/35 mb-12">
            Collection 01
          </p>

          <h1 className="font-serif text-6xl sm:text-7xl md:text-9xl leading-[0.86] tracking-[0.12em] text-white">
            The First
            <br />
            Wing
          </h1>

          <div className="mt-14 mx-auto h-px w-24 bg-white/25" />

          <p className="mt-14 text-[10px] md:text-xs tracking-[0.55em] text-white/40">
            Every feather remembers.
          </p>
        </div>
      </section>

      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-14 text-[9px] tracking-[0.45em] uppercase text-white/35">
        ParadiseAngels.nl
      </div>

      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-14 text-[9px] tracking-[0.45em] uppercase text-white/35">
        AMSTERDAM.
      </div>
    </main>
  );
}