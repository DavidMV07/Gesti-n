import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../utils/api';

export default function Courses(){
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(()=>{
    const load = async () => {
      try{
        const data = await apiFetch('/api/courses');
        // apiFetch for courses may return { message, course } or array depending on controller
        setCourses(Array.isArray(data) ? data : (data.courses || []));
      }catch(err){ console.error(err); }
      finally{ setLoading(false); }
    };
    load();
  },[]);

  if(loading) return <div>Cargando cursos...</div>;

  return (
    <div className="courses-page">
      <h2>Cursos</h2>
      {courses.length === 0 && <p>No hay cursos disponibles.</p>}
      <ul>
        {courses.map(c => (
          <li key={c._id} style={{ marginBottom: 12 }}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <button onClick={() => navigate(`/courses/${c._id}`)}>Ver detalle</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
