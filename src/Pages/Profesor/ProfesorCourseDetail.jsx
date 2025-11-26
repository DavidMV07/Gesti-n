import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiFetch from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/ProfesorGlobal.css";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseEnrollments, setCourseEnrollments] = useState([]);
  const [gradeInputs, setGradeInputs] = useState({});

  // Cargar curso
  const fetchCourse = async () => {
    try {
      const data = await apiFetch(`/api/courses/${id}`);
      setCourse(data);
    } catch (err) {
      console.error("Error al cargar curso:", err);
    }
  };

  // Cargar matriculados
  const fetchEnrollments = async () => {
    if (!user || (user.role !== "profesor" && user.role !== "admin")) return;
    try {
      const res = await apiFetch(`/api/enrollments/course/${id}`);
      setCourseEnrollments(res || []);
    } catch (err) {
      console.error("Error al cargar matriculados:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchCourse();
      await fetchEnrollments();
      setLoading(false);
    };
    load();
  }, [user, id]);

  const handleGradeInputChange = (enrollmentId, field, value) => {
    setGradeInputs((prev) => ({
      ...prev,
      [enrollmentId]: { ...(prev[enrollmentId] || {}), [field]: value },
    }));
  };

  const handleAddGrade = async (enrollment) => {
    const input = gradeInputs[enrollment._id];
    if (!input || !input.name) {
      alert("Ingresa nombre de la evaluación");
      return;
    }
    const val = Number(input.value || 0);
    const newGrade = { name: input.name, value: val };
    const updatedGrades = [...(enrollment.grades || []), newGrade];

    try {
      await apiFetch(`/api/enrollments/${enrollment._id}/grades`, {
        method: "PUT",
        body: JSON.stringify({ grades: updatedGrades }),
      });
      await fetchEnrollments();
      setGradeInputs((prev) => ({ ...prev, [enrollment._id]: { name: "", value: "" } }));
    } catch (err) {
      console.error(err);
      alert("Error al actualizar calificaciones");
    }
  };

  if (loading) return <div className="admin-container">Cargando curso...</div>;
  if (!course) return <div className="admin-container">Curso no encontrado.</div>;

  return (
    <div className="admin-container">
      <h2>{course.title}</h2>
      <p>{course.description}</p>

      {(user.role === "profesor" || user.role === "admin") && (
        <div style={{ marginTop: 24 }}>
          <h3>Estudiantes matriculados</h3>
          {courseEnrollments.length === 0 && <p>No hay estudiantes matriculados.</p>}
          {courseEnrollments.length > 0 && (
            <ul>
              {courseEnrollments.map((enr) => (
                <li key={enr._id} style={{ marginBottom: 12 }}>
                  <div>
                    <strong>
                      {enr.alumno.firstName} {enr.alumno.lastName}
                    </strong>{" "}
                    ({enr.alumno.email})
                  </div>
                  <div>
                    <strong>Calificaciones:</strong>
                    {enr.grades && enr.grades.length ? (
                      <ul>
                        {enr.grades.map((g, i) => (
                          <li key={i}>
                            {g.name}: {g.value}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No hay calificaciones.</p>
                    )}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <input
                      placeholder="Nombre evaluación"
                      value={(gradeInputs[enr._id] || {}).name || ""}
                      onChange={(e) =>
                        handleGradeInputChange(enr._id, "name", e.target.value)
                      }
                    />
                    <input
                      placeholder="Valor"
                      type="number"
                      value={(gradeInputs[enr._id] || {}).value || ""}
                      onChange={(e) =>
                        handleGradeInputChange(enr._id, "value", e.target.value)
                      }
                      style={{ width: 100, marginLeft: 8 }}
                    />
                    <button
                      onClick={() => handleAddGrade(enr)}
                      style={{ marginLeft: 8 }}
                    >
                      Agregar calificación
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button className="btn-back" onClick={() => navigate(-1)}>
        ⟵ Volver
      </button>
    </div>
  );
}
