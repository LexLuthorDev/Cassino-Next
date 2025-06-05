"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import usePwaInstallPrompt from "@/hooks/usePwaInstallPrompt";
import PwaInstallBanner from "@/components/PwaInstallBanner"; // ✅ novo banner
import Header from "@/components/home/Header";

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
    </div>
  );
}
