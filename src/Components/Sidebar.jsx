import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "../styles/Sidebar.css";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const {token, user, logout} = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
          <li><Link to="/RoleDashboard" onClick={() => setOpen(false)}>Inicio</Link></li>
          {token ? (
            <>
              {/** Link dinámico al dashboard según el rol */}
              <li>
                <Link to={
                  user?.role === 'admin' ? '/admin/dashboard' :
                  user?.role === 'profesor' ? '/professor/dashboard' :
                  '/student/dashboard'
                } onClick={() => setOpen(false)}>Mi panel</Link>
              </li>
              {user && user.role === "admin" && (
                <>
                  <li>
                    <Link to="/admin/dashboard" onClick={() => setOpen(false)}>Admin - Panel</Link>
                  </li>
                  <li>
                    <Link to="/admin/users" onClick={() => setOpen(false)}>Usuarios</Link>
                  </li>
                  <li>
                    <Link to="/admin/courses" onClick={() => setOpen(false)}>Cursos</Link>
                  </li>
                </>
              )}
              <li>
                <button onClick={handleLogout}>Cerrar sesión</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setOpen(false)}>Iniciar sesión</Link>
              </li>
              <li>
                <Link to="/Register" onClick={() => setOpen(false)}>Registrarse</Link>
              </li>
              <li>
                <Link to="/courses" onClick={() => setOpen(false)}>Cursos</Link>
              </li>
            </>
          )}
        </ul>
        <div className="meta">
          {user ? (
            <div className="user-info">
              <span className="user-name">{(user.firstName || user.lastName) ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : user.email}</span>
              <small className="user-role">{user.role}</small>
            </div>
          ) : (
            <small>v1.0</small>
          )}
        </div>
      </nav>
    </div>
  );
}