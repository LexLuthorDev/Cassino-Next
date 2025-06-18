'use client';

import { AuthProvider } from "@/context/AuthContext";
import { DadosJogadorProvider } from "@/context/DadosJogadorContext";
import { ConfigCassinoProvider } from "@/context/ConfigCassinoContext";
import { IdiomaProvider } from "@/context/IdiomaContext"; // Importe o IdiomaProvider

export function Providers({ children }) {
  return (
    <AuthProvider>
      <ConfigCassinoProvider>
        <DadosJogadorProvider>
          <IdiomaProvider>
            {children}
          </IdiomaProvider>
        </DadosJogadorProvider>
      </ConfigCassinoProvider>
    </AuthProvider>
  );
}
