# Requisitos
- Python

---

# Instalación y configuración
Estos pasos se realizan solo la primera vez.
1) Instalar Python
2) Clonar el repositorio y ubicarse en la raíz del proyecto.
3) Creación del entorno (venv)
```bash
python -m venv venv
```
4) Activación del entorno
```bash
source venv/bin/activate
```
5) Instalación de dependencias (PyQt)
```bash
pip install -r requirements.txt
```

# Levantamiento y ejecución
Estos son los pasos necesarios cada que levantemos el proyecto.
1) Activación del entorno
```bash
source venv/bin/activate
```
2 ) Ejecución del programa
```bash
python src/main.py
```
3) Salir del entorno
Cerrar terminal o ejecutar:
```bash
deactivate
```

---

# Estructura del proyecto

```bash
adopcion-ids-equipo7-frontend/
│
├── venv/                   # Entorno virtual y personal de Python
├── src/                    # Código fuente
│   └── main.py             # Archivo principal de levantamiento
├── .gitignore              # Archivo que indica a Git el contenido a ignorar
├── requirements.txt        # Define las dependencias y librerias necesarias
└── README.md               # Documento de presentación del proyecto
```


