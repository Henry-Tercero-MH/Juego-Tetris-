import { StyleSheet, View } from 'react-native';

import { TETROMINO_SHAPES, type TetrominoType } from '@/core';

import { BoardCell } from '../Board';

interface PiecePreviewProps {
  type: TetrominoType | null;
  cellSize: number;
  dimmed?: boolean;
}

/** Dibuja una pieza suelta (para "Siguiente" y "Guardada"), sin filas/columnas vacías. */
export function PiecePreview({ type, cellSize, dimmed = false }: PiecePreviewProps) {
  const boxSize = cellSize * 4;

  if (!type) {
    return <View style={{ width: boxSize, height: cellSize * 2 }} />;
  }

  const rows = TETROMINO_SHAPES[type].filter((row) => row.some(Boolean));

  return (
    <View style={[styles.container, { width: boxSize, height: cellSize * 2 }, dimmed && styles.dimmed]}>
      {rows.map((row, y) => (
        <View key={y} style={styles.row}>
          {row.map((value, x) => (
            <View key={x} style={{ width: cellSize, height: cellSize }}>
              {value ? <BoardCell type={type} size={cellSize} /> : null}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  dimmed: {
    opacity: 0.35,
  },
});
