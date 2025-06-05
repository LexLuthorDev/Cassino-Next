import { login as loginRequest, logout as logoutRequest } from "../api/auth";

export const doLogin = async (email, senha) => {
  const response = await loginRequest(email, senha);
  
  return response.data;
};

export const doLogout = async () => {
  await logoutRequest(); // faz o POST /jogador/logout
};
