import { createBag, fillQueue, nextRandom } from '../randomizer';

describe('randomizer', () => {
  it('es determinista para la misma semilla', () => {
    expect(nextRandom(42)).toEqual(nextRandom(42));
    expect(createBag(7).bag).toEqual(createBag(7).bag);
  });

  it('devuelve valores en [0, 1)', () => {
    let seed = 1;
    for (let i = 0; i < 1000; i++) {
      const result = nextRandom(seed);
      expect(result.value).toBeGreaterThanOrEqual(0);
      expect(result.value).toBeLessThan(1);
      seed = result.seed;
    }
  });

  it('cada bolsa contiene las 7 piezas exactamente una vez', () => {
    const { bag } = createBag(123);
    expect([...bag].sort()).toEqual(['I', 'J', 'L', 'O', 'S', 'T', 'Z']);
  });

  it('rellena la cola hasta el mínimo pedido', () => {
    const { queue } = fillQueue([], 5, 10);
    expect(queue.length).toBeGreaterThanOrEqual(10);
  });
});
