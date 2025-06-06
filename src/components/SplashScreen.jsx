"use client";

import { useEffect } from "react";

export default function SplashScreen({ logo = "https://imagedelivery.net/BgH9d8bzsn4n0yijn4h7IQ/4b455706-eb40-453d-0658-532b576f7400/w=1200?quality=95&format=auto",/*"/assets/logo.svg",*/ alt = "Logo", duration = 2500, onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish?.(); // chama callback se existir
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <img src={logo} alt={alt} className="w-full  animate-pulse" />
    </div>
  );
}
