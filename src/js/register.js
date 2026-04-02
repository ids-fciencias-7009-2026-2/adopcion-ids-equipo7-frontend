const URL_REGISTER = "http://localhost:8080/usuarios/register";
// AL momento de hacer Click en el botón de registro, se ejecuta esta función de registro.
document.getElementById('btn-register').addEventListener('click', async () => {
    const errorMsg = document.getElementById('reg-error');
    // Conseguir los datos proporcionados por el usuario en la página
    const datos = {
        nombre: document.getElementById('reg-nombre').value,
        email: document.getElementById('reg-email').value,
        codigoPostal: document.getElementById('reg-cp').value,
        password: document.getElementById('reg-pass').value
    };

    // Validación básica, asegurarse que ningun campo obligatorio esté vacío
    if (!datos.nombre || !datos.email || !datos.password) {
        errorMsg.textContent = "Por favor, llena todos los campos obligatorios.";
        return;
    }

    try {
        // Enviar los datos al backend para crear la cuenta
        const response = await fetch(URL_REGISTER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        // Verificación exitosa de la creación de la cuenta
        if (response.ok) {
            alert("Cuenta creada con éxito. Inicia sesión para continuar.");
            window.location.href = "./login.html";
        } else {
            // Manejo de errores específicos, como email ya registrado
            errorMsg.textContent = "Error al crear la cuenta. El correo podría ya estar registrado.";
        }
    } catch (err) {
        // Manejo de errores de comunicación con el backend
        errorMsg.textContent = "Error de comunicación con el sistema.";
    }
});