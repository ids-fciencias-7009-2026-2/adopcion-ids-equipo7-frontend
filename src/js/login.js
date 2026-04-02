const URL_LOGIN = "http://localhost:8080/usuarios/login";

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
        const response = await fetch(URL_LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            // Login exitoso, guardar token y redirigir a home
            const data = await response.json();
            // Guardar el token para usarlo en peticiones posteriores, además del email para mostrarlo en la vista /me
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('userEmail', email); // Útil para la vista /me
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