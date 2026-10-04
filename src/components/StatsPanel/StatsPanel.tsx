import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

import { Panel } from '../ui';

interface StatsPanelProps {
  score: number;
  level: number;
  lines: number;
}

export function StatsPanel({ score, level, lines }: StatsPanelProps) {
  return (
    <View style={styles.container}>
      <Stat title="Puntos" value={score} />
      <Stat title="Nivel" value={level} />
      <Stat title="Líneas" value={lines} />
    </View>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <Panel title={title}>
      <Text style={styles.value}>{value.toLocaleString()}</Text>
    </Panel>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  value: {
    ...typography.value,
    color: colors.textPrimary,
  },
});
