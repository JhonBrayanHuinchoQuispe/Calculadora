# 🧮 Calculadora Científica Avanzada

Una calculadora web moderna y completa con funciones científicas, sistema de memoria, historial y múltiples temas.

## ✨ Características Principales

### 🔬 Modo Científico
- **Funciones trigonométricas**: sin, cos, tan y sus inversas
- **Logaritmos**: log (base 10) y ln (logaritmo natural)
- **Constantes matemáticas**: π (pi) y e (número de Euler)
- **Operaciones avanzadas**: potencias (x^y), raíz cuadrada, x², x³, 1/x
- **Factorial**: cálculo de n!

### 💾 Sistema de Memoria
- **MC**: Limpiar memoria
- **MR**: Recordar (usar valor en memoria)
- **M+**: Sumar al valor en memoria
- **M-**: Restar del valor en memoria
- **Indicador visual**: muestra "M" cuando hay valor guardado

### 📈 Historial de Cálculos
- **Registro automático**: guarda todas las operaciones realizadas
- **Reutilización**: haz clic en cualquier cálculo anterior para usarlo
- **Persistencia**: se mantiene entre sesiones
- **Límite inteligente**: mantiene los últimos 50 cálculos

### 🎨 Temas Personalizables
- **Modo Oscuro**: diseño elegante para uso nocturno
- **Modo Claro**: interfaz limpia para uso diurno
- **Transiciones suaves**: cambios animados entre temas
- **Persistencia**: recuerda tu preferencia

### ⌨️ Soporte Completo de Teclado
- **Números y operadores básicos**: 0-9, +, -, *, /, =, Enter
- **Funciones especiales**: Escape (limpiar), Backspace (borrar)
- **Atajos científicos** (Ctrl/Cmd + tecla):
  - `Ctrl+S`: sin()
  - `Ctrl+C`: cos()
  - `Ctrl+T`: tan()
  - `Ctrl+L`: log()
  - `Ctrl+N`: ln()
  - `Ctrl+P`: π
  - `Ctrl+E`: e
  - `Ctrl+R`: raíz cuadrada
  - `Ctrl+H`: mostrar/ocultar historial

### 📱 Diseño Responsivo
- **Adaptable**: funciona perfectamente en móviles, tablets y escritorio
- **Interfaz optimizada**: botones del tamaño adecuado para cada dispositivo
- **Historial móvil**: panel deslizable desde abajo en pantallas pequeñas

## 🚀 Funcionalidades Avanzadas

### Operaciones Complejas
- **Paréntesis inteligentes**: manejo automático de paréntesis anidados
- **Multiplicación implícita**: 2π, 3(2+1), etc.
- **Porcentajes**: soporte para múltiples porcentajes (15%%)
- **Números científicos**: notación exponencial para números muy grandes/pequeños

### Sistema de Cálculo
- **Evaluación en tiempo real**: muestra resultados parciales mientras escribes
- **Manejo de errores**: detecta y maneja divisiones por cero y operaciones inválidas
- **Precisión**: formateo inteligente de números decimales
- **Validación**: previene operaciones incorrectas

### Experiencia de Usuario
- **Animaciones suaves**: transiciones y efectos visuales elegantes
- **Retroalimentación visual**: efectos hover y de pulsación
- **Indicadores de estado**: memoria activa, modo científico
- **Scrollbar personalizada**: diseño consistente con el tema

## 🎯 Cómo Usar

### Operaciones Básicas
1. Haz clic en los números o usa el teclado
2. Selecciona operadores (+, -, ×, ÷)
3. Presiona = o Enter para calcular

### Modo Científico
1. Haz clic en "Científico" en la barra superior
2. Aparecerán los botones de funciones científicas
3. Usa sin(), cos(), tan(), log(), ln(), π, e
4. Las funciones se aplicarán al número actual

### Sistema de Memoria
1. Realiza un cálculo
2. Usa M+ para agregar el resultado a memoria
3. Usa MR para insertar el valor de memoria
4. MC limpia la memoria

### Historial
1. Haz clic en el ícono de historial (⏰)
2. Ve todos tus cálculos anteriores
3. Haz clic en cualquier cálculo para reutilizarlo
4. Usa el ícono de basura para limpiar el historial

## 🛠️ Tecnologías Utilizadas

- **HTML5**: estructura semántica
- **CSS3**: variables CSS, Grid, Flexbox, animaciones
- **JavaScript ES6+**: programación modular y funcional
- **LocalStorage**: persistencia de datos
- **Font Awesome**: iconos vectoriales
- **Google Fonts**: tipografía Roboto

## 🎮 Atajos de Teclado

| Tecla | Función |
|-------|---------|
| 0-9 | Números |
| +, -, *, / | Operadores básicos |
| Enter/= | Calcular |
| Escape | Limpiar |
| Backspace | Borrar último carácter |
| ( ) | Paréntesis |
| % | Porcentaje |
| . | Punto decimal |
| Ctrl+S | sin() |
| Ctrl+C | cos() |
| Ctrl+T | tan() |
| Ctrl+L | log() |
| Ctrl+N | ln() |
| Ctrl+P | π |
| Ctrl+E | e |
| Ctrl+R | √ |
| Ctrl+H | Historial |

## 🌟 Ejemplos de Uso

```
Básico: 2 + 3 × 4 = 14
Científico: sin(π/2) = 1
Potencias: 2^3 = 8
Constantes: π × 2 = 6.283185
Factorial: 5! = 120
Porcentajes: 100 + 15% = 115
Complejos: (2 + 3) × sin(π/4) = 3.536
```

## 📂 Estructura del Proyecto

```
calculadora/
├── index.html          # Estructura principal
├── styles.css          # Estilos y temas
├── script.js           # Lógica de la aplicación
└── README.md           # Documentación
```

## 🚀 Instalación y Uso

1. Clona o descarga los archivos
2. Abre `index.html` en tu navegador
3. ¡Comienza a calcular!

Para desarrollo local:
```bash
# Servidor Python
python3 -m http.server 8000

# Servidor Node.js
npx serve

# Servidor PHP
php -S localhost:8000
```

## 🔮 Próximas Mejoras

- [ ] Modo programador (binario, hexadecimal)
- [ ] Calculadora de matrices
- [ ] Gráficos de funciones
- [ ] Conversión de unidades
- [ ] Calculadora financiera
- [ ] Soporte para fracciones
- [ ] Exportar historial
- [ ] Temas personalizables adicionales

---

**¡Disfruta calculando con estilo! 🎉**
