import React, { useContext, useEffect, useState } from 'react';
import apiFetch from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfessorDashboard(){
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(()=>{
    const load = async () => {
      try{
        const all = await apiFetch('/api/courses');
        const arr = Array.isArray(all) ? all : (all.courses || []);
        const mine = arr.filter(c => (c.profesor || []).some(p => (p._id||p) === (user?.id || user?._id)));
        setCourses(mine);
      }catch(err){ console.error(err); }
      finally{ setLoading(false); }
    };
    if(user) load();
  }, [user]);

  if(loading) return <div>Cargando cursos...</div>;

  return (
    <div>
      <h2>Mis Cursos</h2>
      {courses.length === 0 && <p>No estás asignado a ningún curso.</p>}
      <ul>
        {courses.map(c => (
          <li key={c._id} style={{ marginBottom: 12 }}>
            <strong>{c.title}</strong>
            <div>{c.description}</div>
            <button onClick={() => navigate(`/professor/courses/${c._id}`)}>
              Gestionar/Calificar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
