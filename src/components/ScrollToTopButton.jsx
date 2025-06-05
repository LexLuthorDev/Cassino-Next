// src/components/ScrollToTopButton.jsx
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { useTheme } from "@/context/ThemeContext";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const theme = useTheme();

  // Monitora rolagem para mostrar/esconder botão
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 150);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        border: "1px solid",
        borderColor: theme?.cor_primaria,
        left: "50%",
        transform: "translateX(-50%)",
      }}
      className="fixed bottom-22 z-50 px-4 py-1 rounded-md bg-zinc-800 text-white shadow-lg hover:bg-zinc-700 transition"
      aria-label="Voltar ao topo"
    >
      <span className="flex items-center gap-2 text-xs">
        {" "}
        <ArrowUp className="w-4 h-4" /> De volta ao topo
      </span>
    </button>
  );
}
