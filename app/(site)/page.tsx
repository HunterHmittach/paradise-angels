export default function Home() {
  return (
    <main className="bg-[#f4f1ea] text-black">

      {/* SECTION 1 — Identity */}
      <section className="min-h-screen flex items-center px-10 md:px-24">
        <div className="max-w-5xl">
          <h1 className="font-serif text-[48px] md:text-[90px] leading-[0.95] tracking-tight">
            PARADISE<br />ANGELS
          </h1>

          <p className="mt-8 text-sm tracking-[0.4em] uppercase text-neutral-500">
            A House Built Under Pressure
          </p>
        </div>
      </section>


      {/* SECTION 2 — Statement */}
      <section className="px-10 md:px-24 py-32 border-t border-neutral-200">
        <div className="max-w-3xl space-y-8">
          <p className="text-2xl md:text-3xl font-serif leading-snug">
            Not formed by comfort.
          </p>
          <p className="text-2xl md:text-3xl font-serif leading-snug">
            Constructed through discipline.
          </p>
          <p className="text-2xl md:text-3xl font-serif leading-snug">
            Released without permission.
          </p>
        </div>
      </section>


      {/* SECTION 3 — The First Form */}
      <section className="px-10 md:px-24 py-40 border-t border-neutral-200">
        <div className="max-w-6xl">

          <h2 className="text-sm tracking-[0.5em] uppercase text-neutral-500 mb-16">
            The First Form
          </h2>

          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Placeholder Visual */}
            <div className="bg-neutral-200 h-[500px] w-full" />

            {/* Product Info */}
            <div>
              <h3 className="font-serif text-4xl mb-6">
                Form 01
              </h3>

              <p className="text-neutral-600 mb-10 max-w-md">
                Constructed under precision.
                Designed without compromise.
              </p>

              <p className="text-lg mb-8">
                €180
              </p>

              <button className="uppercase tracking-widest text-sm border-b border-black pb-1 hover:opacity-60 transition">
                Acquire
              </button>

            </div>

          </div>
        </div>
      </section>


      {/* SECTION 4 — Closing */}
      <section className="px-10 md:px-24 py-40 border-t border-neutral-200">
        <p className="font-serif text-4xl">
          The ascent continues.
        </p>
      </section>

    </main>
  );
}