import { BASE_URL, AUTH_PREFIX } from "./config.js";
import { getToken } from "./auth.js";

function buildAuthHeader(token) {
  if (!token) return null;
  if (!AUTH_PREFIX) return token;         // token "pelón"
  return `${AUTH_PREFIX} ${token}`;       // Bearer token
}

export async function api(path, { method = "GET", headers = {}, body } = {}) {
  const token = getToken();
  const authValue = buildAuthHeader(token);

  const finalHeaders = {
    ...headers,
    ...(authValue ? { Authorization: authValue } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body,
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  return { ok: res.ok, status: res.status, data };
}

function safeJson(text) {
  try { return JSON.parse(text); } catch { return text; }
}