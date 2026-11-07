import type {
  LaunchArchiveQuery,
  LaunchDetailQuery,
} from '../../../core/graphql/generated/graphql';
import { toLaunchArchive, toLaunchDetail, toOutcome } from './launch.model';

type RawLaunch = NonNullable<NonNullable<LaunchArchiveQuery['launchesPast']>[number]>;

function rawLaunch(overrides: Partial<RawLaunch> = {}): RawLaunch {
  return {
    id: '100',
    mission_name: 'CRS-20',
    launch_date_utc: '2020-03-07T04:50:31.000Z',
    launch_success: true,
    details: 'Última misión de Dragon 1.',
    launch_site: { site_id: 'ccafs_slc_40', site_name: 'CCAFS SLC 40' },
    rocket: {
      rocket_name: 'Falcon 9',
      second_stage: {
        payloads: [
          { id: 'CRS-20', payload_mass_kg: 1977, orbit: 'ISS' },
          null,
          { id: 'Bartolomeo', payload_mass_kg: 400, orbit: 'ISS' },
        ],
      },
    },
    links: {
      mission_patch_small: 'http://images2.imgbox.com/patch.png',
      flickr_images: ['https://live.staticflickr.com/1.jpg'],
    },
    ...overrides,
  };
}

describe('toOutcome', () => {
  it('maps nullable booleans to explicit outcomes', () => {
    expect(toOutcome(true)).toBe('success');
    expect(toOutcome(false)).toBe('failure');
    expect(toOutcome(null)).toBe('unknown');
    expect(toOutcome(undefined)).toBe('unknown');
  });
});

describe('toLaunchArchive', () => {
  it('normalises nullable GraphQL data into a clean domain model', () => {
    const [launch] = toLaunchArchive({ launchesPast: [rawLaunch()] });
    expect(launch).toMatchObject({
      id: '100',
      name: 'CRS-20',
      year: 2020,
      outcome: 'success',
      rocket: 'Falcon 9',
      payloadMassKg: 2377,
      orbits: ['ISS'],
      patch: 'https://images2.imgbox.com/patch.png',
      image: 'https://live.staticflickr.com/1.jpg',
    });
  });

  it('drops holes and records without id or date, and sorts newest first', () => {
    const result = toLaunchArchive({
      launchesPast: [
        rawLaunch({ id: 'old', launch_date_utc: '2010-06-04T18:45:00.000Z' }),
        null,
        rawLaunch({ id: null }),
        rawLaunch({ id: 'new', launch_date_utc: '2021-01-01T00:00:00.000Z' }),
        rawLaunch({ id: 'no-date', launch_date_utc: null }),
      ],
    });
    expect(result.map((l) => l.id)).toEqual(['new', 'old']);
  });

  it('builds an accent-insensitive search haystack', () => {
    const [launch] = toLaunchArchive({ launchesPast: [rawLaunch({ details: 'Misión ÉPICA' })] });
    expect(launch?.searchText).toContain('mision epica');
  });

  it('returns an empty list when the API sends null', () => {
    expect(toLaunchArchive({ launchesPast: null })).toEqual([]);
  });
});

describe('toLaunchDetail', () => {
  const detail: LaunchDetailQuery = {
    launch: {
      id: '100',
      mission_name: 'CRS-20',
      launch_date_utc: '2020-03-07T04:50:31.000Z',
      launch_success: true,
      details: null,
      launch_site: {
        site_id: 'x',
        site_name: 'CCAFS SLC 40',
        site_name_long: 'Cape Canaveral SLC 40',
      },
      links: {
        article_link: null,
        video_link: 'https://youtu.be/1MkcWK2PnsU',
        wikipedia: 'http://en.wikipedia.org/wiki/CRS-20',
        presskit: null,
        mission_patch: null,
        flickr_images: [],
      },
      rocket: {
        rocket_name: 'Falcon 9',
        rocket_type: 'FT',
        rocket: { id: 'falcon9' },
        first_stage: {
          cores: [
            {
              flight: 2,
              block: 5,
              reused: true,
              land_success: true,
              landing_intent: true,
              landing_type: 'RTLS',
              landing_vehicle: 'LZ-1',
              core: { id: 'B1059', status: 'lost', reuse_count: 1 },
            },
          ],
        },
        second_stage: { block: 5, payloads: [] },
        fairings: null,
      },
      ships: [{ id: 'GOQUEST', name: 'GO Quest', image: null }],
    },
  };

  it('maps cores, links and ships', () => {
    const result = toLaunchDetail(detail);
    expect(result?.cores[0]).toMatchObject({ serial: 'B1059', reused: true, landing: 'success' });
    expect(result?.links).toEqual([
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/CRS-20' },
    ]);
    expect(result?.ships).toEqual(['GO Quest']);
    expect(result?.rocketId).toBe('falcon9');
    expect(result?.fairingsRecovered).toBeNull();
  });

  it('returns null for a missing launch', () => {
    expect(toLaunchDetail({ launch: null })).toBeNull();
  });
});
