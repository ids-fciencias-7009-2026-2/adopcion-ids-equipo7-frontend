import { requireAuth, clearSession, setSession, getStoredEmail, getStoredUserId } from "./auth.js";
import { api } from "./api.js";
import { ME_USES_QUERY_EMAIL } from "./config.js";

const statusEl = document.querySelector("#status");
const profileEl = document.querySelector("#profile");
const debugEl = document.querySelector("#debug");
const btnLogout = document.querySelector("#btnLogout");
const linkLogin = document.querySelector("#linkLogin");

btnLogout.addEventListener("click", async () => {
  // Si existe endpoint /usuarios/logout protegido por token, lo llamamos.
  // Si falla, igual limpiamos sesión.
  await api("/usuarios/logout", { method: "POST" });
  clearSession();
  window.location.href = "./index.html";
});

function showProfile(u) {
  document.querySelector("#p_id").textContent = u?.id ?? "";
  document.querySelector("#p_nombre").textContent = u?.nombre ?? "";
  document.querySelector("#p_email").textContent = u?.email ?? "";
  document.querySelector("#p_cp").textContent =
    u?.codigoPostal ?? u?.codigo_postal ?? "";

  profileEl.classList.remove("hidden");
}

(async () => {
  const token = requireAuth();
  if (!token) return;

  statusEl.textContent = "Cargando perfil…";

  // /me puede ser solo token o token+email (según config)
  const email = getStoredEmail();
  const mePath = (ME_USES_QUERY_EMAIL && email)
    ? `/usuarios/me?email=${encodeURIComponent(email)}`
    : "/usuarios/me";

  const r = await api(mePath);

  if (!r.ok) {
    // 401: token inválido o faltante → manda a login
    if (r.status === 401) {
      clearSession();
      window.location.href = "./login.html";
      return;
    }
    statusEl.textContent = `Error cargando perfil (${r.status}).`;
    debugEl.textContent = JSON.stringify(r.data, null, 2);
    debugEl.classList.remove("hidden");
    return;
  }

  const u = r.data;

  // Guarda email/userId si vienen (para update, logout, etc.)
  setSession({
    email: u?.email ?? email ?? undefined,
    userId: u?.id ?? getStoredUserId() ?? undefined,
  });

  statusEl.textContent = "OK";
  showProfile(u);
})();