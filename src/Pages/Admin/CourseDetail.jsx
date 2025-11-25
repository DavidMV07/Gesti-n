import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

export default function CourseDetail(){
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const { user } = useContext(AuthContext);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [myEnrollmentId, setMyEnrollmentId] = useState(null);
  const [courseEnrollments, setCourseEnrollments] = useState([]);
  const [gradeInputs, setGradeInputs] = useState({}); // { enrollmentId: { name, value } }

  const fetchCourse = async () => {
    try { const data = await apiFetch(`/api/courses/${id}`, { method: 'GET' }); setCourse(data); }
    catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try { const data = await apiFetch('/api/admin/users/users', { method: 'GET' }); setUsers(data || []); }
    catch (err) { console.error(err); }
  };

  useEffect(()=>{ fetchCourse(); fetchUsers(); }, [id]);

  useEffect(()=>{
    // Check if current user is enrolled in this course
    const fetchMy = async () => {
      if(!user) return;
      try {
        const my = await apiFetch('/api/enrollments/me');
        const found = (my || []).find(e => e.course && (e.course._id === id || e.course === id));
        if(found){ setIsEnrolled(true); setMyEnrollmentId(found._id); }
        else { setIsEnrolled(false); setMyEnrollmentId(null); }
      } catch(err){ /* ignore */ }
    };
    fetchMy();
  }, [user, id]);

  useEffect(()=>{
    // If user is teacher/admin, load enrollments for this course
    const fetchCourseEnrolls = async () => {
      if(!user) return;
      if(user.role !== 'profesor' && user.role !== 'admin') return;
      try {
        const res = await apiFetch(`/api/enrollments/course/${id}`);
        setCourseEnrollments(res || []);
      } catch(err){ console.error(err); }
    };
    fetchCourseEnrolls();
  }, [user, id]);

  const handleAdd = async () => {
    if(!selectedTeacher) { alert('Selecciona un docente'); return; }
    try {
      await apiFetch(`/api/courses/${id}/teachers`, { method: 'POST', body: JSON.stringify({ teacherId: selectedTeacher }) });
      setSelectedTeacher('');
      fetchCourse();
    } catch (err) { console.error(err); alert('Error asignando docente'); }
  };

  const handleRemove = async (teacherId) => {
    if(!confirm('Quitar docente?')) return;
    try {
      await apiFetch(`/api/courses/${id}/teachers/${teacherId}`, { method: 'DELETE' });
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

  const handleGradeInputChange = (enrollmentId, field, value) => {
    setGradeInputs(prev => ({ ...prev, [enrollmentId]: { ...(prev[enrollmentId]||{}), [field]: value } }));
  };

  const handleAddGrade = async (enrollment) => {
    const input = gradeInputs[enrollment._id];
    if(!input || !input.name) { alert('Ingresa nombre de la evaluación'); return; }
    const val = Number(input.value || 0);
    const newGrade = { name: input.name, value: val };
    const updatedGrades = [ ...(enrollment.grades || []), newGrade ];
    try {
      await apiFetch(`/api/enrollments/${enrollment._id}/grades`, { method: 'PUT', body: JSON.stringify({ grades: updatedGrades }) });
      // refresh
      const res = await apiFetch(`/api/enrollments/course/${id}`);
      setCourseEnrollments(res || []);
      setGradeInputs(prev => ({ ...prev, [enrollment._id]: { name: '', value: '' } }));
    } catch(err){ console.error(err); alert('Error al actualizar calificaciones'); }
  };

  return (
    <div className="admin-container">
      <h2>Curso: {course?.title}</h2>
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

      <h3>Docentes asignados</h3>
      <ul>
        {(course?.teachers || []).map(t => (
          <li key={t._id}>{(t.firstName || t.lastName) ? `${t.firstName || ''} ${t.lastName || ''}`.trim() : t.email} ({t.role}) <button onClick={() => handleRemove(t._id)}>Quitar</button></li>
        ))}
      </ul>

      <h3>Asignar docente</h3>
      <div>
        <select value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)}>
          <option value="">-- seleccionar --</option>
          {users.filter(u => u.role === 'profesor' || u.role === 'admin').map(u => (
            <option key={u._id} value={u._id}>{(u.firstName || u.lastName) ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : u.email} ({u.role})</option>
          ))}
        </select>
        <button onClick={handleAdd} style={{ marginLeft: 8 }}>Asignar</button>
      </div>

      {/* Teacher view: students and grades */}
      {(user && (user.role === 'profesor' || user.role === 'admin')) && (
        <div style={{ marginTop: 24 }}>
          <h3>Estudiantes matriculados</h3>
          {courseEnrollments.length === 0 && <p>No hay estudiantes matriculados.</p>}
          <ul>
            {courseEnrollments.map(enr => (
              <li key={enr._id} style={{ marginBottom: 12 }}>
                <div><strong>{enr.student.firstName || ''} {enr.student.lastName || ''}</strong> ({enr.student.email})</div>
                <div>
                  <strong>Calificaciones:</strong>
                  {enr.grades && enr.grades.length ? (
                    <ul>
                      {enr.grades.map((g, i) => <li key={i}>{g.name}: {g.value}</li>)}
                    </ul>
                  ) : <p>No hay calificaciones.</p>}
                </div>
                <div style={{ marginTop: 8 }}>
                  <input placeholder="Nombre evaluación" value={(gradeInputs[enr._id]||{}).name||''} onChange={e => handleGradeInputChange(enr._id,'name', e.target.value)} />
                  <input placeholder="Valor" type="number" value={(gradeInputs[enr._id]||{}).value||''} onChange={e => handleGradeInputChange(enr._id,'value', e.target.value)} style={{ width: 100, marginLeft: 8 }} />
                  <button onClick={() => handleAddGrade(enr)} style={{ marginLeft: 8 }}>Agregar calificación</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
