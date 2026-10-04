import type { TetrominoType } from '@/core';

/** Paleta general de la app (tema oscuro tipo arcade). */
export const colors = {
  background: '#0B0E1A',
  surface: '#151A2E',
  surfaceAlt: '#1E2540',
  border: '#2C3560',
  boardBackground: '#0F1324',
  gridLine: '#1A2038',
  textPrimary: '#F2F4FF',
  textSecondary: '#8A93B8',
  accent: '#7C5CFF',
  accentPressed: '#5B3FE0',
  overlay: 'rgba(5, 7, 15, 0.85)',
} as const;

/** Color de cada pieza (colores estándar de la Tetris Guideline). */
export const pieceColors: Readonly<Record<TetrominoType, string>> = {
  I: '#00E5FF',
  O: '#FFD600',
  T: '#B04BFF',
  S: '#2EE66B',
  Z: '#FF3D57',
  J: '#3D7BFF',
  L: '#FF9F1C',
};
