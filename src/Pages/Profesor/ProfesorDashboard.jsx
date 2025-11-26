import React, { useContext, useEffect, useState } from 'react';
import apiFetch from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../../styles/ProfesorGlobal.css";

export default function ProfessorDashboard() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const all = await apiFetch('/api/courses');
        const arr = Array.isArray(all) ? all : (all.courses || []);
        const userId = (user?.id || user?._id)?.toString();
        const mine = arr.filter(c =>
          (c.profesor || []).some(p => (p._id ? p._id.toString() : p) === userId)
        );
        setCourses(mine);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user]);

  if (loading) return <div className="admin-container">Cargando cursos...</div>;

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((acc, c) => acc + (c.alumnos?.length || 0), 0);
  const tasksPending = courses.reduce((acc, c) => acc + (c.tasks?.filter(t => !t.graded)?.length || 0), 0);

  return (
    <div className="admin-container">
      <h2>Bienvenido, {user?.firstName || user?.name}</h2>

      <div className="teacher-summary">
        <div className="teacher-container">
          <strong>Cursos asignados:</strong> {totalCourses}
        </div>
        <div className="teacher-container">
          <strong>Alumnos totales:</strong> {totalStudents}
        </div>
        <div className="teacher-container">
          <strong>Tareas pendientes:</strong> {tasksPending}
        </div>
      </div>

      <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Mis cursos</h3>
      {courses.length === 0 && <p>No estás asignado a ningún curso.</p>}

      <table className="user-table">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Descripción</th>
            <th>Alumnos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c._id}>
              <td>{c.title}</td>
              <td>{c.description}</td>
              <td>{c.alumnos?.length || 0}</td>
              <td>
                <button className="manage-btn" onClick={() => navigate(`/profesor/courses/${c._id}`)}>
                  Gestionar / Calificar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
