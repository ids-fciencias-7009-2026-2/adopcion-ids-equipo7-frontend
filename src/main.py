import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel
from PyQt6.QtCore import Qt

def main():
    # Creación de la aplicación base
    app = QApplication(sys.argv)
    
    # Creamos la ventana principal
    window = QMainWindow()
    window.setWindowTitle("Sistema de Adopción - Equipo 7")
    window.setGeometry(100, 100, 400, 300) # (x, y, ancho, alto)
    
    # Agregamos un texto básico
    label = QLabel("Hello World!", window)
    label.setAlignment(Qt.AlignmentFlag.AlignCenter)
    window.setCentralWidget(label)
    
    # Muestra la ventana e inicia el ciclo de la aplicación
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
