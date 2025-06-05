// components/PwaInstallModal.jsx
import { X } from "lucide-react";

export default function PwaInstallModal({ visible, onInstall, onClose }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white text-black rounded-xl p-6 shadow-lg w-[90%] max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Instale nosso App!</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="mb-4 text-sm">
          Para uma melhor experiência, instale o aplicativo na tela inicial.
        </p>
        <button
          onClick={onInstall}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
        >
          Instalar agora
        </button>
      </div>
    </div>
  );
}
