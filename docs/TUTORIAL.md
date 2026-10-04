# 📘 Tutorial: cómo está construido este Tetris

Este documento explica **cómo está organizado el proyecto, dónde está cada cosa y por qué**. Está pensado para leerse de arriba hacia abajo la primera vez y luego usarse como referencia.

## Índice

1. [Tecnologías](#1-tecnologías)
2. [Cómo ejecutar el juego](#2-cómo-ejecutar-el-juego)
3. [Mapa de carpetas](#3-mapa-de-carpetas)
4. [Arquitectura en capas](#4-arquitectura-en-capas)
5. [Recorrido: qué pasa cuando tocas un botón](#5-recorrido-qué-pasa-cuando-tocas-un-botón)
6. [Capa 1 — `src/core`: la lógica del juego](#6-capa-1--srccore-la-lógica-del-juego)
7. [Capa 2 — `src/hooks`: el puente con React](#7-capa-2--srchooks-el-puente-con-react)
8. [Capa 3 — `src/components`: lo que se ve](#8-capa-3--srccomponents-lo-que-se-ve)
9. [Capa 4 — `src/screens` y `App.tsx`](#9-capa-4--srcscreens-y-apptsx)
10. [`src/theme`: el diseño](#10-srctheme-el-diseño)
11. [Reglas del juego implementadas](#11-reglas-del-juego-implementadas)
12. [Pruebas](#12-pruebas)
13. [Convenciones y buenas prácticas](#13-convenciones-y-buenas-prácticas)
14. [Agentes especializados de Claude Code](#14-agentes-especializados-de-claude-code)
15. [Archivos de configuración](#15-archivos-de-configuración)
16. [Ejercicios para seguir aprendiendo](#16-ejercicios-para-seguir-aprendiendo)
17. [Glosario](#17-glosario)

---

## 1. Tecnologías

| Herramienta | Para qué se usa |
|---|---|
| **React Native** | Crear la app móvil con componentes (`View`, `Text`, `Pressable`). |
| **Expo (SDK 57)** | Simplifica todo: ejecutar en el teléfono con Expo Go, compilar con EAS, sin tocar Android Studio/Xcode. |
| **TypeScript (modo `strict`)** | Tipos que detectan errores antes de ejecutar. |
| **Jest + jest-expo** | Pruebas unitarias. |
| **ESLint (`eslint-config-expo`)** | Reglas de estilo y de los Hooks de React. |
| **react-native-safe-area-context** | Evitar el notch y la barra inferior del teléfono. |

No se usa ninguna librería de juegos: todo el Tetris está escrito a mano en `src/core`, para que se pueda estudiar.

---

## 2. Cómo ejecutar el juego

### En el teléfono con Expo Go (desarrollo)
Necesitas una computadora con Node.js 20+ y la app **Expo Go** en el teléfono (Play Store / App Store).

```bash
git clone https://github.com/Henry-Tercero-MH/Juego-Tetris-.git
cd Juego-Tetris-
npm install
npm start
```

Aparece un código QR en la terminal: escanéalo con Expo Go (Android) o con la cámara (iPhone). El teléfono y la computadora deben estar en la misma red Wi-Fi (o usa `npx expo start --tunnel`).

### Generar un APK instalable (sin computadora potente)
Con una cuenta gratuita de Expo puedes compilar en la nube:

```bash
npx eas-cli@latest build --platform android --profile preview
```

Al terminar, EAS te da un enlace para descargar el `.apk` directamente en el teléfono.

### Comandos de calidad

```bash
npm test            # pruebas
npm run typecheck   # tipos
npm run lint        # estilo
```

---

## 3. Mapa de carpetas

```
Juego-Tetris-/
├── .claude/
│   ├── agents/                 ← Agentes especializados de Claude Code (sección 14)
│   │   ├── arquitecto.md
│   │   ├── logica-juego.md
│   │   ├── disenador-ui.md
│   │   ├── tester.md
│   │   ├── revisor-clean-code.md
│   │   └── documentador.md
│   └── settings.json           ← Activa el plugin oficial de Expo para Claude Code
├── assets/                     ← Íconos y splash de la app
├── docs/
│   └── TUTORIAL.md             ← Este documento
├── src/
│   ├── App.tsx                 ← Raíz de la app (proveedores + pantalla)
│   ├── core/                   ← 🧠 Lógica pura del juego (sin React)
│   │   ├── __tests__/          ← Pruebas del núcleo
│   │   ├── types.ts            ← Tipos: Board, Piece, GameState…
│   │   ├── constants.ts        ← Tamaño del tablero, velocidades…
│   │   ├── tetrominoes.ts      ← Forma de las 7 piezas
│   │   ├── randomizer.ts       ← Generador aleatorio con semilla + "7-bag"
│   │   ├── board.ts            ← Crear tablero, colisiones, fijar pieza, limpiar líneas
│   │   ├── piece.ts            ← Aparecer, mover, rotar, caída
│   │   ├── scoring.ts          ← Puntos, nivel y velocidad
│   │   ├── gameReducer.ts      ← Cerebro: (estado, acción) → nuevo estado
│   │   ├── selectors.ts        ← Prepara datos listos para dibujar
│   │   └── index.ts            ← API pública del núcleo
│   ├── hooks/                  ← 🔌 Puente entre el núcleo y React
│   │   ├── useTetris.ts        ← Hook principal del juego
│   │   ├── useInterval.ts      ← Reloj que hace caer la pieza
│   │   ├── useSwipeControls.ts ← Gestos táctiles sobre el tablero
│   │   ├── useAppBackground.ts ← Pausa al salir de la app
│   │   └── index.ts
│   ├── components/             ← 🎨 Piezas visuales reutilizables
│   │   ├── Board/              ← Tablero y celdas
│   │   ├── PiecePreview/       ← Mini pieza (siguiente / guardada)
│   │   ├── StatsPanel/         ← Puntos, nivel, líneas
│   │   ├── ControlPad/         ← Botones de control
│   │   ├── GameOverlay/        ← Pantallas de inicio, pausa y fin
│   │   └── ui/                 ← Genéricos: GameButton, Panel
│   ├── screens/
│   │   └── GameScreen.tsx      ← 📱 La pantalla que une todo
│   └── theme/                  ← 🎨 Colores, espacios, tipografía
├── index.ts                    ← Punto de entrada que registra App
├── app.json                    ← Configuración de Expo (nombre, ícono, orientación)
├── eas.json                    ← Perfiles para compilar el APK en la nube
├── package.json                ← Dependencias y scripts
├── tsconfig.json               ← Configuración de TypeScript (alias @/)
├── eslint.config.js            ← Reglas de ESLint
├── CLAUDE.md                   ← Instrucciones para Claude Code
├── AGENTS.md                   ← Reglas oficiales de Expo para agentes de IA
└── README.md                   ← Presentación corta del proyecto
```

> **Regla para saber dónde va algo nuevo:**
> ¿Es una regla del juego? → `core`. ¿Usa hooks de React pero no dibuja? → `hooks`. ¿Dibuja algo? → `components`. ¿Es una pantalla completa? → `screens`. ¿Es un color o tamaño? → `theme`.

---

## 4. Arquitectura en capas

```
┌─────────────────────────────┐
│ App.tsx                     │  proveedores globales
├─────────────────────────────┤
│ screens/GameScreen.tsx      │  compone la pantalla
├─────────────────────────────┤
│ components/*                │  dibujan (reciben props)       ← theme/*
├─────────────────────────────┤
│ hooks/*                     │  estado de React, reloj, gestos
├─────────────────────────────┤
│ core/*                      │  reglas puras de Tetris
└─────────────────────────────┘
      Las flechas de import solo van HACIA ABAJO.
```

**¿Por qué así?**

- **Separación de responsabilidades**: si mañana cambias el diseño, no tocas las reglas; si cambias una regla, no tocas el diseño.
- **Testeable**: `core` no depende de React, así que se prueba con funciones simples (sección 12).
- **Reutilizable**: el mismo `core` serviría para una versión web o de consola.

---

## 5. Recorrido: qué pasa cuando tocas un botón

Ejemplo: tocas el botón **◀** (mover a la izquierda).

1. `src/components/ControlPad/ControlPad.tsx` → el `GameButton` llama a `actions.moveLeft`.
2. `src/hooks/useTetris.ts` → `moveLeft` ejecuta `dispatch({ type: 'MOVE_LEFT' })`.
3. React llama a `gameReducer(estadoActual, { type: 'MOVE_LEFT' })` en `src/core/gameReducer.ts`.
4. El reducer usa `tryMove(board, current, -1, 0)` de `src/core/piece.ts`, que pregunta a `isValidPosition` de `src/core/board.ts` si la pieza cabe.
5. Si cabe, devuelve un **estado nuevo** con la pieza desplazada; si no, devuelve el mismo estado.
6. `useTetris` recalcula `selectRenderBoard(state)` (`src/core/selectors.ts`): una matriz 20×10 con el tablero + pieza + fantasma.
7. `GameScreen` pasa esa matriz a `<Board>`, que dibuja cada `<BoardCell>`. Gracias a `memo`, solo se redibujan las celdas que cambiaron.

La **caída automática** sigue el mismo camino, pero quien hace `dispatch({ type: 'TICK' })` es `useInterval` cada X milisegundos.

---

## 6. Capa 1 — `src/core`: la lógica del juego

Todo aquí es **TypeScript puro**: sin React, sin `Math.random()`, sin modificar objetos existentes (inmutabilidad).

### `types.ts`
Define el vocabulario del juego:

```ts
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type Cell = TetrominoType | null;      // celda vacía u ocupada
export type Board = Cell[][];                 // board[fila][columna]
export type Shape = number[][];               // 1 = bloque, 0 = vacío
```

`GameState` contiene todo lo que hay que saber de una partida: tablero, pieza actual, cola de siguientes, pieza guardada, puntos, líneas, nivel, estado (`idle | playing | paused | gameOver`) y la **semilla** aleatoria.

### `constants.ts`
Números con nombre (en vez de "números mágicos"): `BOARD_ROWS = 20`, `BOARD_COLS = 10`, `PREVIEW_COUNT = 3`, velocidades…

### `tetrominoes.ts`
La forma de cada pieza como matriz. Ejemplo, la T:

```ts
T: [
  [0, 1, 0],
  [1, 1, 1],
  [0, 0, 0],
],
```

> Los **colores no están aquí** sino en `src/theme/colors.ts`: la lógica no sabe nada de cómo se ve.

### `randomizer.ts`
- `nextRandom(seed)`: generador pseudoaleatorio *mulberry32*. Misma semilla → mismos números. Así el reducer es **puro** y las pruebas son repetibles.
- `createBag(seed)`: baraja las 7 piezas (algoritmo Fisher-Yates). Es el sistema **7-bag** del Tetris oficial: en cada grupo de 7 sale cada pieza una vez.
- `fillQueue(queue, seed, min)`: agrega bolsas hasta que la cola tenga suficientes piezas.

### `board.ts`
| Función | Qué hace |
|---|---|
| `createEmptyBoard()` | Tablero 20×10 lleno de `null`. |
| `forEachBlock(shape, pos, cb)` | Recorre cada bloque de una pieza con su posición real. Evita repetir el doble `for` en todas partes. |
| `isValidPosition(board, shape, pos)` | ¿La pieza cabe? (no sale por los lados ni por abajo y no choca). Permite sobresalir por arriba al aparecer. |
| `mergePiece(board, piece)` | Devuelve un tablero **nuevo** con la pieza fijada. |
| `clearLines(board)` | Quita filas completas y agrega filas vacías arriba. Devuelve cuántas quitó. |
| `isAboveBoard(piece)` | Detecta si la pieza se fijó por encima del tablero (fin de partida). |

### `piece.ts`
| Función | Qué hace |
|---|---|
| `spawnPiece(type, cols)` | Crea la pieza centrada arriba. |
| `rotateShapeClockwise(shape)` | Gira la matriz 90°: las columnas pasan a ser filas invertidas. |
| `tryMove(board, piece, dx, dy)` | Devuelve la pieza movida o `null` si no cabe. |
| `tryRotate(board, piece)` | Rota; si choca, prueba desplazamientos (**wall kicks**) a los lados y hacia arriba. |
| `getDropPosition(board, piece)` | Hasta dónde caería la pieza (usado por la **pieza fantasma** y el *hard drop*). |

### `scoring.ts`
| Función | Regla |
|---|---|
| `getLineClearScore(lines, level)` | 1 línea = 100, 2 = 300, 3 = 500, 4 = 800, multiplicado por el nivel. |
| `getLevel(totalLines)` | Nivel = líneas ÷ 10 + 1. |
| `getDropInterval(level)` | 800 ms en nivel 1, 70 ms menos por nivel, mínimo 80 ms. |

### `gameReducer.ts` — el cerebro
Un **reducer** es una función `(estado, acción) => nuevoEstado`. Las acciones posibles están tipadas:

```ts
export type GameAction =
  | { type: 'START'; seed: number }
  | { type: 'TICK' }
  | { type: 'MOVE_LEFT' } | { type: 'MOVE_RIGHT' }
  | { type: 'SOFT_DROP' } | { type: 'HARD_DROP' }
  | { type: 'ROTATE' } | { type: 'HOLD' }
  | { type: 'PAUSE' } | { type: 'RESUME' };
```

Funciones internas (privadas, no se exportan):

- `spawnFromQueue` — saca la siguiente pieza de la cola.
- `placeNewPiece` — la coloca; si no cabe → `gameOver`.
- `lockPiece` — fija la pieza, limpia líneas, suma puntos, recalcula nivel y saca la siguiente.
- `handleHold` — guarda la pieza (una vez por pieza).

Observa la **cláusula de guarda**: si no se está jugando, las acciones de movimiento se ignoran devolviendo el mismo estado.

### `selectors.ts`
- `selectRenderBoard(state)` combina tablero fijo + pieza fantasma + pieza actual en una sola matriz de `RenderCell` (`{ type, isGhost }`). La UI solo la pinta.
- `selectNextPieces(state)` devuelve las 3 próximas piezas.

### `index.ts` (barrel)
Expone **solo lo necesario** al resto de la app. Por eso en otras capas se escribe `import { gameReducer } from '@/core'` y no `'@/core/gameReducer'`.

---

## 7. Capa 2 — `src/hooks`: el puente con React

### `useTetris.ts`
El hook principal. Internamente:

```ts
const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
useInterval(() => dispatch({ type: 'TICK' }), isPlaying ? getDropInterval(state.level) : null);
```

Devuelve a la pantalla:
- datos listos: `renderBoard`, `nextPieces`, `hold`, `score`, `lines`, `level`, `status`;
- `actions`: `start`, `pause`, `resume`, `moveLeft`, `moveRight`, `rotate`, `softDrop`, `hardDrop`, `hold`.

`actions` se crea con `useMemo` una sola vez, así los componentes que lo reciben no se redibujan sin motivo. La semilla aleatoria (`Date.now()`) se genera al tocar "Jugar", fuera del reducer, para mantenerlo puro.

### `useInterval.ts`
Ejecuta una función cada `delay` ms; con `null` se detiene (pausa / fin). Guarda la función en un `useRef` para no reiniciar el reloj en cada render.

### `useSwipeControls.ts`
Usa `PanResponder` de React Native (sin librerías extra):
- arrastrar 24 px a un lado = mover una columna;
- arrastrar hacia abajo = *soft drop*;
- soltar con velocidad rápida hacia abajo = *hard drop*;
- toque corto = rotar.

### `useAppBackground.ts`
Escucha `AppState`: si recibes una llamada o cambias de app, el juego se **pausa** solo.

---

## 8. Capa 3 — `src/components`: lo que se ve

Cada componente vive en **su propia carpeta** con un `index.ts` que lo exporta. Los componentes son "tontos": reciben datos por *props* y avisan con *callbacks*; no conocen el reducer.

| Componente | Archivo | Qué dibuja |
|---|---|---|
| `Board` | `Board/Board.tsx` | La cuadrícula 20×10. Recibe `grid`, `cellSize` y los gestos. |
| `BoardCell` | `Board/BoardCell.tsx` | Un bloque. Con `memo` para rendimiento. Versión normal (relleno) o fantasma (solo borde). |
| `PiecePreview` | `PiecePreview/PiecePreview.tsx` | Mini pieza para "Siguiente" y "Guardada". Reutiliza `BoardCell`. |
| `StatsPanel` | `StatsPanel/StatsPanel.tsx` | Puntos, nivel y líneas. |
| `ControlPad` | `ControlPad/ControlPad.tsx` | Botones HOLD, ↻, ⤓, ◀, ▼, ▶. |
| `GameOverlay` | `GameOverlay/GameOverlay.tsx` | Capa de inicio / pausa / fin de juego. Textos en un objeto `CONTENT` en vez de muchos `if`. |
| `GameButton` | `ui/GameButton.tsx` | Botón base con accesibilidad y estado presionado. |
| `Panel` | `ui/Panel.tsx` | Caja con título usada en la columna lateral. |

---

## 9. Capa 4 — `src/screens` y `App.tsx`

### `screens/GameScreen.tsx`
Solo **compone**: llama a `useTetris()`, `useSwipeControls(actions)` y ubica los componentes:

```
┌──────────────────────────────┐
│ TETRIS                  [II] │  ← encabezado + pausa
├────────────────────┬─────────┤
│                    │Guardada │
│      Board         │Siguiente│
│   (+ GameOverlay)  │ Puntos  │
│                    │ Nivel   │
│                    │ Líneas  │
├────────────────────┴─────────┤
│ [HOLD]   [↻]   [⤓]           │
│ [ ◀ ]   [ ▼ ]   [ ▶ ]        │  ← ControlPad
└──────────────────────────────┘
```

`useCellSize()` calcula el tamaño de cada celda con `useWindowDimensions` y `useSafeAreaInsets`, para que el tablero quepa en cualquier teléfono.

### `App.tsx`
Envuelve todo en `SafeAreaProvider`, pone la barra de estado clara y muestra `GameScreen`.

### `index.ts` (raíz)
`registerRootComponent(App)`: le dice a Expo cuál es el componente principal.

---

## 10. `src/theme`: el diseño

| Archivo | Contenido |
|---|---|
| `colors.ts` | `colors` (fondo, superficies, texto, acento) y `pieceColors` (color oficial de cada pieza). |
| `spacing.ts` | Espacios en múltiplos de 4 (`xs`=4 … `xxl`=32) y radios de borde. |
| `typography.ts` | Estilos de texto: título, etiqueta, valor, botón. |

**Regla:** ningún componente escribe `'#FF0000'` o `padding: 13`. Siempre `colors.x`, `spacing.x`. Cambiar el tema completo = editar solo esta carpeta.

---

## 11. Reglas del juego implementadas

| Regla | Detalle | Dónde |
|---|---|---|
| Tablero | 10 columnas × 20 filas | `core/constants.ts` |
| Aleatoriedad | 7-bag con semilla | `core/randomizer.ts` |
| Rotación | Horaria, con wall kicks simplificados | `core/piece.ts` |
| Pieza fantasma | Muestra dónde caerá la pieza | `core/selectors.ts` |
| Hold | Guardar/intercambiar pieza, 1 vez por pieza | `core/gameReducer.ts` |
| Vista previa | 3 piezas siguientes | `core/constants.ts` |
| Puntos por líneas | 100 / 300 / 500 / 800 × nivel | `core/scoring.ts` |
| Soft drop | +1 punto por celda | `core/scoring.ts` |
| Hard drop | +2 puntos por celda | `core/scoring.ts` |
| Nivel | Sube cada 10 líneas | `core/scoring.ts` |
| Velocidad | 800 ms − 70 ms/nivel (mínimo 80 ms) | `core/scoring.ts` |
| Fin de partida | La pieza nueva no cabe o se fija fuera del tablero | `core/gameReducer.ts` |
| Pausa automática | Al salir de la app | `hooks/useAppBackground.ts` |

**Controles:** deslizar izq./der. = mover · deslizar abajo = bajar · deslizar rápido abajo = soltar · tocar = rotar · botones en pantalla para todo + HOLD.

---

## 12. Pruebas

Ubicación: `src/core/__tests__/`. Hay 27 pruebas que cubren tablero, piezas, puntuación, aleatoriedad y el reducer.

Ejemplo (`board.test.ts`):

```ts
it('elimina filas completas y baja el resto', () => {
  const board = createEmptyBoard(4, 3);
  board[3] = ['I', 'I', 'I'];
  board[2] = ['T', null, null];
  const result = clearLines(board);
  expect(result.cleared).toBe(1);
  expect(result.board[3]).toEqual(['T', null, null]);
});
```

Gracias a la semilla, `gameReducer(createInitialState(), { type: 'START', seed: 1 })` siempre produce la misma partida → pruebas deterministas.

```bash
npm test                 # todas
npm test -- --coverage   # con cobertura
npm run test:watch       # se re-ejecutan al guardar
```

---

## 13. Convenciones y buenas prácticas

### Nombres
| Elemento | Estilo | Ejemplo |
|---|---|---|
| Componentes y su archivo | `PascalCase` | `GameButton.tsx` |
| Hooks | `useAlgo` | `useTetris.ts` |
| Funciones / variables | `camelCase`, verbo + objeto | `clearLines`, `tryRotate` |
| Constantes | `UPPER_SNAKE_CASE` | `BOARD_ROWS` |
| Tipos / interfaces | `PascalCase` | `GameState`, `BoardProps` |

- **Código en inglés** (estándar de la industria); **comentarios, UI y documentación en español**.

### Clean code aplicado en este proyecto
- **Responsabilidad única**: cada archivo de `core` hace una cosa.
- **DRY**: `forEachBlock`, `GameButton`, `Panel` y `BoardCell` evitan repetir código.
- **Funciones puras e inmutables** en `core` (`mergePiece` copia el tablero en vez de modificarlo).
- **Cláusulas de guarda** en lugar de `if` anidados (`if (!state.canHold) return state;`).
- **Sin números mágicos ni colores sueltos**.
- **Tipado estricto**: uniones discriminadas para las acciones (`GameAction`), sin `any`.
- **Comentarios que explican el porqué**, no el qué.

### Orden de imports
1. Librerías externas (`react`, `react-native`)
2. Alias del proyecto (`@/core`, `@/theme`)
3. Relativos (`./BoardCell`)

Separados por una línea en blanco.

### Rendimiento en móvil
- `memo` en `BoardCell` (se renderiza 200 veces).
- `useMemo` para `renderBoard` y `actions`.
- `StyleSheet.create` para los estilos estáticos.

### Accesibilidad
Todos los botones tienen `accessibilityRole="button"` y `accessibilityLabel` en español, y miden al menos 56×56.

---

## 14. Agentes especializados de Claude Code

En `.claude/agents/` hay 6 agentes. Cada uno es un archivo Markdown con instrucciones para un rol. Claude Code los usa automáticamente cuando la tarea coincide con su descripción, o puedes pedirlos por nombre:

> "Usa el agente **logica-juego** para agregar la rotación antihoraria."

| Agente | Rol | Puede editar |
|---|---|---|
| `arquitecto` | Decide dónde va cada archivo, vigila las capas y dependencias. | No (solo analiza) |
| `logica-juego` | Reglas de Tetris en `src/core`, siempre con pruebas. | Sí |
| `disenador-ui` | Pantallas, componentes, tema, gestos, accesibilidad. | Sí |
| `tester` | Pruebas Jest, reproducir bugs con un test. | Sí |
| `revisor-clean-code` | Revisión de calidad con reporte 🔴/🟡/🟢. | No (solo reporta) |
| `documentador` | Mantiene este tutorial y el README al día. | Sí |

**Flujo recomendado para una funcionalidad nueva:**
`arquitecto` (dónde va) → `logica-juego` / `disenador-ui` (implementar) → `tester` (pruebas) → `revisor-clean-code` (revisión) → `documentador` (actualizar docs).

Además, `CLAUDE.md` da a Claude el resumen del proyecto en cada sesión, y `AGENTS.md` contiene las reglas oficiales de Expo.

---

## 15. Archivos de configuración

| Archivo | Para qué |
|---|---|
| `package.json` | Dependencias, scripts (`start`, `test`, `lint`, `typecheck`) y configuración de Jest (preset `jest-expo` + alias `@/`). |
| `app.json` | Nombre de la app, ícono, orientación vertical, tema oscuro. |
| `eas.json` | Perfiles de compilación en la nube (EAS). `preview` genera un `.apk` instalable. |
| `tsconfig.json` | TypeScript estricto + alias `@/*` → `src/*`. |
| `eslint.config.js` | Reglas de Expo (incluye las reglas de Hooks de React). |
| `.gitignore` | Excluye `node_modules`, `.expo`, carpetas nativas generadas. |
| `.claude/settings.json` | Activa el plugin oficial de Expo para Claude Code. |

---

## 16. Ejercicios para seguir aprendiendo

Ordenados de fácil a difícil. Indica en qué capa trabajarías:

1. **Cambiar los colores** de las piezas → `theme/colors.ts`.
2. **Mostrar 5 piezas siguientes** en vez de 3 → `core/constants.ts` (`PREVIEW_COUNT`).
3. **Rotación antihoraria** → `core/piece.ts` + nueva acción en `gameReducer.ts` + botón en `ControlPad`.
4. **Vibración** al limpiar líneas → `npx expo install expo-haptics` y llamarlo desde un hook.
5. **Guardar el récord** → `npx expo install @react-native-async-storage/async-storage` y un hook `useHighScore`.
6. **Pantalla de menú y de récords** → migrar a Expo Router (`src/app/`), ver `AGENTS.md`.
7. **Sonidos** → `expo-audio`.

---

## 17. Glosario

| Término | Significado |
|---|---|
| **Tetrominó** | Pieza formada por 4 bloques (I, O, T, S, Z, J, L). |
| **Reducer** | Función pura `(estado, acción) → nuevo estado`. |
| **Acción** | Objeto que describe qué pasó: `{ type: 'ROTATE' }`. |
| **Función pura** | Mismo input → mismo output, sin efectos secundarios. |
| **Inmutabilidad** | No modificar datos existentes; crear copias nuevas. |
| **Hook** | Función de React que empieza con `use` y maneja estado/efectos. |
| **Props** | Datos que un componente recibe de su padre. |
| **Barrel (`index.ts`)** | Archivo que reexporta lo público de una carpeta. |
| **Soft drop / Hard drop** | Bajar una fila / soltar la pieza hasta el fondo. |
| **Wall kick** | Desplazar la pieza al rotar para que no choque con la pared. |
| **Pieza fantasma** | Silueta que muestra dónde caerá la pieza. |
| **7-bag** | Sistema aleatorio que entrega las 7 piezas en orden barajado. |
| **Semilla (seed)** | Número que inicializa el generador aleatorio; misma semilla = misma secuencia. |
