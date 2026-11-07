import { Component } from '@angular/core';

@Component({
  selector: 'app-site-footer',
  template: `
    <div class="inner">
      <p>
        Datos de la
        <a href="https://github.com/r-spacex/SpaceX-API" rel="noopener" target="_blank"
          >SpaceX API comunitaria</a
        >, consultada por GraphQL. El conjunto de datos dejó de actualizarse en 2022, así que este
        sitio es un archivo histórico y no un seguimiento en vivo.
      </p>
      <p>
        Proyecto independiente, sin relación con Space Exploration Technologies Corp. Hecho con
        Angular 22 por
        <a href="https://github.com/Jhon-David-Toro" rel="noopener" target="_blank"
          >Jhon David Toro</a
        >.
      </p>
    </div>
  `,
  host: { role: 'contentinfo' },
  styles: `
    :host {
      display: block;
      border-block-start: 1px solid var(--line);
      color: var(--titanium);
      font-size: var(--step--1);
    }
    .inner {
      display: grid;
      gap: var(--space-2xs);
      width: min(100% - 2 * var(--gutter), var(--content));
      margin-inline: auto;
      padding-block: var(--space-l);
    }
    p {
      max-width: var(--measure);
    }
  `,
})
export class SiteFooter {}
