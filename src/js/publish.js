import { api } from "./api.js";
import { getStoredUserId, requireAuth, clearSession } from "./auth.js";

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const errorMsg = document.getElementById("reg-error");
const btnLogout = document.querySelector("#btnLogout");

if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    await api("/usuarios/logout", { method: "POST" });
    clearSession();
    window.location.href = "./login.html";
  });
}

imageInput.addEventListener("change", function () {
  const file = this.files[0];

  if (!file) {
    preview.removeAttribute("src");
    preview.style.display = "none";
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Selecciona una imagen válida.");
    this.value = "";
    preview.removeAttribute("src");
    preview.style.display = "none";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    preview.src = e.target.result;
    preview.style.display = "block";
  };
  reader.onerror = function () {
    alert("Error al leer el archivo.");
  };
  reader.readAsDataURL(file);
});

document.getElementById("btn-publish").addEventListener("click", async () => {
  const token = requireAuth();
  if (!token) return;

  const usuarioId = getStoredUserId();
  if (!usuarioId) {
    errorMsg.textContent = "No se encontró el usuario de la sesión. Vuelve a iniciar sesión.";
    return;
  }

  const datos = {
    nombre: document.getElementById("mascot-name").value.trim(),
    fotoBase64: preview.src,
    descripcion: document.getElementById("mascot-description").value.trim(),
    tipo: document.getElementById("mascot-type").value.trim(),
    raza: document.getElementById("mascot-breed").value.trim(),
    codigoPostal: document.getElementById("mascot-zipcode").value.trim(),
    usuarioId
  };

  if (!datos.nombre || !datos.fotoBase64 || !datos.descripcion || !datos.tipo || !datos.raza || !datos.codigoPostal) {
    errorMsg.textContent = "Por favor, llena todos los campos.";
    return;
  }

  errorMsg.textContent = "";

  try {
    const response = await api("/mascotas/publicar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (response.ok) {
      const mascotaCreada = response.data;
      const id = mascotaCreada?.animalId ?? mascotaCreada?.id;
      alert("¡Mascota publicada con éxito!");
      window.location.href = `./publication_view.html?id=${encodeURIComponent(id)}`;
    } else {
      errorMsg.textContent = response.data?.error || response.data?.mensaje || "Error al publicar. Verifica los datos.";
    }
  } catch (error) {
    errorMsg.textContent = "No hay conexión con el servidor.";
  }
});