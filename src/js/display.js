// @function mostrarPerfil(mascota) 
// @description Muestra la información de la mascota en la página de publicación de adopción.
function mostrarPerfil(mascota) {
  const nombre = mascota.nombre || "Sin nombre";
  const descripcion = mascota.descripcion || "Sin descripción disponible.";
  const foto = mascota.imagen || "https://via.placeholder.com/150?text=Sin+Foto";
  const tipo = mascota.tipo || "Desconocido";
  const raza = mascota.raza || "Desconocida";
  const codigoPostal = mascota.codigoPostal || "Desconocido";
  document.getElementById("mascot-name").textContent = nombre;
  document.getElementById("mascot-description").textContent = descripcion;
  document.getElementById("mascot-photo").src = foto;
  document.getElementById("mascot-type").textContent = tipo;
  document.getElementById("mascot-breed").textContent = raza;
  document.getElementById("mascot-zipcode").textContent = codigoPostal;
}

// @function obtenerMascotaDelBackend()
// @description Obtiene la información de la mascota desde el backend usando el ID proporcionado en la URL y muestra su perfil.
async function obtenerMascotaDelBackend() {
    const params = new URLSearchParams(window.location.search);
    // Obtener el ID de la mascota desde los parámetros de la URL.
    const id = params.get("id");
    // Obtener el token de autenticación para hacer la solicitud al backend.
    const token = sessionStorage.getItem("token");
   // Verificar que se haya proporcionado un ID de mascota en la URL. 
    if (!id) {
        console.error("No se proporcionó un ID de mascota en la URL.");
        return;
    }
    // Hacer una solicitud al backend para obtener la información de la mascota usando el ID proporcionado.
    try {
        const response = await fetch(`http://localhost:8080/mascotas/detalle/${id}`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
        });

        if (response.ok) {
            const mascotaReal = await response.json(); // Obtener la información de la mascota desde el backend.
            mostrarPerfil(mascotaReal); // Mostrar la información de la mascota en la página.
        } else {
            // Error al obtener la información de la mascota.
            alert("Error al obtener la publicación.");
        }
    } catch (error) {
        // Manejo de errores de comunicación con el backend.
        alert("No se pudo conectar con el servidor.");
    }
}

// Cargado de la  página, obtenemos la mascota del backend para mostrar su información.
document.addEventListener('DOMContentLoaded', obtenerMascotaDelBackend);
