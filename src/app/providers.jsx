'use client';

import { AuthProvider } from "@/context/AuthContext";
import { DadosJogadorProvider } from "@/context/DadosJogadorContext";
import { ConfigCassinoProvider } from "@/context/ConfigCassinoContext";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <ConfigCassinoProvider>
        <DadosJogadorProvider>
          {children}
        </DadosJogadorProvider>
      </ConfigCassinoProvider>
    </AuthProvider>
  );
}
