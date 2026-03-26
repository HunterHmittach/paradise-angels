export default function NewCollection() {
  return (
    <section className="min-h-screen bg-[#f4f3ef] py-40 px-10">

      <h1 className="font-serif text-6xl tracking-[0.25em] uppercase text-center mb-32">
        New Collection
      </h1>

      <div className="grid md:grid-cols-3 gap-20 max-w-6xl mx-auto">

        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Parfums</h2>
          <p className="text-black/60">Discover the scent of Paradise</p>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Apparel</h2>
          <p className="text-black/60">Luxury clothing collection</p>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Accessories</h2>
          <p className="text-black/60">Refined finishing touches</p>
        </div>

      </div>

    </section>
  );
}