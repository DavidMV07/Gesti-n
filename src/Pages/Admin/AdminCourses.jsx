import { useEffect, useState } from "react";
import apiFetch from "../../utils/api";
import CourseForm from "./CourseForm";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminUsers.css";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const navigate = useNavigate();

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

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
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
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleCreate}>Crear curso</button>
      </div>

      {showForm && (
        <CourseForm course={editingCourse} onSaved={handleFormSaved} onCancel={() => { setShowForm(false); setEditingCourse(null); }} />
      )}

      {loading ? <p>Cargando cursos...</p> : (
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
            {courses.map(c => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td>{c.code}</td>
                <td>{(c.teachers || []).map(t => `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.email).join(', ')}</td>
                <td>
                  <button onClick={() => handleEdit(c)}>Editar</button>
                  <button onClick={() => navigate(`/admin/courses/${c._id}`)}>Gestionar Docentes</button>
                  <button className="delete-btn" onClick={() => handleDelete(c._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
