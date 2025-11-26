import { useEffect, useState } from "react";
import apiFetch from "../../utils/api";
import CourseForm from "./CourseForm";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminGlobal.css";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const openEditModal = (course) => {
  setEditingUser(course);
  setShowEditModal(true);
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/courses', { method: 'GET' });
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleCreate = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

const handleUpdateCourse = async () => {
  if (!editingUser || !editingUser._id) {
    console.error("No hay curso cargado para editar", editingUser);
    return;
  }

  try {
    setSaving(true);
    console.log("Actualizando curso:", editingUser);

    const res = await apiFetch(`/api/courses/${editingUser._id}`, {
      method: "PUT",
      // apiFetch espera que envíes body como string o algo que fetch entienda -> usamos JSON.stringify
      body: JSON.stringify(editingUser),
    });

    // Dependiendo de cómo tu backend responda, res puede ser objeto vacío o el recurso actualizado.
    console.log("Respuesta actualización curso:", res);

    // Cerrar modal y refrescar
    setShowEditModal(false);
    setEditingUser(null);
    await fetchCourses();
  } catch (err) {
    // apiFetch lanza objetos con { status, body, url } o lanza error de red
    console.error("Error actualizando curso:", err);
    // muestra feedback al usuario
    alert(
      err?.message ||
      (err?.body && JSON.stringify(err.body)) ||
      "Error actualizando curso"
    );
  } finally {
    setSaving(false);
  }
};


  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este curso?')) return;
    try {
      await apiFetch(`/api/courses/${id}`, { method: 'DELETE' });
      fetchCourses();
    } catch (err) { console.error(err); }
  };

  const handleFormSaved = () => {
    setShowForm(false);
    setEditingCourse(null);
    fetchCourses();
  };

return (
  <div className="admin-container">
    <h2>Gestión de Cursos</h2>

    {/* BOTÓN CREAR */}
    <button onClick={handleCreate} className="add-btn">
      + Crear curso
    </button>

    {showForm && (
      <CourseForm
        course={editingCourse}
        onSaved={handleFormSaved}
        onCancel={() => {
          setShowForm(false);
          setEditingCourse(null);
        }}
      />
    )}

    {loading ? (
      <p>Cargando cursos...</p>
    ) : (
      <>
        <table className="user-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Código</th>
              <th>Docentes</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((c) => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td>{c.code}</td>
                <td>
                  {(c.profesor || [])
                    .map(
                      (p) =>
                        `${p.firstName || ""} ${p.lastName || ""}`.trim() ||
                        p.email
                    )
                    .join(", ")}
                </td>

                <td>
                  <button onClick={() => openEditModal(c)} className="edit-btn">
                    Editar
                  </button>

                  <button
                    onClick={() => navigate(`/admin/courses/${c._id}`)}
                    className="manage-btn"
                  >
                    Gestionar Docentes
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(c._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showEditModal && editingUser && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Editar Curso</h3>

              <input
                type="text"
                placeholder="Título del curso"
                value={editingUser.title}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, title: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Código"
                value={editingUser.code}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, code: e.target.value })
                }
              />

              <textarea
                placeholder="Descripción"
                value={editingUser.description || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, description: e.target.value })
                }
                style={{ resize: "none", padding: "8px", borderRadius: "6px" }}
              />

              <div className="modal-actions">
                <button onClick={handleUpdateCourse} disabled={saving} className="confirm-btn">
                  {saving ? "Guardando..." : "Guardar"}
                </button>
                <button onClick={() => { setShowEditModal(false); setEditingUser(null); }} className="cancel-btn">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )}
  </div>
);

}
