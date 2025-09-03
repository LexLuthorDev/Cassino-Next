"use client";

import { useState, useEffect, useMemo } from "react";
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
import PwaInstallBanner from "@/components/PwaInstallBanner";
import BottomNav from "@/components/home/BottomNav";
import { useIdioma } from "@/context/IdiomaContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getBonusMetodoIdioma } from "@/api/jogador";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const ResgatarBonus = ({ textoConteudo, textoBotao, onClose, resgatarBonus }) => (
  <div className="fixed top-0 left-0 right-0 bg-black/50 p-4 z-50 overflow-y-auto">
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

// ------------ helpers ----------
const isActiveGame = (g) =>
  Number(g.status_api) === 1 &&
  Number(g.is_active) === 1 &&
  !g.soft_deleted_at;

/*const toGameCard = (g) => ({
  id: g.id ?? `${g.provider_id}:${g.game_code}`,
  titulo: g.game_name,
  imagem: g.banner || "https://placehold.co/640x360?text=Sem+banner",
  fornecedor: g.provider?.name || g.provider?.code || "—",
  _raw: g,
});*/

function toGameCard(g) {
  const providerCode = g.provider?.code || g.provider_code; // do DB
  return {
    id: g.id ?? `${g.provider_id}:${g.game_code}`,
    titulo: g.game_name,
    imagem: g.banner || "https://placehold.co/640x360?text=Sem+banner",
    fornecedor: g.provider?.name || providerCode || "—",
    href: providerCode
      ? `/jogar/${encodeURIComponent(providerCode)}/${encodeURIComponent(g.game_code)}`
      : null,
    _raw: g,
  };
}



const EmptySection = ({ titulo }) => (
  <div className="px-4 sm:px-6 lg:px-8 my-6">
    <h2 className="text-xl font-semibold mb-3">{titulo}</h2>
    <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-400">
      Nenhum jogo nesta seção.
    </div>
  </div>
);
// --------------------------------

export default function Page() {
  const { configCassino, loadingConfigCassino } = useConfigCassino();
  const tema = configCassino?.tema;

  const { idioma, setIdiomaState } = useIdioma();
  const { isAuthenticated } = useAuth();

  const [mostrarBonus, setMostrarBonus] = useState(idioma?.toLowerCase() !== "pt-br");
  const { showInstallModal, triggerInstall, setShowInstallModal } = usePwaInstallPrompt();

  useEffect(() => {
    if (idioma !== "pt-br") setMostrarBonus(true);
  }, [idioma]);

  const handleCloseBonus = () => setMostrarBonus(false);

  const handleResgatarBonus = async () => {
    const resposta = await getBonusMetodoIdioma();
    setMostrarBonus(false);
    const { bonus, mensagem } = resposta.data;

    if (bonus === true) {
      setIdiomaState("pt-br");
      toast.success(mensagem);
      setTimeout(() => window.location.reload(), 3000);
    } else {
      toast.error(mensagem);
      setTimeout(() => window.location.reload(), 3000);
    }
  };

  // ------------ construir seções a partir do backend (sem fallback) ------------
  const jogosAll = useMemo(() => (configCassino?.games || []).filter(isActiveGame), [configCassino?.games]);

  // Destaque: is_featured == 1 OU show_home == 1
  const jogosDestaque = useMemo(
    () => jogosAll.filter((g) => Number(g.is_featured) === 1 || Number(g.show_home) === 1).map(toGameCard),
    [jogosAll]
  );

  // Mais Jogados: is_popular == 1
  const jogosPopulares = useMemo(
    () => jogosAll.filter((g) => Number(g.is_popular) === 1).map(toGameCard),
    [jogosAll]
  );

  // Lançamentos: is_new == 1
  const jogosNovos = useMemo(
    () => jogosAll.filter((g) => Number(g.is_new) === 1).map(toGameCard),
    [jogosAll]
  );
  // -----------------------------------------------------------------------------

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
        <BannerSection />
        <MaioresGanhadoresSection />
        <PromocoesSection />
        <SearchAndCategories />

        {/* Jogos em Destaque */}
        {jogosDestaque.length > 0 ? (
          <GameSection titulo="Jogos em Destaque" jogos={jogosDestaque} />
        ) : (
          <EmptySection titulo="Jogos em Destaque" />
        )}

        {/* Mais Jogados */}
        {jogosPopulares.length > 0 ? (
          <GameSection titulo="Mais Jogados" jogos={jogosPopulares} />
        ) : (
          <EmptySection titulo="Mais Jogados" />
        )}

        {/* Lançamentos */}
        {jogosNovos.length > 0 ? (
          <GameSection titulo="Lançamentos" jogos={jogosNovos} />
        ) : (
          <EmptySection titulo="Lançamentos" />
        )}
      </main>

      <Footer />
      <ScrollToTopButton />
      <BottomNav />

      {mostrarBonus && isAuthenticated && (
        <ResgatarBonus
          textoConteudo={configCassino?.cassino?.MetodosCassinos?.find(m => m?.nome?.toLowerCase() === "idioma")?.configIdioma?.texto_conteudo}
          textoBotao={configCassino?.cassino?.MetodosCassinos?.find(m => m?.nome?.toLowerCase() === "idioma")?.configIdioma?.texto_botao}
          onClose={handleCloseBonus}
          resgatarBonus={handleResgatarBonus}
        />
      )}

      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
