"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { useConfigCassino } from "@/context/ConfigCassinoContext";

export default function StatusPixRealTime({ deposito, onStatusChange }) {
  const { configCassino } = useConfigCassino();
  const [status, setStatus] = useState(deposito?.status || 'aguardando_pagamento');
  const [loading, setLoading] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(null);
  const [error, setError] = useState(null);

  const tema = configCassino?.tema;

  // Verificar status do pagamento
  const verificarStatus = async () => {
    if (!deposito?.pixup?.paymentId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/pixup/status/${deposito.pixup.paymentId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const novoStatus = data.data.status;
          setStatus(novoStatus);
          
          // Notificar mudança de status
          if (onStatusChange) {
            onStatusChange(novoStatus);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      setError("Erro ao verificar status do pagamento");
    } finally {
      setLoading(false);
    }
  };

  // Calcular tempo restante
  useEffect(() => {
    if (deposito?.pixup?.expiresAt) {
      const interval = setInterval(() => {
        const agora = new Date();
        const expira = new Date(deposito.pixup.expiresAt);
        const diff = expira - agora;
        
        if (diff <= 0) {
          setTempoRestante("Expirado");
          setStatus('expirado');
        } else {
          const minutos = Math.floor(diff / 60000);
          const segundos = Math.floor((diff % 60000) / 1000);
          setTempoRestante(`${minutos}:${segundos.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [deposito?.pixup?.expiresAt]);

  // Verificar status automaticamente a cada 10 segundos
  useEffect(() => {
    if (status === 'aguardando_pagamento' || status === 'pendente') {
      const interval = setInterval(verificarStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Renderizar status
  const renderStatus = () => {
    switch (status) {
      case 'aguardando_pagamento':
        return (
          <div className="flex items-center gap-2 text-yellow-400">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Aguardando Pagamento</span>
          </div>
        );
      
      case 'pago':
        return (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Pago com Sucesso!</span>
          </div>
        );
      
      case 'aprovado':
        return (
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Depósito Aprovado!</span>
          </div>
        );
      
      case 'expirado':
        return (
          <div className="flex items-center gap-2 text-red-400">
            <XCircle className="w-4 h-4" />
            <span className="font-medium">QR Code Expirado</span>
          </div>
        );
      
      case 'cancelado':
        return (
          <div className="flex items-center gap-2 text-red-400">
            <XCircle className="w-4 h-4" />
            <span className="font-medium">Pagamento Cancelado</span>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center gap-2 text-gray-400">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Status: {status}</span>
          </div>
        );
    }
  };

  // Renderizar ações baseadas no status
  const renderAcoes = () => {
    if (status === 'aguardando_pagamento' || status === 'pendente') {
      return (
        <div className="flex gap-2">
          <button
            onClick={verificarStatus}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              backgroundColor: tema?.cor_primaria || "#22C55E",
              color: tema?.cor_texto_primaria || "#FFFFFF"
            }}
          >
            {loading ? "Verificando..." : "🔄 Verificar"}
          </button>
        </div>
      );
    }
    
    if (status === 'pago') {
      return (
        <div className="text-sm text-green-400">
          ✅ Pagamento confirmado! Aguarde a aprovação do administrador.
        </div>
      );
    }
    
    if (status === 'aprovado') {
      return (
        <div className="text-sm text-green-500">
          🎉 Depósito aprovado! Seu saldo foi atualizado.
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-3">
      {/* Status */}
      <div className="text-center">
        {renderStatus()}
      </div>

      {/* Tempo Restante */}
      {tempoRestante && status === 'aguardando_pagamento' && (
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Expira em:</div>
          <div 
            className="text-lg font-mono font-bold"
            style={{ color: tema?.cor_primaria || "#22C55E" }}
          >
            {tempoRestante}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="text-center">
        {renderAcoes()}
      </div>

      {/* Erro */}
      {error && (
        <div className="text-center text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
