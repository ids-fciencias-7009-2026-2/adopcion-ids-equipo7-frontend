import { api } from "./api.js";
import { requireAuth, clearSession, getStoredEmail, getStoredUserId } from "./auth.js";
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const frm = document.getElementById("frm");
const btnLogout = document.querySelector("#btnLogout");

// Boton para cancelar la edición de la publicación
document.getElementById("btn-cancel").addEventListener("click", () => (window.location.href = "./home.html"));
// Botón para salir de la sesesión actual
if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    await api("/usuarios/logout", { method: "POST" });
    clearSession();
    window.location.href = "./login.html";
  });
}

// Extraer la foto de la base de datos.
function fotoSrc(mascota) {
  const foto = mascota.fotoBase64 || mascota.foto || "";
  if (!foto) return "https://via.placeholder.com/150?text=Sin+Foto";
  if (typeof foto === "string" && foto.startsWith("data:")) return foto;
  return `data:image/jpeg;base64,${foto}`;
}

// Colocamos unos holders en la ventana de edición, los llenamos con la info de la mascota como default
function mostrarPerfil(mascota) {
  document.getElementById("mascot-name").value = mascota.nombre || "";
  document.getElementById("mascot-description").value = mascota.descripcion || "";
  document.getElementById("preview").src = fotoSrc(mascota);
  document.getElementById("preview").style.display = "block";
  document.getElementById("mascot-type").value = mascota.tipo || "";
  document.getElementById("mascot-breed").value = mascota.raza || "";
  document.getElementById("mascot-zipcode").value = mascota.codigoPostal || "";
}

// Carga una preview de la imagen para que el usuario vea cómo se ve antes de hacer submit de la info
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

// Carga de la respuesta, obtenemos los mismos datos que display usa para mostrar las páginas de publicación
async function loadMe() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
    alert("No se proporcionó un ID de mascota en la URL.");
    return;
    }
    const response = await api(`/mascotas/detalle/${encodeURIComponent(id)}`);
    return response
}

// Mantenemos la ventana como invisible hasta que hagamos la carga de los datos solcitados, así como después de verificar que las credenciales son las adecuadas
(async () => {
  const token = requireAuth();
  if (!token) return;
  const params = new URLSearchParams(window.location.search);
  const idMascota = params.get("id");
  const info_mascota = await loadMe();

  if (!info_mascota.ok) {
    if (info_mascota.status === 401) {
      clearSession();
      window.location.href = "./login.html";
      return;
    }
    alert(info_mascota.data?.mensaje || "Error al tratar de acceder a la info.");
    return;
  }
  if (info_mascota.data.estadoPublicacion != 'DISPONIBLE'){
    alert("No se pueden editar publicaciones ya concluidas");
    window.location.href = `./publication_view.html?id=${idMascota}`;
    return;
  }
  mostrarPerfil(info_mascota.data);

  // Ocultar el mensaje de "Cargando datos..." para que la vista quede limpia
  const statusEl = document.getElementById("status");
  if (statusEl) {
    statusEl.style.display = "none";
  }
  
  frm.classList.remove("hidden");
})();

// Al hacer Submit de las entradas a editar
frm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    const params = new URLSearchParams(window.location.search);
    const idMascota = params.get("id");
    const usuarioId = getStoredUserId();
    // Recolectamos los datos modificados de los inputs del formulario
    const datosModificados = {
    nombre: document.getElementById("mascot-name").value.trim(),
    fotoBase64: document.getElementById("preview").src, 
    descripcion: document.getElementById("mascot-description").value.trim(),
    tipo: document.getElementById("mascot-type").value.trim(),
    raza: document.getElementById("mascot-breed").value.trim(),
    codigoPostal: document.getElementById("mascot-zipcode").value.trim(),
    usuarioId: usuarioId
    };
    // CHECK para cumplir con las reglas de negocio con algunas piezas de información que son requisitos mínimos
    if (!datosModificados.nombre || !datosModificados.descripcion || !datosModificados.fotoBase64.startsWith("data:")) {
        alert("Por favor, llena todos los campos y asegúrate de tener una imagen.");
        return;
    }
    try {
        // Enviamos el PUT con todos los campos actualizados en el body
        const response = await api(`/mascotas/editar/${encodeURIComponent(idMascota)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosModificados)
        });

        if (response.ok) {
            alert("¡Publicación actualizada correctamente!");
            // Redireccionamos de vuelta a la vista de detalle para ver los cambios
            window.location.href = `./publication_view.html?id=${idMascota}`; 
        } else {
          // Hay un error en la actualización de la mascota
            alert(response.data?.mensaje || "Error al actualizar los datos.");
        }
    } catch (error) {
        // error al intentar conectar con el back
        alert("Error de red: No se pudo actualizar la publicación.");
    }
});