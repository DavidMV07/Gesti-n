const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem("token");

  // Asegurar la barra final
  const url = path.startsWith("/")
    ? `${API_BASE}${path}`
    : `${API_BASE}/${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // DEBUG: mostrar la URL usada (temporal)
  // console.log("apiFetch ->", url);

  let res;
  try {
    res = await fetch(url, { ...opts, headers });
  } catch (err) {
    // Error de red / conexión (eg. ECONNREFUSED)
    throw { message: "Network error", url, original: err };
  }

  let body = {};
  try {
    const text = await res.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    body = {};
  }

  if (!res.ok) {
    throw { status: res.status, body, url };
  }

  return body;
}

export default apiFetch;
