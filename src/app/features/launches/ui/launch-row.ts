import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Preferences } from '../../../core/preferences/preferences';
import { massFromKg } from '../../../shared/format/measure';
import { MassPipe } from '../../../shared/format/measure.pipes';
import { OutcomeBadge } from '../../../shared/ui/outcome-badge';
import type { LaunchSummary } from '../data/launch.model';

/** One entry of the flight log: patch, mission, date/vehicle, payload and outcome. */
@Component({
  selector: 'app-launch-row',
  imports: [DatePipe, NgOptimizedImage, RouterLink, OutcomeBadge, MassPipe],
  template: `
    @let l = launch();
    <a class="row" [routerLink]="['/lanzamientos', l.id]">
      <span class="patch">
        @if (l.patch) {
          <img [ngSrc]="l.patch" width="56" height="56" alt="" loading="lazy" />
        } @else {
          <span class="no-patch" aria-hidden="true">{{ l.rocket.slice(0, 2) }}</span>
        }
      </span>
      <span class="main">
        <span class="name">{{ l.name }}</span>
        <span class="meta">
          <time [attr.datetime]="l.date">{{ l.date | date: 'mediumDate' : 'UTC' }}</time>
          <span>{{ l.rocket }}</span>
          <span>{{ l.site }}</span>
        </span>
      </span>
      <span class="mass num">
        @if (l.payloadMassKg > 0) {
          {{ mass() | mass: units() }}
        } @else {
          <span class="visually-hidden">Masa de carga sin dato</span
          ><span aria-hidden="true">—</span>
        }
      </span>
      <app-outcome-badge [outcome]="l.outcome" />
    </a>
  `,
  styles: `
    :host {
      display: block;
    }
    .row {
      display: grid;
      grid-template-columns: 3.5rem 1fr auto auto;
      align-items: center;
      gap: var(--space-s);
      padding: var(--space-xs) var(--space-2xs);
      border-block-end: 1px solid var(--line);
      text-decoration: none;
      transition: background-color 120ms var(--ease-out);
      &:hover {
        background: var(--sky-1);
        .name {
          text-decoration: underline;
          text-decoration-color: var(--foil-mark);
        }
      }
    }
    .patch {
      display: grid;
      place-items: center;
      inline-size: 3.5rem;
      block-size: 3.5rem;
      img {
        inline-size: 100%;
        block-size: 100%;
        object-fit: contain;
      }
    }
    .no-patch {
      display: grid;
      place-items: center;
      inline-size: 2.75rem;
      block-size: 2.75rem;
      border: 1px dashed var(--line-strong);
      border-radius: 50%;
      color: var(--titanium);
      font-size: var(--step--1);
      font-stretch: var(--wide);
    }
    .main {
      display: grid;
      min-width: 0;
    }
    .name {
      font-size: var(--step-1);
      font-weight: 700;
      font-stretch: var(--semi-wide);
      line-height: 1.25;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      column-gap: var(--space-xs);
      color: var(--titanium);
      font-size: var(--step--1);
    }
    .mass {
      color: var(--titanium);
      text-align: end;
      white-space: nowrap;
    }
    @media (width < 40rem) {
      .row {
        grid-template-columns: 2.75rem 1fr auto;
      }
      .patch {
        inline-size: 2.75rem;
        block-size: 2.75rem;
      }
      .mass {
        display: none;
      }
    }
  `,
})
export class LaunchRow {
  readonly launch = input.required<LaunchSummary>();
  protected readonly units = inject(Preferences).units;
  protected readonly mass = computed(() => massFromKg(this.launch().payloadMassKg));
}
