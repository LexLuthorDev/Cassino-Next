import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

function hexToRgba(hex, alpha = 1) {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ==================== COMPONENTE CARROSSEL DE JOGOS ====================
function CarrosselJogos({ jogos }) {
  const theme = useTheme();

  const [indiceAtual, setIndiceAtual] = useState(0);
  const [itensVisiveis, setItensVisiveis] = useState(3);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  const containerRef = useRef(null);

  const navigate = useNavigate();

  // Ajusta o número de itens visíveis com base no tamanho da tela
  useEffect(() => {
    function atualizarTamanho() {
      if (window.innerWidth < 640) {
        setItensVisiveis(1);
      } else if (window.innerWidth < 1024) {
        setItensVisiveis(2);
      } else {
        setItensVisiveis(3);
      }
    }

    window.addEventListener("resize", atualizarTamanho);
    atualizarTamanho();

    return () => window.removeEventListener("resize", atualizarTamanho);
  }, []);

  const podeRolarEsquerda = indiceAtual > 0;
  const podeRolarDireita = indiceAtual < jogos.length - itensVisiveis;

  const handleAnterior = () => {
    if (podeRolarEsquerda) {
      setIndiceAtual(indiceAtual - 1);
    }
  };

  const handleProximo = () => {
    if (podeRolarDireita) {
      setIndiceAtual(indiceAtual + 1);
    }
  };

  // Rola o carrossel quando o índice muda
  useEffect(() => {
    if (containerRef.current) {
      const scrollAmount =
        (containerRef.current.scrollWidth / jogos.length) * indiceAtual;
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }, [indiceAtual, jogos.length]);

  // Funções para swipe em dispositivos móveis
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75 && podeRolarDireita) {
      // Swipe para a esquerda
      handleProximo();
    }

    if (touchStart - touchEnd < -75 && podeRolarEsquerda) {
      // Swipe para a direita
      handleAnterior();
    }
  };

  return (
    <div className="relative group">
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-3 sm:gap-4 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {jogos.map((jogo) => (
          <div
            key={jogo.id}
            onMouseEnter={() => setHoveredCard(jogo.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              backgroundColor: theme?.bg_card || "#27272a",
              borderColor: theme?.cor_borda_card || "#3f3f46",
              boxShadow:
                hoveredCard === jogo.id
                  ? `0 4px 20px ${hexToRgba(
                      theme?.cor_primaria || "#1DC950",
                      0.2
                    )}`
                  : "none",
            }}
            className={`flex-shrink-0 snap-start border rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
              itensVisiveis === 1
                ? "w-[calc(70%-6px)] sm:w-[calc(70%-8px)]"
                : itensVisiveis === 2
                ? "w-[calc(50%-6px)] sm:w-[calc(50%-8px)]"
                : "w-[calc(25%-8px)] sm:w-[calc(25%-11px)]"
            }`}
          >
            <div className="p-0 relative">
              <div className="relative h-70 sm:h-40 md:h-48 w-full">
                <img
                  src={jogo.imagem || "https://placehold.co/300x200"}
                  alt={jogo.titulo}
                  className="w-full h-full"
                  loading="lazy"
                />
                <div
                  style={{
                    backgroundImage: `linear-gradient(to top, ${hexToRgba(
                      theme?.cor_sombra_card_games || "#000000",
                      0.35
                    )}, transparent)`,
                  }}
                  className="absolute inset-0"
                ></div>

                {jogo.quente && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    QUENTE
                  </div>
                )}

                {jogo.novo && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    NOVO
                  </div>
                )}
              </div>

              <div className="p-2.5 sm:p-3 text-start">
                <h3
                  style={{ color: theme?.cor_texto_primaria || "#fff" }}
                  className="font-bold text-sm sm:text-base mb-0.5 truncate"
                >
                  {jogo.titulo}
                </h3>
                <div
                  style={{ color: theme?.cor_texto_secundaria || "#a1a1aa" }}
                  className=" flex text-md mb-2 gap-3 truncate"
                >
                  {jogo.fornecedor}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill={i < jogo.avaliacao ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            color:
                              i < jogo.avaliacao
                                ? theme?.cor_primaria || "#22c55e" // fallback green-500
                                : "#71717a", // fallback zinc-600
                          }}
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags de categoria */}
                <div className="flex justify-between items-center gap-1 mb-2">
                  <div className="flex gap-1">
                    {["Slots", "Cassino", "Popular"]
                      .slice(0, Math.floor(Math.random() * 1) + 1)
                      .map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: theme?.bg_secundario || "#3f3f46",
                            color: theme?.cor_texto_secundaria || "#a1a1aa",
                          }}
                          className="flex items-center justify-center font-medium px-4 py-0.5  rounded-[5px]"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                  <button
                    onClick={() => navigate(`/games/${jogo.nome}`)}
                    style={{
                      backgroundColor: theme?.cor_primaria || "#22c55e",
                      color: theme?.cor_texto_primaria || "#fff",
                    }}
                    className="px-4 py-0 rounded-[5px] border border-transparent font-medium cursor-pointer transition-all duration-200"
                  >
                    Jogar!
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botões de navegação (visíveis apenas em telas maiores) */}
      <button
        className={`hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full p-2 bg-zinc-800/80 border border-zinc-700 text-white items-center justify-center ${
          !podeRolarEsquerda
            ? "opacity-0 cursor-not-allowed"
            : "opacity-0 group-hover:opacity-100 transition-opacity"
        }`}
        onClick={handleAnterior}
        disabled={!podeRolarEsquerda}
        aria-label="Anterior"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        className={`hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full p-2 bg-zinc-800/80 border border-zinc-700 text-white items-center justify-center ${
          !podeRolarDireita
            ? "opacity-0 cursor-not-allowed"
            : "opacity-0 group-hover:opacity-100 transition-opacity"
        }`}
        onClick={handleProximo}
        disabled={!podeRolarDireita}
        aria-label="Próximo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}

export default function GameSection({ titulo, jogos }) {
  const theme = useTheme();
  return (
    <section className="container mx-auto px-3 py-4 sm:py-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{titulo}</h2>
        <a
          href="#"
          style={{ color: theme?.cor_primaria || "#1DC950" }}
          className="text-xs sm:text-sm hover:underline"
        >
          Ver todos
        </a>
      </div>
      <CarrosselJogos jogos={jogos} />
    </section>
  );
}
