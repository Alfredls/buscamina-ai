# Buscamina Retro

Un buscamina clásico con estética retro estilo Windows 95/XP, construido con Vanilla JS y Vite.

![Buscamina Retro](https://via.placeholder.com/400x300/008080/ffffff?text=Buscamina+Retro)

## 🎮 Características

- **Estética retro**: Diseño nostálgico estilo Windows 95/XP
- **3 niveles de dificultad**: Principiante, Intermedio, Avanzado
- **Controles intuitivos**: Clic izquierdo para revelar, derecho para marcar banderas
- **Timer y contador**: Sigue tu tiempo y las minas restantes
- **Sin dependencias**: Vanilla JS puro con Vite como build tool

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd buscamina

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar producción
npm run preview
```

## 🎯 Controles

| Acción | Control |
|--------|---------|
| Revelar celda | Clic izquierdo |
| Marcar/desmarcar bandera | Clic derecho |
| Reiniciar juego | Clic en la carita |
| Cambiar dificultad | Botones inferiores |

## 📊 Niveles de Dificultad

| Nivel | Tablero | Minas |
|-------|---------|-------|
| Principiante | 9x9 | 10 |
| Intermedio | 16x16 | 40 |
| Avanzado | 16x30 | 99 |

## 🏗️ Estructura del Proyecto

```
buscamina/
├── src/
│   ├── main.js                 # Punto de entrada
│   ├── game/                   # Lógica del juego
│   │   ├── Board.js           # Tablero y lógica
│   │   ├── Cell.js            # Celda individual
│   │   └── Game.js            # Controlador principal
│   ├── components/            # Componentes UI
│   │   ├── Board.js           # Renderizado del tablero
│   │   ├── Cell.js            # Celda visual
│   │   ├── Counter.js         # Contador de minas
│   │   ├── Timer.js           # Cronómetro
│   │   ├── GameStatus.js      # Estado del juego
│   │   ├── Header.js          # Barra de encabezado
│   │   └── Controls.js        # Controles de dificultad
│   ├── utils/                  # Utilidades
│   │   ├── constants.js       # Constantes del juego
│   │   └── helpers.js         # Funciones helper
│   └── styles/                # Estilos CSS (BEM)
│       ├── main.css
│       ├── _variables.css
│       ├── _board.css
│       ├── _cell.css
│       └── ...
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Estilos (BEM)

El proyecto utiliza la metodología BEM para CSS:

```css
.block {}
.block__element {}
.block--modifier {}
```

Ejemplos en el proyecto:
- `.game-window` → Ventana principal
- `.game-window__title-bar` → Barra de título
- `.cell--revealed` → Celda revelada
- `.controls__btn--active` → Botón activo

## 📝 API del Juego

```javascript
import { Game } from './game/Game.js';
import { DIFFICULTY } from './utils/constants.js';

// Crear instancia
const game = new Game();

// Inicializar con dificultad
game.init(DIFFICULTY.BEGINNER);

// Manejar eventos
game.on('click', (result) => console.log(result));
game.on('gameover', (result) => console.log(result));
game.on('timer', (seconds) => console.log(seconds));

// Acciones
game.click(row, col);      // Clic en celda
game.flag(row, col);       // Marcar bandera
game.reset();              // Reiniciar
game.changeDifficulty(DIFFICULTY.INTERMEDIATE);
```

## 🔧 Tecnologías

- **Vite** - Build tool y dev server
- **Vanilla JS** - JavaScript puro sin frameworks
- **CSS3** - Estilos con variables y BEM
- **ES Modules** - Sistema de módulos nativo

## 📄 Licencia

MIT License
