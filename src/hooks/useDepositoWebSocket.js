import { useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

export const useDepositoWebSocket = (depositoId, usuarioId) => {
  const socketRef = useRef(null);
  const isConnectedRef = useRef(false);

  // Conectar ao WebSocket
  const conectar = useCallback(() => {
    if (!depositoId || !usuarioId || isConnectedRef.current) return;

    try {
      console.log("🔌 [useDepositoWebSocket] Iniciando conexão WebSocket...");
      console.log("📊 [useDepositoWebSocket] Dados da conexão:", {
        depositoId,
        usuarioId,
        url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'https://lexluthorapi.site', //'http://localhost:3000',
        jaConectado: isConnectedRef.current
      });
      
      // Conectar ao servidor WebSocket
      const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'https://lexluthorapi.site'; //'http://localhost:3000';
      console.log("🌐 [useDepositoWebSocket] URL do WebSocket:", wsUrl);
      
      socketRef.current = io(wsUrl, {
        transports: ['websocket', 'polling'], // Tentar websocket primeiro, depois polling
        withCredentials: true,
        timeout: 20000,
        forceNew: true,
        autoConnect: true,
        upgrade: true,
        rememberUpgrade: true
      });

      // Eventos de conexão
      socketRef.current.on('connect', () => {
        console.log('🔌 [useDepositoWebSocket] Conectado ao servidor WebSocket');
        console.log('📊 [useDepositoWebSocket] Socket ID:', socketRef.current.id);
        isConnectedRef.current = true;
        
        // Entrar na sala do depósito
        console.log('🚪 [useDepositoWebSocket] Entrando na sala do depósito:', {
          depositoId,
          usuarioId
        });
        
        socketRef.current.emit('deposito:entrar', {
          depositoId: depositoId,
          usuarioId: usuarioId
        });
      });

      socketRef.current.on('deposito:conectado', (data) => {
        console.log('✅ [useDepositoWebSocket] Conectado à sala do depósito:', data);
        console.log('📊 [useDepositoWebSocket] Dados recebidos:', {
          sala: data.sala,
          depositoId: data.depositoId,
          usuarioId: data.usuarioId
        });
      });

      // Eventos de depósito
      socketRef.current.on('deposito:pagamento_aprovado', (data) => {
        console.log('🎉 [useDepositoWebSocket] ===== PAGAMENTO APROVADO =====');
        console.log('📊 [useDepositoWebSocket] Dados do pagamento aprovado:', data);
        console.log('📊 [useDepositoWebSocket] Disparando evento customizado...');
        // Aqui você pode disparar um callback ou usar um estado global
        window.dispatchEvent(new CustomEvent('deposito:pagamento_aprovado', { detail: data }));
        console.log('✅ [useDepositoWebSocket] Evento customizado disparado');
      });

      socketRef.current.on('deposito:pagamento_rejeitado', (data) => {
        console.log('❌ [useDepositoWebSocket] ===== PAGAMENTO REJEITADO =====');
        console.log('📊 [useDepositoWebSocket] Dados do pagamento rejeitado:', data);
        window.dispatchEvent(new CustomEvent('deposito:pagamento_rejeitado', { detail: data }));
      });

      socketRef.current.on('deposito:pagamento_expirado', (data) => {
        console.log('⏰ [useDepositoWebSocket] ===== PAGAMENTO EXPIRADO =====');
        console.log('📊 [useDepositoWebSocket] Dados do pagamento expirado:', data);
        window.dispatchEvent(new CustomEvent('deposito:pagamento_expirado', { detail: data }));
      });

      socketRef.current.on('deposito:status_atualizado', (data) => {
        console.log('📊 [useDepositoWebSocket] ===== STATUS ATUALIZADO =====');
        console.log('📊 [useDepositoWebSocket] Dados do status atualizado:', data);
        window.dispatchEvent(new CustomEvent('deposito:status_atualizado', { detail: data }));
      });

      // Eventos de erro
      socketRef.current.on('deposito:erro', (data) => {
        console.error('❌ [useDepositoWebSocket] Erro:', data);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('❌ [useDepositoWebSocket] Erro de conexão:', error);
        console.error('❌ [useDepositoWebSocket] Detalhes do erro:', {
          message: error.message,
          description: error.description,
          type: error.type,
          transport: error.transport
        });
        isConnectedRef.current = false;
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('🚪 [useDepositoWebSocket] Desconectado:', reason);
        isConnectedRef.current = false;
      });

    } catch (error) {
      console.error('❌ [useDepositoWebSocket] Erro ao conectar:', error);
    }
  }, [depositoId, usuarioId]);

  // Desconectar do WebSocket
  const desconectar = useCallback(() => {
    if (socketRef.current && isConnectedRef.current) {
      // Sair da sala do depósito
      socketRef.current.emit('deposito:sair', {
        depositoId: depositoId,
        usuarioId: usuarioId
      });

      // Desconectar
      socketRef.current.disconnect();
      isConnectedRef.current = false;
      socketRef.current = null;
      
      console.log('🚪 [useDepositoWebSocket] Desconectado da sala do depósito');
    }
  }, [depositoId, usuarioId]);

  // Testar conexão
  const testarConexao = useCallback(() => {
    if (socketRef.current && isConnectedRef.current) {
      socketRef.current.emit('deposito:ping', { timestamp: Date.now() });
    }
  }, []);

  // Conectar automaticamente quando o hook for montado
  useEffect(() => {
    conectar();

    // Cleanup na desmontagem
    return () => {
      desconectar();
    };
  }, [conectar, desconectar]);

  // Reconectar quando depositoId ou usuarioId mudarem
  useEffect(() => {
    if (depositoId && usuarioId) {
      desconectar();
      setTimeout(() => conectar(), 100);
    }
  }, [depositoId, usuarioId, conectar, desconectar]);

  return {
    conectar,
    desconectar,
    testarConexao,
    isConnected: isConnectedRef.current,
    socket: socketRef.current
  };
};
