import { SAMPLE_LAUNCHES } from '../../../../testing/launch-fixtures';
import {
  DEFAULT_CRITERIA,
  computeStats,
  criteriaFromParams,
  criteriaToParams,
  filterLaunches,
} from './launch-filters';

const ids = (list: readonly { id: string }[]) => list.map((l) => l.id);

describe('filterLaunches', () => {
  it('returns every launch, newest first, with default criteria', () => {
    expect(ids(filterLaunches(SAMPLE_LAUNCHES, DEFAULT_CRITERIA))).toEqual([
      '5',
      '4',
      '3',
      '2',
      '1',
    ]);
  });

  it('matches every search term, ignoring accents and case', () => {
    const result = filterLaunches(SAMPLE_LAUNCHES, { ...DEFAULT_CRITERIA, query: 'FALCÓN heavy' });
    expect(ids(result)).toEqual(['2']);
  });

  it('combines year, outcome and rocket filters', () => {
    const result = filterLaunches(SAMPLE_LAUNCHES, {
      ...DEFAULT_CRITERIA,
      year: 2020,
      outcome: 'success',
      rocket: 'Falcon 9',
    });
    expect(ids(result)).toEqual(['4', '3']);
  });

  it('sorts by payload mass', () => {
    const result = filterLaunches(SAMPLE_LAUNCHES, { ...DEFAULT_CRITERIA, sort: 'heaviest' });
    expect(ids(result).slice(0, 2)).toEqual(['3', '4']);
  });

  it('does not mutate its input', () => {
    const copy = [...SAMPLE_LAUNCHES];
    filterLaunches(SAMPLE_LAUNCHES, { ...DEFAULT_CRITERIA, sort: 'oldest' });
    expect(SAMPLE_LAUNCHES).toEqual(copy);
  });
});

describe('criteria ↔ URL params', () => {
  it('omits defaults so shared URLs stay short', () => {
    expect(criteriaToParams(DEFAULT_CRITERIA)).toEqual({
      q: null,
      year: null,
      outcome: null,
      rocket: null,
      sort: null,
    });
  });

  it('round-trips non-default criteria', () => {
    const criteria = {
      query: 'crs',
      year: 2019,
      outcome: 'failure',
      rocket: 'Falcon 9',
      sort: 'oldest',
    } as const;
    const params = criteriaToParams(criteria);
    expect(
      criteriaFromParams({
        q: params['q'] ?? undefined,
        year: params['year'] ?? undefined,
        outcome: params['outcome'] ?? undefined,
        rocket: params['rocket'] ?? undefined,
        sort: params['sort'] ?? undefined,
      }),
    ).toEqual(criteria);
  });

  it('falls back to defaults for untrusted values', () => {
    expect(criteriaFromParams({ year: 'abc', outcome: 'maybe', sort: 'random' })).toEqual(
      DEFAULT_CRITERIA,
    );
  });
});

describe('computeStats', () => {
  it('summarises the archive', () => {
    const stats = computeStats(SAMPLE_LAUNCHES);
    expect(stats.total).toBe(5);
    expect(stats.successes).toBe(3);
    expect(stats.failures).toBe(1);
    // Unknown outcomes are excluded from the rate.
    expect(stats.successRate).toBe(0.75);
    expect(stats.firstYear).toBe(2006);
    expect(stats.lastYear).toBe(2020);
    expect(stats.busiestYear).toEqual({ year: 2020, count: 3 });
  });

  it('handles an empty archive', () => {
    const stats = computeStats([]);
    expect(stats.successRate).toBe(0);
    expect(stats.firstYear).toBeNull();
    expect(stats.busiestYear).toBeNull();
  });
});
