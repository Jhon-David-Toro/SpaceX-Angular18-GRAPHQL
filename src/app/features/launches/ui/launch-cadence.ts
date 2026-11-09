import { formatDate } from '@angular/common';
import { Component, LOCALE_ID, computed, inject, input, linkedSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Preferences } from '../../../core/preferences/preferences';
import { formatMass, massFromKg } from '../../../shared/format/measure';
import { OutcomeBadge } from '../../../shared/ui/outcome-badge';
import type { LaunchSummary } from '../data/launch.model';
import { OUTCOME_TEXT } from '../data/launch-outcomes.constants';
import { CADENCE_HEIGHT, CADENCE_WIDTH, layoutCadence, nearestTick } from './cadence-layout';

/**
 * Every launch as one vertical line on a time axis.
 * Exposed to assistive tech as a slider: arrow keys move between launches, Enter opens one.
 */
@Component({
  selector: 'app-launch-cadence',
  imports: [RouterLink, OutcomeBadge],
  templateUrl: './launch-cadence.html',
  styleUrl: './launch-cadence.scss',
})
export class LaunchCadence {
  private readonly router = inject(Router);
  private readonly locale = inject(LOCALE_ID);
  protected readonly units = inject(Preferences).units;

  readonly launches = input.required<readonly LaunchSummary[]>();

  protected readonly width = CADENCE_WIDTH;
  protected readonly height = CADENCE_HEIGHT;
  protected readonly layout = computed(() => layoutCadence(this.launches()));

  /** Starts on the most recent launch; resets when the data set changes. */
  protected readonly active = linkedSignal(() => Math.max(this.layout().ticks.length - 1, 0));
  protected readonly activeTick = computed(() => this.layout().ticks[this.active()] ?? null);

  protected readonly activeMeta = computed(() => {
    const launch = this.activeTick()?.launch;
    if (!launch) {
      return '';
    }
    const parts = [formatDate(launch.date, 'longDate', this.locale, 'UTC'), launch.rocket];
    if (launch.payloadMassKg > 0) {
      parts.push(`${formatMass(massFromKg(launch.payloadMassKg), this.units())} de carga`);
    }
    return parts.join(', ');
  });

  protected readonly valueText = computed(() => {
    const launch = this.activeTick()?.launch;
    if (!launch) {
      return '';
    }
    const date = formatDate(launch.date, 'longDate', this.locale, 'UTC');
    return `${launch.name}, ${date}, ${launch.rocket}, ${OUTCOME_TEXT[launch.outcome]}`;
  });

  protected readonly summary = computed(() => {
    const ticks = this.layout().ticks;
    const years = this.layout().years;
    if (!ticks.length) {
      return '';
    }
    return `${ticks.length} lanzamientos entre ${years[0]?.year} y ${years.at(-1)?.year}. Usa las flechas para recorrerlos.`;
  });

  protected onPointerMove(event: PointerEvent, svg: Element): void {
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) {
      return;
    }
    const position = ((event.clientX - rect.left) / rect.width) * CADENCE_WIDTH;
    this.active.set(nearestTick(this.layout().ticks, position));
  }

  protected onKeydown(event: KeyboardEvent): void {
    const last = this.layout().ticks.length - 1;
    const step = event.shiftKey ? 10 : 1;
    const moves: Record<string, () => number> = {
      ArrowRight: () => this.active() + step,
      ArrowUp: () => this.active() + step,
      ArrowLeft: () => this.active() - step,
      ArrowDown: () => this.active() - step,
      PageUp: () => this.active() + 10,
      PageDown: () => this.active() - 10,
      Home: () => 0,
      End: () => last,
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      this.active.set(Math.min(Math.max(move(), 0), last));
      return;
    }
    if (event.key === 'Enter') {
      this.openActive();
    }
  }

  protected openActive(): void {
    const launch = this.activeTick()?.launch;
    if (launch) {
      void this.router.navigate(['/lanzamientos', launch.id]);
    }
  }
}
