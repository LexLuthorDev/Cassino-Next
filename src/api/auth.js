import http from "./http";

export const login = (email, senha) => {
  return http.post("/jogador/login", { email, senha });
};

export const logout = () => {
  return http.post("/jogador/logout");
};
