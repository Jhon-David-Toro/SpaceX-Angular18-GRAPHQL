import type { Measure } from '../../../shared/format/measure';

/**
 * Represents the outcome of a launch or landing attempt.
 */
export type LaunchOutcome = 'success' | 'failure' | 'unknown';

/**
 * Summarized launch information optimized for list views and filtering.
 */
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

/**
 * Information about a single core (first stage booster) used in a launch.
 */
export interface CoreFlight {
  readonly serial: string;
  readonly flight: number | null;
  readonly block: number | null;
  readonly reused: boolean;
  readonly landing: LaunchOutcome | 'none';
  readonly landingType: string | null;
  readonly landingVehicle: string | null;
}

/**
 * Detailed information about a payload carried by a launch.
 */
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

/**
 * External link related to a launch (article, Wikipedia, press kit).
 */
export interface LaunchLink {
  readonly label: string;
  readonly url: string;
}

/**
 * Complete launch details for detail views.
 */
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
