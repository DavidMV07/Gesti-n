import "../Components/Login.css";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
    navigate("/dashboard");
  };

  return (
    <div className="Login__Container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Usuario"/>
        <input type="password" placeholder="Contraseña"/>
        <button type="submit" className="Btn__Submit">Entrar</button>
        <button type="button" className="Btn__Register" onClick={() => navigate("/register")}>
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Login;