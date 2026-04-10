import { setSession, clearSession } from "./auth.js";
import { api } from "./api.js";


// Al momneto de hacer Click en el botón de login, se ejecuta esta función de login.
document.getElementById('btn-login').addEventListener('click', async () => {
    // Conseguir los datos proporcionados por el usuario en la página
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;
    const errorMsg = document.getElementById('login-error');

    // Limpiar errores previos
    errorMsg.textContent = "";

    try {
        // Enviar los datos al backend para hacer el login
        const response = await api('/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            clearSession();
            setSession({
                token: response.data.token,
                email: email,
                userId: response.data.userId
            })

            window.location.href = "./home.html";
        } else {
            // Manejo de errores específicos, como credenciales incorrectas
            errorMsg.textContent = "Usuario o contraseña incorrectos.";
        }
    } catch (err) {
        // Manejo de errores de comunicación con el backend
        errorMsg.textContent = "Error de conexión con el servidor.";
    }
});