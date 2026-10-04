import { clearLines, createEmptyBoard, isValidPosition, mergePiece } from '../board';
import type { Piece } from '../types';

const square: Piece = {
  type: 'O',
  shape: [
    [1, 1],
    [1, 1],
  ],
  position: { x: 0, y: 0 },
};

describe('board', () => {
  it('crea un tablero vacío de 20x10', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(20);
    expect(board[0]).toHaveLength(10);
    expect(board.flat().every((cell) => cell === null)).toBe(true);
  });

  it('detecta posiciones fuera del tablero', () => {
    const board = createEmptyBoard();
    expect(isValidPosition(board, square.shape, { x: -1, y: 0 })).toBe(false);
    expect(isValidPosition(board, square.shape, { x: 9, y: 0 })).toBe(false);
    expect(isValidPosition(board, square.shape, { x: 0, y: 19 })).toBe(false);
    expect(isValidPosition(board, square.shape, { x: 8, y: 18 })).toBe(true);
  });

  it('permite que la pieza sobresalga por arriba', () => {
    const board = createEmptyBoard();
    expect(isValidPosition(board, square.shape, { x: 0, y: -1 })).toBe(true);
  });

  it('detecta choques con bloques existentes', () => {
    const board = mergePiece(createEmptyBoard(), square);
    expect(isValidPosition(board, square.shape, { x: 1, y: 1 })).toBe(false);
    expect(isValidPosition(board, square.shape, { x: 2, y: 0 })).toBe(true);
  });

  it('mergePiece no muta el tablero original', () => {
    const board = createEmptyBoard();
    const merged = mergePiece(board, square);
    expect(board[0][0]).toBeNull();
    expect(merged[0][0]).toBe('O');
  });

  it('elimina filas completas y baja el resto', () => {
    const board = createEmptyBoard(4, 3);
    board[3] = ['I', 'I', 'I'];
    board[2] = ['T', null, null];
    const result = clearLines(board);
    expect(result.cleared).toBe(1);
    expect(result.board[3]).toEqual(['T', null, null]);
    expect(result.board[0]).toEqual([null, null, null]);
  });
});
