import { api } from "./api.js";
import { requireAuth } from "./auth.js";

// Vista protegida: Si no hay sesión activa, expulsa al usuario al login automáticamente
requireAuth();

// Esperamos a que la página HTML termine de cargar antes de pedir los datos
document.addEventListener("DOMContentLoaded", () => {
    cargarSolicitudes();
});

// Función principal que trae los datos del servidor y el manejo de errores
async function cargarSolicitudes() {
    const contenedorLista = document.getElementById("lista-solicitudes");
    const estadoVacioGlobal = document.getElementById("global-empty-state");

    // Limpiamos el contenedor (borra las tarjetas de ejemplo)
    // contenedorLista.innerHTML = "";

    try {
        // Pedimos la información al backend
        // (api.js ya se encarga de inyectar nuestro token de forma segura)
        const respuesta = await api('/solicitudes');

        if (respuesta.ok) {
            const mascotas = respuesta.data; // Aquí guardamos el JSON recibido

            // Caso si el usuario no tiene ninguna mascota publicada
            if (!mascotas || mascotas.length === 0) {
                // Mostramos el letrero gigante de "Aún no has publicado ninguna mascota"
                estadoVacioGlobal.style.display = "block";
                return; // Detenemos la función aquí
            }

            // Caso sí hay mascotas, recorremos una por una para crear su tarjeta visual
            mascotas.forEach(mascota => {
                const tarjeta = document.createElement("div");
                tarjeta.className = "mascota-card";

                // Tarjeta de la mascota (nombre, raza, foto y el botón de Ver Detalle)
                let htmlTarjeta = `
                    <div class="mascota-header">
                        <img src="${mascota.foto}" alt="${mascota.nombreMascota}" class="mascota-foto">
                        <div class="mascota-info">
                            <h2>${mascota.nombreMascota}</h2>
                            <p>${mascota.tipo} | ${mascota.raza}</p>
                        </div>
                        <div class="mascota-acciones">
                            <a href="./publication_view.html?id=${mascota.mascotaId}" class="btn-detalle">Ver detalle</a>
                        </div>
                    </div>
                    <div class="interesados-body">
                `;

                // Revisamos si hay personas interesadas en esta mascota específica
                if (mascota.interesados && mascota.interesados.length > 0) {
                    // Contador de cuántas personas interesadas hay en esta mascota
                    htmlTarjeta += `<h3>Personas interesadas (${mascota.interesados.length})</h3>`;

                    // Por cada persona interesada, creamos su tarjeta de contacto
                    mascota.interesados.forEach(interesado => {
                        htmlTarjeta += `
                            <div class="interesado-item">
                                <div class="interesado-datos">
                                    <h4>${interesado.nombre}</h4>
                                    <p>${interesado.email}</p>
                                </div>
                                <div class="interesado-fecha">
                                    🗓️ ${interesado.fecha}
                                </div>
                                <div>
                                    <a href="mailto:${interesado.email}?subject=Sobre la adopción de ${mascota.nombreMascota}" class="btn-contactar">Enviar Correo</a>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    // Caso si la mascota está publicada pero NADIE ha dado clic en "Me interesa"
                    htmlTarjeta += `
                        <div class="empty-state">
                            <i> Aún no hay solicitudes para ${mascota.nombreMascota}. ¡Pronto llegará su familia ideal!</i>
                        </div>
                    `;
                }

                htmlTarjeta += `</div>`;
                tarjeta.innerHTML = htmlTarjeta;
                contenedorLista.appendChild(tarjeta);
            });

        } else {
            // Caso si el servidor respondió con un error
            alert("No se pudieron cargar las solicitudes. El servidor reportó un error.");
        }
    } catch (error) {
        // Si el servidor está apagado o no hay internet
        console.error("Fallo la comunicación con la API:", error);
        alert("Hubo un problema al conectar con el servidor. Revisa tu conexión.");
    }
}