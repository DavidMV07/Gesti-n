import "../../styles/AlumnoGlobal.css";

import { useEffect, useState } from "react";
import apiFetch from "../../utils/api";

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await apiFetch("/api/courses");
        const mine = await apiFetch("/api/enrollments/me");

        setCourses(all || []);
        setMyEnrollments(mine || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const isEnrolled = (courseId) =>
    myEnrollments.some((e) => e.course._id === courseId);

  const handleEnroll = async (courseId) => {
    try {
      await apiFetch("/api/enrollments", {
        method: "POST",
        body: JSON.stringify({ courseId }),
      });

      alert("Te inscribiste a la materia");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al inscribirse");
    }
  };

  if (loading) return <p>Cargando cursos...</p>;

  return (
    <div className="student-courses-container">
      <h1>Catálogo de Materias</h1>

      {courses.length === 0 ? (
        <p>No hay cursos disponibles.</p>
      ) : (
        <div className="course-grid">
          {courses.map((c) => (
            <div className="course-card" key={c._id}>
              <h3>{c.title}</h3>
              <p>{c.description}</p>

              <p>
                <strong>Profesores:</strong>{" "}
                {c.profesor?.length
                  ? c.profesor
                      .map((p) => `${p.firstName} ${p.lastName}`)
                      .join(", ")
                  : "Sin asignar"}
              </p>

              {isEnrolled(c._id) ? (
                <button className="btn enrolled" disabled>
                  Ya inscrito
                </button>
              ) : (
                <button
                  className="btn enroll"
                  onClick={() => handleEnroll(c._id)}
                >
                  Inscribirme
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
