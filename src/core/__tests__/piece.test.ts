import { createEmptyBoard } from '../board';
import { getDropPosition, rotateShapeClockwise, spawnPiece, tryMove, tryRotate } from '../piece';

describe('piece', () => {
  it('aparece centrada y con su primera fila visible arriba', () => {
    const piece = spawnPiece('I', 10);
    expect(piece.position).toEqual({ x: 3, y: -1 });
  });

  it('rota una matriz en sentido horario', () => {
    expect(
      rotateShapeClockwise([
        [1, 0],
        [1, 1],
      ]),
    ).toEqual([
      [1, 1],
      [1, 0],
    ]);
  });

  it('no permite moverse fuera del tablero', () => {
    const board = createEmptyBoard();
    const piece = { ...spawnPiece('O', 10), position: { x: 0, y: 0 } };
    expect(tryMove(board, piece, -1, 0)).toBeNull();
    expect(tryMove(board, piece, 1, 0)?.position).toEqual({ x: 1, y: 0 });
  });

  it('aplica wall kick al rotar pegado a la pared', () => {
    const board = createEmptyBoard();
    const vertical = spawnPiece('I', 10);
    const rotated = tryRotate(board, vertical);
    expect(rotated).not.toBeNull();
    // Pegada a la pared derecha, la I vertical debe poder rotar empujándose a la izquierda.
    const atWall = { ...rotated!, position: { x: 7, y: 5 } };
    const kicked = tryRotate(board, atWall);
    expect(kicked).not.toBeNull();
    expect(kicked!.position.x).toBeLessThan(7);
  });

  it('calcula la posición de caída hasta el fondo', () => {
    const board = createEmptyBoard();
    const piece = { ...spawnPiece('O', 10), position: { x: 4, y: 0 } };
    expect(getDropPosition(board, piece)).toEqual({ x: 4, y: 18 });
  });
});
