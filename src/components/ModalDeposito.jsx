"use client";

import { useState, useEffect } from "react";
import { X, CreditCard, Coins, Plus, Clipboard, CheckCircle, XCircle, Clock } from "lucide-react";
import { useConfigCassino } from "@/context/ConfigCassinoContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import StatusPixRealTime from "./StatusPixRealTime";
import QRCode from "qrcode";
import { useDepositoWebSocket } from "@/hooks/useDepositoWebSocket";

export default function ModalDeposito({ visible, onClose, onDepositar }) {
  const { configCassino } = useConfigCassino();
  const [metodoPagamento, setMetodoPagamento] = useState("pix");
  const [valorDeposito, setValorDeposito] = useState("");
  const [valorSelecionado, setValorSelecionado] = useState(null);
  const [depositoCriado, setDepositoCriado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusAtual, setStatusAtual] = useState(null);
  const [error, setError] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [pagamentoAprovado, setPagamentoAprovado] = useState(false);
  const [pagamentoData, setPagamentoData] = useState(null);

  const tema = configCassino?.tema;

    // Gerar QR Code quando o depósito for criado
  useEffect(() => {
    if (depositoCriado?.pixup?.qrCodeText) {
      gerarQRCode(depositoCriado.pixup.qrCodeText);
    }
    
    // Debug: Verificar dados recebidos
    if (depositoCriado) {
      console.log("🔍 [ModalDeposito] Dados completos do depósito:", depositoCriado);
      console.log("🔍 [ModalDeposito] ID do depósito:", depositoCriado.id);
      console.log("🔍 [ModalDeposito] Dados do depósito:", {
        id: depositoCriado.id,
        valor: depositoCriado.valor,
        pixup: depositoCriado.pixup,
        valor_alternativo: depositoCriado.pixup?.amount,
        valor_final: depositoCriado.valor || depositoCriado.pixup?.amount || '0.00'
      });
    }
  }, [depositoCriado]);

  // WebSocket para depósitos
  const { isConnected } = useDepositoWebSocket(
    depositoCriado?.id, 
    depositoCriado?.id_usuario || 25 // Placeholder - você deve pegar o ID real do usuário
  );

  console.log("🔌 [ModalDeposito] Status da conexão WebSocket:", isConnected);
  console.log("📊 [ModalDeposito] Dados do depósito para WebSocket:", {
    depositoId: depositoCriado?.id,
    usuarioId: depositoCriado?.id_usuario || 25
  });

  // Escutar eventos de pagamento
  useEffect(() => {
    console.log("🎧 [ModalDeposito] Configurando listeners de eventos WebSocket...");
    
    const handlePagamentoAprovado = (event) => {
      const data = event.detail;
      console.log('🎉 [ModalDeposito] ===== PAGAMENTO APROVADO RECEBIDO =====');
      console.log('📊 [ModalDeposito] Dados do pagamento aprovado:', data);
      
      // Tocar som de dinheiro/vitória
      try {
        console.log('🔊 [ModalDeposito] Tentando tocar som de sucesso...');
        const audio = new Audio('/sounds/cashout.mp3');
        audio.volume = 0.7; // Volume 70%
        
        // Adicionar listeners para debug
        audio.addEventListener('loadstart', () => console.log('🔊 [ModalDeposito] Áudio: Iniciando carregamento'));
        audio.addEventListener('canplay', () => console.log('🔊 [ModalDeposito] Áudio: Pronto para tocar'));
        audio.addEventListener('play', () => console.log('🔊 [ModalDeposito] Áudio: Iniciando reprodução'));
        audio.addEventListener('ended', () => console.log('🔊 [ModalDeposito] Áudio: Reprodução finalizada'));
        audio.addEventListener('error', (e) => console.error('🔊 [ModalDeposito] Áudio: Erro no carregamento', e));
        
        audio.play().then(() => {
          console.log('✅ [ModalDeposito] Som tocado com sucesso');
        }).catch(error => {
          console.log('🔇 [ModalDeposito] Não foi possível tocar o som:', error);
          console.log('🔇 [ModalDeposito] Tipo do erro:', error.name);
          console.log('🔇 [ModalDeposito] Mensagem do erro:', error.message);
        });
      } catch (error) {
        console.log('🔇 [ModalDeposito] Erro ao criar áudio:', error);
      }
      
      setPagamentoAprovado(true);
      setPagamentoData(data);
      console.log('✅ [ModalDeposito] Estado atualizado para pagamento aprovado');
      
      // Fechar modal e menu após 3 segundos
      setTimeout(() => {
        // Fechar modal
        onClose();
        resetarModal();
        
        // Fechar menu lateral se estiver aberto (disparar evento personalizado)
        window.dispatchEvent(new CustomEvent('fecharMenuLateral'));
        // darum reload da pagina
        window.location.reload();
      }, 8000);
    };

    const handlePagamentoRejeitado = (event) => {
      const data = event.detail;
      console.log('❌ [ModalDeposito] ===== PAGAMENTO REJEITADO RECEBIDO =====');
      console.log('📊 [ModalDeposito] Dados do pagamento rejeitado:', data);
      
      setError({
        type: "pagamento_rejeitado",
        title: "Pagamento Rejeitado",
        message: data.motivo || "Seu pagamento foi rejeitado. Tente novamente.",
        icon: "❌"
      });
    };

    const handlePagamentoExpirado = (event) => {
      const data = event.detail;
      console.log('⏰ [ModalDeposito] ===== PAGAMENTO EXPIRADO RECEBIDO =====');
      console.log('📊 [ModalDeposito] Dados do pagamento expirado:', data);
      
      setError({
        type: "pagamento_expirado",
        title: "Pagamento Expirado",
        message: "O tempo para pagamento expirou. Crie um novo depósito.",
        icon: "⏰"
      });
    };

    // Adicionar listeners
    console.log("🎧 [ModalDeposito] Adicionando event listeners...");
    window.addEventListener('deposito:pagamento_aprovado', handlePagamentoAprovado);
    window.addEventListener('deposito:pagamento_rejeitado', handlePagamentoRejeitado);
    window.addEventListener('deposito:pagamento_expirado', handlePagamentoExpirado);
    console.log("✅ [ModalDeposito] Event listeners adicionados");

    // Cleanup
    return () => {
      console.log("🧹 [ModalDeposito] Removendo event listeners...");
      window.removeEventListener('deposito:pagamento_aprovado', handlePagamentoAprovado);
      window.removeEventListener('deposito:pagamento_rejeitado', handlePagamentoRejeitado);
      window.removeEventListener('deposito:pagamento_expirado', handlePagamentoExpirado);
      console.log("✅ [ModalDeposito] Event listeners removidos");
    };
  }, [onClose]);

  if (!visible) return null;

  const opcoesDeposito = [
    { valor: 30, bonus: 30 },
    { valor: 50, bonus: 50 },
    { valor: 80, bonus: 80 },
  ];

  const handleValorSelecionado = (valor) => {
    setValorSelecionado(valor);
    setValorDeposito(valor.toString());
  };

  const handleDepositar = async () => {
    const valor = parseFloat(valorDeposito);
    if (valor >= 25) {
      setLoading(true);
      setError(null); // Limpar erro anterior
      
      try {
        const resultado = await onDepositar({ valor, metodo: metodoPagamento });
        if (resultado?.success && resultado?.data) {
          setDepositoCriado(resultado.data);
        }
      } catch (error) {
        console.error("Erro ao criar depósito:", error);
        
        // Tratar erros específicos
        if (error.message?.includes("PIXUP_NOT_CONFIGURED") || 
            error.message?.includes("Sistema de pagamento PIX não está configurado")) {
          setError({
            type: "pixup_config",
            title: "PIX Indisponível",
            message: "O sistema de pagamento PIX não está configurado no momento. Tente novamente mais tarde ou entre em contato com o suporte.",
            icon: "⚠️"
          });
        } else {
          setError({
            type: "general",
            title: "Erro no Depósito",
            message: error.message || "Ocorreu um erro ao processar seu depósito. Tente novamente.",
            icon: "❌"
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const valor = e.target.value;
    setValorDeposito(valor);
    setValorSelecionado(null); // Remove seleção automática quando digita
  };

  const copiarCodigoPix = async () => {
    if (depositoCriado?.pixup?.qrCodeText) {
      try {
        await navigator.clipboard.writeText(depositoCriado.pixup.qrCodeText);
        alert("Código PIX copiado para a área de transferência!");
      } catch (error) {
        console.error("Erro ao copiar código PIX:", error);
        alert("Erro ao copiar código PIX");
      }
    } else if (depositoCriado?.qr_code_text) {
      // Fallback para o campo direto do depósito
      try {
        await navigator.clipboard.writeText(depositoCriado.qr_code_text);
        alert("Código PIX copiado para a área de transferência!");
      } catch (error) {
        console.error("Erro ao copiar código PIX:", error);
        alert("Erro ao copiar código PIX");
      }
    }
  };

  const resetarModal = () => {
    setDepositoCriado(null);
    setValorDeposito("");
    setValorSelecionado(null);
    setMetodoPagamento("pix");
    setStatusAtual(null);
    setError(null);
    setQrCodeUrl(null);
  };

  // Gerar QR Code a partir do código PIX
  const gerarQRCode = async (codigoPix) => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(codigoPix, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
      setQrCodeUrl(null);
    }
  };

  const handleStatusChange = (novoStatus) => {
    setStatusAtual(novoStatus);
    if (novoStatus === 'aprovado') {
      // Fechar modal após alguns segundos quando aprovado
      setTimeout(() => {
        onClose();
        resetarModal();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/90 via-purple-900/20 to-black/90 z-[60] flex flex-col items-center justify-center backdrop-blur-sm">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

      {/* Conteúdo principal */}
      <div className="relative z-10 w-[95%] max-w-sm sm:max-w-md">
                 {/* Header do Modal */}
         <div className="flex justify-between items-center mb-4 sm:mb-6">
           <div className="text-center flex-1">
             <p className="text-gray-300 text-xs sm:text-sm">
               {pagamentoAprovado ? '🎉 Pagamento Aprovado!' : 
                depositoCriado ? 'Pague com PIX' : 'Falta pouco para a diversão!'}
             </p>
           </div>
           <button
             onClick={pagamentoAprovado ? onClose : (depositoCriado ? resetarModal : onClose)}
             className="ml-2 sm:ml-4 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
           >
             <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
           </button>
         </div>

                 {/* Seleção de Método de Pagamento - Esconder quando QR Code estiver visível */}
         {!pagamentoAprovado && !depositoCriado && (
           <div 
             className="backdrop-blur-xl p-4 sm:p-6 rounded-xl sm:rounded-2xl border shadow-2xl mb-4 sm:mb-6"
             style={{
               backgroundColor: tema?.bg_card || "rgba(255, 255, 255, 0.05)",
               borderColor: tema?.cor_primaria || "rgba(255, 255, 255, 0.1)",
             }}
           >
          <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
            {/* Botão PIX */}
            <button
              onClick={() => setMetodoPagamento("pix")}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg font-medium transition-all duration-200 ${
                metodoPagamento === "pix"
                  ? "text-white shadow-lg scale-105"
                  : "text-gray-300 hover:opacity-80"
              }`}
              style={{
                backgroundColor: metodoPagamento === "pix" 
                  ? tema?.cor_primaria || "#22C55E"
                  : tema?.bg_secundario || "#374151"
              }}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded flex items-center justify-center">
                <span className="text-green-500 font-bold text-xs sm:text-sm">P</span>
              </div>
              <span className="text-sm sm:text-base">PIX</span>
            </button>

            {/* Botão Cartão de Crédito */}
            <button
              onClick={() => setMetodoPagamento("cartao")}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg font-medium transition-all duration-200 ${
                metodoPagamento === "cartao"
                  ? "text-white shadow-lg scale-105"
                  : "text-gray-300 hover:opacity-80"
              }`}
              style={{
                backgroundColor: metodoPagamento === "cartao" 
                  ? tema?.cor_primaria || "#22C55E"
                  : tema?.bg_secundario || "#374151"
              }}
            >
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Cartão de Crédito</span>
            </button>
          </div>

          {/* Detalhes do Depósito */}
          <div className="text-center">
            <h3 
              className="font-semibold text-base sm:text-lg mb-2"
              style={{ color: tema?.cor_primaria || "#22C55E" }}
            >
              Depósito via {metodoPagamento === "pix" ? "PIX" : "Cartão"}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
              Valor do depósito (Depósito mínimo de R$ 25,00)
            </p>

            {/* Campo de Input */}
            <div className="relative mb-3 sm:mb-4">
              <Input
                type="number"
                placeholder="Insira um valor"
                value={valorDeposito}
                onChange={handleInputChange}
                className="w-full text-white placeholder-gray-400 text-center text-base sm:text-lg py-2.5 sm:py-3"
                style={{
                  backgroundColor: tema?.bg_card || "#1F2937",
                  borderColor: tema?.cor_primaria || "#22C55E",
                  color: tema?.cor_texto_primaria || "#FFFFFF"
                }}
                min="25"
                step="0.01"
              />
              <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2">
                <Coins 
                  className="w-4 h-4 sm:w-5 sm:h-5" 
                  style={{ color: tema?.cor_primaria || "#22C55E" }}
                />
              </div>
            </div>

            {/* Opções de Depósito */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {opcoesDeposito.map((opcao) => (
                <button
                  key={opcao.valor}
                  onClick={() => handleValorSelecionado(opcao.valor)}
                  className={`p-2 sm:p-3 rounded-lg font-medium transition-all duration-200 ${
                    valorSelecionado === opcao.valor
                      ? "text-white shadow-lg scale-105"
                      : "text-gray-300 hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: valorSelecionado === opcao.valor
                      ? tema?.cor_primaria || "#22C55E"
                      : tema?.bg_secundario || "#374151"
                  }}
                >
                  <div className="text-xs sm:text-sm font-bold">R$ {opcao.valor}</div>
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="text-xs">bônus R$ {opcao.bonus}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Botão de Depósito */}
            <Button
              onClick={handleDepositar}
              disabled={!valorDeposito || parseFloat(valorDeposito) < 25 || loading}
              className="w-full font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-base sm:text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: tema?.cor_primaria || "#22C55E",
                color: tema?.cor_texto_primaria || "#FFFFFF"
              }}
            >
              {loading ? "Processando..." : "Depositar"}
            </Button>
          </div>
        </div>
        )}

        {/* Seção de Erro */}
        {error && (
          <div 
            className="backdrop-blur-xl p-4 sm:p-6 rounded-xl sm:rounded-2xl border shadow-2xl mt-4 sm:mt-6"
            style={{
              backgroundColor: tema?.bg_card || "rgba(255, 255, 255, 0.05)",
              borderColor: error.type === "pixup_config" ? "#F59E0B" : "#EF4444",
            }}
          >
            <div className="text-center">
              <div className="mb-4">
                <div className="text-4xl mb-2">{error.icon}</div>
                <h3 
                  className="font-bold text-lg sm:text-xl mb-2"
                  style={{ 
                    color: error.type === "pixup_config" ? "#F59E0B" : "#EF4444" 
                  }}
                >
                  {error.title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base mb-4">
                  {error.message}
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={resetarModal}
                  className="flex-1 py-2.5 sm:py-3 px-4 rounded-lg font-medium transition-all duration-200"
                  style={{
                    backgroundColor: error.type === "pixup_config" ? "#F59E0B" : "#EF4444",
                    color: "#FFFFFF"
                  }}
                >
                  🔄 Tentar Novamente
                </Button>
                
                {error.type === "pixup_config" && (
                  <Button
                    onClick={() => setMetodoPagamento("cartao")}
                    variant="outline"
                    className="flex-1 py-2.5 sm:py-3 px-4 rounded-lg font-medium transition-all duration-200"
                    style={{
                      borderColor: tema?.cor_primaria || "#22C55E",
                      color: tema?.cor_primaria || "#22C55E"
                    }}
                  >
                    💳 Usar Cartão
                  </Button>
                )}
              </div>

              {/* Informações Adicionais */}
              {error.type === "pixup_config" && (
                <div className="mt-4 text-xs text-gray-400">
                  <p>💡 <strong>Dica:</strong> Você pode tentar usar cartão de crédito como alternativa</p>
                  <p>📞 <strong>Suporte:</strong> Entre em contato se o problema persistir</p>
                </div>
              )}
            </div>
          </div>
        )}

                 {/* Tela de Pagamento Aprovado */}
        {pagamentoAprovado && (
          <div 
            className="backdrop-blur-xl p-6 sm:p-8 rounded-2xl border shadow-2xl text-center"
            style={{
              backgroundColor: tema?.bg_card || "rgba(255, 255, 255, 0.05)",
              borderColor: "#22C55E",
            }}
          >
            <div className="mb-6">
              {/* Animação de sucesso */}
              <div className="mx-auto mb-4 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-green-500 mb-2">
                🎉 Pagamento Aprovado!
              </h3>
              
              <p className="text-gray-300 text-sm mb-4">
                Seu depósito de <span className="font-bold text-green-400">
                  R$ {pagamentoData?.valor || '0,00'}
                </span> foi aprovado com sucesso!
              </p>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <p className="text-green-400 text-sm font-medium">
                  💰 Seu saldo foi atualizado automaticamente
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Aprovado em: {new Date().toLocaleString('pt-BR')}
                </p>
              </div>
              
              <p className="text-gray-500 text-xs">
                Esta janela será fechada automaticamente em alguns segundos...
              </p>
            </div>
          </div>
        )}

        {/* Seção do QR Code PIX - Layout Compacto */}
         {!pagamentoAprovado && depositoCriado && depositoCriado.pixup && (
           <div 
             className="backdrop-blur-xl p-4 sm:p-6 rounded-2xl border shadow-2xl"
             style={{
               backgroundColor: tema?.bg_card || "rgba(255, 255, 255, 0.05)",
               borderColor: tema?.cor_primaria || "rgba(255, 255, 255, 0.1)",
             }}
           >
             <div className="text-center">
               {/* Header Compacto */}
               <div className="mb-4">
                 
                 <p className="text-gray-400 text-xs sm:text-sm">
                   Escaneie o QR Code ou copie o código
                 </p>
               </div>
              
                             {/* QR Code Compacto */}
               <div className="mb-4 flex justify-center">
                 <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border-2 border-gray-100">
                   {qrCodeUrl ? (
                     <img 
                       src={qrCodeUrl} 
                       alt="QR Code PIX"
                       className="w-32 h-32 sm:w-36 sm:h-36"
                     />
                   ) : (
                     <div className="w-32 h-32 sm:w-36 sm:h-36 bg-gray-100 rounded-lg flex items-center justify-center">
                       <div className="text-gray-400 text-center">
                         <div className="text-2xl mb-2">⏳</div>
                         <div className="text-xs font-medium">Gerando...</div>
                       </div>
                     </div>
                   )}
                 </div>
               </div>

                             {/* Informações Essenciais */}
               <div className="mb-4">
                 {/* Indicador de Conexão WebSocket 
                 <div className="flex items-center justify-center mb-3">
                   <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                     isConnected 
                       ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                       : 'bg-red-500/20 text-red-400 border border-red-500/30'
                   }`}>
                     <div className={`w-2 h-2 rounded-full ${
                       isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                     }`}></div>
                     {isConnected ? 'Conectado' : 'Desconectado'}
                   </div>
                 </div>*/}

                 {/* Valor e Status em Linha */}
                 <div className="flex items-center justify-center gap-4 mb-3">
                   <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 px-3 py-2 rounded-lg border border-green-500/30">
                     <div className="text-gray-400 text-xs mb-1">Valor</div>
                     <div 
                       className="text-lg font-bold"
                       style={{ color: tema?.cor_primaria || "#22C55em" }}
                     >
                       R$ {(() => {
                         // Tentar diferentes campos para o valor
                         const valor = depositoCriado.valor || 
                                     depositoCriado.pixup?.amount || 
                                     '0.00';
                         
                         // Formatar para 2 casas decimais
                         return typeof valor === 'number' ? valor.toFixed(2) : valor;
                       })()}
                     </div>
                   </div>
                   
                   {/* Status Compacto */}
                   <div className="bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                     <div className="text-gray-400 text-xs mb-1">Status</div>
                     <div className="text-sm font-medium text-green-400">
                       {depositoCriado.pixup?.status === 'PENDING' ? 'Aguardando Pagamento' : 
                        depositoCriado.pixup?.status === 'PAID' ? 'Pago' :
                        depositoCriado.pixup?.status === 'EXPIRED' ? 'Expirado' :
                        depositoCriado.status === 'aprovado' ? 'Pago' :
                        depositoCriado.status === 'expirado' ? 'Expirado' :
                        depositoCriado.status === 'cancelado' ? 'Cancelado' :
                        'Pendente'}
                     </div>
                   </div>
                 </div>
               </div>

                             {/* Botão de Ação - Apenas Copiar */}
               <div className="mb-4">
                 <Button
                   onClick={copiarCodigoPix}
                   className="w-full py-3 px-6 rounded-lg font-semibold text-base transition-all duration-200 hover:scale-105 shadow-lg"
                   style={{
                     backgroundColor: tema?.cor_primaria || "#22C55E",
                     color: tema?.cor_texto_primaria || "#FFFFFF"
                   }}
                 >
                   <Clipboard className="w-4 h-4 mr-2" />
                   Copiar Código PIX
                 </Button>
               </div>

                             {/* Instruções Compactas no Rodapé */}
               <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-700/30">
                 <div className="text-center">
                   <div className="flex justify-center gap-3 text-xs text-gray-500">
                     <span>1. App do banco</span>
                     <span>•</span>
                     <span>2. PIX</span>
                     <span>•</span>
                     <span>3. Escanear</span>
                     <span>•</span>
                     <span>4. Confirmar</span>
                   </div>
                 </div>
               </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
