import { requireAuth, clearSession, setSession, getStoredEmail } from "./auth.js";
import { api } from "./api.js";
import { ME_USES_QUERY_EMAIL, UPDATE_USES_PATH_EMAIL } from "./config.js";

const statusEl = document.querySelector("#status");
const msgEl = document.querySelector("#msg");
const debugEl = document.querySelector("#debug");

const frm = document.querySelector("#frm");
const btnBack = document.querySelector("#btnBack");
const btnCancel = document.querySelector("#btnCancel");
const btnLogout = document.querySelector("#btnLogout");

btnBack.addEventListener("click", () => history.back());
btnCancel.addEventListener("click", () => (window.location.href = "./home.html"));

btnLogout.addEventListener("click", async () => {
  await api("/usuarios/logout", { method: "POST" });
  clearSession();
  window.location.href = "./login.html";
});

function fillForm(u) {
  document.querySelector("#nombre").value = u?.nombre ?? "";
  document.querySelector("#email").value = u?.email ?? (getStoredEmail() ?? "");
  document.querySelector("#codigoPostal").value =
    u?.codigoPostal ?? u?.codigo_postal ?? "";
}

async function loadMe() {
  const email = getStoredEmail();
  const mePath = (ME_USES_QUERY_EMAIL && email)
    ? `/usuarios/me?email=${encodeURIComponent(email)}`
    : "/usuarios/me";

  return api(mePath);
}

(async () => {
  const token = requireAuth();
  if (!token) return;

  statusEl.textContent = "Cargando datos…";
  const r = await loadMe();

  if (!r.ok) {
    if (r.status === 401) {
      clearSession();
      window.location.href = "./login.html";
      return;
    }
    statusEl.textContent = `Error cargando datos (${r.status}).`;
    debugEl.textContent = JSON.stringify(r.data, null, 2);
    debugEl.classList.remove("hidden");
    return;
  }

  fillForm(r.data);
  statusEl.textContent = "OK";
  frm.classList.remove("hidden");
})();

frm.addEventListener("submit", async (e) => {
  e.preventDefault();
  msgEl.textContent = "";
  debugEl.classList.add("hidden");

  const nombre = document.querySelector("#nombre").value.trim();
  const emailNuevo = document.querySelector("#email").value.trim();
  const codigoPostal = document.querySelector("#codigoPostal").value.trim();
  const password = document.querySelector("#password").value;

  if (!nombre || !emailNuevo || !codigoPostal) {
    msgEl.textContent = "Completa los campos obligatorios.";
    return;
  }

  const payload = { nombre, email: emailNuevo, codigoPostal };
  if (password) payload.password = password;

  // Endpoint de update: PUT /usuarios  o PUT /usuarios/{email}
  const emailActual = getStoredEmail() || emailNuevo;
  const path = UPDATE_USES_PATH_EMAIL
    ? `/usuarios/${encodeURIComponent(emailActual)}`
    : "/usuarios";

  msgEl.textContent = "Guardando…";

  const r = await api(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    if (r.status === 401) {
      clearSession();
      window.location.href = "./login.html";
      return;
    }
    msgEl.textContent = `Error (${r.status}).`;
    debugEl.textContent = JSON.stringify(r.data, null, 2);
    debugEl.classList.remove("hidden");
    return;
  }

  // Si cambió el email, actualízalo en sessionStorage
  setSession({ email: emailNuevo });

  msgEl.textContent = "Actualizado ✅";
  setTimeout(() => (window.location.href = "./home.html"), 600);
});