import type { Shape, TetrominoType } from './types';

/**
 * Formas iniciales de cada pieza (orientación de aparición).
 * Los colores NO viven aquí: son responsabilidad del tema (src/theme).
 */
export const TETROMINO_SHAPES: Readonly<Record<TetrominoType, Shape>> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

export const ALL_TETROMINOES: readonly TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
