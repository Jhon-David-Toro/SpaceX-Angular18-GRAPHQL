import type { LaunchSummary } from '../data/launch.model';

/**
 * A single launch rendered as a vertical tick in the cadence visualization.
 */
export interface CadenceTick {
  readonly launch: LaunchSummary;
  /** Horizontal position in viewBox units (0 to CADENCE_WIDTH) */
  readonly x: number;
  /** Vertical height in viewBox units (MIN_TICK to MAX_TICK) */
  readonly height: number;
}

/**
 * Year marker for the cadence timeline axis.
 */
export interface CadenceYear {
  readonly year: number;
  /** Horizontal position in viewBox units where the year begins */
  readonly x: number;
}

/**
 * Complete layout data for rendering the launch cadence visualization.
 */
export interface CadenceLayout {
  readonly ticks: readonly CadenceTick[];
  readonly years: readonly CadenceYear[];
}

/** SVG viewBox width for the cadence visualization */
export const CADENCE_WIDTH = 1000;

/** SVG viewBox height for the cadence visualization */
export const CADENCE_HEIGHT = 240;

/**
 * Minimum tick height in viewBox units.
 * Ensures even zero-payload launches are visible.
 */
const MIN_TICK = 22;

/**
 * Maximum tick height in viewBox units.
 * Leaves 30 units at the top for padding and year labels.
 */
const MAX_TICK = CADENCE_HEIGHT - 30;

/**
 * Generates layout data for the launch cadence visualization.
 *
 * **Layout algorithm:**
 * - X-axis: Time is linear — each launch's horizontal position is proportional
 *   to its timestamp between the first and last launch dates
 * - Y-axis: Height represents payload mass using square-root scaling to prevent
 *   heavy Starlink batches from visually dominating lighter payloads
 * - Year markers are positioned at January 1st of each year in the range
 *
 * **Why square-root scaling?**
 * Linear mass scaling would make 15-ton Starlink batches 30× taller than 500kg
 * satellites, flattening most of the history. Square-root scaling (√mass) reduces
 * this to ~5.5× while still showing the relative differences.
 *
 * @param launches - Array of launches to visualize (any order, will be sorted)
 * @returns Layout object with positioned ticks and year markers
 */
export function layoutCadence(launches: readonly LaunchSummary[]): CadenceLayout {
  if (launches.length === 0) {
    return { ticks: [], years: [] };
  }
  const chronological = [...launches].sort((a, b) => a.timestamp - b.timestamp);
  const first = chronological[0]?.year ?? 0;
  const last = chronological.at(-1)?.year ?? first;
  const start = Date.UTC(first, 0, 1);
  const end = Date.UTC(last + 1, 0, 1);
  const span = end - start;
  const maxRoot = Math.sqrt(Math.max(...chronological.map((l) => l.payloadMassKg), 1));
  const x = (time: number) => ((time - start) / span) * CADENCE_WIDTH;

  const ticks = chronological.map((launch) => ({
    launch,
    x: x(launch.timestamp),
    height: MIN_TICK + (Math.sqrt(launch.payloadMassKg) / maxRoot) * (MAX_TICK - MIN_TICK),
  }));

  const years: CadenceYear[] = [];
  for (let year = first; year <= last; year++) {
    years.push({ year, x: x(Date.UTC(year, 0, 1)) });
  }
  return { ticks, years };
}

/**
 * Finds the tick closest to a given horizontal position.
 * Used for keyboard navigation and hover interactions.
 *
 * @param ticks - Array of positioned ticks
 * @param position - Horizontal position in viewBox units
 * @returns Zero-based index of the closest tick
 */
export function nearestTick(ticks: readonly CadenceTick[], position: number): number {
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  ticks.forEach((tick, index) => {
    const distance = Math.abs(tick.x - position);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  });
  return best;
}
