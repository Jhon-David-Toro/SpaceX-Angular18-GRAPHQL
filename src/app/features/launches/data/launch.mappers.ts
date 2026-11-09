import type {
  LaunchArchiveQuery,
  LaunchDetailQuery,
} from '../../../core/graphql/generated/graphql';
import { compact, normalizeText, secureUrl, sum } from '../../../shared/util/collections';
import type {
  CoreFlight,
  LaunchDetail,
  LaunchLink,
  LaunchOutcome,
  LaunchSummary,
  PayloadInfo,
} from './launch.types';

type RawSummary = NonNullable<LaunchArchiveQuery['launchesPast']>[number];
type RawDetail = NonNullable<LaunchDetailQuery['launch']>;
type RawCore = NonNullable<
  NonNullable<NonNullable<NonNullable<RawDetail['rocket']>['first_stage']>['cores']>[number]
>;
type RawPayload = NonNullable<
  NonNullable<NonNullable<NonNullable<RawDetail['rocket']>['second_stage']>['payloads']>[number]
>;

/**
 * Converts a GraphQL boolean success flag to a typed LaunchOutcome.
 *
 * @param success - The success flag from the API (true, false, null, or undefined)
 * @returns 'success' if true, 'failure' if false, 'unknown' otherwise
 */
export function toOutcome(success: boolean | null | undefined): LaunchOutcome {
  if (success === true) {
    return 'success';
  }
  return success === false ? 'failure' : 'unknown';
}

/**
 * Transforms a raw launch summary from the GraphQL API into our domain model.
 * Filters out launches with missing required fields (id or date).
 *
 * @param raw - Raw launch data from the LaunchArchiveQuery
 * @returns LaunchSummary object or null if required fields are missing
 */
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

/**
 * Transforms the complete launch archive from GraphQL into a sorted array of summaries.
 * Filters out invalid launches and sorts by timestamp (newest first).
 *
 * @param data - Complete LaunchArchiveQuery result
 * @returns Sorted array of LaunchSummary objects
 */
export function toLaunchArchive(data: LaunchArchiveQuery): LaunchSummary[] {
  return compact(compact(data.launchesPast).map(toLaunchSummary)).sort(
    (a, b) => b.timestamp - a.timestamp,
  );
}

/**
 * Transforms a raw core (first stage booster) from the API into our domain model.
 *
 * @param raw - Raw core data from the GraphQL API
 * @returns CoreFlight object with landing information
 */
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

/**
 * Transforms a raw payload from the API into our domain model.
 *
 * @param raw - Raw payload data from the GraphQL API
 * @param index - Payload index for fallback ID generation
 * @returns PayloadInfo object with orbital parameters and customer information
 */
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

/**
 * Transforms a complete launch detail from the GraphQL API into our domain model.
 * Includes cores, payloads, links, images, and all metadata.
 * Filters out launches with missing required fields (id or date).
 *
 * @param data - Complete LaunchDetailQuery result
 * @returns LaunchDetail object or null if required fields are missing
 */
export function toLaunchDetail(data: LaunchDetailQuery): LaunchDetail | null {
  const raw = data.launch;
  if (!raw?.id || !raw.launch_date_utc) {
    return null;
  }

  // Build external links array from available sources
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
