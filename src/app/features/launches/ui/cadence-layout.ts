import type { LaunchSummary } from '../data/launch.model';

export interface CadenceTick {
  readonly launch: LaunchSummary;
  readonly x: number;
  readonly height: number;
}

export interface CadenceYear {
  readonly year: number;
  readonly x: number;
}

export interface CadenceLayout {
  readonly ticks: readonly CadenceTick[];
  readonly years: readonly CadenceYear[];
}

export const CADENCE_WIDTH = 1000;
export const CADENCE_HEIGHT = 240;
const MIN_TICK = 22;
const MAX_TICK = CADENCE_HEIGHT - 30;

/**
 * Pure layout: x is proportional to time, height to the square root of payload mass
 * (so heavy Starlink batches don't flatten every other mission).
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

/** Index of the tick closest to a horizontal position in viewBox units. */
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
