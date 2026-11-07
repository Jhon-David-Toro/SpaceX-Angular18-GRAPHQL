import { DatePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HistoryDocument } from '../../core/graphql/generated/graphql';
import type { HistoryQuery } from '../../core/graphql/generated/graphql';
import { queryResource } from '../../core/graphql/query-resource';
import { ResourceStatus } from '../../shared/ui/resource-status';
import { compact, secureUrl } from '../../shared/util/collections';

export interface Milestone {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly details: string | null;
  readonly article: string | null;
  readonly flightId: string | null;
}

export function toMilestones(data: HistoryQuery): Milestone[] {
  return compact(data.histories)
    .flatMap((h): Milestone[] =>
      h.id && h.title && h.event_date_utc
        ? [
            {
              id: h.id,
              title: h.title,
              date: h.event_date_utc,
              details: h.details,
              article: secureUrl(h.links?.article ?? h.links?.wikipedia),
              flightId: h.flight?.id ?? null,
            },
          ]
        : [],
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

@Component({
  selector: 'app-history-page',
  imports: [DatePipe, RouterLink, ResourceStatus],
  template: `
    <div class="page">
      <header class="page-intro">
        <h1>Hitos</h1>
        <p>Los momentos que cambiaron lo que se creía posible en un lanzamiento, en orden.</p>
      </header>

      <app-resource-status [resource]="resource" subject="los hitos" />

      @if (milestones().length) {
        <ol class="timeline">
          @for (m of milestones(); track m.id) {
            <li>
              <time class="num" [attr.datetime]="m.date">{{
                m.date | date: 'longDate' : 'UTC'
              }}</time>
              <div class="event">
                <h2>{{ m.title }}</h2>
                @if (m.details) {
                  <p>{{ m.details }}</p>
                }
                <p class="links">
                  @if (m.flightId) {
                    <a [routerLink]="['/lanzamientos', m.flightId]">Ver la misión</a>
                  }
                  @if (m.article) {
                    <a [href]="m.article" target="_blank" rel="noopener"
                      >Leer la noticia<span class="visually-hidden">
                        (se abre en otra pestaña)</span
                      ></a
                    >
                  }
                </p>
              </div>
            </li>
          }
        </ol>
      }
    </div>
  `,
  styles: `
    .timeline {
      position: relative;
      display: grid;
      gap: var(--space-l);
      margin: 0;
      padding: 0;
      list-style: none;
      &::before {
        content: '';
        position: absolute;
        inset-block: 0.6rem 0;
        inset-inline-start: 11.25rem;
        inline-size: 1px;
        background: var(--line-strong);
      }
    }
    li {
      display: grid;
      grid-template-columns: 10rem 1fr;
      gap: var(--space-l);
    }
    time {
      padding-block-start: 0.15rem;
      color: var(--titanium);
      text-align: end;
      font-size: var(--step--1);
    }
    .event {
      position: relative;
      display: grid;
      gap: var(--space-2xs);
      max-width: var(--measure);
      &::before {
        content: '';
        position: absolute;
        inset-inline-start: calc(-1 * var(--space-l) + 0.25rem - 5px);
        inset-block-start: 0.45rem;
        inline-size: 9px;
        block-size: 9px;
        border-radius: 50%;
        background: var(--foil-mark);
        box-shadow: 0 0 0 4px var(--sky-0);
      }
      h2 {
        font-size: var(--step-1);
      }
    }
    .links {
      display: flex;
      gap: var(--space-s);
      a {
        color: var(--foil-ink);
        font-weight: 600;
      }
    }
    @media (width < 40rem) {
      .timeline::before {
        inset-inline-start: 0.25rem;
      }
      li {
        grid-template-columns: 1fr;
        gap: var(--space-3xs);
        padding-inline-start: var(--space-l);
      }
      time {
        text-align: start;
      }
    }
  `,
})
export default class HistoryPage {
  protected readonly resource = queryResource(HistoryDocument, { select: toMilestones });
  protected readonly milestones = computed(() =>
    this.resource.hasValue() ? this.resource.value() : [],
  );
}
