import axios from "axios";

const http = axios.create({
  baseURL: "https://925c-161-22-59-99.ngrok-free.app/api", // ou IP da API
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ⬅️ ESSENCIAL para cookies HttpOnly
});

http.interceptors.response.use(
  response => response,  // Para capturar a resposta normalmente
  error => {
    // Captura qualquer erro de rede
    if (error.message === "Network Error") {
      console.error("Erro de rede! Verifique a conexão com o servidor.");
    }
    return Promise.reject(error);
  }
);

export default http;
