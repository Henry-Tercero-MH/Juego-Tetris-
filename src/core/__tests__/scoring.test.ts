import { getDropInterval, getLevel, getLineClearScore } from '../scoring';

describe('scoring', () => {
  it('multiplica los puntos por el nivel', () => {
    expect(getLineClearScore(1, 1)).toBe(100);
    expect(getLineClearScore(4, 1)).toBe(800);
    expect(getLineClearScore(4, 3)).toBe(2400);
    expect(getLineClearScore(0, 5)).toBe(0);
  });

  it('sube de nivel cada 10 líneas', () => {
    expect(getLevel(0)).toBe(1);
    expect(getLevel(9)).toBe(1);
    expect(getLevel(10)).toBe(2);
    expect(getLevel(25)).toBe(3);
  });

  it('acelera con el nivel sin bajar del mínimo', () => {
    expect(getDropInterval(1)).toBeGreaterThan(getDropInterval(2));
    expect(getDropInterval(100)).toBe(80);
  });
});
