/**
 * Punto de entrada público del núcleo del juego.
 * El resto de la app importa desde '@/core' y no desde archivos internos.
 */
export * from './constants';
export * from './types';
export { TETROMINO_SHAPES } from './tetrominoes';
export { createInitialState, gameReducer, type GameAction } from './gameReducer';
export { selectNextPieces, selectRenderBoard } from './selectors';
export { getDropInterval } from './scoring';
