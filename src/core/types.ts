/**
 * Tipos compartidos por toda la lógica del juego.
 * Este archivo NO depende de React ni de React Native.
 */

/** Las 7 piezas clásicas de Tetris. */
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

/** Una celda del tablero: vacía (null) o ocupada por un tipo de pieza. */
export type Cell = TetrominoType | null;

/** Tablero indexado como board[fila][columna]. La fila 0 es la de arriba. */
export type Board = Cell[][];

/** Forma de una pieza: 1 = bloque, 0 = vacío. */
export type Shape = number[][];

export interface Position {
  x: number;
  y: number;
}

/** Pieza que está cayendo actualmente. */
export interface Piece {
  type: TetrominoType;
  shape: Shape;
  position: Position;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver';

export interface GameState {
  board: Board;
  current: Piece | null;
  /** Próximas piezas (la primera es la siguiente en salir). */
  queue: TetrominoType[];
  hold: TetrominoType | null;
  /** Evita guardar (hold) más de una vez por pieza. */
  canHold: boolean;
  score: number;
  lines: number;
  level: number;
  status: GameStatus;
  /** Semilla del generador aleatorio: hace que el reducer sea puro. */
  seed: number;
}

/** Celda lista para dibujar: combina tablero, pieza actual y "fantasma". */
export interface RenderCell {
  type: TetrominoType | null;
  isGhost: boolean;
}
