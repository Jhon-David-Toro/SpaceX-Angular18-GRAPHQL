export interface OrbitElements {
  /** Semi-major axis, astronomical units. */
  readonly semiMajorAxis: number;
  readonly eccentricity: number;
  /** Longitude of the ascending node, degrees. */
  readonly longitude: number;
  /** Argument of periapsis, degrees. */
  readonly periapsisArg: number;
}

export interface OrbitGeometry {
  /** Ellipse centre (the Sun sits at one focus, the origin). */
  readonly cx: number;
  readonly cy: number;
  readonly rx: number;
  readonly ry: number;
  /** Rotation of the major axis, degrees, SVG convention (clockwise, y down). */
  readonly rotation: number;
  readonly perihelion: { readonly x: number; readonly y: number };
  readonly aphelion: { readonly x: number; readonly y: number };
}

const DEG = Math.PI / 180;

/**
 * Projects a heliocentric orbit onto the ecliptic plane (inclination is ~1°, so ignoring it
 * is visually exact). The longitude of perihelion orients the ellipse.
 */
export function orbitGeometry(elements: OrbitElements): OrbitGeometry {
  const a = elements.semiMajorAxis;
  const e = Math.min(Math.max(elements.eccentricity, 0), 0.99);
  const b = a * Math.sqrt(1 - e * e);
  const varpi = (elements.longitude + elements.periapsisArg) * DEG;
  // SVG y grows downwards: flip the sign of every y so the orbit is prograde on screen.
  const ux = Math.cos(varpi);
  const uy = -Math.sin(varpi);
  const c = a * e;
  return {
    cx: -c * ux,
    cy: -c * uy,
    rx: a,
    ry: b,
    rotation: Math.atan2(uy, ux) / DEG,
    perihelion: { x: a * (1 - e) * ux, y: a * (1 - e) * uy },
    aphelion: { x: -a * (1 + e) * ux, y: -a * (1 + e) * uy },
  };
}

/** Mean orbital radii used for reference circles. */
export const EARTH_AU = 1;
export const MARS_AU = 1.524;
