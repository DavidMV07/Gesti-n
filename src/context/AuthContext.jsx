// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch(e){ return null; }
  });

  useEffect(()=> {
    // opcional: validar token al arrancar (llamar /auth/validate si lo tienes)
  }, []);

  const login = ({ token: t, user: u }) => {
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u || null));
    setToken(t);
    setUser(u || null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (u) => {
    // update user in context and localStorage without changing token
    try {
      localStorage.setItem('user', JSON.stringify(u || null));
      setUser(u || null);
    } catch(e){ console.error('updateUser error', e); }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}