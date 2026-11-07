import { orbitGeometry } from './orbit';

describe('orbitGeometry', () => {
  // Values close to the Roadster's published elements.
  const geometry = orbitGeometry({
    semiMajorAxis: 1.324,
    eccentricity: 0.256,
    longitude: 317,
    periapsisArg: 177,
  });

  it('keeps the Sun on a focus: perihelion and aphelion distances match a(1∓e)', () => {
    expect(Math.hypot(geometry.perihelion.x, geometry.perihelion.y)).toBeCloseTo(
      1.324 * (1 - 0.256),
    );
    expect(Math.hypot(geometry.aphelion.x, geometry.aphelion.y)).toBeCloseTo(1.324 * (1 + 0.256));
  });

  it('computes the semi-minor axis', () => {
    expect(geometry.ry).toBeCloseTo(1.324 * Math.sqrt(1 - 0.256 ** 2));
  });

  it('degenerates to a circle centred on the Sun when e = 0', () => {
    const circle = orbitGeometry({
      semiMajorAxis: 1,
      eccentricity: 0,
      longitude: 0,
      periapsisArg: 0,
    });
    expect(circle.cx).toBeCloseTo(0);
    expect(circle.cy).toBeCloseTo(0);
    expect(circle.rx).toBe(circle.ry);
  });
});
