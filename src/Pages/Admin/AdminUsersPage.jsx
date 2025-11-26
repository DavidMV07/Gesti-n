import React, { useEffect, useState } from "react";
import "../../styles/AdminUsersPage.css";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // MODAL CREAR
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "alumno",
  });

  // MODAL EDITAR
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const token = localStorage.getItem("token");

  // -----------------------------------
  // GET USERS
  // -----------------------------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener usuarios");

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // -----------------------------------
  // CREAR USUARIO
  // -----------------------------------
  const handleCreate = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error("Error al crear usuario");

      const data = await res.json();

      setUsers([...users, data.user]);
      setShowCreateModal(false);

      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        role: "alumno",
      });

      alert("Usuario creado");
    } catch (err) {
      alert(err.message);
    }
  };

  // -----------------------------------
  // EDITAR
  // -----------------------------------
  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${editingUser._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingUser),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar usuario");

      const data = await res.json();

      setUsers(users.map((u) => (u._id === editingUser._id ? data.user : u)));

      setShowEditModal(false);
      alert("Usuario actualizado");
    } catch (err) {
      alert(err.message);
    }
  };

  // -----------------------------------
  // ELIMINAR
  // -----------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar usuario");

      setUsers(users.filter((u) => u._id !== id));
      alert("Usuario eliminado");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div className="admin-container">
      <h2>Gestión de Usuarios</h2>

      {/* BOTÓN CREAR */}
      <button className="add-btn" onClick={() => setShowCreateModal(true)}>
        + Crear Usuario
      </button>

      {/* TABLA */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingUser(user);
                    setShowEditModal(true);
                  }}
                >
                  Editar
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ======================================== */}
      {/* MODAL CREAR USUARIO */}
      {/* ======================================== */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Crear Usuario</h3>

            <input
              type="text"
              placeholder="Nombre"
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Apellido"
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />

            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="alumno">Alumno</option>
              <option value="profesor">Profesor</option>
              <option value="admin">Admin</option>
            </select>

            <div className="modal-actions">
              <button onClick={handleCreate}>Crear</button>
              <button onClick={() => setShowCreateModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================== */}
      {/* MODAL EDITAR USUARIO */}
      {/* ======================================== */}
      {showEditModal && editingUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Editar Usuario</h3>

            <input
              type="text"
              value={editingUser.firstName}
              onChange={(e) =>
                setEditingUser({ ...editingUser, firstName: e.target.value })
              }
            />

            <input
              type="text"
              value={editingUser.lastName}
              onChange={(e) =>
                setEditingUser({ ...editingUser, lastName: e.target.value })
              }
            />

            <input
              type="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />

            <select
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
            >
              <option value="alumno">Alumno</option>
              <option value="profesor">Profesor</option>
              <option value="admin">Admin</option>
            </select>

            <div className="modal-actions">
              <button onClick={handleUpdate}>Guardar</button>
              <button onClick={() => setShowEditModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
