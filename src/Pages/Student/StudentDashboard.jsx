import "../../styles/AdminGlobal.css";
import { useContext, useEffect, useState } from 'react';
import apiFetch from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

const StudentDashboard = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', passwordConfirm: ''
  });

  // ---- CARGAR MATRICULAS ----
  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch('/api/enrollments/me');
        setEnrollments(res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ---- CARGAR DATOS DEL USUARIO ----
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '',
        passwordConfirm: ''
      });
    }
  }, [user]);

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const saveAccount = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.passwordConfirm) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      const body = { firstName: form.firstName, lastName: form.lastName, email: form.email };
      if (form.password) body.password = form.password;

      const res = await apiFetch('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify(body)
      });

      alert('Cuenta actualizada');
      updateUser(res.user || res);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Error actualizando cuenta');
    }
  };

  const getGeneralAverage = () => {
    const grades = enrollments.flatMap(e => e.grades?.map(g => g.value) || []);
    if (!grades.length) return "Sin notas";
    const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
    return avg.toFixed(1);
  };

  // ---- Datos para gráficos ----
  const gradeDistribution = () => {
    const grades = enrollments.flatMap(e => e.grades?.map(g => g.value) || []);
    const bins = [0, 1, 2, 3, 4, 5];
    return bins.map((b, i) => ({
      name: `${b}-${b+1}`,
      value: grades.filter(g => g >= b && g < b+1).length
    }));
  };

  const progressData = enrollments.map(e => ({
    name: e.course.title,
    progress: e.progress || 0
  }));

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <h1>Bienvenido{user ? `, ${user.firstName || user.email}` : ''}</h1>

        {/* ----------- RESUMEN ----------- */}
        <section className="student-summary">
          <div className="summary-card">
            <h3>Materias inscritas</h3>
            <p>{enrollments.length}</p>
          </div>
          <div className="summary-card">
            <h3>Promedio general</h3>
            <p>{getGeneralAverage()}</p>
          </div>
          <div className="summary-card">
            <h3>Progreso promedio</h3>
            <p>{enrollments.length ? (enrollments.reduce((a,e)=>a+(e.progress||0),0)/enrollments.length).toFixed(1) + "%" : "0%"}</p>
          </div>
        </section>

        {/* ----------- ESTADISTICAS ----------- */}
        {enrollments.length > 0 && (
          <section className="stats-section">
            <h2>Estadísticas de materias</h2>
            <div className="charts-container">
              <div className="chart-card">
                <h4>Distribución de notas</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={gradeDistribution()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <h4>Progreso por materia</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={progressData}
                      dataKey="progress"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {progressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        {/* ----------- MATERIAS ----------- */}
        <section className="courses-section">
          <h2>Mis Materias</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : enrollments.length === 0 ? (
            <p>No estás matriculado en ninguna materia.</p>
          ) : (
            <ul className="course-list">
              {enrollments.map(e => (
                <li key={e._id} className="course-card">
                  <h3>{e.course.title}</h3>
                  <p>{e.course.description}</p>
                  <p>
                    <strong>Profesor(es): </strong>
                    {e.course.profesor?.length
                      ? e.course.profesor.map(p => `${p.firstName} ${p.lastName}`).join(', ')
                      : "Sin asignar"}
                  </p>
                  <p><strong>Progreso:</strong> {e.progress || 0}%</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ----------- CONFIGURACIÓN ----------- */}
        <section className="account-settings">
          <h2>Configuración de cuenta</h2>
          {!editing ? (
            <div className="account-info">
              <p><strong>Nombre:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <button className="edit-btn" onClick={() => setEditing(true)}>Editar cuenta</button>
            </div>
          ) : (
            <form className="account-form" onSubmit={saveAccount}>
              <input placeholder="Nombre" value={form.firstName} onChange={e => handleChange('firstName', e.target.value)} />
              <input placeholder="Apellido" value={form.lastName} onChange={e => handleChange('lastName', e.target.value)} />
              <input placeholder="Email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
              <input placeholder="Nueva contraseña (opcional)" type="password" value={form.password} onChange={e => handleChange('password', e.target.value)} />
              <input placeholder="Confirmar contraseña" type="password" value={form.passwordConfirm} onChange={e => handleChange('passwordConfirm', e.target.value)} />

              <div className="form-buttons">
                <button type="submit" className="save-btn">Guardar</button>
                <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
