import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../../utils/api";
import "../../styles/AlumnoGlobal.css";

export default function StudentCourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await apiFetch(`/api/student/courses/${id}`);
      setCourse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!course) return <p>No existe el curso.</p>;

  return (
    <div className="course-detail">
      <h2>{course.title}</h2>
      <p>{course.description}</p>

      <h3>Profesores</h3>
      <ul>
        {course.profesor?.map(p => (
          <li key={p._id}>{p.firstName} {p.lastName} — {p.email}</li>
        ))}
      </ul>

      <h3>Compañeros de clase</h3>
      {course.classmates?.length ? (
        <ul>
          {course.classmates.map(c => (
            <li key={c._id}>{c.firstName} {c.lastName}</li>
          ))}
        </ul>
      ) : <p>No hay compañeros registrados.</p>}

      <h3>Calificaciones</h3>
      {course.grades?.length ? (
        <ul>
          {course.grades.map((g, i) => (
            <li key={i}>
              {g.name}: <strong>{g.value}</strong>
            </li>
          ))}
        </ul>
      ) : <p>No tienes calificaciones aún.</p>}

      <h3>Contenido / Temas</h3>
      {course.content?.length ? (
        <ul>
          {course.content.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      ) : <p>No hay contenido cargado aún.</p>}
    </div>
  );
}
