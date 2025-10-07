import "../Components/Login.css";
import { useNavigate } from "react-router-dom";

function Register({ onRegister }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister();
    navigate("/dashboard");
  };

  return (
    <div className="form-container">
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Usuario" className="input" />
        <input type="email" placeholder="Correo" className="input" />
        <input type="password" placeholder="Contraseña" className="input" />
        <button type="submit" className="btn">Registrar</button>
        <button type="button" className="btn" onClick={() => navigate("/login")}>
          Volver a Login
        </button>
      </form>
    </div>
  );
}

export default Register;