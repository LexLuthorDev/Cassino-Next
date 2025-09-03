import http from "./http";

// Lançar jogo (pede URL ao backend)
export const launchGame = ({ provider_code, game_code = "", lang = "pt-br" }) =>
  http.post(`/integracaoigamewin/launch`, { provider_code, game_code, lang });
