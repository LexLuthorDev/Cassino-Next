import { createContext, useState, useContext , useEffect} from "react";
import { temaCassino } from "../api/jogador";

// Criar o contexto
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    async function fetchTheme() {
      try {
        const origin = window.location.origin;
        console.log("Origin:", origin);
        const res = await temaCassino();
        console.log("Resposta:", res);
        setTheme(res.data); // Exemplo: { corPrimaria: "#FF0000", fonte: "Arial", ... }
      } catch (error) {
        console.error("Erro ao buscar tema:", error);
      }
    }

    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}