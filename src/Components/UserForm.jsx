// ...new file...
import React, { useEffect, useState } from "react";
import apiFetch from "../utils/api";
import UserForm from "../Components/UserForm";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // user object or null
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/admin/users");
      setUsers(data);
    } catch (e) {
      setError("No se pudo cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };
  const handleEdit = (u) => {
    setEditing(u);
    setShowForm(true);
  };

  const handleSave = async (payload) => {
    try {
      if (editing) {
        await apiFetch(`/api/admin/users/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/api/admin/users", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e.body?.message || "Error al guardar");
    }
  };

  const handleDelete = async (u) => {
    if (!confirm(`Eliminar ${u.email}?`)) return;
    try {
      await apiFetch(`/api/admin/users/${u._id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError("Error al eliminar");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Usuarios</h2>
        <div>
          <button onClick={handleCreate}>Crear usuario</button>
        </div>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>Editar</button>
                  <button onClick={() => handleDelete(u)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <UserForm
          user={editing}
          onCancel={() => setShowForm(false)}
          onSaved={handleSave}
        />
      )}
    </div>
  );
}
