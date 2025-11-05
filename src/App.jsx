import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Pages/Header";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import UsersPage from "./Pages/UsersPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminUsers from './Pages/AdminUsers';
import "./App.css"

function ProtectedAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Verificando...</div>;
  if (!user || user.role !== "admin") return <Navigate to="/login" />;
  return children;
}

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  const handleLogin = () => setIsAuth(true);

  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleLogin} />} />
          <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/users" element={
            <ProtectedAdmin>
              <UsersPage />
            </ProtectedAdmin>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
