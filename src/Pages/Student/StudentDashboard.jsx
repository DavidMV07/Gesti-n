import "../../styles/Dashboard.css";
import { useContext, useEffect, useState } from 'react';
import apiFetch from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', passwordConfirm: '' });

  useEffect(()=>{
    const load = async () => {
      try{
        const res = await apiFetch('/api/enrollments/me');
        setEnrollments(res || []);
      }catch(err){ console.error(err); }
      finally{ setLoading(false); }
    };
    load();
  }, []);

  useEffect(()=>{
    if(user){ setForm({ firstName: user.firstName||'', lastName: user.lastName||'', email: user.email||'', password: '', passwordConfirm: '' }); }
  }, [user]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const saveAccount = async (e) => {
    e.preventDefault();
    if(form.password && form.password !== form.passwordConfirm){ alert('Las contraseñas no coinciden'); return; }
    try{
      const body = { firstName: form.firstName, lastName: form.lastName, email: form.email };
      if(form.password) body.password = form.password;
      const res = await apiFetch('/api/users/me', { method: 'PUT', body: JSON.stringify(body) });
      alert('Cuenta actualizada');
      updateUser(res.user || res);
      setEditing(false);
    }catch(err){ console.error(err); alert('Error actualizando cuenta'); }
  };

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <h1>Bienvenido{user ? `, ${user.firstName || user.email}` : ''}</h1>

        <section style={{ marginTop: 16 }}>
          <h2>Mis Materias y Calificaciones</h2>
          {loading ? <p>Cargando...</p> : (
            enrollments.length === 0 ? <p>No estás matriculado en ninguna materia.</p> : (
              <ul>
                {enrollments.map(e => (
                  <li key={e._id} style={{ marginBottom: 12 }}>
                    <strong>{e.course.title}</strong>
                    <div>{e.course.description}</div>
                    <div>
                      <strong>Calificaciones:</strong>
                      {e.grades && e.grades.length ? (
                        <ul>
                          {e.grades.map((g, i) => <li key={i}>{g.name}: {g.value}</li>)}
                        </ul>
                      ) : <div>No hay calificaciones.</div>}
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>Configuración de cuenta</h2>
          {!editing ? (
            <div>
              <p><strong>Nombre:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <button onClick={() => setEditing(true)}>Editar cuenta</button>
            </div>
          ) : (
            <form onSubmit={saveAccount} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420 }}>
              <input placeholder="Nombre" value={form.firstName} onChange={e => handleChange('firstName', e.target.value)} />
              <input placeholder="Apellido" value={form.lastName} onChange={e => handleChange('lastName', e.target.value)} />
              <input placeholder="Email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
              <input placeholder="Nueva contraseña (opcional)" type="password" value={form.password} onChange={e => handleChange('password', e.target.value)} />
              <input placeholder="Confirmar contraseña" type="password" value={form.passwordConfirm} onChange={e => handleChange('passwordConfirm', e.target.value)} />
              <div>
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setEditing(false)} style={{ marginLeft: 8 }}>Cancelar</button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
