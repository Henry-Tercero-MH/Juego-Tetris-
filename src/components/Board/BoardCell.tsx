import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { TetrominoType } from '@/core';
import { colors, pieceColors } from '@/theme';

interface BoardCellProps {
  type: TetrominoType | null;
  isGhost?: boolean;
  size: number;
}

/** Un bloque del tablero. Memoizado: solo se vuelve a dibujar si cambian sus props. */
function BoardCellComponent({ type, isGhost = false, size }: BoardCellProps) {
  const color = type ? pieceColors[type] : undefined;

  return (
    <View
      style={[
        styles.cell,
        { width: size, height: size },
        color && !isGhost && { backgroundColor: color, borderColor: 'rgba(255,255,255,0.35)' },
        color && isGhost && { borderColor: color, opacity: 0.4 },
      ]}
    />
  );
}

export const BoardCell = memo(BoardCellComponent);

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    borderColor: colors.gridLine,
    borderRadius: 2,
  },
});
