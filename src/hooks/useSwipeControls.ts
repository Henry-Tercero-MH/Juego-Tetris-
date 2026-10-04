import { useMemo } from 'react';
import { PanResponder, type PanResponderInstance } from 'react-native';

import type { TetrisActions } from './useTetris';

/** Píxeles que hay que arrastrar el dedo para mover la pieza una celda. */
const STEP_PX = 24;
/** Velocidad vertical (px/ms) a partir de la cual soltar el dedo cuenta como "caída rápida". */
const FLICK_VELOCITY = 1.2;
/** Movimiento máximo (px) para considerar el gesto como un toque. */
const TAP_SLOP_PX = 8;

/**
 * Crea el detector de gestos. Vive fuera del hook porque guarda variables
 * mutables (cuánto se ha arrastrado) que no forman parte del render.
 */
function createSwipeResponder(actions: TetrisActions): PanResponderInstance {
  let consumedX = 0;
  let consumedY = 0;

  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      consumedX = 0;
      consumedY = 0;
    },
    onPanResponderMove: (_event, gesture) => {
      while (gesture.dx - consumedX >= STEP_PX) {
        actions.moveRight();
        consumedX += STEP_PX;
      }
      while (gesture.dx - consumedX <= -STEP_PX) {
        actions.moveLeft();
        consumedX -= STEP_PX;
      }
      while (gesture.dy - consumedY >= STEP_PX) {
        actions.softDrop();
        consumedY += STEP_PX;
      }
    },
    onPanResponderRelease: (_event, gesture) => {
      const isTap = Math.abs(gesture.dx) < TAP_SLOP_PX && Math.abs(gesture.dy) < TAP_SLOP_PX;
      if (isTap) {
        actions.rotate();
      } else if (gesture.vy > FLICK_VELOCITY) {
        actions.hardDrop();
      }
    },
  });
}

/**
 * Gestos sobre el tablero:
 * - Arrastrar izquierda/derecha: mueve la pieza celda por celda.
 * - Arrastrar hacia abajo: baja la pieza (soft drop).
 * - Deslizar rápido hacia abajo y soltar: hard drop.
 * - Toque: rotar.
 */
export function useSwipeControls(actions: TetrisActions): PanResponderInstance {
  return useMemo(() => createSwipeResponder(actions), [actions]);
}
