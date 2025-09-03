"use client";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

export default function VoltarHomeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="fixed top-5 left-5 flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400 
                 text-white font-semibold px-5 py-2 rounded-full shadow-lg shadow-emerald-900/30 
                 hover:scale-105 hover:shadow-emerald-700/50 transition-all duration-300 ease-in-out z-50"
    >
      <Home size={18} />
      <span>Voltar</span>
    </button>
  );
}
