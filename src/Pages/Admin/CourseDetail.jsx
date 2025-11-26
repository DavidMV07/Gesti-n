import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiFetch from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

export default function CourseDetail(){
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const { user } = useContext(AuthContext);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [myEnrollmentId, setMyEnrollmentId] = useState(null);

  const fetchCourse = useCallback(async () => {
    try { const data = await apiFetch(`/api/courses/${id}`, { method: 'GET' }); setCourse(data); }
    catch (err) { console.error(err); }
  }, [id]);

  const fetchUsers = async () => {
    try { const data = await apiFetch('/api/admin/users', { method: 'GET' }); setUsers(data || []); }
    catch (err) { console.error(err); }
  };

  useEffect(()=>{ fetchCourse(); fetchUsers(); }, [fetchCourse, id]);

  useEffect(()=>{
    // Check if current user is enrolled in this course
    const fetchMy = async () => {
      if(!user) return;
      try {
        const my = await apiFetch('/api/enrollments/me');
        const found = (my || []).find(e => e.course && (e.course._id === id || e.course === id));
        if(found){ setIsEnrolled(true); setMyEnrollmentId(found._id); }
        else { setIsEnrolled(false); setMyEnrollmentId(null); }
      } catch(err) {
        console.error(err);
      }
    }
    fetchMy();
  }, [user, id]);

  const handleAdd = async () => {
    if(!selectedTeacher) { alert('Selecciona un docente'); return; }
    try {
      await apiFetch(`/api/courses/${id}/profesor`, { method: 'POST', body: JSON.stringify({ profesorId: selectedTeacher }) });
      setSelectedTeacher('');
      fetchCourse();
    } catch (err) { console.error(err); alert('Error asignando docente'); }
  };

  const handleRemove = async (profesorId) => {
    if(!confirm('Quitar docente?')) return;
    try {
      await apiFetch(`/api/courses/${id}/profesor/${profesorId}`, { method: 'DELETE' });
      fetchCourse();
    } catch (err) { console.error(err); alert('Error removiendo docente'); }
  };

  const handleEnroll = async () => {
    if(!user){ alert('Necesitas iniciar sesión'); return; }
    try {
      const res = await apiFetch('/api/enrollments', { method: 'POST', body: JSON.stringify({ courseId: id }) });
      setIsEnrolled(true);
      setMyEnrollmentId(res._id || res.id);
      alert('Matriculado correctamente');
    } catch (err) { console.error(err); alert('Error al matricular'); }
  };

  const handleUnenroll = async () => {
    if(!myEnrollmentId){ alert('No hay matrícula encontrada'); return; }
    if(!confirm('¿Deseas desmatricularte de este curso?')) return;
    try {
      await apiFetch(`/api/enrollments/${myEnrollmentId}`, { method: 'DELETE' });
      setIsEnrolled(false);
      setMyEnrollmentId(null);
      alert('Desmatriculado');
    } catch (err) { console.error(err); alert('Error al desmatricular'); }
  };



  return (
    <div className="admin-container">
      <h2>{course?.title}</h2>
      <p>{course?.description}</p>

      {/* Enroll actions for students */}
      {user && user.role === 'alumno' && (
        <div style={{ margin: '12px 0' }}>
          {!isEnrolled ? (
            <button onClick={handleEnroll}>Matricularme</button>
          ) : (
            <button onClick={handleUnenroll}>Desmatricularme</button>
          )}
        </div>
      )}

      <div className="teacher-container">
        <h2 className="teacher-title">Docentes asignados</h2>

        <table className="teacher-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {(course?.profesor || []).length > 0 ? (
              (course?.profesor || []).map(p => (
                <tr key={p._id}>
                  <td>
                    {(p.firstName || p.lastName)
                      ? `${p.firstName || ''} ${p.lastName || ''}`.trim()
                      : p.email}
                  </td>

                  <td>{p.role}</td>

                  <td>
                    <button
                      className="btn-remove"
                      onClick={() => handleRemove(p._id)}
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "15px" }}>
                  No hay docentes asignados.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <h3 style={{ marginTop: 25, color: "#ffcf40", fontSize: 20 }}>Asignar docente</h3>

        <div className="assign-box">
          <select
            value={selectedTeacher}
            onChange={e => setSelectedTeacher(e.target.value)}
          >
            <option value="">-- seleccionar --</option>
            {users
              .filter(u => u.role === 'profesor')
              .map(u => (
                <option key={u._id} value={u._id}>
                  {(u.firstName || u.lastName)
                    ? `${u.firstName || ''} ${u.lastName || ''}`.trim()
                    : u.email} ({u.role})
                </option>
              ))}
          </select>

          <button className="btn-assign" onClick={handleAdd}>
            Asignar
          </button>
          <button className="btn-back" onClick={() => navigate(-1)}>
            ⟵ Volver
          </button>
        </div>
      </div>
    </div>
  );
}
