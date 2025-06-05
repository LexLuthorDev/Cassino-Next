// src/components/PwaInstallBanner.jsx
import { X, Download } from "lucide-react";

import { useTheme } from "@/context/ThemeContext";

export default function PwaInstallBanner({ visible, onInstall, onClose }) {
  if (!visible) return null;

  const theme = useTheme();

  return (
    <div style={{ backgroundColor: theme?.cor_primaria_dark }} className="w-full  text-white text-sm sm:text-base px-4 py-2 flex items-center justify-between z-50  fixed top-0 left-0">
      <div className="flex items-center gap-2">
        <Download className="w-6 h-6" />
        <span className=" text-xs">Faça o download do nosso aplicativo para uma experiência ainda melhor!</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onInstall}
          className="bg-white text-green-700 px-3 py-1 rounded hover:bg-green-200 text-xs sm:text-sm"
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
