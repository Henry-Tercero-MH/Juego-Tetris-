# Tetris — React Native (Expo)

Lee también `AGENTS.md` (reglas de Expo) y `docs/TUTORIAL.md` (estructura completa del proyecto).

## Comandos
- `npm start` — servidor de desarrollo (escanear el QR con Expo Go)
- `npm test` — pruebas (Jest)
- `npm run typecheck` — TypeScript
- `npm run lint` — ESLint

Ejecuta `npm run lint`, `npm run typecheck` y `npm test` antes de dar una tarea por terminada.

## Arquitectura (resumen)
`src/App.tsx → src/screens → src/components → src/hooks → src/core` (las dependencias solo apuntan hacia `core`).
- `src/core/`: lógica pura del juego en TypeScript. Sin React, sin `Math.random()`, sin mutaciones.
- `src/hooks/`: conecta el núcleo con React (`useTetris`, gestos, temporizador).
- `src/components/`: componentes visuales sin reglas del juego. Uno por carpeta con `index.ts`.
- `src/theme/`: colores, espacios y tipografía. No escribir colores sueltos en componentes.
- Imports con alias `@/` (ej. `import { gameReducer } from '@/core'`).

## Convenciones
- Código (nombres) en inglés; comentarios, textos de UI y documentación en español.
- Pruebas en `__tests__/` junto al código, descripciones en español.

## Agentes especializados (`.claude/agents/`)
| Agente | Cuándo usarlo |
|---|---|
| `arquitecto` | Dónde va un archivo nuevo, capas, dependencias |
| `logica-juego` | Reglas de Tetris en `src/core` |
| `disenador-ui` | Pantallas, componentes, tema, gestos, accesibilidad |
| `tester` | Escribir/ampliar pruebas Jest |
| `revisor-clean-code` | Revisión final de calidad (solo lectura) |
| `documentador` | Mantener `docs/TUTORIAL.md` y `README.md` al día |
