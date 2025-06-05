"use client";
import { useEffect } from "react";
import Header from "@/components/home/Header";
import { useTheme } from "@/context/ThemeContext";
import { Gift } from "lucide-react";
import BottomNav from "@/components/home/BottomNav";
import ScrollToTopButton from "@/components/ScrollToTopButton";

import { promocoes } from "@/mocks/promocoes";

import usePwaInstallPrompt from "@/hooks/usePwaInstallPrompt";
import PwaInstallBanner from "@/components/PwaInstallBanner"; // ✅ novo banner

export default function PagePromocoes() {
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

      <Header offsetTop={showInstallModal ? 47 : 0} />

      <main className="flex-1 mb-20">
        <section className="container mx-auto px-3 py-4 sm:py-6">
          <div className="flex items-center justify-start mb-3 gap-2">
            <Gift style={{ color: theme?.cor_primaria }} className="w-6 h-6 " />
            <h1 className="text-2xl sm:text-3xl font-bold">Promoções</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {promocoes.map((promocao) => (
              <div key={promocao.id} className=" p-0 rounded-md shadow-md">
                <img
                  src={promocao.imagem}
                  alt={promocao.titulo}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <p className="text-lg font-semibold">{promocao.descricao}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <ScrollToTopButton />

      <BottomNav />
    </div>
  );
}
