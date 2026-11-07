import { Component, computed } from '@angular/core';
import { CompanyDocument } from '../../core/graphql/generated/graphql';
import { queryResource } from '../../core/graphql/query-resource';
import { UsdPipe } from '../../shared/format/measure.pipes';
import { formatInteger } from '../../shared/format/measure';
import { ResourceStatus } from '../../shared/ui/resource-status';

/** Deferred section: only fetched when it scrolls into view. */
@Component({
  selector: 'app-company-facts',
  imports: [ResourceStatus, UsdPipe],
  template: `
    <section aria-labelledby="company-title">
      <h2 id="company-title">La compañía</h2>
      <app-resource-status [resource]="company" subject="los datos de la compañía" />
      @if (info(); as c) {
        <div class="grid">
          <p class="summary">{{ c.summary }}</p>
          <dl>
            <div>
              <dt>Fundación</dt>
              <dd class="num">{{ c.founded }}, por {{ c.founder }}</dd>
            </div>
            <div>
              <dt>Sede</dt>
              <dd>{{ c.headquarters?.city }}, {{ c.headquarters?.state }}</dd>
            </div>
            <div>
              <dt>Empleados</dt>
              <dd class="num">{{ employees() }}</dd>
            </div>
            <div>
              <dt>Valoración registrada</dt>
              <dd class="num">{{ c.valuation | usd }}</dd>
            </div>
            <div>
              <dt>Plataformas de lanzamiento</dt>
              <dd class="num">{{ c.launch_sites }}</dd>
            </div>
            <div>
              <dt>Dirección</dt>
              <dd>{{ c.ceo }} (CEO), {{ c.coo }} (COO)</dd>
            </div>
          </dl>
        </div>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      padding-block: var(--space-xl) var(--space-l);
      border-block-start: 1px solid var(--line);
    }
    h2 {
      margin-block-end: var(--space-m);
    }
    .grid {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
      gap: var(--space-xl);
    }
    .summary {
      max-width: var(--measure);
      font-size: var(--step-1);
      line-height: 1.55;
    }
    dl {
      display: grid;
      gap: var(--space-s);
    }
    dt {
      color: var(--titanium);
      font-size: var(--step--1);
    }
    dd {
      font-weight: 600;
    }
    @media (width < 48rem) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class CompanyFacts {
  protected readonly company = queryResource(CompanyDocument, { select: (d) => d.company });
  protected readonly info = computed(() => (this.company.hasValue() ? this.company.value() : null));
  protected readonly employees = computed(() => formatInteger(this.info()?.employees));
}
