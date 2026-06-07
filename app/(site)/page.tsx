import ArrivalLayer from "./components/ArrivalLayer";
import HeroEngine from "./components/runway/HeroEngine";
import ManifestoSection from "./components/ManifestoSection";
import SignatureQuote from "./components/SignatureQuote";

export default function Home() {
  return (
    <main className="bg-[#f4f1ea] text-black overflow-hidden">
      <ArrivalLayer />

      {/* CINEMATIC HERO */}
      <HeroEngine />

      {/* BRAND STATEMENT */}
      <ManifestoSection />

      {/* FINAL EMOTION */}
      <SignatureQuote />
    </main>
  );
}