import { useState } from "react";

import {
  AlertTriangle,
  BookOpen,
  Dices,
  Facebook,
  GamepadIcon,
  HelpCircle,
  Instagram,
  Mail,
  MessageSquare,
  Phone,
  Shield,
  Twitter,
  Users,
  Zap,
} from "lucide-react";

import { useConfigCassino } from "@/context/ConfigCassinoContext";

// ==================== DADOS MOCKADOS ====================

// Categorias de jogos
const categoriaJogos = [
  { id: "slots", nome: "Caça-Níqueis" },
  { id: "mesa", nome: "Jogos de Mesa" },
  { id: "aovivo", nome: "Cassino ao Vivo" },
  { id: "esportes", nome: "Apostas Esportivas" },
  { id: "poker", nome: "Poker" },
  { id: "jackpot", nome: "Jackpots" },
];

function hexToRgba(hex, alpha = 1) {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Footer() {
  const { configCassino, loadingConfigCassino } = useConfigCassino();

  const tema = configCassino?.tema;
  const cassino = configCassino?.cassino;
  const logoCassino = cassino?.ImagensCassinos?.find(img => img.tipo === 4);
  const urlLogoCassino = logoCassino ? logoCassino.url : "";

  const nomeCassino = cassino?.nome || "Cassino do Lex Luthor";
  const whatsappCassino =
    cassino?.MidiasSociaisCassino?.whatsapp || "(48) 9 9130-0326";
  const facebookCassino =
    cassino?.MidiasSociaisCassino?.facebook ||
    "https://www.facebook.com/lex.luthor.1";
  const instagramCassino =
    cassino?.MidiasSociaisCassino?.instagram ||
    "https://www.instagram.com/lex.luthor.1/";
  const twitterCassino =
    cassino?.MidiasSociaisCassino?.twitter ||
    "https://twitter.com/lex.luthor.1";

  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverBotao, setHoverBotao] = useState(false);
  const [hoveredCategoria, setHoveredCategoria] = useState(null);

  // Se ainda estiver carregando ou não veio nada, retorna null
  if (loadingConfigCassino || !configCassino) return null;

  return (
    <footer className="bg-zinc-800 border-t border-zinc-700 py-6 sm:py-8 mb-15">
      <div className="container mx-auto px-3">
        {/* Versão desktop */}
        <div className="sm:grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 sm:col-span-1 text-left sm:text-left mb-6 sm:mb-0">
            <a href="/" className="flex items-center">
              <img
                //src="/assets/logo.svg"
                src={urlLogoCassino}
                alt="Logo do Cassino"
                className="sm:h-16 max-w-[150px] object-contain mb-2"
              />
            </a>
            <p
              style={{ color: tema?.cor_texto_secundaria || "#a1a1aa" }}
              className=" text-sm sm:text-base"
            >
              A melhor experiência de cassino online com uma grande variedade de
              jogos e bônus emocionantes.
            </p>

            {/* Redes sociais */}
            <div className="mt-4 flex space-x-4">
              <a
                href={facebookCassino}
                target="_blank"
                onMouseEnter={() => setHoveredItem("facebook")}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  color:
                    hoveredItem === "facebook"
                      ? tema?.cor_primaria || "#1DC950"
                      : tema?.cor_texto_secundaria || "#a1a1aa",
                }}
                className="transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>

              <a
                href={instagramCassino}
                target="_blank"
                onMouseEnter={() => setHoveredItem("instagram")}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  color:
                    hoveredItem === "instagram"
                      ? tema?.cor_primaria || "#1DC950"
                      : tema?.cor_texto_secundaria || "#a1a1aa",
                }}
                className="transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href={twitterCassino}
                target="_blank"
                onMouseEnter={() => setHoveredItem("twitter")}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  color:
                    hoveredItem === "twitter"
                      ? tema?.cor_primaria || "#1DC950"
                      : tema?.cor_texto_secundaria || "#a1a1aa",
                }}
                className="transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mb-6 sm:mb-0">
            <h3
              style={{ color: tema?.cor_texto_primaria || "#fff" }}
              className="text-base sm:text-lg font-bold mb-2 sm:mb-4 flex items-center"
            >
              <GamepadIcon
                style={{ color: tema?.cor_primaria || "#1DC950" }}
                className="w-4 h-4 mr-2"
              />
              Jogos
            </h3>
            <ul
              style={{ color: tema?.cor_texto_secundaria || "#a1a1aa" }}
              className="space-y-1 sm:space-y-2 text-sm sm:text-base"
            >
              {categoriaJogos.slice(0, 4).map((categoria) => (
                <li key={categoria.id}>
                  <a
                    href={`/jogos/${categoria.id}`}
                    onMouseEnter={() => setHoveredCategoria(categoria.id)}
                    onMouseLeave={() => setHoveredCategoria(null)}
                    style={{
                      color:
                        hoveredCategoria === categoria.id
                          ? tema?.cor_primaria || "#1DC950"
                          : tema?.cor_texto_secundaria || "#a1a1aa",
                    }}
                    className="flex items-center transition-colors"
                  >
                    <Dices className="w-3.5 h-3.5 mr-2 opacity-70" />
                    {categoria.nome}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 sm:mb-0">
            <h3
              style={{ color: tema?.cor_texto_primaria || "#fff" }}
              className="text-base sm:text-lg font-bold mb-2 sm:mb-4 flex items-center"
            >
              <HelpCircle
                style={{ color: tema?.cor_primaria || "#1DC950" }}
                className="w-4 h-4 mr-2"
              />
              Suporte
            </h3>
            <ul
              style={{ color: tema?.cor_texto_secundaria || "#a1a1aa" }}
              className="space-y-1 sm:space-y-2 text-sm sm:text-base"
            >
              <li>
                <a
                  href="/faq"
                  onMouseEnter={() => setHoveredItem("faq")}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    color:
                      hoveredItem === "faq"
                        ? tema?.cor_primaria || "#1DC950"
                        : tema?.cor_texto_secundaria || "#a1a1aa",
                  }}
                  className="flex items-center transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-2 opacity-70" />
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a
                  href="/contato"
                  onMouseEnter={() => setHoveredItem("contato")}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    color:
                      hoveredItem === "contato"
                        ? tema?.cor_primaria || "#1DC950"
                        : tema?.cor_texto_secundaria || "#a1a1aa",
                  }}
                  className="flex items-center transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 mr-2 opacity-70" />
                  Fale Conosco
                </a>
              </li>
              <li>
                <a
                  href="/termos"
                  onMouseEnter={() => setHoveredItem("termos")}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    color:
                      hoveredItem === "termos"
                        ? tema?.cor_primaria || "#1DC950"
                        : tema?.cor_texto_secundaria || "#a1a1aa",
                  }}
                  className="flex items-center transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 mr-2 opacity-70" />
                  Termos e Condições
                </a>
              </li>
              <li>
                <a
                  href="/privacidade"
                  onMouseEnter={() => setHoveredItem("privacidade")}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    color:
                      hoveredItem === "privacidade"
                        ? tema?.cor_primaria || "#1DC950"
                        : tema?.cor_texto_secundaria || "#a1a1aa",
                  }}
                  className="flex items-center transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 mr-2 opacity-70" />
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1 text-left">
            <h3
              style={{ color: tema?.cor_texto_primaria || "#fff" }}
              className="text-base sm:text-lg font-bold mb-2 sm:mb-4 flex items-center"
            >
              <AlertTriangle
                style={{ color: tema?.cor_primaria || "#1DC950" }}
                className="w-4 h-4 mr-2"
              />
              Jogo Responsável
            </h3>
            <p
              style={{ color: tema?.cor_texto_secundaria || "#a1a1aa" }}
              className=" text-sm sm:text-base mb-3 sm:mb-4"
            >
              Promovemos o jogo responsável. Por favor, jogue com
              responsabilidade e estabeleça limites para si mesmo.
            </p>
            <button
              onMouseEnter={() => setHoverBotao(true)}
              onMouseLeave={() => setHoverBotao(false)}
              style={{
                color: tema?.cor_primaria || "#1DC950",
                borderColor: tema?.cor_primaria || "#1DC950",
                backgroundColor: hoverBotao
                  ? hexToRgba(tema?.cor_primaria || "#1DC950", 0.1)
                  : "transparent",
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md border flex items-center justify-center transition-colors"
            >
              <Users className="w-4 h-4 mr-2" />
              Auto-Exclusão
            </button>

            {/* Contato rápido */}
            <div
              style={{ color: tema?.cor_texto_secundaria || "#a1a1aa" }}
              className="mt-4 flex items-center text-sm"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span>Suporte: {whatsappCassino}</span>
            </div>
          </div>
        </div>

        <div
          style={{ color: tema?.cor_texto_secundaria || "#a1a1aa" }}
          className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-zinc-700 text-center"
        >
          <p className="text-sm sm:text-base">
            © {new Date().getFullYear()} {nomeCassino}. Todos os direitos
            reservados.
          </p>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm flex items-center justify-center">
            <AlertTriangle
              style={{ color: tema?.cor_tercearia || "#F4D51E" }}
              className="w-3.5 h-3.5 mr-1.5"
            />
            Este site é destinado a maiores de 18 anos. Jogue com
            responsabilidade.
          </p>
        </div>
      </div>
    </footer>
  );
}
