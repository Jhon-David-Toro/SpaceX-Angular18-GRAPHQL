import { normalizeText } from '../../../shared/util/collections';
import type { LaunchOutcome, LaunchSummary } from './launch.model';

/**
 * Outcome filter option including 'all' to show all outcomes.
 */
export type OutcomeFilter = 'all' | LaunchOutcome;

/**
 * Available sort orders for the launch archive.
 */
export type LaunchSort = 'newest' | 'oldest' | 'heaviest';

/**
 * Complete filter and sort criteria for the launch archive.
 */
export interface LaunchCriteria {
  readonly query: string;
  /** Year to filter by. `0` means all years (signal forms bind selects to primitives). */
  readonly year: number;
  readonly outcome: OutcomeFilter;
  /** Rocket name to filter by. 'all' means all rockets. */
  readonly rocket: string;
  readonly sort: LaunchSort;
}

/**
 * Default criteria when no filters are applied.
 */
export const DEFAULT_CRITERIA: LaunchCriteria = {
  query: '',
  year: 0,
  outcome: 'all',
  rocket: 'all',
  sort: 'newest',
};

/**
 * Sort comparator functions for each LaunchSort option.
 */
const SORTERS: Record<LaunchSort, (a: LaunchSummary, b: LaunchSummary) => number> = {
  newest: (a, b) => b.timestamp - a.timestamp,
  oldest: (a, b) => a.timestamp - b.timestamp,
  heaviest: (a, b) => b.payloadMassKg - a.payloadMassKg,
};

/**
 * Filters and sorts launches based on criteria.
 * Pure and allocation-light so it can run on every keystroke inside a `computed`.
 *
 * @param launches - Complete array of launches to filter
 * @param criteria - Filter and sort criteria
 * @returns Filtered and sorted array (new array, original unchanged)
 */
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

/**
 * Type guard for OutcomeFilter values.
 * Used to validate untrusted URL query params.
 *
 * @param value - Value to check
 * @returns True if value is a valid OutcomeFilter
 */
export function isOutcomeFilter(value: unknown): value is OutcomeFilter {
  return value === 'all' || value === 'success' || value === 'failure' || value === 'unknown';
}

/**
 * Type guard for LaunchSort values.
 * Used to validate untrusted URL query params.
 *
 * @param value - Value to check
 * @returns True if value is a valid LaunchSort
 */
export function isLaunchSort(value: unknown): value is LaunchSort {
  return value === 'newest' || value === 'oldest' || value === 'heaviest';
}

/**
 * Builds LaunchCriteria from untrusted URL query params.
 * Validates and sanitizes all inputs, falling back to defaults for invalid values.
 *
 * @param params - URL query parameters (strings or undefined)
 * @returns Valid LaunchCriteria object
 */
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

/**
 * Serializes LaunchCriteria to URL query params.
 * Omits default values to keep URLs short and shareable.
 *
 * @param criteria - Criteria to serialize
 * @returns Object mapping param names to values (null removes the param)
 */
export function criteriaToParams(criteria: LaunchCriteria): Record<string, string | null> {
  return {
    q: criteria.query.trim() || null,
    year: criteria.year ? String(criteria.year) : null,
    outcome: criteria.outcome === 'all' ? null : criteria.outcome,
    rocket: criteria.rocket === 'all' ? null : criteria.rocket,
    sort: criteria.sort === 'newest' ? null : criteria.sort,
  };
}

/**
 * Aggregate statistics computed from a set of launches.
 */
export interface ArchiveStats {
  readonly total: number;
  readonly successes: number;
  readonly failures: number;
  /** Success rate as a decimal between 0 and 1 */
  readonly successRate: number;
  readonly firstYear: number | null;
  readonly lastYear: number | null;
  readonly totalPayloadKg: number;
  readonly busiestYear: { year: number; count: number } | null;
}

/**
 * Computes aggregate statistics from an array of launches.
 * Success rate excludes launches with unknown outcomes.
 *
 * @param launches - Array of launches to analyze
 * @returns ArchiveStats object with computed metrics
 */
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
