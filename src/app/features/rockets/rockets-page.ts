import { formatDate } from '@angular/common';
import { Component, LOCALE_ID, computed, inject, input, linkedSignal } from '@angular/core';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { Router } from '@angular/router';
import { RocketsDocument } from '../../core/graphql/generated/graphql';
import { queryResource } from '../../core/graphql/query-resource';
import { Preferences } from '../../core/preferences/preferences';
import { formatInteger } from '../../shared/format/measure';
import { LengthPipe, MassPipe, RatioPipe, UsdPipe } from '../../shared/format/measure.pipes';
import { ResourceStatus } from '../../shared/ui/resource-status';
import {
  LINEUP_HEIGHT,
  STATUE_OF_LIBERTY_M,
  layoutSilhouettes,
  toRockets,
} from './data/rocket.model';

const LINEUP_WIDTH = 800;

@Component({
  selector: 'app-rockets-page',
  imports: [
    ResourceStatus,
    LengthPipe,
    MassPipe,
    RatioPipe,
    UsdPipe,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabContent,
  ],
  templateUrl: './rockets-page.html',
  styleUrl: './rockets-page.scss',
})
export default class RocketsPage {
  private readonly router = inject(Router);
  private readonly locale = inject(LOCALE_ID);
  protected readonly units = inject(Preferences).units;

  /** `?cohete=` query param, so a rocket can be linked from a mission page. */
  readonly cohete = input<string>();

  protected readonly resource = queryResource(RocketsDocument, { select: toRockets });
  protected readonly rockets = computed(() =>
    this.resource.hasValue() ? this.resource.value() : [],
  );

  protected readonly selectedId = linkedSignal<string | undefined>(() => {
    const requested = this.cohete();
    const list = this.rockets();
    return (
      list.find((r) => r.id === requested)?.id ?? list.find((r) => r.active)?.id ?? list[0]?.id
    );
  });

  protected readonly selected = computed(
    () => this.rockets().find((r) => r.id === this.selectedId()) ?? null,
  );

  protected readonly viewBox = `0 0 ${LINEUP_WIDTH} ${LINEUP_HEIGHT + 4}`;
  protected readonly lineup = computed(() => layoutSilhouettes(this.rockets(), LINEUP_WIDTH));
  protected readonly statueY = computed(
    () => LINEUP_HEIGHT - STATUE_OF_LIBERTY_M * this.lineup().metersToUnits,
  );
  protected readonly baseline = LINEUP_HEIGHT;
  protected readonly width = LINEUP_WIDTH;

  /** Largest capacity to each destination across the line-up, to draw comparable bars. */
  private readonly maxCapacity = computed(() => {
    const max = new Map<string, number>();
    for (const rocket of this.rockets()) {
      for (const c of rocket.capacities) {
        max.set(c.id, Math.max(max.get(c.id) ?? 0, c.mass.metric ?? 0));
      }
    }
    return max;
  });

  protected capacityShare(id: string, kg: number | null | undefined): number {
    const max = this.maxCapacity().get(id) ?? 0;
    return max > 0 && kg ? (kg / max) * 100 : 0;
  }

  protected engines(count: number | null, name: string | null): string {
    if (count === null) {
      return name ?? '—';
    }
    return `${formatInteger(count)} × ${name ?? 'motor'}`;
  }

  protected status(active: boolean, firstFlight: string | null): string {
    const state = active ? 'En servicio' : 'Retirado o en desarrollo';
    return firstFlight
      ? `${state}, primer vuelo el ${formatDate(firstFlight, 'longDate', this.locale, 'UTC')}`
      : state;
  }

  protected select(id: string | undefined): void {
    if (!id) {
      return;
    }
    this.selectedId.set(id);
    void this.router.navigate([], { queryParams: { cohete: id }, replaceUrl: true });
  }
}
