import {
  BASE_DROP_INTERVAL_MS,
  DROP_INTERVAL_STEP_MS,
  LINES_PER_LEVEL,
  MIN_DROP_INTERVAL_MS,
} from './constants';

/** Puntos base por líneas eliminadas a la vez (0, 1, 2, 3 o 4 = "Tetris"). */
const LINE_CLEAR_POINTS = [0, 100, 300, 500, 800] as const;

export const SOFT_DROP_POINTS_PER_CELL = 1;
export const HARD_DROP_POINTS_PER_CELL = 2;

export function getLineClearScore(linesCleared: number, level: number): number {
  const base = LINE_CLEAR_POINTS[Math.min(linesCleared, 4)];
  return base * level;
}

/** El nivel empieza en 1 y sube cada LINES_PER_LEVEL líneas. */
export function getLevel(totalLines: number): number {
  return Math.floor(totalLines / LINES_PER_LEVEL) + 1;
}

/** Milisegundos entre cada caída automática según el nivel. */
export function getDropInterval(level: number): number {
  const interval = BASE_DROP_INTERVAL_MS - (level - 1) * DROP_INTERVAL_STEP_MS;
  return Math.max(MIN_DROP_INTERVAL_MS, interval);
}
