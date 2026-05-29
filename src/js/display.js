import { api } from "./api.js";
import { clearSession, getStoredUserId } from "./auth.js";
import {GOOGLE_MAPS_KEY} from "./config.js"; // La API KEY de Google Maps 

let map, geocoder; // Variables globales para el mapa y el geocoder de Google Maps
/*
* Variable de control para el CP de la mascota. Se ejecuta dos veces la función de búsqueda del CP: 
* una al cargar el perfil (si el mapa ya cargó) y otra al cargar el mapa (si el perfil ya cargó).
* Esta variable nos ayuda a controlar que se haga la búsqueda en ambos casos sin importar el orden de carga.
*/
let codigoPostalMascota = "";
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

// Función para cargar la API de Google Maps de forma dinámica.  
function cargarGoogleMaps() {
  if (document.querySelector('script[src^="https://maps.googleapis.com"]')) return; //Evita cargar el script dos veces si ya fue cargadoantes.
  
  const script = document.createElement('script');
  const apiKey = typeof GOOGLE_MAPS_KEY !== 'undefined' ? GOOGLE_MAPS_KEY : '';
  // Verificación de la API Key antes de cargar el script
  if (!apiKey) {
    console.error("Falta la API Key en config.js. El mapa no cargará.");
    return;
  }
  // Cuando se carga el script completamente, se llama a initmap para inicializar el mapa mediante callback.
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

// Función que inicializa el mapa de Google Maps.
//Además, si el CP de la mascota ya se obtuvo antes de que el mapa cargara, se dispara la función de búsqueda
// cómo se hace la solicitud al backEnd para obtener el CP al mismo tiempo que se carga el mapa,
// está función maneja el caso en el que la carga del backend sea más rápida que la de Google Maps, ejecutando la búsqueda del CP
function initMap() {
  geocoder = new google.maps.Geocoder();
  //Ubicación inicial del mapa (CDMX), placeholder mientras se obtiene el Codigo postal de la mascota. 
  const cdmx = { lat: 19.4326, lng: -99.1332 };
  
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    center: cdmx,
  });
  if (codigoPostalMascota) {
    buscarCP(codigoPostalMascota, map, geocoder);
  }
}

// Se asigna la función initMap al objeto global para que Google Maps pueda llamarla como callback al cargar el script.
window.initMap = initMap;

// Busqueda de código postal en Google Maps, coloca un pin en el mapa y centra la vista en la ubicación del CP.
function buscarCP(cp, map, geocoder) {
  if (!cp || cp === "Desconocido") return;
  // Solicitud a la API de Google Maps para obtener la ubicación del CP y colocar un pin en el mapa.
  geocoder.geocode({ address: `${cp}, Mexico` }, (results, status) => {
    if (status === "OK" && results[0]) {
      map.setCenter(results[0].geometry.location); // Centra el mapa en la ubicación del CP
      map.setZoom(14); // Aumentamos el zoom para acercar al área del código postal
      // se coloca el pin en el mapa.
      new google.maps.Marker({
        map: map, // El mapa donde se colocará el pin
        position: results[0].geometry.location, // La ubicación obtenida del CP
        title: `CP: ${cp}`
      });
    } else {
      // Si ocurre un error al buscar el CP. En teoría tenemos cubierto el caso de errores de fofmato de CP en el backend.
      // Eso si, no tenemos control sobre errores de conexión con Google Maps o que el CP no exista, por lo que se hace este manejo de error general.
      console.error("No se pudo encontrar el código postal: " + status);
    }
  });
}

// Obtenemos la información de la mascota mediante una solicitud al BackEnd que guardamos en un objeto mascota, extraemos su atributos y desplegamos.
function mostrarPerfil(mascota) {
  document.getElementById("mascot-name").textContent = mascota.nombre || "Sin nombre";
  document.getElementById("mascot-description").textContent = mascota.descripcion || "Sin descripción disponible.";
  document.getElementById("mascot-photo").src = fotoSrc(mascota);
  document.getElementById("mascot-type").textContent = mascota.tipo || "Desconocido";
  document.getElementById("mascot-breed").textContent = mascota.raza || "Desconocida";
  document.getElementById("mascot-zipcode").textContent = mascota.codigoPostal || "Desconocido";
  // Guardamos el CP de la mascota en la variable global de control
  codigoPostalMascota = mascota.codigoPostal;

  // En el extraño caso de que el mapa ya haya cargado antes que la información del back, se manda a llamar la función de búsqueda del Cp para cubrir ese caso del flujo 
  if (geocoder && map) {
    buscarCP(codigoPostalMascota, map, geocoder);
  }
}

// Esta función maneja la solicitud de la info de la mascota al BackEnd. aquí se manejan además los errores que se puedan presentar en la solicitud
async function obtenerMascotaDelBackend() {
  cargarGoogleMaps(); // Cargar el script de Google Maps antes de inicializar el mapa
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

// Al haberse cargado el html por completo, se llama a la función que obtiene la información de la mascota del BackEnd y la muestra en pantalla.
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