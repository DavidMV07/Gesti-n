// src/pages/AdminDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function AdminDashboard(){
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    if (!token) return; // si no hay token no intentar
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(import.meta.env.VITE_API_URL + "/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Usuarios API:", res.data);
        setUsers(res.data);
      } catch(err){
        console.error("Error cargando usuarios:", err);
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <div>
      <h2>Usuarios registrados</h2>
      <table>
        <thead><tr><th>ID</th><th>Nombre</th><th>Email</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id || u.id}>
              <td>{u._id || u.id}</td>
              <td>{(u.firstName || u.lastName) ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : (u.name || u.nombre)}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
