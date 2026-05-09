# Frontend Adopción — Equipo 7

Este repositorio contiene el **frontend** del sistema de adopción de mascotas, desarrollado con **HTML, CSS y JavaScript**.  
El frontend consume el **backend del equipo** construido con **Spring Boot + Kotlin**, y permite a los usuarios registrarse, iniciar sesión, consultar su perfil, actualizar sus datos, publicar mascotas y explorar publicaciones existentes.

---

## Tecnologías utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (ES Modules)**
- **Fetch API**
- **sessionStorage** para manejo de sesión en cliente

---

## Funcionalidades implementadas

### Gestión de usuario
- Registro de usuario
- Inicio de sesión
- Consulta de perfil
- Actualización de datos
- Cierre de sesión

### Gestión de mascotas
- Publicar una mascota en adopción
- Explorar mascotas publicadas
- Buscar mascotas por nombre
- Ver detalle de una publicación
- Registrar interés en una mascota
- Consultar **mis publicaciones**
- Consultar **mascotas que me interesan**

---

## Requisitos previos

- Tener el **backend corriendo** en `http://localhost:8080`
- Tener instalado **Python 3** o cualquier servidor estático simple
- Navegador moderno (Firefox, Chrome, etc.)

> **Importante:** el backend espera el token en el header `Authorization` **sin** prefijo `Bearer`.

---

## Estructura del proyecto

```text
.
├── docs/
│   ├── diagramaCU1.png
│   ├── diargamaCU2.png
│   ├── diagramaCU3.png
│   └── documento-evolutivo-v2.pdf
├── src/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── config.js
│   │   ├── display.js
│   │   ├── home.js
│   │   ├── login.js
│   │   ├── mascotas.js
│   │   ├── publish.js
│   │   ├── register.js
│   │   └── update.js
│   ├── home.html
│   ├── index.html
│   ├── login.html
│   ├── main.js
│   ├── mascotas.html
│   ├── publication_view.html
│   ├── publish_mascot.html
│   ├── register.html
│   └── update.html
├── .gitignore
├── README.md
└── requirements.txt