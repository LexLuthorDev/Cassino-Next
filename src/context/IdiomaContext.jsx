import React, { createContext, useState, useContext } from "react";

// Criação do contexto
const IdiomaContext = createContext();

// Hook para usar o contexto
export const useIdioma = () => useContext(IdiomaContext);

// Componente que fornece o contexto
export const IdiomaProvider = ({ children }) => {
  const [idioma, setIdioma] = useState("pt-br");

  return (
    <IdiomaContext.Provider value={{ idioma, setIdioma }}>
      {children}
    </IdiomaContext.Provider>
  );
};
