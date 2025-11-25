import { useState } from "react";
import apiFetch from "../../utils/api";

export default function CourseForm({ course, onSaved, onCancel }) {
  const [title, setTitle] = useState(course?.title || '');
  const [code, setCode] = useState(course?.code || '');
  const [description, setDescription] = useState(course?.description || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (course) {
        await apiFetch(`/api/courses/${course._id}`, { method: 'PUT', body: JSON.stringify({ title, code, description }) });
      } else {
        await apiFetch('/api/courses', { method: 'POST', body: JSON.stringify({ title, code, description }) });
      }
      onSaved && onSaved();
    } catch (err) {
      console.error('Error saving course', err);
      alert(err?.body?.message || err?.message || 'Error al guardar');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
      <div>
        <label>Título</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Código</label>
        <input value={code} onChange={e => setCode(e.target.value)} />
      </div>
      <div>
        <label>Descripción</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancelar</button>
      </div>
    </form>
  );
}
