import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import apiFetch from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function CoursePage(){
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [myEnrollmentId, setMyEnrollmentId] = useState(null);

  useEffect(()=>{
    const load = async () => {
      try{
        const data = await apiFetch(`/api/courses/${id}`);
        setCourse(data.course || data);
      }catch(err){ console.error(err); }
      finally{ setLoading(false); }
    };
    load();
  },[id]);

  useEffect(()=>{
    const check = async () => {
      if(!user) return;
      try{
        const my = await apiFetch('/api/enrollments/me');
        const found = (my || []).find(e => e.course && (e.course._id === id || e.course === id));
        if(found){ setIsEnrolled(true); setMyEnrollmentId(found._id); }
        else { setIsEnrolled(false); setMyEnrollmentId(null); }
      }catch(err){ /* ignore */ }
    };
    check();
  },[user, id]);

  const handleEnroll = async () => {
    if(!user){ alert('Inicia sesión para matricularte'); return; }
    try{
      const res = await apiFetch('/api/enrollments', { method: 'POST', body: JSON.stringify({ courseId: id }) });
      setIsEnrolled(true);
      setMyEnrollmentId(res._id || res.id);
      alert('Matriculado correctamente');
    }catch(err){ console.error(err); alert('Error al matricular'); }
  };

  const handleUnenroll = async () => {
    if(!myEnrollmentId){ alert('No hay matrícula encontrada'); return; }
    if(!confirm('¿Deseas desmatricularte?')) return;
    try{
      await apiFetch(`/api/enrollments/${myEnrollmentId}`, { method: 'DELETE' });
      setIsEnrolled(false);
      setMyEnrollmentId(null);
      alert('Desmatriculado');
    }catch(err){ console.error(err); alert('Error al desmatricular'); }
  };

  if(loading) return <div>Cargando curso...</div>;
  if(!course) return <div>Curso no encontrado.</div>;

  return (
    <div className="course-page">
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p><strong>Profesores:</strong> {(course.teachers || []).map(t => `${t.firstName||''} ${t.lastName||''} (${t.email})`).join(', ')}</p>

      {user && user.role === 'alumno' && (
        <div style={{ marginTop: 12 }}>
          {!isEnrolled ? (
            <button onClick={handleEnroll}>Matricularme</button>
          ) : (
            <button onClick={handleUnenroll}>Desmatricularme</button>
          )}
        </div>
      )}
    </div>
  );
}
