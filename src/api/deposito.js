// src/api/deposito.js

import http from './http';

const depositoAPI = {
  // Criar novo depósito
  async criarDeposito(dadosDeposito) {
    try {
      const response = await http.post('/deposito/frontend', dadosDeposito);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar depósito:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar depósito');
    }
  },

  // Buscar depósitos do jogador
  async buscarDepositosJogador(limit = 10) {
    try {
      const response = await http.get(`/deposito/jogador?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar depósitos:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar depósitos');
    }
  },

  // Buscar depósito específico
  async buscarDeposito(id) {
    try {
      const response = await http.get(`/deposito/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar depósito:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar depósito');
    }
  },

  // Atualizar depósito
  async atualizarDeposito(id, dadosAtualizacao) {
    try {
      const response = await http.put(`/deposito/${id}`, dadosAtualizacao);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar depósito:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar depósito');
    }
  },

  // Aprovar depósito
  async aprovarDeposito(id, observacoes = '') {
    try {
      const response = await http.post(`/deposito/${id}/aprovar`, { observacoes });
      return response.data;
    } catch (error) {
      console.error('Erro ao aprovar depósito:', error);
      throw new Error(error.response?.data?.error || 'Erro ao aprovar depósito');
    }
  },

  // Rejeitar depósito
  async rejeitarDeposito(id, observacoes = '') {
    try {
      const response = await http.post(`/deposito/${id}/rejeitar`, { observacoes });
      return response.data;
    } catch (error) {
      console.error('Erro ao rejeitar depósito:', error);
      throw new Error(error.response?.data?.error || 'Erro ao rejeitar depósito');
    }
  },

  // Deletar depósito
  async deletarDeposito(id) {
    try {
      const response = await http.delete(`/deposito/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar depósito:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar depósito');
    }
  }
};

export default depositoAPI;
