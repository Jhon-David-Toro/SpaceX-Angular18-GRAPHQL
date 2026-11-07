import { Component, computed, input } from '@angular/core';
import type { LaunchOutcome } from '../../features/launches/data/launch.model';

const LABELS: Record<LaunchOutcome, string> = {
  success: 'Éxito',
  failure: 'Fallo',
  unknown: 'Sin dato',
};

/** Outcome is conveyed by text and shape, never by colour alone. */
@Component({
  selector: 'app-outcome-badge',
  template: `<span class="mark" aria-hidden="true"></span>{{ label() }}`,
  host: { '[attr.data-outcome]': 'outcome()' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.4em;
      padding: 0.1em 0.55em 0.1em 0.45em;
      border: 1px solid currentColor;
      border-radius: var(--radius-tag);
      font-size: var(--step--1);
      font-weight: 600;
      font-stretch: var(--semi-wide);
      line-height: 1.5;
      white-space: nowrap;
    }
    :host([data-outcome='success']) {
      color: var(--foil-ink);
    }
    :host([data-outcome='failure']) {
      color: var(--flame-ink);
    }
    :host([data-outcome='unknown']) {
      color: var(--titanium);
    }
    .mark {
      inline-size: 0.55em;
      block-size: 0.55em;
      background: currentColor;
    }
    :host([data-outcome='success']) .mark {
      border-radius: 50%;
    }
    :host([data-outcome='failure']) .mark {
      clip-path: polygon(50% 0, 100% 100%, 0 100%);
    }
  `,
})
export class OutcomeBadge {
  readonly outcome = input.required<LaunchOutcome>();
  protected readonly label = computed(() => LABELS[this.outcome()]);
}
