import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "../styles/Register.css";

function Register({ onRegister }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Usuario registrado exitosamente");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.message || "Error al registrar");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            Registrar
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => navigate("/login")}
          >
            Volver a Login
          </button>
          {error && <div className="message error">{error}</div>}
          {success && <div className="message success">{success}</div>}
        </form>
      </div>
    </div>
  );
}

export default Register;