import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Board } from '@/components/Board';
import { ControlPad } from '@/components/ControlPad';
import { GameOverlay } from '@/components/GameOverlay';
import { PiecePreview } from '@/components/PiecePreview';
import { StatsPanel } from '@/components/StatsPanel';
import { GameButton, Panel } from '@/components/ui';
import { BOARD_COLS, BOARD_ROWS } from '@/core';
import { useSwipeControls, useTetris } from '@/hooks';
import { colors, spacing, typography } from '@/theme';

/** Espacio reservado (px) para las zonas que no son el tablero. */
const SIDE_COLUMN_WIDTH = 88;
const HEADER_HEIGHT = 56;
const CONTROLS_HEIGHT = 140;
const PREVIEW_CELL_SIZE = 14;

/** Calcula el tamaño de cada celda para que el tablero quepa en cualquier pantalla. */
function useCellSize(): number {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const availableWidth = width - spacing.lg * 3 - SIDE_COLUMN_WIDTH;
  const availableHeight =
    height - insets.top - insets.bottom - HEADER_HEIGHT - CONTROLS_HEIGHT - spacing.lg * 3;

  return Math.floor(Math.min(availableWidth / BOARD_COLS, availableHeight / BOARD_ROWS));
}

/** Pantalla principal: solo compone componentes, no contiene reglas del juego. */
export function GameScreen() {
  const insets = useSafeAreaInsets();
  const cellSize = useCellSize();
  const { renderBoard, nextPieces, hold, canHold, score, lines, level, status, actions } = useTetris();
  const isPlaying = status === 'playing';

  const swipe = useSwipeControls(actions);

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.title}>TETRIS</Text>
        <GameButton
          label="II"
          accessibilityLabel="Pausar"
          onPress={actions.pause}
          disabled={!isPlaying}
        />
      </View>

      <View style={styles.playArea}>
        <View>
          <Board grid={renderBoard} cellSize={cellSize} gestureHandlers={swipe.panHandlers} />
          <GameOverlay status={status} score={score} onStart={actions.start} onResume={actions.resume} />
        </View>

        <View style={styles.sideColumn}>
          <Panel title="Guardada">
            <PiecePreview type={hold} cellSize={PREVIEW_CELL_SIZE} dimmed={!canHold} />
          </Panel>
          <Panel title="Siguiente">
            {nextPieces.map((type, index) => (
              <PiecePreview key={index} type={type} cellSize={PREVIEW_CELL_SIZE} />
            ))}
          </Panel>
          <StatsPanel score={score} level={level} lines={lines} />
        </View>
      </View>

      <ControlPad actions={actions} disabled={!isPlaying} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.title,
    fontSize: 24,
    color: colors.textPrimary,
  },
  playArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  sideColumn: {
    width: SIDE_COLUMN_WIDTH,
    gap: spacing.sm,
  },
});
