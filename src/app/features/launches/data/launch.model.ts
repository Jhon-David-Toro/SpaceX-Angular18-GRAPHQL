import type {
  LaunchArchiveQuery,
  LaunchDetailQuery,
} from '../../../core/graphql/generated/graphql';
import type { Measure } from '../../../shared/format/measure';
import { compact, normalizeText, secureUrl, sum } from '../../../shared/util/collections';

export type LaunchOutcome = 'success' | 'failure' | 'unknown';

export interface LaunchSummary {
  readonly id: string;
  readonly name: string;
  /** ISO-8601, UTC. */
  readonly date: string;
  readonly timestamp: number;
  readonly year: number;
  readonly outcome: LaunchOutcome;
  readonly rocket: string;
  readonly site: string;
  readonly payloadMassKg: number;
  readonly orbits: readonly string[];
  readonly patch: string | null;
  readonly image: string | null;
  readonly details: string | null;
  /** Pre-computed haystack for accent-insensitive search. */
  readonly searchText: string;
}

type RawSummary = NonNullable<LaunchArchiveQuery['launchesPast']>[number];

export function toOutcome(success: boolean | null | undefined): LaunchOutcome {
  if (success === true) {
    return 'success';
  }
  return success === false ? 'failure' : 'unknown';
}

export function toLaunchSummary(raw: NonNullable<RawSummary>): LaunchSummary | null {
  if (!raw.id || !raw.launch_date_utc) {
    return null;
  }
  const date = new Date(raw.launch_date_utc);
  const payloads = compact(raw.rocket?.second_stage?.payloads);
  const name = raw.mission_name ?? 'Misión sin nombre';
  const rocket = raw.rocket?.rocket_name ?? 'Desconocido';
  const site = raw.launch_site?.site_name ?? 'Sitio desconocido';
  const orbits = [...new Set(compact(payloads.map((p) => p.orbit)))];

  return {
    id: raw.id,
    name,
    date: date.toISOString(),
    timestamp: date.getTime(),
    year: date.getUTCFullYear(),
    outcome: toOutcome(raw.launch_success),
    rocket,
    site,
    payloadMassKg: sum(payloads.map((p) => p.payload_mass_kg ?? 0)),
    orbits,
    patch: secureUrl(raw.links?.mission_patch_small),
    image: secureUrl(compact(raw.links?.flickr_images)[0]),
    details: raw.details ?? null,
    searchText: normalizeText([name, rocket, site, ...orbits, raw.details ?? ''].join(' ')),
  };
}

export function toLaunchArchive(data: LaunchArchiveQuery): LaunchSummary[] {
  return compact(compact(data.launchesPast).map(toLaunchSummary)).sort(
    (a, b) => b.timestamp - a.timestamp,
  );
}

type RawDetail = NonNullable<LaunchDetailQuery['launch']>;
type RawCore = NonNullable<
  NonNullable<NonNullable<NonNullable<RawDetail['rocket']>['first_stage']>['cores']>[number]
>;
type RawPayload = NonNullable<
  NonNullable<NonNullable<NonNullable<RawDetail['rocket']>['second_stage']>['payloads']>[number]
>;

export interface CoreFlight {
  readonly serial: string;
  readonly flight: number | null;
  readonly block: number | null;
  readonly reused: boolean;
  readonly landing: LaunchOutcome | 'none';
  readonly landingType: string | null;
  readonly landingVehicle: string | null;
}

export interface PayloadInfo {
  readonly id: string;
  readonly type: string | null;
  readonly mass: Measure;
  readonly orbit: string | null;
  readonly regime: string | null;
  readonly periapsisKm: number | null;
  readonly apoapsisKm: number | null;
  readonly inclinationDeg: number | null;
  readonly customers: readonly string[];
  readonly manufacturer: string | null;
  readonly nationality: string | null;
}

export interface LaunchLink {
  readonly label: string;
  readonly url: string;
}

export interface LaunchDetail {
  readonly id: string;
  readonly name: string;
  readonly date: string;
  readonly outcome: LaunchOutcome;
  readonly details: string | null;
  readonly site: string;
  readonly siteLong: string | null;
  readonly rocket: string;
  readonly rocketId: string | null;
  readonly rocketType: string | null;
  readonly patch: string | null;
  readonly images: readonly string[];
  readonly videoUrl: string | null;
  readonly links: readonly LaunchLink[];
  readonly cores: readonly CoreFlight[];
  readonly payloads: readonly PayloadInfo[];
  readonly fairingsRecovered: boolean | null;
  readonly ships: readonly string[];
}

function toCore(raw: RawCore): CoreFlight {
  let landing: CoreFlight['landing'] = 'none';
  if (raw.landing_intent) {
    landing = toOutcome(raw.land_success);
  }
  return {
    serial: raw.core?.id ?? 'Sin serie',
    flight: raw.flight,
    block: raw.block,
    reused: raw.reused ?? false,
    landing,
    landingType: raw.landing_type,
    landingVehicle: raw.landing_vehicle,
  };
}

function toPayload(raw: RawPayload, index: number): PayloadInfo {
  return {
    id: raw.id ?? `Carga ${index + 1}`,
    type: raw.payload_type,
    mass: { metric: raw.payload_mass_kg, imperial: raw.payload_mass_lbs },
    orbit: raw.orbit,
    regime: raw.orbit_params?.regime ?? null,
    periapsisKm: raw.orbit_params?.periapsis_km ?? null,
    apoapsisKm: raw.orbit_params?.apoapsis_km ?? null,
    inclinationDeg: raw.orbit_params?.inclination_deg ?? null,
    customers: compact(raw.customers),
    manufacturer: raw.manufacturer,
    nationality: raw.nationality,
  };
}

export function toLaunchDetail(data: LaunchDetailQuery): LaunchDetail | null {
  const raw = data.launch;
  if (!raw?.id || !raw.launch_date_utc) {
    return null;
  }
  const links: LaunchLink[] = [];
  const candidates: [string, string | null | undefined][] = [
    ['Artículo', raw.links?.article_link],
    ['Wikipedia', raw.links?.wikipedia],
    ['Kit de prensa', raw.links?.presskit],
  ];
  for (const [label, url] of candidates) {
    const safe = secureUrl(url);
    if (safe) {
      links.push({ label, url: safe });
    }
  }

  return {
    id: raw.id,
    name: raw.mission_name ?? 'Misión sin nombre',
    date: new Date(raw.launch_date_utc).toISOString(),
    outcome: toOutcome(raw.launch_success),
    details: raw.details,
    site: raw.launch_site?.site_name ?? 'Sitio desconocido',
    siteLong: raw.launch_site?.site_name_long ?? null,
    rocket: raw.rocket?.rocket_name ?? 'Desconocido',
    rocketId: raw.rocket?.rocket?.id ?? null,
    rocketType: raw.rocket?.rocket_type ?? null,
    patch: secureUrl(raw.links?.mission_patch),
    images: compact(compact(raw.links?.flickr_images).map(secureUrl)),
    videoUrl: secureUrl(raw.links?.video_link),
    links,
    cores: compact(raw.rocket?.first_stage?.cores).map(toCore),
    payloads: compact(raw.rocket?.second_stage?.payloads).map(toPayload),
    fairingsRecovered: raw.rocket?.fairings?.recovery_attempt
      ? (raw.rocket.fairings.recovered ?? null)
      : null,
    ships: compact(compact(raw.ships).map((s) => s.name)),
  };
}
