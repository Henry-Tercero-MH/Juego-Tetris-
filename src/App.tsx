import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GameScreen } from '@/screens/GameScreen';

/** Raíz de la aplicación: proveedores globales + pantalla principal. */
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <GameScreen />
    </SafeAreaProvider>
  );
}
