import React, { useEffect, useState } from 'react';
import apiFetch from '../../utils/api';
import '../../styles/AlumnoGlobal.css';

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

  if (loading) return <div className="loading">Cargando matriculaciones...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="my-enrollments">
      <h2>Mis Materias</h2>
      {enrollments.length === 0 && <p>No estás matriculado en ninguna materia.</p>}
      <div className="enrollments-grid">
        {enrollments.map(e => (
          <div key={e._id} className="enrollment-card">
            <h3>{e.course.title}</h3>
            <p>{e.course.description}</p>

            <div className="card-section">
              <strong>Profesores:</strong>
              <p>{e.course.profesor?.map(t => `${t.firstName} ${t.lastName} (${t.email})`).join(', ') || 'Sin asignar'}</p>
            </div>

            <div className="card-section">
              <strong>Calificaciones:</strong>
              {e.grades && e.grades.length ? (
                <ul className="grades-list">
                  {e.grades.map((g, idx) => (
                    <li key={idx}>
                      <span className="grade-name">{g.name}</span>
                      <div className="grade-bar-container">
                        <div className="grade-bar" style={{ width: `${g.value * 10}%` }}>
                          <span className="grade-value">{g.value}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p>No hay calificaciones aún.</p>}
            </div>

            <div className="card-section">
              <strong>Compañeros:</strong>
              {e.classmates && e.classmates.length ? (
                <ul className="classmates-list">
                  {e.classmates.map(c => (
                    <li key={c._id}>{c.firstName} {c.lastName} ({c.email})</li>
                  ))}
                </ul>
              ) : <p>No hay compañeros registrados.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
