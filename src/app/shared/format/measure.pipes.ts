import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';
import type { UnitSystem } from '../../core/preferences/preferences';
import type { Measure } from './measure';
import {
  formatDistanceKm,
  formatForce,
  formatLength,
  formatMass,
  formatPercent,
  formatSpeedKph,
  formatUsd,
} from './measure';

// Pure pipes: the unit system is passed explicitly (`value | mass: units()`), so the template
// re-evaluates only when the value or the viewer's unit preference changes.

const EMPTY: Measure = { metric: null, imperial: null };

@Pipe({ name: 'length' })
export class LengthPipe implements PipeTransform {
  transform(value: Measure | null | undefined, units: UnitSystem): string {
    return formatLength(value ?? EMPTY, units);
  }
}

@Pipe({ name: 'mass' })
export class MassPipe implements PipeTransform {
  transform(value: Measure | null | undefined, units: UnitSystem): string {
    return formatMass(value ?? EMPTY, units);
  }
}

@Pipe({ name: 'distanceKm' })
export class DistanceKmPipe implements PipeTransform {
  transform(km: number | null | undefined, units: UnitSystem): string {
    return formatDistanceKm(km, units);
  }
}

@Pipe({ name: 'speedKph' })
export class SpeedKphPipe implements PipeTransform {
  transform(kph: number | null | undefined, units: UnitSystem): string {
    return formatSpeedKph(kph, units);
  }
}

@Pipe({ name: 'usd' })
export class UsdPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatUsd(value);
  }
}

@Pipe({ name: 'ratio' })
export class RatioPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatPercent(value);
  }
}

@Pipe({ name: 'force' })
export class ForcePipe implements PipeTransform {
  transform(value: Measure | null | undefined, units: UnitSystem): string {
    return formatForce(value ?? EMPTY, units);
  }
}
