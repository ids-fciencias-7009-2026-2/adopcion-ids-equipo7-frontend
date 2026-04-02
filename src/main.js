/**
 * main.js - Lógica global de la plataforma
 * Se encarga de redirecciones automáticas y estados globales.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Plataforma de Adopción inicializada.");

    // Verificamos si ya existe un token en el almacenamiento de sesión
    const token = sessionStorage.getItem('token');

    // Si el usuario ya tiene un token y está en la página de inicio, ir directamente a su perfil o al Home.
    if (token) {
        console.log("Sesión activa detectada.");
        window.location.href = "home.html";
    }
});