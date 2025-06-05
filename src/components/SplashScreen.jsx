"use client";

import { useEffect } from "react";

export default function SplashScreen({ logo = "/assets/logo.svg", alt = "Logo", duration = 2500, onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish?.(); // chama callback se existir
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <img src={logo} alt={alt} className="w-32 h-32 animate-pulse" />
    </div>
  );
}
