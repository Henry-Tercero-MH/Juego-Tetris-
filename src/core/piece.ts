import { isValidPosition } from './board';
import { TETROMINO_SHAPES } from './tetrominoes';
import type { Board, Piece, Position, Shape, TetrominoType } from './types';

/**
 * Desplazamientos que se prueban al rotar cuando la pieza choca
 * ("wall kicks" simplificados): primero en su lugar, luego a los lados
 * y por último un paso hacia arriba.
 */
const WALL_KICKS: readonly Position[] = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -2, y: 0 },
  { x: 2, y: 0 },
  { x: 0, y: -1 },
];

/** Crea una pieza centrada horizontalmente en la parte superior. */
export function spawnPiece(type: TetrominoType, boardCols: number): Piece {
  const shape = TETROMINO_SHAPES[type];
  const firstFilledRow = shape.findIndex((row) => row.some(Boolean));

  return {
    type,
    shape,
    position: {
      x: Math.floor((boardCols - shape[0].length) / 2),
      y: -firstFilledRow,
    },
  };
}

/** Gira una matriz 90° en sentido horario. */
export function rotateShapeClockwise(shape: Shape): Shape {
  return shape[0].map((_, colIndex) => shape.map((row) => row[colIndex]).reverse());
}

/** Intenta mover la pieza; si no cabe devuelve null. */
export function tryMove(board: Board, piece: Piece, dx: number, dy: number): Piece | null {
  const position = { x: piece.position.x + dx, y: piece.position.y + dy };
  return isValidPosition(board, piece.shape, position) ? { ...piece, position } : null;
}

/** Intenta rotar la pieza aplicando wall kicks; si no cabe devuelve null. */
export function tryRotate(board: Board, piece: Piece): Piece | null {
  const shape = rotateShapeClockwise(piece.shape);

  for (const kick of WALL_KICKS) {
    const position = { x: piece.position.x + kick.x, y: piece.position.y + kick.y };
    if (isValidPosition(board, shape, position)) {
      return { ...piece, shape, position };
    }
  }

  return null;
}

/** Posición final si la pieza cayera directo hacia abajo (para la "pieza fantasma"). */
export function getDropPosition(board: Board, piece: Piece): Position {
  let y = piece.position.y;
  while (isValidPosition(board, piece.shape, { x: piece.position.x, y: y + 1 })) {
    y++;
  }
  return { x: piece.position.x, y };
}
