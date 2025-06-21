import React, { createContext, useState, useContext, useEffect } from "react";

// Criação do contexto
const IdiomaContext = createContext();

// Hook para usar o contexto
export const useIdioma = () => useContext(IdiomaContext);

// Componente que fornece o contexto
export const IdiomaProvider = ({ children }) => {
  const [idioma, setIdioma] = useState("pt-br");

  // Carrega o idioma do localStorage ao iniciar
  useEffect(() => {
    const idiomaSalvo = localStorage.getItem("idioma");
    if (idiomaSalvo) {
      setIdioma(idiomaSalvo);
    }
  }, []);

  // Atualiza estado + localStorage
  const setIdiomaState = (novoIdioma) => {
    setIdioma(novoIdioma);
    localStorage.setItem("idioma", novoIdioma);
  };

  return (
    <IdiomaContext.Provider value={{ idioma, setIdiomaState }}>
      {children}
    </IdiomaContext.Provider>
  );
};
