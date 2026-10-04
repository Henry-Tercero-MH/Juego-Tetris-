import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/** Llama a `onBackground` cuando la app pasa a segundo plano (p. ej. llega una llamada). */
export function useAppBackground(onBackground: () => void): void {
  const savedCallback = useRef(onBackground);

  useEffect(() => {
    savedCallback.current = onBackground;
  }, [onBackground]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        savedCallback.current();
      }
    });
    return () => subscription.remove();
  }, []);
}
