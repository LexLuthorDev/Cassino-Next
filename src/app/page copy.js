"use client";

import { useState, useEffect } from "react";
import Header from "@/components/home/Header";
import BannerSection from "@/components/home/BannerSection";
import MaioresGanhadoresSection from "@/components/home/MaioresGanhadoresSection";
import SearchAndCategories from "@/components/home/SearchAndCategories";
import PromocoesSection from "@/components/home/PromocoesSection";
import Footer from "@/components/home/Footer";
import GameSection from "@/components/home/GameSection";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useConfigCassino } from "@/context/ConfigCassinoContext";
import { useAuth } from "@/context/AuthContext";
import usePwaInstallPrompt from "@/hooks/usePwaInstallPrompt";
import PwaInstallBanner from "@/components/PwaInstallBanner"; // ✅ novo banner
import BottomNav from "@/components/home/BottomNav";
import { useIdioma } from "@/context/IdiomaContext"; // Importando o hook do contexto
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getBonusMetodoIdioma } from "@/api/jogador";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner"; // <- toast vem da lib sonner diretamente
const ResgatarBonus = ({
  textoConteudo,
  textoBotao,
  onClose,
  resgatarBonus,
}) => (
  <div className="fixed top-0 left-0 right-0 bg-black bg-opacity-50 p-4 z-50 overflow-y-auto">
    <div className="bg-zinc-950 p-4 rounded-md border border-zinc-800 max-w-xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="text-sm text-zinc-300 whitespace-pre-wrap break-words">
          {textoConteudo || "Texto do conteúdo aparecerá aqui"}
        </div>
        <div className="flex justify-between items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
            onClick={resgatarBonus}
          >
            {textoBotao || "Botão"}
          </Button>
          <X onClick={onClose} className="cursor-pointer" />
        </div>
      </div>
    </div>
  </div>
);

// ==================== DADOS MOCKADOS ====================

// Jogos em destaque
const jogosDestaque = [
  {
    id: "jogo1",
    titulo: "Tigre da Fortuna",
    imagem: "https://i.imgur.com/lCMY74B.png",
    fornecedor: "PG Soft",
    avaliacao: 4.8,
    quente: true,
  },
  {
    id: "jogo2",
    titulo: "Blackjack VIP",
    imagem: "https://placehold.co/300x200",
    fornecedor: "Evolution Gaming",
    avaliacao: 4.7,
  },
  {
    id: "jogo3",
    titulo: "Mega Moolah",
    imagem: "https://placehold.co/300x200",
    fornecedor: "Microgaming",
    avaliacao: 4.9,
    quente: true,
  },
  {
    id: "jogo4",
    titulo: "Livro dos Mortos",
    imagem: "https://placehold.co/300x200",
    fornecedor: "Play'n GO",
    avaliacao: 4.6,
  },
  {
    id: "jogo5",
    titulo: "Sweet Bonanza",
    imagem: "https://placehold.co/300x200",
    fornecedor: "Pragmatic Play",
    avaliacao: 4.8,
    quente: true,
  },
  {
    id: "jogo6",
    titulo: "Roleta Relâmpago",
    imagem: "https://placehold.co/300x200",
    fornecedor: "Evolution Gaming",
    avaliacao: 4.7,
  },
];

// Jogos populares
const jogosPopulares = [
  {
    id: "pop1",
    titulo: "Starburst",
    imagem: "https://placehold.co/300x200",
    fornecedor: "NetEnt",
    avaliacao: 4.5,
  },
  {
    id: "pop2",
    titulo: "A Busca de Gonzo",
    imagem: "https://placehold.co/300x200",
    fornecedor: "NetEnt",
    avaliacao: 4.6,
    quente: true,
  },
  {
    id: "pop3",
    titulo: "Crazy Time",
    imagem: "https://placehold.co/300x200",
    fornecedor: "Evolution Gaming",
    avaliacao: 4.9,
    quente: true,
  },
  {
    id: "pop4",
    titulo: "Lobo Dourado",
    imagem: "https://placehold.co/300x200",
    fornecedor: "Pragmatic Play",
    avaliacao: 4.4,
  },
  {
    id: "pop5",
    titulo: "Portões do Olimpo",
    imagem: "https://placehold.co/300x200",
    fornecedor: "Pragmatic Play",
    avaliacao: 4.7,
    quente: true,
  },
  {
    id: "pop6",
    titulo: "Big Bass Bonanza",
    imagem: "https://placehold.co/300x200",
    fornecedor: "Pragmatic Play",
    avaliacao: 4.5,
  },
];

// Jogos novos
const jogosNovos = [
  {
    id: "1",
    nome: "doublex",
    titulo: "Double X",
    imagem: "/img-doublex.png",
    fornecedor: "Lex Labs Games",
    avaliacao: 4.8,
    novo: true,
  },
  {
    id: "novo2",
    titulo: "Wild West Gold Megaways",
    imagem: "https://placehold.co/300x200",
    fornecedor: "Pragmatic Play",
    avaliacao: 4.6,
    novo: true,
  },
  {
    id: "novo3",
    titulo: "Reactoonz 3",
    imagem: "https://placehold.co/300x200",
    fornecedor: "Play'n GO",
    avaliacao: 4.7,
    novo: true,
  },
  {
    id: "novo4",
    titulo: "Immortal Romance II",
    imagem: "https://placehold.co/300x200",
    fornecedor: "Microgaming",
    avaliacao: 4.5,
    novo: true,
  },
  {
    id: "novo5",
    titulo: "Cash Elevator",
    imagem: "https://placehold.co/300x200",
    fornecedor: "Pragmatic Play",
    avaliacao: 4.4,
    novo: true,
  },
  {
    id: "novo6",
    titulo: "Fruit Party 2",
    imagem: "https://placehold.co/300x200",
    fornecedor: "Pragmatic Play",
    avaliacao: 4.3,
    novo: true,
  },
];

export default function Page() {
  const { configCassino, loadingConfigCassino } = useConfigCassino();
  console.log("configCassinosss:", configCassino);
  const metodoIdioma = configCassino?.cassino?.MetodosCassinos?.find(
    (metodo) => metodo?.nome?.toLowerCase() === "idioma"
  );

  const textoConteudoMetodoIdioma =
    metodoIdioma?.configIdioma?.texto_conteudo ?? "Texto padrão para idioma";
  const textoBotaoMetodoIdioma =
    metodoIdioma?.configIdioma?.texto_botao ?? "Botão padrão para idioma";
  const tema = configCassino?.tema;

  const { idioma, setIdiomaState } = useIdioma();

  //console.log("idioma:", idioma);

  const { isAuthenticated, logout } = useAuth();

  const [mostrarBonus, setMostrarBonus] = useState(
    idioma?.toLowerCase() !== "pt-br"
  );

  const { showInstallModal, triggerInstall, setShowInstallModal } =
    usePwaInstallPrompt();

  // Lógica para mostrar o bônus caso o idioma seja diferente de pt-br
  useEffect(() => {
    if (idioma !== "pt-br") {
      //console.log("Idioma diferente de pt-BR, exibindo bônus");
      setMostrarBonus(true); // Exibe o bônus
    }
  }, [idioma]);

  const handleCloseBonus = () => {
    setMostrarBonus(false); // Fecha o bônus
  };

  const handleResgatarBonus = async () => {
    //console.log("Resgatando bônus");
    // Lógica para resgatar o bônus
    const resposta = await getBonusMetodoIdioma();

    setMostrarBonus(false);

    //console.log("Resposta:", resposta);
    const { bonus, mensagem } = resposta.data;

    if (bonus === true) {
      setIdiomaState("pt-br");
      toast.success(mensagem, {
        // description: mensagem,
      });
      // esperar 3 segundos
      // dar um reload na pagina
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      //setIdiomaState("pt-br");
      toast.error(mensagem, {
        //description: mensagem,
      });
      // dar um reload na pagina
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  // Se ainda estiver carregando ou não veio nada, retorna null
  if (loadingConfigCassino || !configCassino) return null;
  return (
    <div
      style={{ backgroundColor: tema?.cor_fundo || "#18181B" }}
      className="min-h-screen flex flex-col text-white"
    >
      {/* BANNER FIXO ACIMA DO HEADER */}
      <PwaInstallBanner
        visible={showInstallModal}
        onInstall={triggerInstall}
        onClose={() => setShowInstallModal(false)}
      />
      {/* Cabeçalho */}
      <Header offsetTop={showInstallModal ? 47 : 0} />

      <main className="flex-1 mt-10">
        {/* Seção de Banner */}
        <BannerSection />

        {/* Seção deMaiores Ganhadores */}
        <MaioresGanhadoresSection />

        {/* Seção de Promoções */}
        <PromocoesSection />

        {/* Pesquisa e Categorias */}
        <SearchAndCategories />

        {/* Jogos em Destaque */}
        <GameSection titulo="Jogos em Destaque" jogos={jogosDestaque} />

        {/* Jogos Populares */}
        <GameSection titulo="Mais Jogados" jogos={jogosPopulares} />

        {/* Jogos Novos */}
        <GameSection titulo="Lançamentos" jogos={jogosNovos} />
      </main>

      {/* Rodapé */}
      <Footer />

      <ScrollToTopButton />

      <BottomNav />

      {/* Mostrar o componente de bônus se o idioma for diferente de pt-br */}
      {mostrarBonus && isAuthenticated && (
        <ResgatarBonus
          textoConteudo={textoConteudoMetodoIdioma}
          textoBotao={textoBotaoMetodoIdioma}
          onClose={handleCloseBonus}
          resgatarBonus={handleResgatarBonus}
        />
      )}

      {/* Render do Toaster */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
