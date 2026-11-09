/**
 * Human-readable names for orbital destinations and payload capacity categories.
 * Maps API orbit identifiers to localized display names.
 */
export const ORBIT_NAMES: Record<string, string> = {
  leo: 'Órbita baja (LEO)',
  gto: 'Transferencia geoestacionaria (GTO)',
  mars: 'Marte',
  moon: 'Luna',
  pluto: 'Plutón',
};

/**
 * Height of the lineup SVG viewport in units.
 * Used as the common baseline for all rocket silhouettes.
 */
export const LINEUP_HEIGHT = 300;

/**
 * Height of the Statue of Liberty in meters (93m from ground to torch).
 * Used as a reference structure drawn behind the rockets for scale comparison.
 */
export const STATUE_OF_LIBERTY_M = 93;
