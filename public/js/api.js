const API_BASE = '/api';

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(API_BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
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