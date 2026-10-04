import { StyleSheet, View, type ViewProps } from 'react-native';

import type { RenderCell } from '@/core';
import { colors, radius } from '@/theme';

import { BoardCell } from './BoardCell';

interface BoardProps {
  grid: RenderCell[][];
  cellSize: number;
  /** Props de gestos (PanResponder) que se aplican sobre el tablero. */
  gestureHandlers?: ViewProps;
}

export function Board({ grid, cellSize, gestureHandlers }: BoardProps) {
  return (
    <View style={styles.board} {...gestureHandlers} accessibilityLabel="Tablero de juego">
      {grid.map((row, y) => (
        <View key={y} style={styles.row}>
          {row.map((cell, x) => (
            <BoardCell key={x} type={cell.type} isGhost={cell.isGhost} size={cellSize} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: colors.boardBackground,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
});
