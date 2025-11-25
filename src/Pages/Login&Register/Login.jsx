import "../../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import apiFetch from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data && data.token) {
        login({ token: data.token, user: data.user });
        navigate("/RoleDashboard");
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      // Mostrar detalles en consola para depuración
      console.error("Login error:", err);
      const clientMessage = err?.body?.message || err?.message || (err?.original && err.original.message) || "Error de conexión con el servidor";
      setError(clientMessage);
    }
  };

  return (
    <div className="Login__Container">
      <div className="Login">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit} className="Form__Login">
            <label htmlFor="email">Correo: </label>
            <input type="email" id="email" placeholder="ejemplo@gmail.com" value={email} onChange={e => setEmail(e.target.value)}/>
            <label htmlFor="password">Contraseña: </label>
            <input type="password" id="password" placeholder="Tu contraseña" value={password} onChange={e => setPassword(e.target.value)}/>
            <div className="Login__Buttons">
              <button type="submit" className="Btn__Submit">Entrar</button>
              <button type="button" className="Btn__Register" onClick={() => navigate("/register")}>Registrarse</button>
            </div>
            {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
          </form>
      </div>
    </div>
  );
}

export default Login;