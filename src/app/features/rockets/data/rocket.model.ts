import type { RocketsQuery } from '../../../core/graphql/generated/graphql';
import type { Measure } from '../../../shared/format/measure';
import { compact, secureUrl } from '../../../shared/util/collections';
import { LINEUP_HEIGHT, ORBIT_NAMES, STATUE_OF_LIBERTY_M } from './rocket.constants';

/**
 * Payload capacity for a specific orbital destination.
 */
export interface PayloadCapacity {
  readonly id: string;
  readonly name: string;
  readonly mass: Measure;
}

/**
 * Complete rocket specifications and capabilities.
 */
export interface RocketModel {
  readonly id: string;
  readonly name: string;
  readonly active: boolean;
  readonly description: string | null;
  readonly wikipedia: string | null;
  readonly stages: number | null;
  readonly boosters: number | null;
  readonly costPerLaunch: number | null;
  /** Success rate as a decimal between 0 and 1 */
  readonly successRate: number | null;
  readonly firstFlight: string | null;
  readonly country: string | null;
  readonly height: Measure;
  readonly diameter: Measure;
  readonly mass: Measure;
  readonly engineCount: number | null;
  readonly engineName: string | null;
  readonly propellants: readonly string[];
  readonly thrustSeaLevel: Measure;
  readonly reusable: boolean;
  readonly landingLegs: number | null;
  readonly capacities: readonly PayloadCapacity[];
}

/**
 * SVG silhouette data for rendering a rocket to scale.
 */
export interface Silhouette {
  readonly id: string;
  readonly x: number;
  readonly width: number;
  readonly height: number;
  readonly path: string;
}

type RawRocket = NonNullable<NonNullable<RocketsQuery['rockets']>[number]>;

// Re-export constants for backward compatibility
export { LINEUP_HEIGHT, STATUE_OF_LIBERTY_M };

/**
 * Transforms a raw rocket from the GraphQL API into our domain model.
 * Normalizes engine names, converts success rate to decimal, and maps payload capacities.
 *
 * @param raw - Raw rocket data from the RocketsQuery
 * @returns RocketModel object or null if required fields are missing
 */
export function toRocket(raw: RawRocket): RocketModel | null {
  if (!raw.id || !raw.name) {
    return null;
  }
  const engines = raw.engines;
  const engineName = [engines?.type, engines?.version].filter(Boolean).join(' ');
  return {
    id: raw.id,
    name: raw.name,
    active: raw.active ?? false,
    description: raw.description,
    wikipedia: secureUrl(raw.wikipedia),
    stages: raw.stages,
    boosters: raw.boosters,
    costPerLaunch: raw.cost_per_launch,
    successRate: raw.success_rate_pct === null ? null : raw.success_rate_pct / 100,
    firstFlight: raw.first_flight,
    country: raw.country,
    height: { metric: raw.height?.meters, imperial: raw.height?.feet },
    diameter: { metric: raw.diameter?.meters, imperial: raw.diameter?.feet },
    mass: { metric: raw.mass?.kg, imperial: raw.mass?.lb },
    engineCount: engines?.number ?? null,
    engineName: engineName ? engineName.charAt(0).toUpperCase() + engineName.slice(1) : null,
    propellants: compact([engines?.propellant_1, engines?.propellant_2]),
    thrustSeaLevel: {
      metric: engines?.thrust_sea_level?.kN,
      imperial: engines?.thrust_sea_level?.lbf,
    },
    reusable: raw.first_stage?.reusable ?? false,
    landingLegs: raw.landing_legs?.number ?? null,
    capacities: compact(raw.payload_weights).flatMap((w) =>
      w.id
        ? [
            {
              id: w.id,
              name: ORBIT_NAMES[w.id] ?? w.name ?? w.id,
              mass: { metric: w.kg, imperial: w.lb },
            },
          ]
        : [],
    ),
  };
}

/**
 * Transforms the complete rockets GraphQL query into an array of rocket models.
 * Sorts by first flight date (oldest first), which for SpaceX also orders by size.
 *
 * @param data - Complete RocketsQuery result
 * @returns Sorted array of RocketModel objects
 */
export function toRockets(data: RocketsQuery): RocketModel[] {
  return compact(compact(data.rockets).map(toRocket)).sort((a, b) =>
    (a.firstFlight ?? '9999').localeCompare(b.firstFlight ?? '9999'),
  );
}

/**
 * Generates true-to-scale SVG silhouettes for a lineup of rockets.
 * Each rocket is drawn as a cylindrical body with a parabolic nose cone,
 * positioned left-to-right on a shared baseline. The scale is normalized
 * so the tallest rocket (or Statue of Liberty reference) fits within LINEUP_HEIGHT.
 *
 * **Algorithm:**
 * - Height is proportional to the rocket's actual height in meters
 * - Nose cone height is 12% of total height (capped at 2.4× diameter for proportions)
 * - Width is proportional to diameter (minimum 4 units for visibility)
 * - All rockets share a common baseline at the bottom of the viewport
 *
 * @param rockets - Array of rockets to layout
 * @param width - Total viewport width in SVG units
 * @returns Object containing silhouette paths and the meters-to-units scale factor
 */
export function layoutSilhouettes(
  rockets: readonly RocketModel[],
  width: number,
): {
  silhouettes: Silhouette[];
  metersToUnits: number;
} {
  const tallest = Math.max(...rockets.map((r) => r.height.metric ?? 0), STATUE_OF_LIBERTY_M);
  const metersToUnits = (LINEUP_HEIGHT - 20) / tallest;
  const slot = width / Math.max(rockets.length, 1);

  const silhouettes = rockets.map((rocket, index) => {
    const h = (rocket.height.metric ?? 0) * metersToUnits;
    const w = Math.max((rocket.diameter.metric ?? 0) * metersToUnits, 4);
    const cx = slot * index + slot / 2;
    const left = cx - w / 2;
    const right = cx + w / 2;
    const base = LINEUP_HEIGHT;
    const top = base - h;
    const nose = Math.min(h * 0.12, w * 2.4);
    const path = [
      `M${left},${base}`,
      `L${left},${top + nose}`,
      `Q${left},${top} ${cx},${top}`,
      `Q${right},${top} ${right},${top + nose}`,
      `L${right},${base}`,
      'Z',
    ].join(' ');
    return { id: rocket.id, x: cx, width: w, height: h, path };
  });

  return { silhouettes, metersToUnits };
}
