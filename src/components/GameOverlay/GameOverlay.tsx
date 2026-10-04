import { StyleSheet, Text, View } from 'react-native';

import type { GameStatus } from '@/core';
import { colors, spacing, typography } from '@/theme';

import { GameButton } from '../ui';

interface GameOverlayProps {
  status: GameStatus;
  score: number;
  onStart: () => void;
  onResume: () => void;
}

const CONTENT: Record<Exclude<GameStatus, 'playing'>, { title: string; button: string }> = {
  idle: { title: 'TETRIS', button: 'Jugar' },
  paused: { title: 'PAUSA', button: 'Continuar' },
  gameOver: { title: 'FIN DEL JUEGO', button: 'Jugar de nuevo' },
};

/** Capa encima del tablero para inicio, pausa y fin de partida. */
export function GameOverlay({ status, score, onStart, onResume }: GameOverlayProps) {
  if (status === 'playing') {
    return null;
  }

  const { title, button } = CONTENT[status];
  const onPress = status === 'paused' ? onResume : onStart;

  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>{title}</Text>
      {status === 'gameOver' && <Text style={styles.subtitle}>Puntuación: {score.toLocaleString()}</Text>}
      {status === 'idle' && (
        <Text style={styles.hint}>
          Desliza para mover · Toca para rotar{'\n'}Desliza rápido hacia abajo para soltar
        </Text>
      )}
      <GameButton label={button} accessibilityLabel={button} onPress={onPress} variant="primary" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  hint: {
    ...typography.subtitle,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
  },
});
