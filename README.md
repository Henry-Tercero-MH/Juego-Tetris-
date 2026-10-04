# 🎮 Tetris para móvil — React Native + Expo

Juego de Tetris para Android/iOS hecho con **React Native**, **Expo** y **TypeScript**, organizado con arquitectura en capas, pruebas unitarias y agentes de Claude Code especializados.

![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-000?logo=expo) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)

## 📱 Instalar en Android

Descarga desde el teléfono: **[tetris.apk](https://github.com/Henry-Tercero-MH/Juego-Tetris-/releases/latest/download/tetris.apk)** (se compila solo con GitHub Actions en cada cambio).

## Ejecutar en desarrollo

```bash
npm install
npm start          # escanea el QR con la app Expo Go en tu teléfono
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Inicia el servidor de desarrollo |
| `npm test` | Ejecuta las pruebas |
| `npm run typecheck` | Revisa los tipos de TypeScript |
| `npm run lint` | Revisa el estilo del código |

## Controles

- **Deslizar** izquierda/derecha: mover · **Deslizar abajo**: bajar · **Deslizar rápido abajo**: soltar
- **Tocar el tablero**: rotar · Botones en pantalla para todo lo anterior + **HOLD**

## 📘 Documentación

Todo el proyecto está explicado paso a paso en **[docs/TUTORIAL.md](docs/TUTORIAL.md)**: estructura de carpetas, qué hace cada archivo, cómo fluye la información, reglas del juego, convenciones y cómo usar los agentes.
