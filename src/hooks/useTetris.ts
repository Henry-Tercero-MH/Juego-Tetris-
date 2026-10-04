import { useCallback, useMemo, useReducer } from 'react';

import {
  createInitialState,
  gameReducer,
  getDropInterval,
  selectNextPieces,
  selectRenderBoard,
} from '@/core';

import { useAppBackground } from './useAppBackground';
import { useInterval } from './useInterval';

/**
 * Hook que conecta el núcleo del juego (puro) con React.
 * Los componentes solo ven datos listos para pintar y funciones de control.
 */
export function useTetris() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  const isPlaying = state.status === 'playing';
  useInterval(() => dispatch({ type: 'TICK' }), isPlaying ? getDropInterval(state.level) : null);

  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  useAppBackground(pause);

  // `dispatch` es estable, así que este objeto se crea una sola vez.
  const actions = useMemo(
    () => ({
      // La semilla se genera aquí (evento del usuario), no dentro del reducer, para que este siga siendo puro.
      start: () => dispatch({ type: 'START', seed: Date.now() }),
      pause,
      resume: () => dispatch({ type: 'RESUME' }),
      moveLeft: () => dispatch({ type: 'MOVE_LEFT' }),
      moveRight: () => dispatch({ type: 'MOVE_RIGHT' }),
      rotate: () => dispatch({ type: 'ROTATE' }),
      softDrop: () => dispatch({ type: 'SOFT_DROP' }),
      hardDrop: () => dispatch({ type: 'HARD_DROP' }),
      hold: () => dispatch({ type: 'HOLD' }),
    }),
    [pause],
  );

  const renderBoard = useMemo(() => selectRenderBoard(state), [state]);
  const nextPieces = useMemo(() => selectNextPieces(state), [state]);

  return {
    renderBoard,
    nextPieces,
    hold: state.hold,
    canHold: state.canHold,
    score: state.score,
    lines: state.lines,
    level: state.level,
    status: state.status,
    actions,
  };
}

export type TetrisActions = ReturnType<typeof useTetris>['actions'];
