import { ALL_TETROMINOES } from './tetrominoes';
import type { TetrominoType } from './types';

/**
 * Generador pseudoaleatorio "mulberry32".
 * Recibe una semilla y devuelve un número en [0, 1) junto con la nueva semilla.
 * Al no usar Math.random() la lógica es determinista y fácil de probar.
 */
export function nextRandom(seed: number): { value: number; seed: number } {
  const nextSeed = (seed + 0x6d2b79f5) | 0;
  let t = nextSeed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { value, seed: nextSeed };
}

/**
 * "7-bag": baraja las 7 piezas y las entrega en ese orden.
 * Garantiza que nunca pasen demasiadas piezas sin ver una I.
 */
export function createBag(seed: number): { bag: TetrominoType[]; seed: number } {
  const bag = [...ALL_TETROMINOES];
  let currentSeed = seed;

  // Algoritmo de Fisher-Yates.
  for (let i = bag.length - 1; i > 0; i--) {
    const random = nextRandom(currentSeed);
    currentSeed = random.seed;
    const j = Math.floor(random.value * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }

  return { bag, seed: currentSeed };
}

/** Rellena la cola hasta tener al menos `minLength` piezas. */
export function fillQueue(
  queue: TetrominoType[],
  seed: number,
  minLength: number,
): { queue: TetrominoType[]; seed: number } {
  let filled = queue;
  let currentSeed = seed;

  while (filled.length < minLength) {
    const result = createBag(currentSeed);
    filled = [...filled, ...result.bag];
    currentSeed = result.seed;
  }

  return { queue: filled, seed: currentSeed };
}
