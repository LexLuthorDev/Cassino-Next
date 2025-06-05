"use client";

import { useState, useEffect } from "react";
import Header from "@/components/home/Header";
import BannerSection from "@/components/home/BannerSection";
import SearchAndCategories from "@/components/home/SearchAndCategories";
import PromocoesSection from "@/components/home/PromocoesSection";
import Footer from "@/components/home/Footer";
import GameSection from "@/components/home/GameSection";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useTheme } from "@/context/ThemeContext";
import usePwaInstallPrompt from "@/hooks/usePwaInstallPrompt";
import PwaInstallBanner from "@/components/PwaInstallBanner"; // ✅ novo banner
import BottomNav from "@/components/home/BottomNav";

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
  const theme = useTheme();
  const { showInstallModal, triggerInstall, setShowInstallModal } =
    usePwaInstallPrompt();
  return (
    <div
      style={{ backgroundColor: theme?.cor_fundo || "#18181B" }}
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
    </div>
  );
}
