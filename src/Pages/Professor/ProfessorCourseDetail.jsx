import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../../utils/api";
import "../../styles/ProfesorGlobal.css"

export default function ProfessorCourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [tempGrades, setTempGrades] = useState({});

  const load = async () => {
    try {
      const data = await apiFetch(`/api/courses/${id}`);
      // Ordenar estudiantes
      data.alumno = (data.alumno || []).sort((a, b) =>
        a.firstName.localeCompare(b.firstName)
      );

      // Estado temporal para edición
      const initialTemps = {};
      data.alumno?.forEach(s => {
        initialTemps[s._id] = s.grade ?? "";
      });
      setTempGrades(initialTemps);

      setCourse(data);
    } catch (err) {
      console.error("Error cargando curso", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateGrade = async (alumnoId, grade) => {
    if (grade < 0 || grade > 5) {
      alert("La nota debe estar entre 0 y 5.");
      return;
    }

    try {
      await apiFetch(`/api/courses/${id}/grade/${alumnoId}`, {
        method: "PUT",
        body: { grade }
      });

      alert("Nota actualizada correctamente ✔");
      load();
    } catch (err) {
      console.error("Error actualizando nota", err);
      alert("Error al guardar la nota.");
    }
  };

  if (loading) return <p>Cargando...</p>;

  if (!course) return <p>Error cargando curso.</p>;

  const students = course.alumno || [];

  // Filtro
  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(filter.toLowerCase())
  );

  // Promedio del curso
  const avg =
    students.length > 0
      ? (
          students.reduce(
            (acc, s) => acc + (Number(s.grade) || 0),
            0
          ) / students.length
        ).toFixed(2)
      : "N/A";

  return (
    <div className="prof-course-container">
      <h2>Gestion de Curso</h2>
      <p><strong>Total de estudiantes:</strong> {students.length}</p>
      <p><strong>Promedio del curso:</strong> {avg}</p>

      <h3>Filtrar estudiantes</h3>
      <input
        type="text"
        className="prof-filter-input"
        placeholder="Buscar por nombre..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <h3 style={{ marginTop: "20px" }}>Estudiantes inscritos</h3>

      {students.length === 0 && <p>No hay estudiantes inscritos.</p>}

      {students.length > 0 && (
        <table border={1} cellPadding={10} style={{ marginTop: 10 }} className="prof-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Nota actual</th>
              <th>Nueva nota</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(s => (
              <tr key={s._id}>
                <td>{s.firstName} {s.lastName}</td>
                <td>{s.grade ?? "Sin nota"}</td>

                {/* Campo editable */}
                <td>
                  <input
                    className="prof-grade-input"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={tempGrades[s._id]}
                    onChange={(e) =>
                      setTempGrades({
                        ...tempGrades,
                        [s._id]: e.target.value
                      })
                    }
                  />
                </td>

                <td>
                  <button
                    className="prof-save-btn"
                    onClick={() => updateGrade(s._id, tempGrades[s._id])}
                    disabled={tempGrades[s._id] === s.grade}
                  >
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
