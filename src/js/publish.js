const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');

// @function: Maneja la selección de imagen y muestra una vista previa
imageInput.addEventListener('change', function () {
    const file = this.files[0];

    // Validar que se haya seleccionado un archivo
    if (!file) {
        preview.style.display = 'none';
        return;
        }

    // Verificar que el archivo seleccionado es una imagen
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        this.value = ''; // Reset input
        preview.style.display = 'none';
        return;
    }

    // Leer y desplegar la imagen seleccionada usando FileReader
    const reader = new FileReader();
    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
    };
    reader.onerror = function () {
        alert('Error reading file.');
    };
    reader.readAsDataURL(file);
});

// @function: Maneja el evento de publicación del animal
document.getElementById('btn-publish').addEventListener('click', async () => {
    const errorMsg = document.getElementById('reg-error'); // Suponiendo que existte IDe es
    const token = sessionStorage.getItem('token'); // Recuperar token 
    // Obtenemos los datos del formulario para enviar al backend
    const datos = {
        nombre: document.getElementById('mascot-name').value.trim(),
        imagen: document.getElementById('preview').src,
        descripcion: document.getElementById('mascot-description').value.trim(),
        tipo: document.getElementById('mascot-type').value.trim(),
        raza: document.getElementById('mascot-breed').value.trim(),
        codigoPostal: document.getElementById('mascot-zipcode').value.trim(),
    };

    // Validación básica, asegurarse que ningun campo obligatorio esté vacío
    if (!datos.nombre || !datos.imagen || !datos.descripcion || !datos.tipo || !datos.raza || !datos.codigoPostal) {
        errorMsg.textContent = "Por favor, llena todos los campos .";
        return;
    }

    // Limpiar cualquier mensaje de error previo
    errorMsg.textContent = "";
    // Intentar enviar los datos al backend para crear la publicación de adopción
    try {
        const response = await fetch("http://localhost:8080/mascotas", {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Verificar que el token se envía en la solicitud al backend
            },
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            const mascotaCreada = await response.json();
            alert("¡Mascota publicada con éxito!");
            // Redirección a la publicación recien creada.
            window.location.href = `publicacion.html?id=${mascotaCreada.id}`; 
        } else {
            // Error en los datos enviados o en la creación de la publicación en el backend.
            errorMsg.textContent = "Error al publicar. Verifica los datos.";
        }
    } catch (error) {
        // Error al no poder establecer conexión con el backend.
        errorMsg.textContent = "No hay conexión con el servidor.";
    }
});