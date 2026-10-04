import type { TextStyle } from 'react-native';

export const typography = {
  title: { fontSize: 32, fontWeight: '800', letterSpacing: 4 },
  subtitle: { fontSize: 16, fontWeight: '600' },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  value: { fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'] },
  button: { fontSize: 20, fontWeight: '700' },
} as const satisfies Record<string, TextStyle>;
