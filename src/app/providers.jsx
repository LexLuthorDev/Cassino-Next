'use client';

import { AuthProvider } from "@/context/AuthContext";
import { DadosJogadorProvider } from "@/context/DadosJogadorContext";
import { ThemeProvider } from "@/context/ThemeContext";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DadosJogadorProvider>
          {children}
        </DadosJogadorProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
