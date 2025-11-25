import { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../../styles/AdminUsers.css";
import { AuthContext } from "../../context/AuthContext";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "alumno",
  });

  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const API = "http://localhost:5000/api/admin";


  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Obtener usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/users`, authHeader);
      setUsers(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Crear usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/users`, newUser, authHeader);

      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        role: "alumno",
      });

      fetchUsers();
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  // Actualizar rol
  const handleRoleChange = async (id, role) => {
    try {
      await axios.put(`${API}/users/${id}`, { role }, authHeader);
      fetchUsers();
    } catch (error) {
      console.error("Error al actualizar rol:", error);
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      await axios.delete(`${API}/users/${id}`, authHeader);
      fetchUsers();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-container">
      <h2>Gestión de Usuarios</h2>

      {/* FORM CREAR */}
      <form className="create-user-form" onSubmit={handleCreateUser}>
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
          placeholder="Correo"
          value={newUser.email}
          onChange={(e) =>
            setNewUser({ ...newUser, email: e.target.value })
          }
          required
        />

        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="alumno">Alumno</option>
          <option value="admin">Administrador</option>
        </select>

        <button type="submit">Crear Usuario</button>
      </form>

      <hr />

      {/* TABLA */}
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>

                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  >
                    <option value="alumno">Alumno</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(u._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminUsers;
