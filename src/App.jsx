import 'reset-css-pro';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Pages/Header";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";


function About() {
  return <div style={{ textAlign: "center", marginTop: "40px" }}><h2>Acerca de nosotros</h2></div>;
}

function App() {
  const [isAuth, setIsAuth] = useState(false);

  const handleLogin = () => setIsAuth(true);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleLogin} />} />
        <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;