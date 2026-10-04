import { forEachBlock } from './board';
import { PREVIEW_COUNT } from './constants';
import { getDropPosition } from './piece';
import type { GameState, RenderCell, TetrominoType } from './types';

/**
 * Construye la matriz que la UI dibuja: tablero fijo + pieza fantasma + pieza actual.
 * La UI no necesita saber cómo se calcula, solo pinta el resultado.
 */
export function selectRenderBoard(state: GameState): RenderCell[][] {
  const grid: RenderCell[][] = state.board.map((row) =>
    row.map((type) => ({ type, isGhost: false })),
  );
  const { current } = state;

  if (!current) {
    return grid;
  }

  const paint = (x: number, y: number, isGhost: boolean) => {
    if (y >= 0 && y < grid.length) {
      grid[y][x] = { type: current.type, isGhost };
    }
  };

  const ghostPosition = getDropPosition(state.board, current);
  forEachBlock(current.shape, ghostPosition, (x, y) => paint(x, y, true));
  forEachBlock(current.shape, current.position, (x, y) => paint(x, y, false));

  return grid;
}

export function selectNextPieces(state: GameState): TetrominoType[] {
  return state.queue.slice(0, PREVIEW_COUNT);
}
