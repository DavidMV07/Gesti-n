import React from "react";
import { Link } from "react-router-dom";
import "../styles/Unauthorized.css";

export default function Unauthorized() {
  return (
    <div className="unauthorized-page">
      <h2>Acceso denegado</h2>
      <p>No tienes permisos para ver esta página.</p>
      <div className="unauthorized-actions">
        <Link to="/RoleDashboard">Ir a mi panel</Link>
        <Link to="/RoleDashboard">Ir al inicio</Link>
      </div>
    </div>
  );
}
