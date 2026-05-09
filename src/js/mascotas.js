import { api } from "./api.js";
import { getToken, clearSession } from "./auth.js";

const statusEl = document.getElementById("status");
const listEl = document.getElementById("list");
const debugEl = document.getElementById("debug");
const qEl = document.getElementById("q");
const btnBuscar = document.getElementById("btnBuscar");
const tabs = Array.from(document.querySelectorAll(".tab"));
const btnLogout = document.getElementById("btnLogout");

let currentTab = "todas";

if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    await api("/usuarios/logout", { method: "POST" });
    clearSession();
    window.location.href = "./login.html";
  });
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

function fotoSrc(m) {
  const fb = m.fotoBase64 ?? m.foto_base64 ?? null;
  if (!fb) return "";
  if (typeof fb === "string" && fb.startsWith("data:")) return fb;
  return `data:image/jpeg;base64,${fb}`;
}

function mascotaId(m) {
  return m.animalId ?? m.id;
}

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
  const id = mascotaId(m);

  div.innerHTML = `
    <div style="display:grid; grid-template-columns: 90px 1fr; gap:12px; align-items:start;">
      <img src="${img}" alt="foto" style="width:90px;height:90px;object-fit:cover;border-radius:10px;border:1px solid #2a2f3a;${img ? "" : "display:none;"}" />
      <div>
        <h3 style="margin:0 0 6px 0;">${nombre}</h3>
        <p style="margin:0; opacity:.85;">${[tipo, raza].filter(Boolean).join(" • ")}</p>
        <p style="margin:6px 0 0 0; opacity:.75;">CP: ${cp}</p>
      </div>
    </div>

    <div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;">
      <a class="btn btn-secondary" href="./publication_view.html?id=${encodeURIComponent(id)}">Ver</a>
      <button class="btn btn-primary btn-interes" data-id="${id}">Me interesa</button>
    </div>
  `;

  div.querySelector(".btn-interes").addEventListener("click", async (e) => {
    const animalId = e.target.dataset.id;

    if (!getToken()) {
      window.location.href = "./login.html";
      return;
    }

    setStatus("Registrando interés…");
    hideDebug();

    const r = await api(`/mascotas/${encodeURIComponent(animalId)}/interes`, {
      method: "POST"
    });

    if (!r.ok) {
      if (r.status === 401) {
        clearSession();
        window.location.href = "./login.html";
        return;
      }
      setStatus(`Error (${r.status}).`);
      showDebug(r.data);
      return;
    }

    setStatus(r.data?.mensaje || "Interés registrado ✅");
    setTimeout(() => setStatus(""), 1200);
  });

  return div;
}

async function fetchList() {
  hideDebug();
  listEl.innerHTML = "";
  setStatus("Cargando…");

  const q = qEl.value.trim();
  const params = new URLSearchParams();

  if (q) params.set("nombre", q);
  if (currentTab === "mias") params.set("filtro", "mis-publicaciones");
  if (currentTab === "interes") params.set("filtro", "me-interesa");

  if ((currentTab === "mias" || currentTab === "interes") && !getToken()) {
    window.location.href = "./login.html";
    return;
  }

  const query = params.toString();
  const r = await api(`/mascotas${query ? `?${query}` : ""}`);

  if (!r.ok) {
    if (r.status === 401) {
      clearSession();
      window.location.href = "./login.html";
      return;
    }
    setStatus(`Error (${r.status}).`);
    showDebug(r.data);
    return;
  }

  const arr = Array.isArray(r.data) ? r.data : [];
  if (!arr.length) {
    setStatus("No hay resultados.");
    return;
  }

  setStatus(`Resultados: ${arr.length}`);
  arr.forEach(m => listEl.appendChild(renderCard(m)));
}

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

fetchList();