# Frontend Adopción — Equipo 7

Este repositorio contiene el **frontend** (puro **HTML + CSS + JavaScript**) para el sistema de adopción de mascotas.
Está pensado para consumirse con el **backend** del equipo (API en Spring Boot + Kotlin).

---

## Tecnologías utilizadas
- **HTML5 + CSS3**
- **JavaScript (ES Modules)** usando `fetch` para consumir la API
- **sessionStorage** para guardar token/sesión

---

## Requisitos previos
- **Backend corriendo** en `http://localhost:8080` (revisa el README del backend para configurar BD y levantarlo).
- Navegador moderno (Firefox/Chrome).
- Una forma de servir el frontend como sitio estático (recomendado **Python 3**).

> Nota sobre autenticación: el backend espera el token en el header `Authorization` **tal cual** (sin el prefijo `Bearer`).

---

## Estructura esperada del proyecto
Dentro de `src/`:
- `index.html`
- `login.html`
- `register.html`
- `home.html`
- `update.html`
- `css/` (estilos, por ejemplo `css/style.css`)
- `js/` (módulos de JS: `api.js`, `auth.js`, `config.js`, `home.js`, `update.js`, `login.js`, `register.js`, etc.)

```text
.
├── docs/
│   ├── diagramaCU1.png
│   ├── diagramaCU3.png
│   ├── diargamaCU2.png
│   └── documento-evolutivo-v2.pdf
├── src/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── config.js
│   │   ├── home.js
│   │   ├── login.js
│   │   ├── register.js
│   │   └── update.js
│   ├── home.html
│   ├── index.html
│   ├── login.html
│   ├── main.js
│   ├── register.html
│   └── update.html
├── .gitignore
├── README.md
└── requirements.txt
```


---

## Configuración rápida
  Revisa `src/js/config.js` (o el archivo de configuración equivalente) y confirma que el **base URL** apunte a:
- `http://localhost:8080`

---

## Correr el frontend (local)
Desde la raíz del repo:

```bash
python3 -m http.server 5173 --directory src
```

Abre en tu navegador:
- `http://localhost:5173/index.html`

---

## Flujo mínimo de prueba (end-to-end)
Con **backend encendido**:

1) **Registro**
- Entra a `register.html`
- Crea un usuario (nombre, email, código postal, password)

2) **Login**
- Entra a `login.html`
- Inicia sesión
- Verifica que se guarde en `sessionStorage`:
  - `token`
  - `email`
  - `userId` (si aplica)

3) **Perfil /me**
- Entra a `home.html`
- Debe consultar `GET /usuarios/me` enviando el header:
  - `Authorization: <token>` (sin `Bearer`)

4) **Actualizar datos**
- Entra a `update.html`
- Debe hacer `PUT /usuarios` (ya que usa token).

5) **Logout**
- Ejecuta `POST /usuarios/logout` enviando:
  - `Authorization: <token>`
- Limpia `sessionStorage` y redirige a login.

---

## Entregables
- Código fuente del frontend.
- README actualizado.
- Tag correspondiente en el repositorio del frontend (1.0.0).
