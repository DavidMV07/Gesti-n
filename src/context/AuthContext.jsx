import React, { createContext, useEffect, useState, useContext } from "react";
import apiFetch from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar usuario autenticado (si existe token)
  const loadUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await apiFetch("/api/auth/me");
      // Aseguramos que tenga el campo role
      if (data && data.role) {
        setUser(data);
      } else {
        console.warn("El usuario no tiene campo 'role' en /api/auth/me");
        setUser(null);
      }
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Ejecutar al iniciar la app
  useEffect(() => {
    loadUser();
  }, []);

  // 🔹 Cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, reload: loadUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acceder al contexto
export function useAuth() {
  return useContext(AuthContext);
}
