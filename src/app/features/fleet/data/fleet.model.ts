import type { FleetQuery } from '../../../core/graphql/generated/graphql';
import type { Measure } from '../../../shared/format/measure';
import { compact, secureUrl } from '../../../shared/util/collections';

/**
 * SpaceX recovery fleet ship with complete specifications.
 */
export interface ShipModel {
  readonly id: string;
  readonly name: string;
  readonly type: string | null;
  readonly roles: readonly string[];
  readonly active: boolean;
  readonly homePort: string | null;
  readonly yearBuilt: number | null;
  readonly image: string | null;
  readonly weight: Measure;
  /** Landing statistics, null if ship has never attempted a landing */
  readonly landings: { readonly successful: number; readonly attempted: number } | null;
  /** Number of missions this ship has supported */
  readonly missions: number;
}

type RawShip = NonNullable<NonNullable<FleetQuery['ships']>[number]>;

/**
 * Localized (Spanish) names for ship roles.
 * Maps English API role names to Spanish display names.
 */
const ROLE_NAMES: Record<string, string> = {
  'ASDS barge': 'Plataforma de aterrizaje',
  'Fairing Recovery': 'Recuperación de cofias',
  'Support Ship': 'Apoyo',
  'Dragon Recovery': 'Recuperación de Dragon',
  'Main Ship': 'Barco principal',
  Tug: 'Remolcador',
  'Barge Tug': 'Remolcador de barcaza',
};

/**
 * Translates a ship role from English to Spanish.
 * Falls back to the original role name if no translation exists.
 *
 * @param role - English role name from the API
 * @returns Spanish role name or original if unmapped
 */
export function roleName(role: string): string {
  return ROLE_NAMES[role] ?? role;
}

/**
 * Transforms a raw ship from the GraphQL API into our domain model.
 * Localizes role names and computes landing statistics.
 *
 * @param raw - Raw ship data from the FleetQuery
 * @returns ShipModel object or null if required fields are missing
 */
export function toShip(raw: RawShip): ShipModel | null {
  if (!raw.id || !raw.name) {
    return null;
  }
  const attempted = raw.attempted_landings ?? 0;
  return {
    id: raw.id,
    name: raw.name,
    type: raw.type,
    roles: compact(raw.roles).map(roleName),
    active: raw.active ?? false,
    homePort: raw.home_port,
    yearBuilt: raw.year_built,
    image: secureUrl(raw.image),
    weight: { metric: raw.weight_kg, imperial: raw.weight_lbs },
    landings: attempted > 0 ? { successful: raw.successful_landings ?? 0, attempted } : null,
    missions: compact(raw.missions).length,
  };
}

/**
 * Transforms the complete fleet GraphQL query into a sorted array of ships.
 * Sorts active ships first, then by number of missions, then alphabetically.
 *
 * @param data - Complete FleetQuery result
 * @returns Sorted array of ShipModel objects
 */
export function toFleet(data: FleetQuery): ShipModel[] {
  return compact(compact(data.ships).map(toShip)).sort(
    (a, b) =>
      Number(b.active) - Number(a.active) ||
      b.missions - a.missions ||
      a.name.localeCompare(b.name),
  );
}
