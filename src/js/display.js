import { api } from "./api.js";
import { clearSession } from "./auth.js";

const btnLogout = document.querySelector("#btnLogout");

if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    await api("/usuarios/logout", { method: "POST" });
    clearSession();
    window.location.href = "./login.html";
  });
}

function fotoSrc(mascota) {
  const foto = mascota.fotoBase64 || mascota.foto || "";
  if (!foto) return "https://via.placeholder.com/150?text=Sin+Foto";
  if (typeof foto === "string" && foto.startsWith("data:")) return foto;
  return `data:image/jpeg;base64,${foto}`;
}

function mostrarPerfil(mascota) {
  document.getElementById("mascot-name").textContent = mascota.nombre || "Sin nombre";
  document.getElementById("mascot-description").textContent = mascota.descripcion || "Sin descripción disponible.";
  document.getElementById("mascot-photo").src = fotoSrc(mascota);
  document.getElementById("mascot-type").textContent = mascota.tipo || "Desconocido";
  document.getElementById("mascot-breed").textContent = mascota.raza || "Desconocida";
  document.getElementById("mascot-zipcode").textContent = mascota.codigoPostal || "Desconocido";
}

async function obtenerMascotaDelBackend() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("No se proporcionó un ID de mascota en la URL.");
    return;
  }

  try {
    const response = await api(`/mascotas/detalle/${encodeURIComponent(id)}`);

    if (response.ok) {
      mostrarPerfil(response.data);
    } else {
      alert(response.data?.mensaje || response.data?.error || "Error al obtener la publicación.");
    }
  } catch (error) {
    alert("No se pudo conectar con el servidor.");
  }
}

document.addEventListener("DOMContentLoaded", obtenerMascotaDelBackend);