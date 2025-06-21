import http from "./http";

export const temaCassino = () => http.post("/cassino/tema");

export const getConfigCassino = () => http.post("/cassino/configuracao");
export const getBonusMetodoIdioma = () => http.get("/jogador/resgatar/bonus-idioma");
export const createJogador = (data) => http.post("/jogador", data);
export const loginJogador = (data) => http.post("/jogador/login", data);
export const getJogadorMe = () => http.post("/jogador/me");

