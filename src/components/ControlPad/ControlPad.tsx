import { StyleSheet, View } from 'react-native';

import type { TetrisActions } from '@/hooks';
import { spacing } from '@/theme';

import { GameButton } from '../ui';

interface ControlPadProps {
  actions: TetrisActions;
  disabled: boolean;
}

/** Botones en pantalla. Complementan los gestos sobre el tablero. */
export function ControlPad({ actions, disabled }: ControlPadProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <GameButton label="HOLD" accessibilityLabel="Guardar pieza" onPress={actions.hold} disabled={disabled} />
        <GameButton label="↻" accessibilityLabel="Rotar" onPress={actions.rotate} disabled={disabled} />
        <GameButton label="⤓" accessibilityLabel="Caída rápida" onPress={actions.hardDrop} disabled={disabled} />
      </View>
      <View style={styles.row}>
        <GameButton label="◀" accessibilityLabel="Mover a la izquierda" onPress={actions.moveLeft} disabled={disabled} style={styles.wide} />
        <GameButton label="▼" accessibilityLabel="Bajar" onPress={actions.softDrop} disabled={disabled} style={styles.wide} />
        <GameButton label="▶" accessibilityLabel="Mover a la derecha" onPress={actions.moveRight} disabled={disabled} style={styles.wide} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  wide: {
    flex: 1,
  },
});
