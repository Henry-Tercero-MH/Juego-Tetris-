import { useEffect, useRef } from 'react';

/**
 * Ejecuta `callback` cada `delay` ms. Si `delay` es null, se detiene.
 * Guarda el callback en una ref para no reiniciar el intervalo en cada render.
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
