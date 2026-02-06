# Documentación de Arquitectura

## Visión General

Buscamina Retro sigue una arquitectura basada en **componentes** con separación clara entre lógica de negocio (game/) y presentación (components/). El patrón Observer facilita la comunicación entre módulos.

```
┌─────────────────────────────────────────────────────────┐
│                      index.html                         │
│                           ↓                             │
│                      main.js                            │
│                           ↓                             │
│         ┌─────────────────────────────────┐             │
│         │           App Class            │             │
│         │    (Orquestador principal)     │             │
│         └─────────────────────────────────┘             │
│                    ↓          ↓          ↓               │
│         ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│         │  Game    │  │  Header  │  │ Controls │       │
│         │ (Lógica) │  │  (UI)    │  │  (UI)    │       │
│         └──────────┘  └──────────┘  └──────────┘       │
│              ↓                                    ↓     │
│         ┌──────────┐                        ┌────────┐ │
│         │  Board   │                        │ Board  │ │
│         │  (Data)  │                        │ (View) │ │
│         └──────────┘                        └────────┘ │
│              ↓                                    ↓     │
│         ┌──────────┐                        ┌────────┐ │
│         │  Cell    │                        │ Cell   │ │
│         │  (Data)  │                        │ (View) │ │
│         └──────────┘                        └────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Capas de la Arquitectura

### 1. Capa de Datos (game/)

**Cell.js**
```javascript
class Cell {
  - row, col           // Posición
  - state              // HIDDEN | REVEALED | FLAGGED | EXPLODED
  - hasMine           // Boolean
  - adjacentMines      // Integer (0-8)
  
  + reveal()          // Revela la celda
  + flag()            // Alterna bandera
  + explode()         // Celda con mina explotada
}
```

**Board.js**
```javascript
class Board {
  - rows, cols        // Dimensiones
  - totalMines        // Total de minas
  - grid[][]          // Matriz de Cell
  - firstClick       // Boolean
  - gameOver         // Boolean
  - status           // READY | PLAYING | WON | LOST
  
  + init()           // Inicializa tablero vacío
  + placeMines()     // Coloca minas aleatorias
  + click(row, col)  // Maneja clic
  + flag(row, col)  // Maneja bandera
  + revealCell()    // Revelado recursivo
  + checkWin()       // Verifica victoria
}
```

**Game.js**
```javascript
class Game {
  - board            // Instancia de Board
  - timer            // Interval ID
  - seconds          // Tiempo transcurrido
  - listeners       // Event handlers
  
  + init(difficulty)    // Inicializa juego
  + click(row, col)     // Delegar a board
  + flag(row, col)      // Delegar a board
  + startTimer()        // Inicia cronómetro
  + stopTimer()         // Detiene cronómetro
  + on(event, callback) // Subscribe a eventos
}
```

### 2. Capa de Presentación (components/)

**Patrón de componentes:**
```javascript
class Component {
  - element          // DOM element
  
  + createElement()  // Crea el DOM
  + render()         // Renderiza el contenido
  + update()         // Actualiza estado visual
  + destroy()        // Limpia recursos
}
```

**BoardComponent.js**
```javascript
class BoardComponent {
  - board            // Referencia al modelo
  - cells[]          // Array de CellComponent
  - onCellClick      // Callback
  - onCellRightClick // Callback
  
  + render()         // Crea grid de celdas
  + updateCell()     // Actualiza celda específica
  + revealCells()   // Revela múltiples celdas
}
```

### 3. Capa de Utilidades (utils/)

**constants.js**
```javascript
export const DIFFICULTY = { BEGINNER, INTERMEDIATE, ADVANCED };
export const CELL_STATE = { HIDDEN, REVEALED, FLAGGED, EXPLODED };
export const GAME_STATUS = { READY, PLAYING, WON, LOST };
export const ICONS = { MINE, FLAG, HAPPY, DEAD, COOL };
```

**helpers.js**
```javascript
export function createEmptyBoard(rows, cols);
export function placeMines(board, excludeRow, excludeCol, count);
export function calculateAdjacentMines(board);
export function getNeighbors(board, row, col);
export function countFlaggedCells(board);
export function checkWinCondition(board, totalMines);
```

## Flujo de Eventos

```
Usuario hace clic
      ↓
BoardComponent.click()
      ↓
Game.click(row, col)
      ↓
Board.click(row, col)
      ↓
┌────────────────────────────────────────┐
│ Si primera celda:                      │
│   - Board.placeMinesSafe()             │
│   - Game.startTimer()                  │
└────────────────────────────────────────┘
      ↓
Board.revealCell() [recursivo]
      ↓
Game.emit('click', result)
      ↓
BoardComponent.revealCells()
      ↓
Actualización visual
```

## Sistema de Eventos

```javascript
// Game como EventEmitter
game.on('init', (stats) => { ... });
game.on('click', (result) => { ... });
game.on('flag', (result) => { ... });
game.on('timer', (seconds) => { ... });
game.on('gameover', (result) => { ... });
game.on('reset', () => { ... });
```

## Estilos CSS (BEM)

```
Bloque:     .board
Elemento:   .board__grid
Modificador:.board--active

.cell
.cell__icon
.cell--revealed
.cell--mine
.cell--flagged
.cell--1, .cell--2, ...
```

## Constantes de Diseño

```css
:root {
  --color-window: #c0c0c0;      /* Gris Windows */
  --color-bg: #008080;          /* Azul teal */
  --cell-size: 24px;
  --font-retro: 'Courier New';
}
```

## Algoritmo de Revelado (Flood Fill)

```javascript
function revealCell(row, col) {
  const cell = grid[row][col];
  
  // Condiciones de parada
  if (cell.revealed || cell.flagged) return [];
  if (cell.hasMine) return [cell];
  
  // Revelar celda actual
  cell.state = REVEALED;
  const revealed = [cell];
  
  // Si tiene minas adyacentes, no continuar
  if (cell.adjacentMines > 0) return revealed;
  
  // Flood fill en vecinos
  for (const neighbor of getNeighbors(row, col)) {
    revealed.push(...revealCell(neighbor.row, neighbor.col));
  }
  
  return revealed;
}
```

## Consideraciones de Rendimiento

1. **Renderizado inicial**: Grid se renderiza una sola vez
2. **Updates parciales**: Solo celdas afectadas se actualizan
3. **Event delegation**: Eventos en Board delegan a Cells
4. **Memory**: Referencias a DOM se mantienen mínimas

## Extensibilidad

- **Nuevas dificultades**: Agregar a `DIFFICULTY` y `ControlsComponent`
- **Temas visuales**: Agregar nuevos valores a variables CSS
- **Sonidos**: Agregar listeners a eventos del Game
- **Persistencia**: Agregar localStorage en Game.init()
