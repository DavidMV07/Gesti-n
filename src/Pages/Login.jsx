import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        onLogin();
        navigate("/dashboard");
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
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