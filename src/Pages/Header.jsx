import React from "react";
import { useLocation, Link } from "react-router-dom";
import "../Components/Header.css";

function Header() {
  const location = useLocation();
  const simpleRoutes = ["/login", "/register", "/"];
  const isSimple = simpleRoutes.includes(location.pathname);

  return (
    <header className="header">
      <div className="header__logo">
        <img
          src="/logo-universidad.png"
          alt="Logo Universidad"
        />
        <span className="header__title">Universidad Ejemplo</span>
      </div>
      <nav className="header__nav">
        {isSimple ? (
          <Link to="/about" className="header__link">
            Acerca de nosotros
          </Link>
        ) : (
          <>
            <Link to="/dashboard" className="header__link">
              Dashboard
            </Link>
            <Link to="/profile" className="header__link">
              Perfil
            </Link>
            <Link to="/about" className="header__link">
              Acerca de nosotros
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;