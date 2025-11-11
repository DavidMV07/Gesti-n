import React, { useEffect, useState } from "react";
import apiFetch from "../../utils/api";
import "../../styles/AdminUsers.css"

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "alumno",
  });

  // 🔹 Cargar usuarios al iniciar
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/admin/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Eliminar usuario
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      await apiFetch(`/api/admin/users/${id}`, { method: "DELETE" });
      setUsers(users.filter((u) => u._id !== id));
    } catch {
      alert("Error al eliminar el usuario");
    }
  };

  // ➕ Crear usuario
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(newUser),
      });
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        role: "alumno",
      });
      loadUsers();
    } catch {
      alert("Error al crear usuario");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-users-container">
      <h2>Gestión de Usuarios</h2>

      {/* FORMULARIO DE CREACIÓN */}
      <form onSubmit={handleCreate} className="user-form">
        <input
          type="text"
          placeholder="Nombre"
          value={newUser.firstName}
          onChange={(e) =>
            setNewUser({ ...newUser, firstName: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Apellido"
          value={newUser.lastName}
          onChange={(e) =>
            setNewUser({ ...newUser, lastName: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="alumno">Alumno</option>
          <option value="profesor">Profesor</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">+ Crear usuario</button>
      </form>

      {/* TABLA DE USUARIOS */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Nombre completo</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No hay usuarios registrados.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u._id}>
                <td>
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(u._id)}
                  >
                    🗑 Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UsersPage;
