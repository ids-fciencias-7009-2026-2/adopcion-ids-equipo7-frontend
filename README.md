# adopcion-ids-equipo7-frontend

Frontend del **Sistema de Adopción de Mascotas (Equipo 7)**.

Este repositorio contiene una versión mínima del frontend para la práctica, sirve para validar que el repo de frontend fue inicializado correctamente y que se puede ejecutar localmente.

---

## Tecnologías

- HTML5
- JavaScript (Vanilla)

> No usa frameworks ni dependencias por ahora.

---

## Estructura del proyecto

```
```text
adopcion-ids-equipo7-frontend/
├── src/
│   ├── css/
│   │   └── styles.css       # Estilo global y variables de diseño
│   ├── js/
│   │   ├── api.js           # Fetch e inyección del Token en Headers
│   │   ├── auth.js          # Manejo de sessionStorage y protección de rutas
│   │   ├── config.js        # Variables globales de entorno (ej. BASE_URL)
│   │   ├── home.js          # Lógica para la vista home
│   │   ├── login.js         # Lógica de validación e inicio de sesión
│   │   ├── register.js      # Lógica de validación y registro de cuentas
│   │   └── update.js        # Lógica para actualizar la información del usuario
│   ├── index.html           # Vista pública: Pantalla de bienvenida
│   ├── login.html           # Vista pública: Formulario de inicio de sesión
│   ├── register.html        # Vista pública: Formulario de registro de cuentas
|   ├── home.html            # Vista protegida: Panel principal del usuario
│   └── update.html          # Vista protegida: Formulario de edición de perfil
├── .gitignore
└── README.md
```

---

## Requisitos previos

- **Navegador web**(Firefox/Chrome/Edge).
- (Recomendado) **Node.js 18+** *o* **Python 3** para levantar un servidor local y evitar problemas de CORS/rutas al abrir archivos directamente.

---

## Instalación y ejecución

### Opción A) Abrir directo (rápido)
1. Clona el repositorio:
   ```bash
   git clone https://github.com/ids-fciencias-7009-2026-2/adopcion-ids-equipo7-frontend.git
   cd adopcion-ids-equipo7-frontend
   ```
2. Abre el archivo en la carpeta:
   - `src/index.html` en tu navegador (doble click o “Open With Browser”).

### Opción B) Servidor local (recomendado)

#### Con Python
```bash
cd adopcion-ids-equipo7-frontend
python3 -m http.server 5173 --directory src
```
Luego abre en el navegador:
- `http://localhost:5173`


---

## ¿Qué debería verse?

Al abrir `index.html`, se muestra un mensaje tipo **“¡Hola Mundo! El Frontend está vivo!”**.

---


