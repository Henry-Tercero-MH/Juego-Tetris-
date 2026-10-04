import { clearLines, createEmptyBoard, isAboveBoard, isValidPosition, mergePiece } from './board';
import { BOARD_COLS, PREVIEW_COUNT } from './constants';
import { getDropPosition, spawnPiece, tryMove, tryRotate } from './piece';
import { fillQueue } from './randomizer';
import {
  getLevel,
  getLineClearScore,
  HARD_DROP_POINTS_PER_CELL,
  SOFT_DROP_POINTS_PER_CELL,
} from './scoring';
import type { GameState, Piece, TetrominoType } from './types';

/** Todas las acciones que el jugador (o el reloj del juego) pueden disparar. */
export type GameAction =
  | { type: 'START'; seed: number }
  | { type: 'TICK' }
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'SOFT_DROP' }
  | { type: 'HARD_DROP' }
  | { type: 'ROTATE' }
  | { type: 'HOLD' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' };

export function createInitialState(seed = 0): GameState {
  return {
    board: createEmptyBoard(),
    current: null,
    queue: [],
    hold: null,
    canHold: true,
    score: 0,
    lines: 0,
    level: 1,
    status: 'idle',
    seed,
  };
}

/** Coloca una pieza nueva arriba. Si no cabe, termina la partida. */
function placeNewPiece(state: GameState, type: TetrominoType): GameState {
  const piece = spawnPiece(type, BOARD_COLS);

  if (!isValidPosition(state.board, piece.shape, piece.position)) {
    return { ...state, current: null, status: 'gameOver' };
  }

  return { ...state, current: piece };
}

/** Saca la siguiente pieza de la cola (rellenándola si hace falta). */
function spawnFromQueue(state: GameState): GameState {
  const filled = fillQueue(state.queue, state.seed, PREVIEW_COUNT + 1);
  const [nextType, ...rest] = filled.queue;

  return placeNewPiece({ ...state, queue: rest, seed: filled.seed }, nextType);
}

/** Fija la pieza en el tablero, limpia líneas, suma puntos y saca la siguiente. */
function lockPiece(state: GameState, piece: Piece, bonusPoints = 0): GameState {
  const merged = mergePiece(state.board, piece);

  if (isAboveBoard(piece)) {
    return { ...state, board: merged, current: null, status: 'gameOver' };
  }

  const { board, cleared } = clearLines(merged);
  const lines = state.lines + cleared;

  return spawnFromQueue({
    ...state,
    board,
    lines,
    level: getLevel(lines),
    score: state.score + bonusPoints + getLineClearScore(cleared, state.level),
    canHold: true,
    current: null,
  });
}

/** Reemplaza la pieza actual si el movimiento es válido; si no, no cambia nada. */
function withPiece(state: GameState, piece: Piece | null): GameState {
  return piece ? { ...state, current: piece } : state;
}

function handleHold(state: GameState, current: Piece): GameState {
  if (!state.canHold) {
    return state;
  }

  const held = { ...state, hold: current.type, canHold: false };

  return state.hold === null ? spawnFromQueue(held) : placeNewPiece(held, state.hold);
}

/**
 * Reducer puro: (estado, acción) => nuevo estado.
 * Toda la "verdad" del juego pasa por aquí, lo que lo hace fácil de probar.
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      return spawnFromQueue({ ...createInitialState(action.seed), status: 'playing' });
    case 'PAUSE':
      return state.status === 'playing' ? { ...state, status: 'paused' } : state;
    case 'RESUME':
      return state.status === 'paused' ? { ...state, status: 'playing' } : state;
    default:
      break;
  }

  // El resto de acciones solo aplican mientras se está jugando.
  const { current } = state;
  if (state.status !== 'playing' || current === null) {
    return state;
  }

  switch (action.type) {
    case 'MOVE_LEFT':
      return withPiece(state, tryMove(state.board, current, -1, 0));
    case 'MOVE_RIGHT':
      return withPiece(state, tryMove(state.board, current, 1, 0));
    case 'ROTATE':
      return withPiece(state, tryRotate(state.board, current));
    case 'TICK': {
      const moved = tryMove(state.board, current, 0, 1);
      return moved ? { ...state, current: moved } : lockPiece(state, current);
    }
    case 'SOFT_DROP': {
      const moved = tryMove(state.board, current, 0, 1);
      return moved
        ? { ...state, current: moved, score: state.score + SOFT_DROP_POINTS_PER_CELL }
        : lockPiece(state, current);
    }
    case 'HARD_DROP': {
      const position = getDropPosition(state.board, current);
      const distance = position.y - current.position.y;
      return lockPiece(state, { ...current, position }, distance * HARD_DROP_POINTS_PER_CELL);
    }
    case 'HOLD':
      return handleHold(state, current);
    default:
      return state;
  }
}
