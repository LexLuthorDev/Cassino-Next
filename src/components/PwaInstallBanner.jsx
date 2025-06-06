// src/components/PwaInstallBanner.jsx
import { X, Download } from "lucide-react";

import { useConfigCassino } from "@/context/ConfigCassinoContext";

export default function PwaInstallBanner({ visible, onInstall, onClose }) {
  if (!visible) return null;

  const { configCassino, loadingConfigCassino } = useConfigCassino();
  const tema = configCassino?.tema;

  // Se ainda estiver carregando ou não veio nada, retorna null
  if (loadingConfigCassino || !configCassino) return null;

  return (
    <div
      style={{ backgroundColor: tema?.cor_primaria_dark, color: tema?.cor_texto_primaria }}
      className="w-full   text-sm sm:text-base px-4 py-2 flex items-center justify-between z-50  fixed top-0 left-0"
    >
      <div className="flex items-center gap-2">
        <Download className="w-6 h-6" />
        <span className=" text-xs">
          Faça o download do nosso aplicativo para uma experiência ainda melhor!
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onInstall}
          style={{color: tema?.cor_primaria_dark}}
          className="bg-white  px-3 py-1 rounded  text-xs sm:text-sm"
        >
          Instalar
        </button>
        <button onClick={onClose}>
          <X className="w-4 h-4 text-white hover:text-gray-200" />
        </button>
      </div>
    </div>
  );
}
