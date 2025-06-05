import { createContext, useContext, useEffect, useState } from "react";
import http from "../api/http";
import { getJogadorMe } from "../api/jogador";

import { doLogout } from "../services/authService";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const verificarSessao = async () => {
    try {
      const res = await getJogadorMe();
      if (res.data && res.data.usuario) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verificarSessao();
  }, []);

  const login = () => setAuthenticated(true);
  const logout = async () => {
    try {
      await doLogout();
    } finally {
      setAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, verificarSessao }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth }; // ✅ agora você exporta as duas coisas
