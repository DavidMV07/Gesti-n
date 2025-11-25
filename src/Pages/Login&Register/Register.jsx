import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Usuario registrado exitosamente");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.message || "Error al registrar");
      }
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
          <h2>Registrarse</h2>
          <form onSubmit={handleSubmit} className="Form__Register">
            <label htmlFor="Nombres">Nombres: </label>
            <input type="text" id="Nombres" name="nombres" placeholder="David Esteban" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <label htmlFor="Apellidos">Apellidos: </label>
            <input type="text" id="Apellidos" name="apellidos" placeholder="Mellizo Vidal" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <label htmlFor="Email">Correo: </label>
            <input type="Email" id="Email" name="email" placeholder="ejemplo@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <label htmlFor="password">Contraseña: </label>
            <input type="password" id="password" name="password" placeholder="Tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <div className="Register__Buttons">
              <button type="submit">Registrar</button>
              <button type="button" className="secondary" onClick={() => navigate("/login")}>Volver a Login</button>
            </div>
            {error && <div className="message error">{error}</div>}
            {success && <div className="message success">{success}</div>}
          </form>
      </div>
    </div>
  );
}

export default Register;