import type { LaunchSummary } from '../app/features/launches/data/launch.model';
import { normalizeText } from '../app/shared/util/collections';

/** Builds a valid `LaunchSummary`, overriding only what a test cares about. */
export function launchSummary(overrides: Partial<LaunchSummary> = {}): LaunchSummary {
  const date = overrides.date ?? '2020-05-30T19:22:00.000Z';
  const base: LaunchSummary = {
    id: '1',
    name: 'Demo-2',
    date,
    timestamp: Date.parse(date),
    year: new Date(date).getUTCFullYear(),
    outcome: 'success',
    rocket: 'Falcon 9',
    site: 'KSC LC 39A',
    payloadMassKg: 12_055,
    orbits: ['ISS'],
    patch: null,
    image: null,
    details: null,
    searchText: '',
  };
  const merged = { ...base, ...overrides };
  return {
    ...merged,
    searchText:
      overrides.searchText ??
      normalizeText([merged.name, merged.rocket, merged.site, ...merged.orbits].join(' ')),
  };
}

export const SAMPLE_LAUNCHES: readonly LaunchSummary[] = [
  launchSummary({
    id: '1',
    name: 'FalconSat',
    date: '2006-03-24T22:30:00.000Z',
    outcome: 'failure',
    rocket: 'Falcon 1',
    site: 'Kwajalein Atoll',
    payloadMassKg: 20,
    orbits: ['LEO'],
  }),
  launchSummary({
    id: '2',
    name: 'Falcon Heavy Test Flight',
    date: '2018-02-06T20:45:00.000Z',
    rocket: 'Falcon Heavy',
    payloadMassKg: 1_350,
    orbits: ['HCO'],
  }),
  launchSummary({
    id: '3',
    name: 'Starlink-4',
    date: '2020-01-29T14:07:00.000Z',
    payloadMassKg: 15_600,
  }),
  launchSummary({
    id: '4',
    name: 'Demo-2',
    date: '2020-05-30T19:22:00.000Z',
    payloadMassKg: 12_055,
  }),
  launchSummary({
    id: '5',
    name: 'Sentinel-6 Michael Freilich',
    date: '2020-11-21T17:17:00.000Z',
    outcome: 'unknown',
    site: 'VAFB SLC 4E',
    payloadMassKg: 1_192,
    orbits: ['LEO'],
  }),
];
