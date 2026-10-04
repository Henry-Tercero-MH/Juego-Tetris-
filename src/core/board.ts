import { BOARD_COLS, BOARD_ROWS } from './constants';
import type { Board, Piece, Position, Shape } from './types';

export function createEmptyBoard(rows = BOARD_ROWS, cols = BOARD_COLS): Board {
  return Array.from({ length: rows }, () => Array<Board[number][number]>(cols).fill(null));
}

/**
 * Recorre cada bloque ocupado de una forma y entrega su posición absoluta
 * en el tablero. Centraliza el doble bucle que usan varias funciones.
 */
export function forEachBlock(
  shape: Shape,
  position: Position,
  callback: (x: number, y: number) => void,
): void {
  shape.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value) {
        callback(position.x + colIndex, position.y + rowIndex);
      }
    });
  });
}

/**
 * ¿Cabe la forma en esa posición?
 * Se permite que la pieza sobresalga por arriba (y < 0) mientras aparece.
 */
export function isValidPosition(board: Board, shape: Shape, position: Position): boolean {
  const cols = board[0].length;
  const rows = board.length;
  let valid = true;

  forEachBlock(shape, position, (x, y) => {
    if (x < 0 || x >= cols || y >= rows) {
      valid = false;
    } else if (y >= 0 && board[y][x] !== null) {
      valid = false;
    }
  });

  return valid;
}

/** Devuelve un tablero NUEVO con la pieza fijada (no muta el original). */
export function mergePiece(board: Board, piece: Piece): Board {
  const next = board.map((row) => [...row]);

  forEachBlock(piece.shape, piece.position, (x, y) => {
    if (y >= 0) {
      next[y][x] = piece.type;
    }
  });

  return next;
}

/** Elimina las filas completas y agrega filas vacías arriba. */
export function clearLines(board: Board): { board: Board; cleared: number } {
  const cols = board[0].length;
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const cleared = board.length - remaining.length;
  const emptyRows = createEmptyBoard(cleared, cols);

  return { board: [...emptyRows, ...remaining], cleared };
}

/** ¿Algún bloque de la pieza quedó por encima del tablero visible? */
export function isAboveBoard(piece: Piece): boolean {
  let above = false;
  forEachBlock(piece.shape, piece.position, (_x, y) => {
    if (y < 0) {
      above = true;
    }
  });
  return above;
}
