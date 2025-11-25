import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Header from "../Pages/Header";

export default function ProtectedRoute({ children, role }) {
  const { token, user } = useContext(AuthContext);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Esperar a que user exista antes de validar roles
  if (!user) {
    return <div>Cargando...</div>;
  }

  // Normalizar roles
  const currentRole = (user.role || "").toLowerCase();
  const requiredRole = (role || "").toLowerCase();

  if (requiredRole && currentRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
