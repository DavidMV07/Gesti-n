// src/pages/AdminDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import "../../styles/AdminGlobal.css"; // Asegúrate de que tu CSS esté importado

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(import.meta.env.VITE_API_URL + "/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const countByRole = (role) => users.filter(u => u.role === role).length;

  const exportCSV = () => {
    if (!users.length) return;
    const headers = ["ID", "Nombre", "Email", "Rol"];
    const rows = users.map(u => [
      u._id || u.id,
      `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.name || u.nombre,
      u.email,
      u.role
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "usuarios_estadisticas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="admin-container">Cargando usuarios...</div>;
  if (error) return <div className="admin-container">Error: {JSON.stringify(error)}</div>;

  const rolesData = [
    { name: "Alumnos", value: countByRole("alumno") },
    { name: "Profesores", value: countByRole("profesor") },
    { name: "Administradores", value: countByRole("admin") },
  ];

  const COLORS = ["#facc15", "#00C49F", "#FF6B6B"];

  return (
    <div className="admin-container">
      <h2>Dashboard Administrativo</h2>

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <strong>Total Alumnos:</strong> {countByRole("alumno")} &nbsp;|&nbsp;
        <strong>Total Profesores:</strong> {countByRole("profesor")} &nbsp;|&nbsp;
        <strong>Total Administradores:</strong> {countByRole("admin")}
      </div>

      <button className="add-btn" onClick={exportCSV}>Exportar Estadísticas (CSV)</button>

      <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Distribución de roles</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", justifyContent: "center", marginBottom: "30px" }}>
        <div style={{ width: "400px", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rolesData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: "400px", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rolesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {rolesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 style={{ marginBottom: "15px" }}>Usuarios Registrados</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id || u.id}>
              <td>{u._id || u.id}</td>
              <td>{(u.firstName || u.lastName) ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : (u.name || u.nombre)}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
