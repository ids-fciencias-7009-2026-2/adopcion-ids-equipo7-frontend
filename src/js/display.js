import { api } from "./api.js";
import { clearSession, getStoredUserId } from "./auth.js";

const btnLogout = document.querySelector("#btnLogout");
// Lógica para manejar las opciones del usuario que maneja la publicación.
const Popin = document.getElementById("popin-confirmacion");
const PopinElim = document.getElementById("popin-eliminacion")
// Boton para editar.
const botonEditar = document.getElementById("btn-editar");
// Botón para Confirmar la adopción, lo que cierra las operaciones a realizar sobre una mascota al estar ya adoptada.
const botonConfirmar = document.getElementById("btn-adoptar");
const botonEliminar = document.getElementById("btn-eliminacion");

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

// Obtenemos la información de la mascota mediante una solicitud al BackEnd que guardamos en un objeto mascota, extraemos su atributos y desplegamos.
function mostrarPerfil(mascota) {
  document.getElementById("mascot-name").textContent = mascota.nombre || "Sin nombre";
  document.getElementById("mascot-description").textContent = mascota.descripcion || "Sin descripción disponible.";
  document.getElementById("mascot-photo").src = fotoSrc(mascota);
  document.getElementById("mascot-type").textContent = mascota.tipo || "Desconocido";
  document.getElementById("mascot-breed").textContent = mascota.raza || "Desconocida";
  document.getElementById("mascot-zipcode").textContent = mascota.codigoPostal || "Desconocido";
}

// Esta función maneja la solicitud de la info de la mascota al BackEnd. aquí se manejan además los errores que se puedan presentar en la solicitud
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
      // Obtener el ID de quien está mirando la pantalla
      const idUsuarioLoggeado = getStoredUserId(); 

      // Obtener el ID del dueño de la mascota. Esto ya está implementado en el backend, así que solo lo extraemos de la respuesta.
      const idDuenoMascota = response.data.usuarioId; 

      // IMPORTANTE MENU GESTOR DE PUBLICACIONES
      // Si coincide la sesión loggeada con la del dueño de la mascota, los botones aparecen
      if (idUsuarioLoggeado && idUsuarioLoggeado == idDuenoMascota && response.data.estadoPublicacion == 'DISPONIBLE') {
        botonEditar.classList.remove("hidden");
        botonConfirmar.classList.remove("hidden");
        botonEliminar.classList.remove("hidden");
      }
    } else {
      alert(response.data?.mensaje || response.data?.error || "Error al obtener la publicación.");
    }
  } catch (error) {
    // Error de conexión con el BackEnd.
    alert("No se pudo conectar con el servidor.");
  }
}

document.addEventListener("DOMContentLoaded", obtenerMascotaDelBackend);

// Mostrar un Pop-in al presionar el botón principal
botonConfirmar.addEventListener("click", () => {
    Popin.classList.remove("hidden"); // Aparece el recuadro en pantalla
});

document.getElementById("btn-confirm-adopt").addEventListener("click", async () => {
    const params = new URLSearchParams(window.location.search);
    const idMascota = params.get("id");
    try {
        // Hacemos la petición PUT al endPoint de edición para que solo modifique el estado de publicación
        const response = await api(`/mascotas/${encodeURIComponent(idMascota)}/adoptar`, {
            method: "PUT"
        });

        if (response.ok) {
            // Se actualizó el estado de la publicación de manera correcta
            alert("¡Felicidades! La mascota ha sido marcada como adoptada con éxito.");
            window.location.href = "./home.html"; // Redirecciona al feed o perfil
        } else {
            // Se hace el manejo de errores de acuerdo a la devolución de valores del Back
            alert(response.data?.mensaje || "No se pudo procesar la adopción en el servidor.");
        }
    } catch (error) {
        // Error de conexión con el BackEnd.
        alert("Error: No se pudo establecer conexión con el servidor.");
    }
  });

// Se oculta el Pop-in cuando el usuario cancela la orden
document.getElementById("btn-cancel").addEventListener("click", () => {
    Popin.classList.add("hidden"); // Se vuelve a ocultar
});

// Al hacer clic en el botón editar...
botonEditar.addEventListener("click", () => {
    const params = new URLSearchParams(window.location.search);
    const idMascota = params.get("id");
    
    // El navegador cambia automáticamente a la pantalla de edición
    window.location.href = `./update_mascot.html?id=${idMascota}`;
});

// Hace aparecer el PopIn para confirmar (o cancelar) la eliminación de la publicación
botonEliminar.addEventListener("click", () => {
    PopinElim.classList.remove("hidden")
});

// El usuario mediante los botones del PopIn confirma la eliminación de la publicación
document.getElementById("btn-confirm-elim").addEventListener("click", async () => {
    const params = new URLSearchParams(window.location.search);
    const idMascota = params.get("id");
    try{
      const response = await api(`/mascotas/${encodeURIComponent(idMascota)}`, {
            method: "DELETE"
        });
      if(response.ok){
        alert("La publicación ha sido eliminada permanentemente.");
        window.location.href = "./home.html"; // Redirecciona al feed o perfil del usuario
      } else {
        alert(response.data?.mensaje || "No se pudo eliminar la publicación en el servidor.");
      }

    } catch (error){
      alert("Error: No se pudo establecer conexión con el servidor.");
    }
});

// Cierra la ventana PopIn de eliminar cuando el usuario cancela la solicitud
document.getElementById("btn-cancel-elim").addEventListener("click", () => {
    PopinElim.classList.add("hidden")
});