// ======================
// CU4 + CU2 (Frontend)
// ======================

// Ajusta esto si tu config.js ya tiene BASE_URL.
// Si ya existe en tu proyecto, puedes reemplazar esta línea por:
//   import { BASE_URL } from "./config.js";
const BASE_URL = "http://localhost:8080";

// Backend actual en iteracion_3 (CU1/CU3) usa prefijo:
/**
 *  /api/publicaciones/publicar
 *  /api/publicaciones/detalle/{id}
 *
 * Para CU4/CU2 (tu parte) se recomienda que Persona 2 implemente bajo el mismo prefijo:
 *  GET  /api/publicaciones                  (todas) + ?nombre=...
 *  GET  /api/publicaciones/mias             (mis publicaciones)
 *  GET  /api/publicaciones/interesadas      (me interesa)
 *  POST /api/publicaciones/{id}/interes     (registrar interés)
 */

// --- UI refs ---
const statusEl = document.getElementById("status");
const listEl = document.getElementById("list");
const debugEl = document.getElementById("debug");
const qEl = document.getElementById("q");
const btnBuscar = document.getElementById("btnBuscar");
const tabs = Array.from(document.querySelectorAll(".tab"));

// --- state ---
let currentTab = "todas";

// --- helpers ---
function getToken() {
  // Usa la misma key que ya manejan en login.js
  return sessionStorage.getItem("token");
}

function setStatus(msg) {
  statusEl.textContent = msg;
}

function showDebug(obj) {
  debugEl.textContent = JSON.stringify(obj, null, 2);
  debugEl.classList.remove("hidden");
}

function hideDebug() {
  debugEl.classList.add("hidden");
  debugEl.textContent = "";
}

// Backend histórico: a veces espera token “crudo” sin Bearer.
// Para no depender del backend, mandamos el token tal cual.
// Si tu backend ya acepta Bearer, puedes cambiarlo aquí.
function buildAuthHeader(token) {
  if (!token) return {};
  // Si ya viene "Bearer xxx", respétalo.
  if (token.startsWith("Bearer ")) return { Authorization: token };
  // Default: token crudo
  return { Authorization: token };
}

async function request(path, { method = "GET", json } = {}) {
  const token = getToken();

  const headers = {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...buildAuthHeader(token),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: json ? JSON.stringify(json) : undefined,
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; }
  catch { data = text ? { raw: text } : null; }

  return { ok: res.ok, status: res.status, data };
}

// Intentar varias rutas por si Persona 2 decide nombres distintos.
// Si no existe aún el endpoint, regresará 404 y mostramos mensaje “pendiente”.
async function tryManyGet(paths) {
  for (const p of paths) {
    const r = await request(p);
    if (r.ok) return r;
    if (r.status !== 404) return r; // si es 401/400/500, no sigas probando
  }
  return { ok: false, status: 404, data: { error: "Endpoint no implementado aún" } };
}

async function tryManyPost(paths, body = null) {
  for (const p of paths) {
    const r = await request(p, { method: "POST", json: body });
    if (r.ok) return r;
    if (r.status !== 404) return r;
  }
  return { ok: false, status: 404, data: { error: "Endpoint no implementado aún" } };
}

function fotoSrc(m) {
  const fb = m.fotoBase64 ?? m.foto_base64 ?? null;
  const fu = m.fotoUrl ?? m.foto_url ?? null;

  if (fu) return fu;
  if (!fb) return "";

  // Si ya viene como data URL, úsalo directo
  if (typeof fb === "string" && fb.startsWith("data:")) return fb;

  // Si viene base64 “puro”
  return `data:image/jpeg;base64,${fb}`;
}

// Render card
function renderCard(m) {
  const div = document.createElement("div");
  div.style.border = "1px solid #2a2f3a";
  div.style.borderRadius = "12px";
  div.style.padding = "12px";
  div.style.background = "#171a21";

  const img = fotoSrc(m);
  const nombre = m.nombre ?? "(sin nombre)";
  const tipo = m.tipo ?? "";
  const raza = m.raza ?? "";
  const cp = m.codigoPostal ?? m.codigo_postal ?? "";
  const edad = (m.edad !== undefined && m.edad !== null) ? `${m.edad} años` : "";

  div.innerHTML = `
    <div style="display:grid; grid-template-columns: 90px 1fr; gap:12px; align-items:start;">
      <img src="${img}" alt="foto" style="width:90px;height:90px;object-fit:cover;border-radius:10px;border:1px solid #2a2f3a;${img ? "" : "display:none;"}" />
      <div>
        <h3 style="margin:0 0 6px 0;">${nombre}</h3>
        <p style="margin:0; opacity:.85;">${[tipo, raza, edad].filter(Boolean).join(" • ")}</p>
        <p style="margin:6px 0 0 0; opacity:.75;">CP: ${cp}</p>
      </div>
    </div>

    <div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;">
      <a class="btn btn-secondary" href="./publication_view.html?id=${encodeURIComponent(m.id)}">Ver</a>
      <button class="btn btn-primary btn-interes" data-id="${m.id}">Me interesa</button>
    </div>
  `;

  // CU2: acción “Me interesa”
  div.querySelector(".btn-interes").addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    const token = getToken();

    // Flujo alterno: si no hay token, manda a login
    if (!token) {
      window.location.href = "./login.html";
      return;
    }

    setStatus("Registrando interés…");
    hideDebug();

    // Rutas recomendadas (Persona 2 backend)
    const r = await tryManyPost([
      `/api/publicaciones/${encodeURIComponent(id)}/interes`,
      `/api/publicaciones/interes/${encodeURIComponent(id)}`,
      `/api/publicaciones/interes?publicacionId=${encodeURIComponent(id)}`
    ]);

    if (!r.ok) {
      if (r.status === 401) {
        // sesión expirada
        sessionStorage.removeItem("token");
        window.location.href = "./login.html";
        return;
      }
      if (r.status === 404) {
        setStatus("Aún no disponible: falta integrar el backend de interés (CU2).");
        showDebug(r);
        return;
      }
      setStatus(`Error (${r.status}).`);
      showDebug(r);
      return;
    }

    setStatus("Interés registrado ✅");
    setTimeout(() => setStatus(""), 800);
  });

  return div;
}

// Construye lista según tab
async function fetchList() {
  hideDebug();
  listEl.innerHTML = "";
  setStatus("Cargando…");

  const q = qEl.value.trim();

  // Si la tab requiere token, lo validamos
  if ((currentTab === "mias" || currentTab === "interes") && !getToken()) {
    window.location.href = "./login.html";
    return;
  }

  let r;

  if (currentTab === "todas") {
    // CU4: búsqueda por nombre (si existe)
    if (q) {
      r = await tryManyGet([
        `/api/publicaciones?nombre=${encodeURIComponent(q)}`,
        `/api/publicaciones/buscar?nombre=${encodeURIComponent(q)}`,
        `/api/publicaciones/listar?nombre=${encodeURIComponent(q)}`
      ]);
    } else {
      r = await tryManyGet([
        `/api/publicaciones`,
        `/api/publicaciones/listar`
      ]);
    }
  }

  if (currentTab === "mias") {
    r = await tryManyGet([
      `/api/publicaciones/mias`,
      `/api/publicaciones?scope=mias`
    ]);
  }

  if (currentTab === "interes") {
    r = await tryManyGet([
      `/api/publicaciones/interesadas`,
      `/api/publicaciones/intereses`,
      `/api/intereses/mios`
    ]);
  }

  if (!r.ok) {
    if (r.status === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "./login.html";
      return;
    }

    if (r.status === 404) {
      setStatus("Aún no disponible: falta integrar el backend de listado/búsqueda (CU4).");
      showDebug(r);
      return;
    }

    setStatus(`Error (${r.status}).`);
    showDebug(r);
    return;
  }

  const arr = Array.isArray(r.data) ? r.data : (r.data?.items ?? []);
  if (!arr.length) {
    setStatus("No hay resultados.");
    return;
  }

  setStatus(`Resultados: ${arr.length}`);
  arr.forEach(m => listEl.appendChild(renderCard(m)));
}

// Events
btnBuscar.addEventListener("click", fetchList);
qEl.addEventListener("keydown", (e) => { if (e.key === "Enter") fetchList(); });

tabs.forEach(t => {
  t.addEventListener("click", () => {
    tabs.forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    currentTab = t.dataset.tab;
    fetchList();
  });
});

// init
fetchList();