// hooks/usePwaInstallPrompt.js
import { useEffect, useState } from "react";

export default function usePwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // impede o prompt automático
      setDeferredPrompt(e);
      setShowInstallModal(true); // ativa seu modal
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("Usuário aceitou instalar o PWA");
    }
    setDeferredPrompt(null);
    setShowInstallModal(false);
  };

  return { showInstallModal, triggerInstall, setShowInstallModal };
}
