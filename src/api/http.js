import axios from "axios";

const http = axios.create({
  baseURL: "https://lexluthorapi.site/api", // ou IP da API
  ///baseURL: "http://localhost:3000/api",
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
