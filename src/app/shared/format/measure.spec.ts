import {
  formatDistanceKm,
  formatLength,
  formatMass,
  formatPercent,
  formatUsd,
  massFromKg,
} from './measure';

// Intl output uses narrow no-break spaces in some locales; compare on normalised whitespace.
const plain = (value: string) => value.replace(/\s/g, ' ');

describe('measure formatting', () => {
  it('formats lengths in the chosen unit system', () => {
    expect(plain(formatLength({ metric: 70, imperial: 229.6 }, 'metric'))).toBe('70 m');
    expect(plain(formatLength({ metric: 70, imperial: 229.6 }, 'imperial'))).toBe('229,6 ft');
  });

  it('switches to tonnes for heavy masses', () => {
    expect(plain(formatMass({ metric: 549_054, imperial: 1_207_920 }, 'metric'))).toBe('549,1 t');
    expect(plain(formatMass({ metric: 400, imperial: 882 }, 'metric'))).toBe('400 kg');
  });

  it('converts kilograms when only metric data exists', () => {
    expect(massFromKg(100).imperial).toBeCloseTo(220.462);
    expect(massFromKg(null)).toEqual({ metric: null, imperial: null });
  });

  it('shows a dash for missing values', () => {
    expect(formatLength({ metric: null, imperial: null }, 'metric')).toBe('—');
    expect(formatUsd(undefined)).toBe('—');
    expect(formatDistanceKm(null, 'imperial')).toBe('—');
  });

  it('formats ratios as percentages', () => {
    expect(plain(formatPercent(0.975))).toMatch(/98 ?%/);
  });
});
