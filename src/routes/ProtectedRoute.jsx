
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

  // Si quieres control por roles (admin)
  if (role && (!user || user.role !== role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
