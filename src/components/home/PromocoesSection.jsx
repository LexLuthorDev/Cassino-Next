import { useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { promocoes } from "@/mocks/promocoes"; // <-- importa os dados

export default function PromocoesSection() {
  const theme = useTheme();
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const scrollRef = useRef(null);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
    if (Math.abs(touchStart - e.targetTouches[0].clientX) > 10) e.preventDefault();
  };
  const handleTouchEnd = () => {
    if (!scrollRef.current) return;
    const scrollAmount = 280;
    if (touchStart - touchEnd > 75) scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    if (touchStart - touchEnd < -75) scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="container mx-auto px-1 py-3 sm:py-2 pr-2 pl-2">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span style={{ backgroundColor: theme?.cor_tercearia, color: theme?.cor_texto_dark}} className="text-sm px-1 py-1 rounded-[5px]">
            <img src="/assets/estrela_black.svg" alt="Estrela" className="w-3" />
          </span>
          <h2 style={{ color: theme?.cor_texto_primaria}} className="text-xl sm:text-2xl font-bold">Promoções</h2>
        </div>
        <a href="/promocoes" style={{ color: theme?.cor_primaria }} className="text-xs sm:text-sm hover:underline">Ver todas</a>
      </div>

      <div
        className="flex justify-between overflow-x-auto gap-3 pb-4 scrollbar-hide snap-x snap-mandatory scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-700"
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {promocoes.map((promo) => (
          <div
            key={promo.id}
            className="flex-shrink-0 snap-start w-[280px] sm:w-[320px] md:w-[32.3%] bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden"
          >
            <div className="relative h-24 sm:h-32">
              <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-zinc-900/70"></div>
              <img
                src={promo.imagem}
                alt={promo.titulo}
                className="w-full h-full "
                loading="lazy"
              />
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
}
