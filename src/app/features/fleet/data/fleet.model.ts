import type { FleetQuery } from '../../../core/graphql/generated/graphql';
import type { Measure } from '../../../shared/format/measure';
import { compact, secureUrl } from '../../../shared/util/collections';

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
  readonly landings: { readonly successful: number; readonly attempted: number } | null;
  readonly missions: number;
}

type RawShip = NonNullable<NonNullable<FleetQuery['ships']>[number]>;

/** Spanish names for the roles the API uses. */
const ROLE_NAMES: Record<string, string> = {
  'ASDS barge': 'Plataforma de aterrizaje',
  'Fairing Recovery': 'Recuperación de cofias',
  'Support Ship': 'Apoyo',
  'Dragon Recovery': 'Recuperación de Dragon',
  'Main Ship': 'Barco principal',
  Tug: 'Remolcador',
  'Barge Tug': 'Remolcador de barcaza',
};

export function roleName(role: string): string {
  return ROLE_NAMES[role] ?? role;
}

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

/** Active ships first, then by number of missions supported. */
export function toFleet(data: FleetQuery): ShipModel[] {
  return compact(compact(data.ships).map(toShip)).sort(
    (a, b) =>
      Number(b.active) - Number(a.active) ||
      b.missions - a.missions ||
      a.name.localeCompare(b.name),
  );
}
