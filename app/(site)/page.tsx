export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--pa-paper)] text-[var(--pa-black)]">

      {/* HERO SECTION */}
      <section className="h-[90vh] flex flex-col justify-center items-center text-center relative">
        <h1 className="text-[70px] md:text-[110px] font-bold font-[var(--font-cormorant)] leading-none">
          PARADISE  
          <span className="block text-[var(--pa-gold)]">ANGELS</span>
        </h1>

        <p className="mt-6 text-xl md:text-2xl max-w-2xl text-black/70">
          A Creative House of Luxury Fashion, Visual Identity & Angelic Expression.
        </p>

        {/* GLOW AURA */}
        <div className="absolute w-[400px] h-[400px] bg-[var(--pa-gold-soft)] opacity-30 blur-[120px] rounded-full -z-10"></div>
      </section>

      {/* MANIFESTO SECTION */}
      <section className="py-28 px-10 md:px-40 text-center">
        <h2 className="text-5xl font-semibold font-[var(--font-cormorant)] mb-10 text-[var(--pa-black)]">
          We Create More Than Fashion.
        </h2>
        <p className="text-xl text-black/70 leading-relaxed max-w-3xl mx-auto">
          Paradise Angels blends luxury with identity, crafting pieces that live 
          between the physical and the ethereal. Each drop carries vision, emotion 
          and aesthetic direction shaped by a creative universe.
        </p>
      </section>

      {/* VISUAL EDITORIAL GALLERY */}
      <section className="grid md:grid-cols-3 gap-6 px-10 md:px-40 py-20">
        <div className="h-[400px] bg-black rounded-[var(--pa-radius)] shadow-[var(--pa-shadow)]"></div>
        <div className="h-[400px] bg-black rounded-[var(--pa-radius)] shadow-[var(--pa-shadow)]"></div>
        <div className="h-[400px] bg-black rounded-[var(--pa-radius)] shadow-[var(--pa-shadow)]"></div>
      </section>

      {/* SHOP PREVIEW */}
      <section className="py-20 px-10 md:px-40">
        <h2 className="text-4xl font-[var(--font-cormorant)] mb-10">
          Featured Pieces
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-6 bg-white rounded-[var(--pa-radius)] shadow-xl border border-black/10">
            <div className="h-[300px] bg-black rounded-xl"></div>
            <h3 className="text-xl mt-4 font-semibold">Product Name</h3>
            <p className="text-black/70">€120</p>
          </div>

          <div className="p-6 bg-white rounded-[var(--pa-radius)] shadow-xl border border-black/10">
            <div className="h-[300px] bg-black rounded-xl"></div>
            <h3 className="text-xl mt-4 font-semibold">Product Name</h3>
            <p className="text-black/70">€120</p>
          </div>

          <div className="p-6 bg-white rounded-[var(--pa-radius)] shadow-xl border border-black/10">
            <div className="h-[300px] bg-black rounded-xl"></div>
            <h3 className="text-xl mt-4 font-semibold">Product Name</h3>
            <p className="text-black/70">€120</p>
          </div>
        </div>
      </section>

    </main>
  );
}
