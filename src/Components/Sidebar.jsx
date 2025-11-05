// ...new file...
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h2 className="logo">Panel</h2>
        <button onClick={() => setCollapsed(!collapsed)} style={{background:"transparent",border:"none",color:"#fff",cursor:"pointer"}}>
          {collapsed ? "≫" : "≪"}
        </button>
      </div>

      <nav>
        <ul>
          <li><Link to="/dashboard">Inicio</Link></li>
          <li><Link to="/admin/users">Usuarios</Link></li>
          <li><Link to="/courses">Cursos</Link></li>
          <li><Link to="/settings">Configuración</Link></li>
        </ul>
      </nav>

      <div className="meta">
        <small>v1.0</small>
      </div>
    </aside>
  );
}