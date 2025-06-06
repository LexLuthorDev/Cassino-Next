"use client";
import { useState, useRef, useEffect } from "react";
import { useConfigCassino } from "@/context/ConfigCassinoContext";
import { Trophy } from "lucide-react";

const defaultSliderData = [
  {
    player: "Matheus S****",
    game: "Fortune Mouse",
    valor: "92,00",
    image:
      "https://raw.githubusercontent.com/LexLuthorDev/imagens-jogos-pg/refs/heads/main/Fortune-Mouse.webp",
  },
  {
    player: "Marcelo F****",
    game: "Fortune Tiger",
    valor: "123,21",
    image:
      "https://raw.githubusercontent.com/LexLuthorDev/imagens-jogos-pg/refs/heads/main/fortunetiger.webp",
  },
  {
    player: "Lucas B****",
    game: "Fortune Rabbit",
    valor: "155,21",
    image:
      "https://raw.githubusercontent.com/LexLuthorDev/imagens-jogos-pg/refs/heads/main/fortune-rabbit.webp",
  },
];

export default function MaioresGanhadoresSection() {
  const { configCassino, loadingConfigCassino } = useConfigCassino();
  const tema = configCassino?.tema;
  const cassino = configCassino?.cassino;

  const metodoTrofeuCassino = cassino?.MetodosCassinos?.find(
    (metodo) => metodo.nome === "trofeu"
  );
  const configMetodoTrofeuCassino = metodoTrofeuCassino?.configTrofeu;

  const scrollRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Trata os dados recebidos dinamicamente
  let parsedDados = [];

  try {
    let raw = configMetodoTrofeuCassino?.dados;
    if (typeof raw === "string") {
      raw = raw.trim();
      parsedDados = JSON.parse(raw);
    } else if (Array.isArray(raw)) {
      parsedDados = raw;
    } else if (typeof raw === "object" && raw !== null) {
      parsedDados = Object.values(raw);
    }
  } catch (e) {
    console.warn("Erro ao interpretar dados dos ganhadores:", e);
    parsedDados = [];
  }

  // Fallback para dados mockados
  const sliderItems = [...(parsedDados.length > 0 ? parsedDados : defaultSliderData), ...(parsedDados.length > 0 ? parsedDados : defaultSliderData)];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let autoScroll;

    const startAutoScroll = () => {
      autoScroll = setInterval(() => {
        if (isInteracting) return;
        el.scrollLeft += 1;

        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }, 30);
    };

    startAutoScroll();

    return () => clearInterval(autoScroll);
  }, [isInteracting]);

  if (loadingConfigCassino || !configCassino) return null;

  return (
    <section className="container mx-auto px-1 py-3 sm:py-2 pr-2 pl-2">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            style={{
              backgroundColor: tema?.cor_tercearia,
              color: tema?.cor_texto_dark,
            }}
            className="text-sm px-1 py-1 rounded-[5px]"
          >
            <Trophy className="w-3 h-3" />
          </span>
          <h2
            style={{ color: tema?.cor_texto_primaria }}
            className="text-xl sm:text-2xl font-bold"
          >
            Maiores Ganhadores
          </h2>
        </div>
      </div>

      <div
        ref={scrollRef}
        onTouchStart={() => setIsInteracting(true)}
        onTouchEnd={() => setIsInteracting(false)}
        className="flex overflow-x-auto gap-3 pb-0 scrollbar-hide snap-x snap-mandatory"
      >
        <div className="flex gap-3 min-w-max">
          {sliderItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-50 bg-zinc-800 rounded-lg overflow-hidden"
            >
              <div className="flex">
                <div className="w-18 h-25 bg-zinc-700 flex-shrink-0">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.game}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/placeholder.svg?height=80&width=80";
                    }}
                  />
                </div>
                <div className="p-2 flex flex-col justify-center gap-1">
                  <p
                    style={{ color: tema?.cor_texto_primaria }}
                    className="text-sm font-medium"
                  >
                    {item.player}
                  </p>
                  <p className="text-sm text-zinc-400">{item.game}</p>
                  <p
                    style={{ color: tema?.cor_primaria }}
                    className="text-sm font-bold"
                  >
                    R$ {item.valor}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
