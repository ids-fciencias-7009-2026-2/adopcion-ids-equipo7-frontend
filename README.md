# Frontend Adopción — Equipo 7

Este repositorio contiene el **frontend** del sistema de adopción de mascotas del Equipo 7, desarrollado con **HTML5, CSS3 y JavaScript modular**.  
El frontend consume la API del backend construida con **Spring Boot + Kotlin** y permite gestionar usuarios, publicaciones de mascotas, solicitudes de interés y el cierre del proceso de adopción.

**Versión:** `3.0.0` — Iteración 4  
**Estado:** Consolidación final del frontend e integración con backend real.

---

## Documentación del proyecto

La documentación evolutiva del sistema se encuentra en el siguiente enlace:

- **Documento ERS / Documentación Iteración 4:** `https://www.notion.so/Sistema-Adopcion-Equipo7-36bde1a623d78086a808cb4a422f185e?source=copy_link`

---

## Tecnologías utilizadas

- **HTML5** para la estructura de las vistas.
- **CSS3** para estilos, layout y componentes visuales.
- **JavaScript ES6 Modules** para la lógica del cliente.
- **Fetch API** para consumir endpoints REST del backend.
- **sessionStorage** para almacenar temporalmente datos de sesión.
- **Python HTTP Server** como servidor estático local para pruebas.

---

## Requisitos previos

- Tener el backend corriendo en:

```text
http://localhost:8080
```

- Tener instalado **Python 3** o cualquier servidor estático equivalente.
- Usar un navegador moderno: Firefox, Chrome, Edge, etc.

> **Importante:** el backend espera el token en el header `Authorization` **sin** prefijo `Bearer`.

Ejemplo correcto:

```http
Authorization: token_generado_por_backend
```

Ejemplo incorrecto:

```http
Authorization: Bearer token_generado_por_backend
```

---

## Cómo correr el frontend

Desde la raíz del repositorio:

```bash
python3 -m http.server 5173 --directory src
```

Luego abrir en el navegador:

```text
http://localhost:5173/index.html
```

Si los cambios no aparecen en el navegador, se recomienda:

1. Abrir DevTools.
2. Ir a **Network**.
3. Activar **Disable cache**.
4. Recargar con `Ctrl + Shift + R`.

---

## Configuración principal

La configuración del backend se encuentra en:

```text
src/js/config.js
```

Configuración esperada:

```js
export const BASE_URL = "http://localhost:8080";
export const AUTH_PREFIX = "";
export const ME_USES_QUERY_EMAIL = false;
export const UPDATE_USES_PATH_EMAIL = false;
```

Esto indica que:

- El backend corre en `localhost:8080`.
- El token se manda crudo en `Authorization`.
- `GET /usuarios/me` no requiere email como query param.
- `PUT /usuarios` no requiere email en la ruta.

---

## Funcionalidades implementadas

### Gestión de usuario

- Registro de usuario.
- Inicio de sesión.
- Consulta de perfil.
- Actualización de datos.
- Cierre de sesión.
- Protección de rutas privadas mediante token en `sessionStorage`.

### Gestión de mascotas

- Publicar una mascota en adopción.
- Explorar publicaciones disponibles.
- Buscar mascotas por nombre.
- Ver detalle de una publicación.
- Registrar interés en una mascota.
- Consultar **Mis publicaciones**.
- Consultar **Me interesa**.
- Editar publicaciones propias.
- Confirmar adopción y cerrar publicación.
- Eliminar publicaciones propias con confirmación.
- Consultar panel de solicitudes de interés recibidas.


---

## Estructura del proyecto

```text
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
│   │   ├── solicitudes.js
│   │   ├── update.js
│   │   └── update_mascot.js
│   ├── home.html
│   ├── index.html
│   ├── login.html
│   ├── main.js
│   ├── mascotas.html
│   ├── publication_view.html
│   ├── publish_mascot.html
│   ├── register.html
│   ├── solicitudes.html
│   ├── update.html
│   └── update_mascot.html
├── docs/
│   ├── arquitectura-cliente-servidor.png
│   ├── arquitectura-tres-capas.png
│   ├── diagrama-CU1.png
│   ├── diagrama-CU2.png
│   ├── diagrama-CU3.png
│   ├── diagrama-CU4.png
│   ├── diagrama-CU5.png
│   ├── diagrama-flujo-autenticacion.png
│   └── documento-evolutivo-v4.pdf
├── .gitignore
├── README.md
└── requirements.txt
```

> La carpeta `docs/` puede variar según los archivos exportados o incluidos por el equipo. La documentación formal actualizada debe enlazarse en el apartado **Documentación del proyecto**.

---

## Archivos principales

### `api.js`

Centraliza las peticiones HTTP al backend.  
Agrega el token en el header `Authorization` cuando existe sesión activa.

### `auth.js`

Maneja sesión en el frontend:

- obtener token;
- guardar sesión;
- limpiar sesión;
- redirigir a login cuando no hay token;
- recuperar `email` y `userId`.

### `config.js`

Contiene la configuración de la URL del backend y del formato de autenticación.

### `mascotas.js`

Controla el catálogo de mascotas:

- listado general;
- búsqueda por nombre;
- filtros `mis-publicaciones` y `me-interesa`;
- registro de interés;
- navegación a detalle.

### `publish.js`

Controla la publicación de mascotas:

- validación de sesión;
- lectura de imagen;
- conversión a `fotoBase64`;
- envío de datos al backend.

### `display.js`

Controla el detalle de la publicación y acciones del dueño:

- consulta de detalle;
- visualización de datos de la mascota;
- confirmación de adopción cuando aplica.

### `update_mascot.js`

Controla la edición y eliminación de publicaciones propias:

- carga datos actuales de mascota;
- llena formulario;
- permite modificar información;
- envía `PUT /mascotas/editar/{id}`;
- muestra Pop-In de eliminación;
- envía `DELETE /mascotas/{id}`.

### `solicitudes.js`

Controla el panel de solicitudes:

- consume `GET /solicitudes`;
- muestra mascotas publicadas por el usuario;
- muestra interesados agrupados por publicación.

---

## Endpoints consumidos

### Usuarios

| Método | Endpoint | Uso en frontend |
|---|---|---|
| `POST` | `/usuarios/register` | Registro de usuario |
| `POST` | `/usuarios/login` | Inicio de sesión |
| `GET` | `/usuarios/me` | Consulta de perfil |
| `PUT` | `/usuarios` | Actualización de datos |
| `POST` | `/usuarios/logout` | Cierre de sesión |

### Mascotas

| Método | Endpoint | Uso en frontend |
|---|---|---|
| `POST` | `/mascotas/publicar` | Publicar mascota |
| `GET` | `/mascotas` | Listar catálogo |
| `GET` | `/mascotas?nombre={nombre}` | Buscar por nombre |
| `GET` | `/mascotas?filtro=mis-publicaciones` | Consultar publicaciones propias |
| `GET` | `/mascotas?filtro=me-interesa` | Consultar intereses del usuario |
| `GET` | `/mascotas/detalle/{id}` | Ver detalle de mascota |
| `POST` | `/mascotas/{id}/interes` | Registrar interés |
| `PUT` | `/mascotas/editar/{id}` | Editar publicación propia |
| `PUT` | `/mascotas/{id}/adoptar` | Confirmar adopción |
| `DELETE` | `/mascotas/{id}` | Eliminar publicación propia |

### Solicitudes

| Método | Endpoint | Uso en frontend |
|---|---|---|
| `GET` | `/solicitudes` | Consultar solicitudes recibidas por el publicador |

---

## Flujo general de uso

1. El usuario se registra en `register.html`.
2. Inicia sesión desde `login.html`.
3. El frontend guarda `token`, `email` y `userId` en `sessionStorage`.
4. El usuario accede a `home.html`.
5. Puede publicar una mascota en `publish_mascot.html`.
6. Puede explorar mascotas en `mascotas.html`.
7. Puede ver el detalle en `publication_view.html`.
8. Puede marcar interés en una mascota.
9. Si es dueño de una publicación, puede editarla desde `update_mascot.html`.
10. Si es dueño, puede confirmar adopción desde el detalle.
11. Si es dueño, puede eliminar una publicación disponible mediante confirmación.
12. Puede consultar solicitudes recibidas en `solicitudes.html`.
13. Puede cerrar sesión con logout.

---

## Pruebas recomendadas

### Pruebas de usuario

1. Registrar usuario nuevo.
2. Iniciar sesión.
3. Consultar perfil.
4. Actualizar datos.
5. Cerrar sesión.
6. Intentar entrar a vistas protegidas sin token.

### Pruebas de mascotas

1. Publicar una mascota.
2. Ver que aparece en catálogo.
3. Buscarla por nombre.
4. Abrir su detalle.
5. Consultar “Mis publicaciones”.
6. Editar la publicación.
7. Verificar que el detalle muestra los cambios.
8. Eliminar una publicación disponible con Pop-In.

### Pruebas de interés y solicitudes

1. Crear un segundo usuario.
2. Iniciar sesión con el segundo usuario.
3. Marcar interés en una mascota.
4. Iniciar sesión con el dueño de la publicación.
5. Entrar a `solicitudes.html`.
6. Verificar que aparece la solicitud agrupada por mascota.
7. Probar mascota sin interesados.
8. Probar usuario sin publicaciones.

### Pruebas de adopción

1. Iniciar sesión como dueño de la publicación.
2. Abrir detalle de una mascota propia.
3. Confirmar adopción.
4. Verificar que la mascota cambia a `ADOPTADO`.
5. Verificar que ya no aparece en el catálogo general.
6. Intentar editar o eliminar una mascota adoptada.

---

## Consideraciones importantes

- El frontend no debe simular respuestas del backend.
- Las vistas deben consumir la API real.
- Las rutas protegidas deben validar token.
- El token se envía sin `Bearer`.
- Los datos de contacto de interesados solo deben mostrarse al dueño de la publicación.
- La confirmación de adopción cambia el estado a `ADOPTADO`; no representa un proceso legal completo de adopción.
- La eliminación de publicaciones se maneja desde el flujo del dueño autenticado y requiere confirmación visual.

---

## Versionamiento

Para la Iteración 4, el tag requerido del frontend es:

```bash
git checkout main
git pull origin main
git tag 3.0.0
git push origin 3.0.0
```

---

## Resultado esperado final

Al finalizar la iteración:

1. El frontend levanta correctamente con servidor estático.
2. El frontend consume el backend real.
3. Registro, login, perfil y actualización funcionan.
4. Publicación, catálogo, detalle e interés funcionan.
5. Edición de publicaciones propias funciona.
6. Confirmación de adopción funciona.
7. Eliminación con Pop-In funciona.
8. Panel de solicitudes funciona.
9. Los errores se muestran de forma visible.
10. El frontend queda versionado con el tag `3.0.0`.
