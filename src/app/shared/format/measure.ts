import type { UnitSystem } from '../../core/preferences/preferences';

const LOCALE = 'es';

const integer = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });
const compact = new Intl.NumberFormat(LOCALE, { notation: 'compact', maximumFractionDigits: 1 });
const usdCompact = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});
const percent = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 0 });

const DASH = '—';

export interface Measure {
  readonly metric: number | null | undefined;
  readonly imperial: number | null | undefined;
}

export function formatLength(value: Measure, units: UnitSystem): string {
  const n = units === 'metric' ? value.metric : value.imperial;
  if (n === null || n === undefined) {
    return DASH;
  }
  return `${oneDecimal.format(n)} ${units === 'metric' ? 'm' : 'ft'}`;
}

/** Masses above 10 t switch to tonnes / compact pounds to stay readable. */
export function formatMass(value: Measure, units: UnitSystem): string {
  const n = units === 'metric' ? value.metric : value.imperial;
  if (n === null || n === undefined) {
    return DASH;
  }
  if (units === 'metric') {
    return n >= 10_000 ? `${oneDecimal.format(n / 1000)} t` : `${integer.format(n)} kg`;
  }
  return n >= 10_000 ? `${compact.format(n)} lb` : `${integer.format(n)} lb`;
}

/** Converts kilograms when the API only gives one unit. */
export function massFromKg(kg: number | null | undefined): Measure {
  return { metric: kg, imperial: kg === null || kg === undefined ? kg : kg * 2.20462 };
}

export function formatDistanceKm(km: number | null | undefined, units: UnitSystem): string {
  if (km === null || km === undefined) {
    return DASH;
  }
  return units === 'metric' ? `${compact.format(km)} km` : `${compact.format(km * 0.621371)} mi`;
}

export function formatSpeedKph(kph: number | null | undefined, units: UnitSystem): string {
  if (kph === null || kph === undefined) {
    return DASH;
  }
  return units === 'metric'
    ? `${integer.format(kph)} km/h`
    : `${integer.format(kph * 0.621371)} mph`;
}

export function formatUsd(value: number | null | undefined): string {
  return value === null || value === undefined ? DASH : usdCompact.format(value);
}

export function formatPercent(ratio: number | null | undefined): string {
  return ratio === null || ratio === undefined ? DASH : percent.format(ratio);
}

export function formatInteger(value: number | null | undefined): string {
  return value === null || value === undefined ? DASH : integer.format(value);
}

export function formatDecimal(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined) {
    return DASH;
  }
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: digits }).format(value);
}

/** Thrust: kilonewtons (metric) or pounds-force (imperial). */
export function formatForce(value: Measure, units: UnitSystem): string {
  const n = units === 'metric' ? value.metric : value.imperial;
  if (n === null || n === undefined) {
    return DASH;
  }
  return units === 'metric' ? `${integer.format(n)} kN` : `${compact.format(n)} lbf`;
}
