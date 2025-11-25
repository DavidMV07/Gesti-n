import React, { useEffect, useState } from 'react';
import apiFetch from '../../utils/api';

export default function MyEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch('/api/enrollments/me');
        setEnrollments(res);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Cargando matriculaciones...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="my-enrollments">
      <h2>Mis Materias</h2>
      {enrollments.length === 0 && <p>No estás matriculado en ninguna materia.</p>}
      <ul>
        {enrollments.map(e => (
          <li key={e._id} className="enrollment-item">
            <h3>{e.course.title}</h3>
            <p>{e.course.description}</p>
            <p><strong>Profesores:</strong> {e.course.teachers?.map(t => `${t.firstName || ''} ${t.lastName || ''} (${t.email})`).join(', ')}</p>
            <div>
              <strong>Calificaciones:</strong>
              {e.grades && e.grades.length ? (
                <ul>
                  {e.grades.map((g, idx) => <li key={idx}>{g.name}: {g.value}</li>)}
                </ul>
              ) : <p>No hay calificaciones aún.</p>}
            </div>
            <div>
              <strong>Compañeros:</strong>
              {e.classmates && e.classmates.length ? (
                <ul>
                  {e.classmates.map(c => <li key={c._id}>{c.firstName} {c.lastName} ({c.email})</li>)}
                </ul>
              ) : <p>No hay compañeros registrados.</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
