"use client";

import { AlertTriangle, CreditCard, Phone } from "lucide-react";
import { useConfigCassino } from "@/context/ConfigCassinoContext";

export default function PixUnavailableBanner({ onSwitchToCard }) {
  const { configCassino } = useConfigCassino();
  const tema = configCassino?.tema;

  return (
    <div 
      className="backdrop-blur-xl p-4 sm:p-6 rounded-xl sm:rounded-2xl border shadow-2xl mb-4 sm:mb-6"
      style={{
        backgroundColor: tema?.bg_card || "rgba(255, 255, 255, 0.05)",
        borderColor: "#F59E0B",
      }}
    >
      <div className="text-center">
        <div className="mb-4">
          <div className="text-4xl mb-2">⚠️</div>
          <h3 
            className="font-bold text-lg sm:text-xl mb-2"
            style={{ color: "#F59E0B" }}
          >
            PIX Temporariamente Indisponível
          </h3>
          <p className="text-gray-300 text-sm sm:text-base mb-4">
            O sistema de pagamento PIX está em manutenção. 
            Você pode usar cartão de crédito como alternativa.
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {onSwitchToCard && (
            <button
              onClick={onSwitchToCard}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-lg font-medium transition-all duration-200"
              style={{
                backgroundColor: tema?.cor_primaria || "#22C55E",
                color: tema?.cor_texto_primaria || "#FFFFFF"
              }}
            >
              <CreditCard className="w-4 h-4" />
              💳 Usar Cartão de Crédito
            </button>
          )}
          
          <button
            onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-lg font-medium transition-all duration-200"
            style={{
              backgroundColor: "#25D366",
              color: "#FFFFFF"
            }}
          >
            <Phone className="w-4 h-4" />
            📞 Falar com Suporte
          </button>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-4 text-xs text-gray-400">
          <p>💡 <strong>Dica:</strong> Pagamentos com cartão são processados instantaneamente</p>
          <p>🕐 <strong>Previsão:</strong> PIX deve voltar em breve</p>
        </div>
      </div>
    </div>
  );
}
