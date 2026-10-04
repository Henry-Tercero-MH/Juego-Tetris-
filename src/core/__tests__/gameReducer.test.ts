import { createEmptyBoard } from '../board';
import { createInitialState, gameReducer } from '../gameReducer';
import { selectNextPieces, selectRenderBoard } from '../selectors';
import type { GameState } from '../types';

function startedGame(seed = 1): GameState {
  return gameReducer(createInitialState(), { type: 'START', seed });
}

describe('gameReducer', () => {
  it('START crea una pieza y llena la vista previa', () => {
    const state = startedGame();
    expect(state.status).toBe('playing');
    expect(state.current).not.toBeNull();
    expect(selectNextPieces(state)).toHaveLength(3);
  });

  it('ignora movimientos si el juego no está en curso', () => {
    const idle = createInitialState();
    expect(gameReducer(idle, { type: 'MOVE_LEFT' })).toBe(idle);
  });

  it('PAUSE y RESUME alternan el estado', () => {
    const paused = gameReducer(startedGame(), { type: 'PAUSE' });
    expect(paused.status).toBe('paused');
    expect(gameReducer(paused, { type: 'TICK' })).toBe(paused);
    expect(gameReducer(paused, { type: 'RESUME' }).status).toBe('playing');
  });

  it('TICK baja la pieza una fila', () => {
    const state = startedGame();
    const next = gameReducer(state, { type: 'TICK' });
    expect(next.current!.position.y).toBe(state.current!.position.y + 1);
  });

  it('HARD_DROP fija la pieza, suma puntos y saca otra', () => {
    const state = startedGame();
    const next = gameReducer(state, { type: 'HARD_DROP' });
    expect(next.score).toBeGreaterThan(0);
    expect(next.board.flat().filter(Boolean)).toHaveLength(4);
    expect(next.current!.type).toBe(state.queue[0]);
  });

  it('elimina una línea completa y suma 100 puntos en nivel 1', () => {
    const board = createEmptyBoard();
    // Última fila llena excepto las 4 columnas centrales (3..6).
    board[19] = ['J', 'J', 'J', null, null, null, null, 'L', 'L', 'L'];
    const state: GameState = {
      ...startedGame(),
      board,
      current: {
        type: 'I',
        shape: [[1, 1, 1, 1]],
        position: { x: 3, y: 0 },
      },
      score: 0,
    };
    const next = gameReducer(state, { type: 'HARD_DROP' });
    expect(next.lines).toBe(1);
    expect(next.score).toBe(100 + 19 * 2);
    expect(next.board[19].every((cell) => cell === null)).toBe(true);
  });

  it('HOLD guarda la pieza y solo se puede usar una vez por pieza', () => {
    const state = startedGame();
    const held = gameReducer(state, { type: 'HOLD' });
    expect(held.hold).toBe(state.current!.type);
    expect(held.canHold).toBe(false);
    expect(gameReducer(held, { type: 'HOLD' })).toBe(held);
  });

  it('termina la partida cuando la pieza nueva no cabe', () => {
    // Filas superiores casi llenas (hueco en la columna 0 para que no se eliminen).
    const blockedBoard = createEmptyBoard().map((row, y) =>
      y < 2 ? row.map((_, x) => (x === 0 ? null : ('Z' as const))) : row,
    );
    const state: GameState = { ...startedGame(), board: blockedBoard };
    const next = gameReducer(
      { ...state, current: { ...state.current!, position: { x: 3, y: 17 } } },
      { type: 'HARD_DROP' },
    );
    expect(next.status).toBe('gameOver');
  });

  it('el tablero de render incluye la pieza actual y su fantasma', () => {
    const grid = selectRenderBoard(startedGame());
    const cells = grid.flat();
    expect(cells.filter((cell) => cell.type && !cell.isGhost)).toHaveLength(4);
    expect(cells.filter((cell) => cell.isGhost)).toHaveLength(4);
  });
});
