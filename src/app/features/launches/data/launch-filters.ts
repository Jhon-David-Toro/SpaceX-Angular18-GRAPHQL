import { normalizeText } from '../../../shared/util/collections';
import type { LaunchOutcome, LaunchSummary } from './launch.model';

export type OutcomeFilter = 'all' | LaunchOutcome;
export type LaunchSort = 'newest' | 'oldest' | 'heaviest';

export interface LaunchCriteria {
  readonly query: string;
  /** `0` means every year (signal forms bind selects to primitives). */
  readonly year: number;
  readonly outcome: OutcomeFilter;
  readonly rocket: string;
  readonly sort: LaunchSort;
}

export const DEFAULT_CRITERIA: LaunchCriteria = {
  query: '',
  year: 0,
  outcome: 'all',
  rocket: 'all',
  sort: 'newest',
};

const SORTERS: Record<LaunchSort, (a: LaunchSummary, b: LaunchSummary) => number> = {
  newest: (a, b) => b.timestamp - a.timestamp,
  oldest: (a, b) => a.timestamp - b.timestamp,
  heaviest: (a, b) => b.payloadMassKg - a.payloadMassKg,
};

/** Pure, allocation-light filtering so it can run on every keystroke inside a `computed`. */
export function filterLaunches(
  launches: readonly LaunchSummary[],
  criteria: LaunchCriteria,
): LaunchSummary[] {
  const terms = normalizeText(criteria.query).split(/\s+/).filter(Boolean);
  return launches
    .filter(
      (launch) =>
        (criteria.year === 0 || launch.year === criteria.year) &&
        (criteria.outcome === 'all' || launch.outcome === criteria.outcome) &&
        (criteria.rocket === 'all' || launch.rocket === criteria.rocket) &&
        terms.every((term) => launch.searchText.includes(term)),
    )
    .sort(SORTERS[criteria.sort]);
}

export function isOutcomeFilter(value: unknown): value is OutcomeFilter {
  return value === 'all' || value === 'success' || value === 'failure' || value === 'unknown';
}

export function isLaunchSort(value: unknown): value is LaunchSort {
  return value === 'newest' || value === 'oldest' || value === 'heaviest';
}

/** Builds criteria from untrusted URL query params. */
export function criteriaFromParams(params: {
  q?: string | undefined;
  year?: string | undefined;
  outcome?: string | undefined;
  rocket?: string | undefined;
  sort?: string | undefined;
}): LaunchCriteria {
  const year = Number(params.year);
  return {
    query: params.q ?? '',
    year: Number.isInteger(year) && year > 2000 ? year : 0,
    outcome: isOutcomeFilter(params.outcome) ? params.outcome : 'all',
    rocket: params.rocket ?? 'all',
    sort: isLaunchSort(params.sort) ? params.sort : 'newest',
  };
}

/** Serialises criteria to query params, omitting defaults to keep URLs short and shareable. */
export function criteriaToParams(criteria: LaunchCriteria): Record<string, string | null> {
  return {
    q: criteria.query.trim() || null,
    year: criteria.year ? String(criteria.year) : null,
    outcome: criteria.outcome === 'all' ? null : criteria.outcome,
    rocket: criteria.rocket === 'all' ? null : criteria.rocket,
    sort: criteria.sort === 'newest' ? null : criteria.sort,
  };
}

export interface ArchiveStats {
  readonly total: number;
  readonly successes: number;
  readonly failures: number;
  readonly successRate: number;
  readonly firstYear: number | null;
  readonly lastYear: number | null;
  readonly totalPayloadKg: number;
  readonly busiestYear: { year: number; count: number } | null;
}

export function computeStats(launches: readonly LaunchSummary[]): ArchiveStats {
  const successes = launches.filter((l) => l.outcome === 'success').length;
  const failures = launches.filter((l) => l.outcome === 'failure').length;
  const perYear = new Map<number, number>();
  let totalPayloadKg = 0;
  for (const launch of launches) {
    perYear.set(launch.year, (perYear.get(launch.year) ?? 0) + 1);
    totalPayloadKg += launch.payloadMassKg;
  }
  let busiestYear: ArchiveStats['busiestYear'] = null;
  for (const [year, count] of perYear) {
    if (!busiestYear || count > busiestYear.count) {
      busiestYear = { year, count };
    }
  }
  const years = [...perYear.keys()];
  const decided = successes + failures;
  return {
    total: launches.length,
    successes,
    failures,
    successRate: decided === 0 ? 0 : successes / decided,
    firstYear: years.length ? Math.min(...years) : null,
    lastYear: years.length ? Math.max(...years) : null,
    totalPayloadKg,
    busiestYear,
  };
}
