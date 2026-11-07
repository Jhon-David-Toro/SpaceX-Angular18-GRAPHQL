import { Component, computed, input } from '@angular/core';
import type { Resource } from '@angular/core';
import { EmptyResponseError } from '../../core/graphql/query-resource';

/** Reloadable resources expose `reload`; plain resources only show their state. */
type ReloadableResource = Resource<unknown> & { reload?: () => boolean };

/**
 * Renders the loading and error states of a resource in one consistent way.
 * The parent renders the data itself once `resource.hasValue()` is true.
 */
@Component({
  selector: 'app-resource-status',
  template: `
    @switch (resource().status()) {
      @case ('loading') {
        <div class="loading" role="status">
          <span class="visually-hidden">Cargando {{ subject() }}…</span>
          @for (row of rows(); track $index) {
            <span class="bar" aria-hidden="true" [style.inline-size.%]="row"></span>
          }
        </div>
      }
      @case ('error') {
        <div class="error" role="alert">
          <h2>{{ title() }}</h2>
          <p>{{ message() }}</p>
          @if (canRetry()) {
            <button type="button" class="button" (click)="retry()">Reintentar</button>
          }
        </div>
      }
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .loading {
      display: grid;
      gap: var(--space-xs);
      padding-block: var(--space-m);
    }
    .bar {
      display: block;
      block-size: 1.1rem;
      border-radius: var(--radius-tag);
      background: linear-gradient(90deg, var(--sky-2), var(--sky-1), var(--sky-2)) 0 0 / 300% 100%;
      animation: sweep 1.6s linear infinite;
    }
    .error {
      display: grid;
      justify-items: start;
      gap: var(--space-xs);
      max-width: var(--measure);
      padding: var(--space-m);
      border: 1px solid var(--flame);
      border-radius: var(--radius-panel);
      background: color-mix(in oklab, var(--flame) 8%, var(--sky-1));
      h2 {
        font-size: var(--step-1);
      }
      p {
        color: var(--titanium);
      }
    }
    @keyframes sweep {
      to {
        background-position: -300% 0;
      }
    }
  `,
})
export class ResourceStatus {
  readonly resource = input.required<ReloadableResource>();
  /** What is being loaded, in plain words: "los lanzamientos". */
  readonly subject = input('los datos');
  readonly rows = input<readonly number[]>([92, 78, 85, 60]);

  protected readonly notFound = computed(
    () => this.resource().error() instanceof EmptyResponseError,
  );
  protected readonly canRetry = computed(() => !this.notFound() && !!this.resource().reload);

  protected readonly title = computed(() =>
    this.notFound() ? 'No encontramos este registro' : `No se pudieron cargar ${this.subject()}`,
  );

  protected readonly message = computed(() =>
    this.notFound()
      ? 'Puede que el enlace esté mal escrito o que el registro ya no exista en la API.'
      : 'La API pública de SpaceX no respondió. Revisa tu conexión y vuelve a intentarlo.',
  );

  protected retry(): void {
    this.resource().reload?.();
  }
}
