import {
  Component,
  computed,
  debounced,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { ResourceStatus } from '../../../shared/ui/resource-status';
import { groupBy } from '../../../shared/util/collections';
import { LaunchArchiveStore } from '../data/launch-archive.store';
import type { LaunchCriteria } from '../data/launch-filters';
import { criteriaFromParams, criteriaToParams, filterLaunches } from '../data/launch-filters';
import { OUTCOME_FILTER_OPTIONS } from '../data/launch-outcomes.constants';
import { LaunchRow } from '../ui/launch-row';

/**
 * Form model for launch filters.
 * Native form controls work with strings; these are parsed into LaunchCriteria.
 */
interface FilterForm {
  q: string;
  year: string;
  outcome: string;
  rocket: string;
  sort: string;
}

/** Number of launches to show per page before "Show more" button */
const PAGE_SIZE = 30;

/**
 * Converts typed LaunchCriteria to string-based FilterForm for native form controls.
 *
 * @param criteria - Parsed criteria object
 * @returns Form model with all values as strings
 */
function toForm(criteria: LaunchCriteria): FilterForm {
  return {
    q: criteria.query,
    year: criteria.year ? String(criteria.year) : '',
    outcome: criteria.outcome,
    rocket: criteria.rocket,
    sort: criteria.sort,
  };
}

@Component({
  selector: 'app-launch-archive-page',
  imports: [FormField, LaunchRow, ResourceStatus],
  templateUrl: './launch-archive-page.html',
  styleUrl: './launch-archive-page.scss',
})
export default class LaunchArchivePage {
  private readonly router = inject(Router);
  protected readonly store = inject(LaunchArchiveStore);

  // Query params, bound by `withComponentInputBinding`.
  readonly q = input<string>();
  readonly year = input<string>();
  readonly outcome = input<string>();
  readonly rocket = input<string>();
  readonly sort = input<string>();

  private readonly urlCriteria = computed(() =>
    criteriaFromParams({
      q: this.q(),
      year: this.year(),
      outcome: this.outcome(),
      rocket: this.rocket(),
      sort: this.sort(),
    }),
  );

  /**
   * Tracks the last query params this page wrote to the URL.
   * Prevents our own navigations from overwriting values being typed in the form.
   */
  private lastWritten = '';

  /**
   * Bidirectional form-criteria sync using linkedSignal.
   *
   * **How it works:**
   * - Source: URL criteria (from query params)
   * - Computation: Converts criteria → form values, BUT skips conversion if
   *   the URL change came from us (checked via lastWritten), preventing
   *   form values from being overwritten while the user is typing
   * - The form's changes flow back through `criteria` computed → debounced effect → router
   *
   * This pattern allows seamless URL↔form sync without fighting user input.
   */
  protected readonly model = linkedSignal<LaunchCriteria, FilterForm>({
    source: this.urlCriteria,
    computation: (criteria, previous) =>
      previous && JSON.stringify(criteriaToParams(criteria)) === this.lastWritten
        ? previous.value
        : toForm(criteria),
  });

  protected readonly filters = form(this.model);

  protected readonly criteria = computed(() => criteriaFromParams(this.model()));

  protected readonly results = computed(() =>
    filterLaunches(this.store.launches(), this.criteria()),
  );
  protected readonly limit = linkedSignal({ source: this.criteria, computation: () => PAGE_SIZE });
  protected readonly visible = computed(() => this.results().slice(0, this.limit()));
  protected readonly groups = computed(() => {
    // Year headings only make sense for chronological orders.
    if (this.criteria().sort === 'heaviest') {
      return [{ year: null, launches: this.visible() }];
    }
    return [...groupBy(this.visible(), (l) => l.year)].map(([year, launches]) => ({
      year,
      launches,
    }));
  });

  protected readonly hasFilters = computed(() => {
    const { query, year, outcome, rocket } = this.criteria();
    return query.trim() !== '' || year !== 0 || outcome !== 'all' || rocket !== 'all';
  });

  protected readonly outcomes = OUTCOME_FILTER_OPTIONS;

  /** Debounced copy of the criteria, used only to keep the URL shareable. */
  private readonly debouncedCriteria = debounced(this.criteria, 350);
  protected readonly announce = signal('');

  constructor() {
    effect(() => {
      if (!this.debouncedCriteria.hasValue()) {
        return;
      }
      const params = criteriaToParams(this.debouncedCriteria.value());
      const serialized = JSON.stringify(params);
      if (serialized === JSON.stringify(criteriaToParams(this.urlCriteria()))) {
        return;
      }
      this.lastWritten = serialized;
      void this.router.navigate([], { queryParams: params, replaceUrl: true });
    });

    effect(() => {
      if (this.store.resource.hasValue()) {
        const count = this.results().length;
        this.announce.set(count === 1 ? '1 lanzamiento' : `${count} lanzamientos`);
      }
    });
  }

  protected showMore(): void {
    this.limit.update((n) => n + PAGE_SIZE);
  }

  protected reset(): void {
    this.model.update((value) => ({ ...toForm(criteriaFromParams({})), sort: value.sort }));
  }
}
