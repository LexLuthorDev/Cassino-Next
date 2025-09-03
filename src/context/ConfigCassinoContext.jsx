import { createContext, useState, useContext , useEffect} from "react";
import { getConfigCassino } from "../api/jogador";

// Criar o contexto
const ConfigCassinoContext = createContext();

export function ConfigCassinoProvider({ children }) {
  const [configCassino, setConfigCassino] = useState(null);
  const [loadingConfigCassino, setLoadingConfigCassino] = useState(true);

  useEffect(() => {
    
    async function fetchConfigCassino() {
      setLoadingConfigCassino(true);
      try {
        //const origin = window.location.origin;
        const res = await getConfigCassino();
        //console.log("Resposta:", res);
        setConfigCassino (res.data); // Exemplo: { corPrimaria: "#FF0000", fonte: "Arial", ... }
      } catch (error) {
        console.error("Erro ao buscar configCassino:", error);
        setConfigCassino(null);
      } finally {
        setLoadingConfigCassino(false);
      }
    }

    fetchConfigCassino();
  }, []);

  return (
    <ConfigCassinoContext.Provider value={{configCassino, loadingConfigCassino}}>
      {children}
    </ConfigCassinoContext.Provider>
  );
}

export function useConfigCassino() {
  return useContext(ConfigCassinoContext);
}