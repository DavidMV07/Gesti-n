import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "../styles/Sidebar.css";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { token, user, logout } = useContext(AuthContext);
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

  const closeMenu = () => setOpen(false);


  // ============================
  // MENÚ SEGÚN ROL
  // ============================
  const renderRoleMenu = () => {
    if (!user) return null;

    switch (user.role) {

      // ADMIN — OK
      case "admin":
        return (
          <>
            <li><Link to="RoleDashboard" onClick={closeMenu}>Panel Admin</Link></li>
            <li><Link to="/admin/users" onClick={closeMenu}>Usuarios</Link></li>
            <li><Link to="/admin/courses" onClick={closeMenu}>Cursos</Link></li>
          </>
        );

      // PROFESOR — FIXED (ANTES USABAS "profesor")
      case "profesor":
        return (
          <>
            <li><Link to="RoleDashboard" onClick={closeMenu}>Mi Panel</Link></li>
            <li><Link to="/profesor/courses" onClick={closeMenu}>Mis Cursos</Link></li>
          </>
        );

      // ESTUDIANTE — FIXED (ANTES USABAS "estudiante")
      case "alumno":
        return (
          <>
            <li><Link to="RoleDashboard" onClick={closeMenu}>Mi Panel</Link></li>
            <li><Link to="/student/courses" onClick={closeMenu}>Cursos Disponibles</Link></li>
            <li><Link to="/student/enrollments" onClick={closeMenu}>Mis Materias</Link></li>
          </>
        );

      default:
        return null;
    }
  };
  return (
    <nav className={scrolled ? "navbar scrolled" : "navbar"}>

      {/* Título */}
      <div className="titulo">
        <h2>S.I.G.A</h2>
        <p>Sistema Integrado de Gestión Académica</p>
      </div>

      {/* Botón móvil */}
      <div className="menu-toggle" onClick={() => setOpen(!open)}>
        {open ? <X size={26} color="#fff" /> : <Menu size={26} color="#fff" />}
      </div>

      {/* Menú */}
      <ul className={open ? "nav-links open" : "nav-links"}>

        {token ? (
          <>
            {renderRoleMenu()}

            {/* Logout */}
            <li>
              <button onClick={handleLogout} className="btn-logout">
                Cerrar sesión
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" onClick={closeMenu}>Iniciar sesión</Link></li>
            <li><Link to="/Register" onClick={closeMenu}>Registrarse</Link></li>
            <li><Link to="/courses" onClick={closeMenu}>Cursos</Link></li>
          </>
        )}
      </ul>

      {/* Info usuario */}
      <div className="meta">
        {user ? (
          <div className="user-info">
            <span className="user-name">
              {(user.firstName || user.lastName)
                ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                : user.email}
            </span>
            <small className="user-role">{user.role}</small>
          </div>
        ) : (
          <small>v1.0</small>
        )}
      </div>
    </nav>
  );
}
