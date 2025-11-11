import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <nav className={scrolled ? "navbar scrolled" : "navbar"} >
        <div className="titulo">
          <h2>S.I.G.A</h2>
          <p>Sistema Integrado de Gestión Académica</p>
        </div>
        {/* Botón menú para móviles */}
        <div className="menu-toggle" onClick={() => setOpen(!open)}>
         {open ? <X size={26} color="#fff" /> : <Menu size={26} color="#fff" />}
        </div>
        <ul className={open ? "nav-links open" : "nav-links"}>
          <li><Link to="/dashboard" onClick={() => setOpen(false)}>Inicio</Link></li>
          <li><Link to="/admin/users" onClick={() => setOpen(false)}>Usuarios</Link></li>
          <li><Link to="/courses" onClick={() => setOpen(false)}>Cursos</Link></li>
          <li><Link to="/settings" onClick={() => setOpen(false)}>Configuración</Link></li>
        </ul>
        <div className="meta">
          <small>v1.0</small>
        </div>
      </nav>
    </div>
  );
}