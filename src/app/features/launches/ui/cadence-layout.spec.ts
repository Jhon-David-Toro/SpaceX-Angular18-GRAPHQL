import { SAMPLE_LAUNCHES } from '../../../../testing/launch-fixtures';
import { CADENCE_HEIGHT, CADENCE_WIDTH, layoutCadence, nearestTick } from './cadence-layout';

describe('layoutCadence', () => {
  const layout = layoutCadence(SAMPLE_LAUNCHES);

  it('orders ticks chronologically within the plot width', () => {
    const xs = layout.ticks.map((t) => t.x);
    expect(xs).toEqual([...xs].sort((a, b) => a - b));
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...xs)).toBeLessThanOrEqual(CADENCE_WIDTH);
    expect(layout.ticks[0]?.launch.id).toBe('1');
  });

  it('gives the heaviest payload the tallest line, within bounds', () => {
    const tallest = layout.ticks.reduce((a, b) => (b.height > a.height ? b : a));
    expect(tallest.launch.id).toBe('3');
    expect(tallest.height).toBeLessThan(CADENCE_HEIGHT);
    expect(Math.min(...layout.ticks.map((t) => t.height))).toBeGreaterThan(0);
  });

  it('labels every year in the range', () => {
    expect(layout.years.map((y) => y.year)).toEqual(Array.from({ length: 15 }, (_, i) => 2006 + i));
  });

  it('handles no data', () => {
    expect(layoutCadence([])).toEqual({ ticks: [], years: [] });
  });
});

describe('nearestTick', () => {
  it('finds the closest tick to a pointer position', () => {
    const { ticks } = layoutCadence(SAMPLE_LAUNCHES);
    expect(nearestTick(ticks, 0)).toBe(0);
    expect(nearestTick(ticks, CADENCE_WIDTH)).toBe(ticks.length - 1);
  });
});
