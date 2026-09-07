const API_BASE = '/api';

function getToken() { return localStorage.getItem('sp_token'); }
function getUser() {
  try { return JSON.parse(localStorage.getItem('sp_user') || 'null'); } catch { return null; }
}
function setSession(token, user) {
  localStorage.setItem('sp_token', token);
  localStorage.setItem('sp_user', JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem('sp_token');
  localStorage.removeItem('sp_user');
}

async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch { /* no body */ }

  if (!res.ok) {
    const err = new Error((data && data.message) || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const Money = (n) => '$' + Number(n).toLocaleString();