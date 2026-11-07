import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RoadsterDocument } from '../../core/graphql/generated/graphql';
import { queryResource, required } from '../../core/graphql/query-resource';
import { Preferences } from '../../core/preferences/preferences';
import { formatDecimal, formatInteger } from '../../shared/format/measure';
import { DistanceKmPipe, MassPipe, SpeedKphPipe } from '../../shared/format/measure.pipes';
import { ResourceStatus } from '../../shared/ui/resource-status';
import { secureUrl } from '../../shared/util/collections';
import { EARTH_AU, MARS_AU, orbitGeometry } from './data/orbit';

@Component({
  selector: 'app-roadster-page',
  imports: [DatePipe, ResourceStatus, DistanceKmPipe, SpeedKphPipe, MassPipe],
  templateUrl: './roadster-page.html',
  styleUrl: './roadster-page.scss',
})
export default class RoadsterPage {
  protected readonly units = inject(Preferences).units;

  protected readonly resource = queryResource(RoadsterDocument, {
    select: (data) => required(data.roadster, 'Roadster'),
  });

  protected readonly roadster = computed(() =>
    this.resource.hasValue() ? this.resource.value() : null,
  );
  protected readonly wikipedia = computed(() => secureUrl(this.roadster()?.wikipedia));
  protected readonly earth = EARTH_AU;
  protected readonly mars = MARS_AU;

  protected readonly orbit = computed(() => {
    const r = this.roadster();
    if (r?.semi_major_axis_au == null || r.eccentricity == null) {
      return null;
    }
    return orbitGeometry({
      semiMajorAxis: r.semi_major_axis_au,
      eccentricity: r.eccentricity,
      longitude: r.longitude ?? 0,
      periapsisArg: r.periapsis_arg ?? 0,
    });
  });

  protected readonly launchMass = computed(() => ({
    metric: this.roadster()?.launch_mass_kg,
    imperial: this.roadster()?.launch_mass_lbs,
  }));

  protected readonly period = computed(() => formatInteger(this.roadster()?.period_days));
  protected readonly au = (value: number | null | undefined) => formatDecimal(value, 3);
}
